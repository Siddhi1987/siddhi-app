import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import Logo from '../components/Logo';

export default function ResetPassword() {
  const router = useRouter();
  const [ready, setReady] = useState(false);     // recovery session detected
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');  // idle | saving | done | error
  const [message, setMessage] = useState('');

  // When the user arrives from the email link, supabase-js sets a recovery
  // session and fires PASSWORD_RECOVERY. Treat that as "ok to set a new password".
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('error');
      setMessage('The two passwords do not match.');
      return;
    }
    if (!supabase) {
      setStatus('error');
      setMessage('Reset is temporarily unavailable. Please try again later.');
      return;
    }

    setStatus('saving');
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus('error');
      setMessage(error.message || 'Could not update password. The link may have expired — request a new one.');
      return;
    }
    setStatus('done');
    setTimeout(() => router.push('/dashboard'), 1800);
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-siddhi-black/10">
        <Logo />
        <Link href="/login" className="text-sm text-siddhi-black/60 hover:text-siddhi-black">Login</Link>
      </nav>

      <main className="max-w-md mx-auto px-5 pt-14 pb-20">
        <h1 className="font-display text-4xl font-bold text-center mb-2">Set a new password</h1>
        <p className="text-center text-siddhi-black/60 mb-8">Choose a strong password you'll remember.</p>

        {status === 'done' ? (
          <div className="rounded-2xl border border-siddhi-black/10 bg-white p-6 text-center">
            <div className="text-3xl mb-3">✅</div>
            <h2 className="font-display text-2xl font-bold mb-2">Password updated</h2>
            <p className="text-siddhi-black/70">Taking you to your dashboard…</p>
          </div>
        ) : !ready ? (
          <div className="rounded-2xl border border-siddhi-black/10 bg-white p-6 text-center">
            <p className="text-siddhi-black/70">
              Open this page from the reset link in your email. If you got here directly or the link expired,{' '}
              <Link href="/forgot-password" className="text-siddhi-saffron underline">request a new link</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-siddhi-black/10 bg-white p-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-siddhi-black/15 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-siddhi-saffron"
              required
            />
            <label className="block text-sm font-medium mb-2" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-lg border border-siddhi-black/15 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-siddhi-saffron"
              required
            />

            {status === 'error' && <p className="text-sm text-red-600 mb-4">{message}</p>}

            <button
              type="submit"
              disabled={status === 'saving'}
              className="w-full rounded-lg bg-siddhi-saffron text-white font-semibold py-3 hover:opacity-90 disabled:opacity-60"
            >
              {status === 'saving' ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
