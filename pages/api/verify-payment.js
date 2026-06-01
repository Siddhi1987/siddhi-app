import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name = '',
      email = '',
      phone = '',
      packageName = 'SiddhiAI Interview Preparation Package',
    } = req.body || {};

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay secret is not configured' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay verification fields' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ verified: false, message: 'Payment verification failed' });
    }

    return res.status(200).json({
      verified: true,
      account: {
        name: String(name).slice(0, 120),
        email: String(email).slice(0, 120).toLowerCase(),
        phone: String(phone).slice(0, 20),
        packageName,
        access: 'active',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        activatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ verified: false, message: 'Unable to verify payment' });
  }
}
