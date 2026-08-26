// pages/signup.jsx — email/password signup.
// The identity trigger (handle_new_user) auto-creates the public.users row on signup, and the
// claim trigger links any guest subscription to the new account by email — so paid buyers who
// arrive from the payment page (?email=&paid=1) MUST sign up with that same email. We prefill and
// LOCK the email in that case so a typo can't leave a paid buyer locked out.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [paidEmailLocked, setPaidEmailLocked] = useState(false);

  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;

  // Prefill (and lock, for paid buyers) the email from the payment redirect: /signup?email=..&paid=1
  useEffect(() => {
    if (!router.isReady) return;
    const qEmail = router.query.email;
    const paid = router.query.paid;
    if (qEmail) {
      setEmail(String(qEmail).trim().toLowerCase());
      if (paid === '1') setPaidEmailLocked(true);
    }
  }, [router.isReady, router.query.email, router.query.paid]);

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus('Supabase is not configured yet.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setStatus('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setStatus('');
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: redirectTo,
      },
    });
    setLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    // Email confirmation OFF -> a session exists now -> go to dashboard.
    // Email confirmation ON  -> no session yet -> ask them to confirm via email.
    if (data.session) {
      router.replace('/dashboard');
    } else {
      setStatus('Account created. Please check your email to confirm and continue.');
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
          <Link href="/login" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">
            Already have an account? Login
          </Link>
        </div>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Create your account</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Join SiddhiAI</h1>
          <p className="text-siddhi-black/60">Save your reports, track progress, and unlock 30-Day Access.</p>
        </div>

        {paidEmailLocked && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-900">
            Payment received. Create your account below with <strong>{email}</strong> to activate your 30-Day Access.
          </div>
        )}

        <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
          <form onSubmit={signUpWithEmail} className="space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              readOnly={paidEmailLocked}
              placeholder="you@email.com"
              className={
                'w-full p-3 border-2 rounded-lg focus:outline-none ' +
                (paidEmailLocked
                  ? 'border-siddhi-black/15 bg-siddhi-ivory text-siddhi-black/70 cursor-not-allowed'
                  : 'border-siddhi-black/15 focus:border-siddhi-saffron')
              }
            />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Create a password (min 8 characters)" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
            <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full bg-siddhi-saffron text-white font-bold hover:bg-siddhi-gold transition disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {status && (
            <div className="mt-4 rounded-lg border border-siddhi-black/10 bg-siddhi-ivory p-4 text-sm text-siddhi-black/75">
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
