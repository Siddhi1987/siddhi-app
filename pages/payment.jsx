import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const PLAN = {
  name: 'SiddhiAI 30-Day Access',
  price: 499,
  durationDays: 30,
};

const displayNameFromUser = (user) => {
  const metadata = user?.user_metadata || {};
  return metadata.full_name || metadata.name || user?.email?.split('@')?.[0] || '';
};

export default function Payment() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const preparePage = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: userData } = await supabase.auth.getUser();
          const user = userData?.user;

          if (user && mounted) {
            setName(displayNameFromUser(user));
            setEmail(user.email || '');
            setPhone(user.user_metadata?.phone || user.phone || '');

            const { data: subscription } = await supabase
              .from('subscriptions')
              .select('status,current_period_end')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .gt('current_period_end', new Date().toISOString())
              .order('current_period_end', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (subscription) {
              window.location.replace('/dashboard');
              return;
            }
          }
        }
      } catch (error) {
        if (mounted) setMessage('We could not verify your account yet. You can still continue securely.');
      }

      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }

      if (mounted) setLoading(false);
    };

    preparePage();
    return () => { mounted = false; };
  }, []);

  const handlePayment = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanPhone.length !== 10) {
      setMessage('Please enter your name, a valid email, and a 10-digit mobile number.');
      return;
    }

    if (!consent) {
      setMessage('Please accept the Privacy Policy and Terms before payment.');
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey || !window.Razorpay) {
      setMessage('Secure checkout is still loading. Please try again in a moment.');
      return;
    }

    try {
      setPaying(true);
      setMessage('');

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          packageName: PLAN.name,
          amount: PLAN.price,
          source: 'siddhiai_payment_page',
        }),
      });

      const order = await orderResponse.json();
      if (!orderResponse.ok || !order?.id) throw new Error(order?.message || 'Order creation failed');

      const checkout = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'SiddhiAI',
        description: `${PLAN.name} - ${PLAN.durationDays} days`,
        image: '/favicon.ico',
        order_id: order.id,
        prefill: { name: cleanName, email: cleanEmail, contact: cleanPhone },
        notes: { name: cleanName, email: cleanEmail, phone: cleanPhone, package: PLAN.name },
        theme: { color: '#FF9933' },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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
              throw new Error(verification?.message || 'Verification failed');
            }

            window.location.replace('/dashboard?payment=success');
          } catch (error) {
            setPaying(false);
            setMessage('Payment was received, but access verification needs attention. Please contact support@siddhiai.in with your payment ID.');
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      checkout.open();
    } catch (error) {
      setPaying(false);
      setMessage('Payment could not be started. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-siddhi-ivory flex items-center justify-center">Checking your access...</div>;
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</Link>
          <Link href="/dashboard" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">Dashboard</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">30-Day Access</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Unlock deeper communication intelligence</h1>
          <p className="text-siddhi-black/60">One payment of ₹499 activates SiddhiAI for 30 days.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white border border-siddhi-black/10 rounded-2xl p-7 shadow-lg">
            <h2 className="font-display text-2xl font-bold mb-4">What you receive</h2>
            <ul className="space-y-3 text-sm text-siddhi-black/75">
              <li>✓ AI interview practice</li>
              <li>✓ Deeper communication feedback</li>
              <li>✓ Communication score dashboard</li>
              <li>✓ Saved reports and interview history</li>
              <li>✓ 30 days of active access</li>
            </ul>
            <div className="mt-8 border-t pt-5 flex justify-between font-bold">
              <span>Total</span><span className="text-siddhi-saffron text-2xl">₹499</span>
            </div>
          </section>

          <section className="bg-white border border-siddhi-black/10 rounded-2xl p-7 shadow-lg">
            <h2 className="font-display text-2xl font-bold mb-5">Your details</h2>
            <div className="space-y-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg" />
              <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" type="tel" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg" />
            </div>

            <label className="flex items-start gap-3 my-6 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              <span>I agree to the <Link href="/privacy" className="underline text-siddhi-saffron">Privacy Policy</Link> and <Link href="/terms" className="underline text-siddhi-saffron">Terms</Link>.</span>
            </label>

            {message && <p className="mb-4 text-sm rounded-lg bg-siddhi-ivory p-3">{message}</p>}

            <button onClick={handlePayment} disabled={paying} className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md disabled:opacity-60">
              {paying ? 'Opening secure checkout...' : 'Pay ₹499 for 30 days →'}
            </button>
            <p className="mt-3 text-xs text-center text-siddhi-black/50">Secured by Razorpay · Payment verification enabled</p>
          </section>
        </div>
      </main>
    </div>
  );
}
