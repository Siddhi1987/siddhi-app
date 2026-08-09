// pages/api/webhooks/razorpay.js
// Backend source of truth. Razorpay calls this directly. Activates access even if the buyer
// closes the tab before verify-payment runs. Idempotent (upsert on razorpay_order_id).

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const admin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const raw = await readRawBody(req);
    const signature = req.headers['x-razorpay-signature'] || '';
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(raw)
      .digest('hex');
    if (expected !== signature) {
      return res.status(400).json({ ok: false });
    }

    const event = JSON.parse(raw);
    const entity = event?.payload?.payment?.entity;

    if (event?.event === 'payment.captured' && entity) {
      const email = (entity.email || '').toLowerCase();
      let userId = null;
      try {
        const { data: list } = await admin.auth.admin.listUsers();
        userId = list?.users?.find((u) => (u.email || '').toLowerCase() === email)?.id || null;
      } catch (_) {}

      const start = new Date();
      const end = new Date(start.getTime() + 30 * 86400000);
      await admin.from('subscriptions').upsert(
        {
          user_id: userId,
          email,
          plan: 'monthly',
          status: 'active',
          amount: entity.amount ? Math.round(entity.amount / 100) : 499,
          currency: entity.currency || 'INR',
          razorpay_order_id: entity.order_id,
          razorpay_payment_id: entity.id,
          payment_id: entity.id,
          order_id: entity.order_id,
          current_period_start: start.toISOString(),
          current_period_end: end.toISOString(),
          start_date: start.toISOString(),
          expiry_date: end.toISOString(),
          starts_at: start.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'razorpay_order_id' }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(200).json({ ok: true });
  }
}
