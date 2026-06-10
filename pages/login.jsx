import Link from 'next/link';
import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setStatus('Supabase is not configured yet. Please add the Phase 1 environment variables.');
      return;
    }

    setLoading(true);
    setStatus('');

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard`
        : process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
          : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus('Magic link sent. Please check your email to continue.');
    }

    setLoading(false);
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
            Back to coach
          </Link>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            Member Login
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Continue with email
          </h1>
          <p className="text-siddhi-black/60">
            Get a secure magic link. No password is required in Phase 1.
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-semibold mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 px-6 py-3 rounded-full bg-siddhi-saffron text-white font-bold hover:bg-siddhi-gold transition disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>

          {status && (
            <div className="mt-4 rounded-lg border border-siddhi-black/10 bg-siddhi-ivory p-4 text-sm text-siddhi-black/75">
              {status}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
