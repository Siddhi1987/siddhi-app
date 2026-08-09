// pages/api/verify-payment.js
// Verifies the Razorpay signature AND activates the subscription (server-side, service-role).
// A verified signature — not a redirect — is what grants access.

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const admin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const PLAN_DAYS = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email = '',
    } = req.body || {};

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay secret is not configured' });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay verification fields' });
    }

    // 1) Verify the signature.
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ verified: false, message: 'Payment verification failed' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 2) Does an account already exist for this email? If so, link the subscription to it now.
    let userId = null;
    try {
      const { data: list } = await admin.auth.admin.listUsers();
      const match = list?.users?.find((u) => (u.email || '').toLowerCase() === cleanEmail);
      userId = match?.id || null;
    } catch (_) {
      // non-fatal; the signup trigger will claim the subscription by email later
    }

    // 3) Activate the subscription (idempotent on razorpay_order_id).
    const start = new Date();
    const end = new Date(start.getTime() + PLAN_DAYS * 86400000);
    const { error } = await admin.from('subscriptions').upsert(
      {
        user_id: userId,
        email: cleanEmail,
        plan: 'monthly',
        status: 'active',
        amount: 499,
        currency: 'INR',
        razorpay_order_id,
        razorpay_payment_id,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
        start_date: start.toISOString(),
        expiry_date: end.toISOString(),
        starts_at: start.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'razorpay_order_id' }
    );

    if (error) {
      console.error('Subscription activation failed:', error);
      return res.status(500).json({ verified: true, activated: false, message: error.message });
    }

    // 4) Tell the client where to go: existing account -> dashboard; new buyer -> signup.
    return res.status(200).json({
      verified: true,
      activated: true,
      hasAccount: Boolean(userId),
      email: cleanEmail,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ verified: false, message: 'Unable to verify payment' });
  }
}
