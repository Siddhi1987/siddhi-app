import Razorpay from "razorpay";

const PACKAGE_AMOUNT = 49900;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name = "", email = "", phone = "", source = "siddhiai_payment_page" } = req.body || {};

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys are not configured" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: PACKAGE_AMOUNT,
      currency: "INR",
      receipt: `siddhiai_499_${Date.now()}`,
      notes: {
        package: "SiddhiAI Interview Preparation Package",
        package_price: "499",
        name: String(name).slice(0, 120),
        email: String(email).slice(0, 120),
        phone: String(phone).slice(0, 20),
        source: String(source).slice(0, 80),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({
      message: "Order creation failed",
    });
  }
}
