import Link from 'next/link';
import { useState, useEffect } from 'react';

const PLAN = {
  id: 'monthly-499',
  name: 'SiddhiAI Monthly Access',
  price: 499,
  period: 'month',
  durationDays: 30,
};

export default function Payment() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\s/g, '');

    if (!cleanName || !cleanEmail || !cleanPhone) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }

    if (!consent) {
      alert('Please agree to the Privacy Policy and Terms.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert('Please enter a valid email.');
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey || razorpayKey.includes('XXXX')) {
      alert('Razorpay key is not configured.');
      return;
    }

    if (typeof window === 'undefined' || !window.Razorpay) {
      alert('Razorpay is still loading. Please try again in a moment.');
      return;
    }

    try {
      setLoading(true);

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          packageName: PLAN.name,
          amount: PLAN.price,
          source: 'siddhiai_monthly_payment_page',
        }),
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok || !order?.id) {
        throw new Error(order?.message || 'Order creation failed');
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'SiddhiAI',
        description: `${PLAN.name} - 30 days access`,
        image: '/favicon.ico',
        order_id: order.id,
        prefill: {
          name: cleanName,
          email: cleanEmail,
          contact: cleanPhone,
        },
        notes: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          package: PLAN.name,
          duration: '30 days',
          price: PLAN.price,
        },
        theme: {
          color: '#FF9933',
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...response,
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                packageName: PLAN.name,
              }),
            });

            const verification = await verifyResponse.json();

            if (!verifyResponse.ok || !verification?.verified) {
              throw new Error(verification?.message || 'Payment verification failed');
            }

            const dashboardParams = new URLSearchParams({
              access: 'active',
              name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              plan: PLAN.name,
            });

            window.location.href = `/dashboard?${dashboardParams.toString()}`;
          } catch (error) {
            console.error('Verification error:', error);
            setLoading(false);
            alert('Payment received, but access verification failed. Please contact support@siddhiai.in with your payment ID.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      alert('Payment could not be started. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">
              SIDDHI
            </span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>

          <Link
            href="/interview"
            className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron"
          >
            Try free tool
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            ₹499 Monthly Subscription
          </p>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Unlock deeper communication intelligence
          </h1>

          <p className="text-siddhi-black/60 max-w-xl mx-auto">
            Use the free tool first. Upgrade when you want deeper AI-generated feedback,
            interview history, and communication score tracking for 30 days.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">
              Your monthly access
            </h2>

            <div className="w-full p-5 rounded-lg border-2 text-left transition border-siddhi-saffron bg-white shadow-lg mb-6">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="font-display text-lg font-bold">
                    {PLAN.name}
                  </div>

                  <div className="text-2xl font-bold text-siddhi-saffron">
                    ₹{PLAN.price.toLocaleString('en-IN')}
                    <span className="text-sm text-siddhi-black/50 font-normal">
                      /{PLAN.period}
                    </span>
                  </div>
                </div>

                <span className="text-xs px-2 py-1 bg-siddhi-saffron text-white rounded-full font-bold">
                  30 Days
                </span>
              </div>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-5">
              <h3 className="font-display text-base font-bold mb-3">
                What activates after payment
              </h3>

              <ul className="space-y-2 text-sm text-siddhi-black/75">
                <li>✓ 30 days SiddhiAI access</li>
                <li>✓ AI Interview Practice</li>
                <li>✓ Deeper communication feedback</li>
                <li>✓ Communication score dashboard</li>
                <li>✓ Previous reports area</li>
                <li>✓ Interview history area</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-4">
              Your details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Enter your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone (10 digits)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your number"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>
            </div>

            <div className="my-6 p-4 bg-white border border-siddhi-black/10 rounded-lg">
              <div className="flex justify-between mb-2 text-sm">
                <span>{PLAN.name}</span>
                <span>₹{PLAN.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between mb-2 text-sm text-siddhi-black/60">
                <span>Access duration</span>
                <span>{PLAN.durationDays} days</span>
              </div>

              <div className="border-t border-siddhi-black/10 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-siddhi-saffron">
                  ₹{PLAN.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-siddhi-saffron"
              />

              <span>
                I agree to SIDDHI's{' '}
                <Link href="/privacy" className="text-siddhi-saffron underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="text-siddhi-saffron underline">
                  Terms & Conditions
                </Link>
                . I understand this activates 30 days of SiddhiAI access.
              </span>
            </label>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Creating secure monthly access…'
                : `Pay ₹${PLAN.price.toLocaleString('en-IN')} for 30 days →`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-siddhi-black/50">
              <span>🔒</span>
              <span>Secured by Razorpay · Payment verification enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
