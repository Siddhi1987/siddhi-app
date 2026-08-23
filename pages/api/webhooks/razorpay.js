// pages/api/webhooks/razorpay.js
// Backend source of truth. Razorpay calls this directly (no browser). Activates access even if
// the buyer closes the tab before verify-payment runs. Idempotent (upsert on razorpay_order_id).
//
// REQUIRES: env vars SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY,
//           RAZORPAY_WEBHOOK_SECRET (set this same secret in the Razorpay dashboard webhook).
// In Razorpay: register webhook URL https://siddhiai.in/api/webhooks/razorpay, event payment.captured.
//
// Revised Aug 17, 2026:
//  - Look up the user by email via public.users (O(1)) instead of listUsers() (first-50-only bug).
//  - Timing-safe signature comparison.
//  - Return 500 on a genuine DB write failure so Razorpay RETRIES (don't silently drop activation).
//    Still return 200 for signature mismatch and for successfully-handled / ignored events.

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Razorpay signs the RAW body — disable Next.js body parsing so we can read it verbatim.
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

function safeEqualHex(a, b) {
  try {
    const bufA = Buffer.from(String(a), 'hex');
    const bufB = Buffer.from(String(b), 'hex');
    if (bufA.length !== bufB.length || bufA.length === 0) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (_) {
    return false;
  }
}

async function findUserIdByEmail(email) {
  if (!email) return null;
  try {
    const { data } = await admin
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();
    return data?.id || null;
  } catch (_) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let raw;
  try {
    raw = await readRawBody(req);
  } catch (error) {
    console.error('Razorpay webhook: failed to read body:', error);
    return res.status(400).json({ ok: false });
  }

  // Verify signature. A mismatch is not retryable — return 400 and stop.
  const signature = req.headers['x-razorpay-signature'] || '';
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(raw)
    .digest('hex');
  if (!safeEqualHex(expected, signature)) {
    return res.status(400).json({ ok: false });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch (_) {
    // Malformed JSON won't parse on retry either — acknowledge so Razorpay stops.
    return res.status(200).json({ ok: true });
  }

  const entity = event?.payload?.payment?.entity;

  // Only act on payment.captured; acknowledge everything else so it isn't retried.
  if (event?.event !== 'payment.captured' || !entity) {
    return res.status(200).json({ ok: true });
  }

  try {
    const email = (entity.email || '').toLowerCase();
    const userId = await findUserIdByEmail(email);

    const start = new Date();
    const end = new Date(start.getTime() + 30 * 86400000);
    const { error } = await admin.from('subscriptions').upsert(
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

    if (error) {
      // Genuine write failure — ask Razorpay to retry rather than losing the activation.
      console.error('Razorpay webhook: subscription activation failed:', error);
      return res.status(500).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    // Unknown error — let Razorpay retry.
    return res.status(500).json({ ok: false });
  }
}
