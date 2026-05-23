import Link from 'next/link';
import { useState, useEffect } from 'react';

const PLANS = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 499,
    period: 'month',
    save: null,
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 4499,
    period: 'year',
    save: 'Save ₹1,489 (25% off)',
    badge: 'Best Value',
  },
];

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all your details.');
      return;
    }
    if (!consent) {
      alert('Please agree to the Privacy Policy and Terms.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email.');
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey || razorpayKey.includes('XXXX')) {
      setTimeout(() => {
        setLoading(false);
        alert(
          '✓ Demo mode\n\nNo Razorpay key configured yet. In production, this would open the Razorpay checkout.\n\nTo enable: add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local file.'
        );
      }, 800);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: selectedPlan.price * 100,
      currency: 'INR',
      name: 'SIDDHI',
      description: `${selectedPlan.name} — Communication AI`,
      image: '/favicon.ico',
      handler: function (response) {
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
        setLoading(false);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: '#FF9933',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    if (typeof window !== 'undefined' && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert('Razorpay is still loading. Please try again in a moment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>
          <Link href="/interview" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">
            ← Back to coach
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            Upgrade to Pro
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Unlock the full SIDDHI
          </h1>
          <p className="text-siddhi-black/60 max-w-xl mx-auto">
            Unlimited practice. Deep AI feedback. All role banks. Early access to Negotiate, Speak, and Lead.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Plan selection */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Choose your plan</h2>

            <div className="space-y-3 mb-6">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full p-5 rounded-lg border-2 text-left transition ${
                    selectedPlan.id === plan.id
                      ? 'border-siddhi-saffron bg-white shadow-lg'
                      : 'border-siddhi-black/10 bg-white hover:border-siddhi-saffron/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-display text-lg font-bold">{plan.name}</div>
                      <div className="text-2xl font-bold text-siddhi-saffron">
                        ₹{plan.price.toLocaleString('en-IN')}
                        <span className="text-sm text-siddhi-black/50 font-normal">/{plan.period}</span>
                      </div>
                    </div>
                    {plan.badge && (
                      <span className="text-xs px-2 py-1 bg-siddhi-saffron text-white rounded-full font-bold">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  {plan.save && (
                    <div className="text-xs text-green-700 font-semibold">{plan.save}</div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-5">
              <h3 className="font-display text-base font-bold mb-3">What you get</h3>
              <ul className="space-y-2 text-sm text-siddhi-black/75">
                <li>✓ Unlimited interview practice sessions</li>
                <li>✓ Deep AI feedback (clarity, tone, structure)</li>
                <li>✓ 50+ role-specific question banks</li>
                <li>✓ Voice analysis & filler-word tracking</li>
                <li>✓ Early access to Negotiate, Speak, Lead</li>
                <li>✓ Email support</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Payment form */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Your details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Enter your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone (10 digits)</label>
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
                <span>{selectedPlan.name}</span>
                <span>₹{selectedPlan.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-siddhi-black/10 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-siddhi-saffron">₹{selectedPlan.price.toLocaleString('en-IN')}</span>
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
                .
              </span>
            </label>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing…' : `Pay ₹${selectedPlan.price.toLocaleString('en-IN')} securely →`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-siddhi-black/50">
              <span>🔒</span>
              <span>Secured by Razorpay · PCI-DSS compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
