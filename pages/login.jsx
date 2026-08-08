// pages/login.jsx — email/password (primary) + Continue with Google + magic-link fallback.
// NOTE: Google button only works after you enable Google in Supabase (see google_oauth_setup.md).

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import Logo from '../components/Logo';

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

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) return;
    setStatus('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) setStatus(error.message);
  };

  const sendMagicLink = async () => {
    if (!isSupabaseConfigured) {
      setStatus('Supabase is not configured yet.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus('Enter your email above first, then tap “Email me a magic link”.');
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
          <Logo />
          <Link href="/interview" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">Back to coach</Link>
        </div>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Member Login</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Welcome back</h1>
          <p className="text-siddhi-black/60">Log in to your practice workspace.</p>
        </div>

        <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border-2 border-siddhi-black/15 font-semibold hover:border-siddhi-saffron transition"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-siddhi-black/10" />
            <span className="text-xs text-siddhi-black/40 uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-siddhi-black/10" />
          </div>

          <form onSubmit={loginWithPassword} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
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
