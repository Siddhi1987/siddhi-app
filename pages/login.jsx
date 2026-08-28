// pages/login.jsx — email/password login (primary) + magic-link fallback.
// Launch-hardening: returning users log in with email + password; magic link stays only as a
// fallback so paid access never depends on repeated magic-link requests (avoids Supabase rate limits).

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;

  const loginWithPassword = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus('Supabase is not configured yet.');
      return;
    }
    setLoading(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) {
      setStatus(error.message);
    } else {
      router.replace('/dashboard');
    }
  };

  const sendMagicLink = async () => {
    if (!isSupabaseConfigured) {
      setStatus('Supabase is not configured yet.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus('Enter your email above first, then tap "Email me a magic link".');
      return;
    }
    setLoading(true);
    setStatus('');
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    setStatus(error ? error.message : 'Magic link sent. Check your email to continue.');
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>
          <Link href="/interview" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">Try free tool</Link>
        </div>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Member Login</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Welcome back</h1>
          <p className="text-siddhi-black/60">Log in to your practice workspace.</p>
        </div>

        <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
          <form onSubmit={loginWithPassword} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
            <a href="/forgot-password" className="block text-right text-sm text-siddhi-saffron underline">Forgot password?</a>
            <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full bg-siddhi-saffron text-white font-bold hover:bg-siddhi-gold transition disabled:opacity-60">
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button type="button" onClick={sendMagicLink} className="font-semibold text-siddhi-black/60 hover:text-siddhi-saffron">
              Email me a magic link
            </button>
            <Link href="/signup" className="font-semibold text-siddhi-saffron hover:underline">
              Create an account
            </Link>
          </div>

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
