import Link from 'next/link';
import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setMessage('Password reset is temporarily unavailable. Please try again later.');
      return;
    }
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setStatus('error');
      setMessage('Please enter the email you registered with.');
      return;
    }

    setStatus('sending');
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(clean, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
      return;
    }
    // Always show success (don't reveal whether an email exists — safer)
    setStatus('sent');
    setMessage('');
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-siddhi-black/10">
        <Logo />
        <Link href="/login" className="text-sm text-siddhi-black/60 hover:text-siddhi-black">
          Back to login
        </Link>
      </nav>

      <main className="max-w-md mx-auto px-5 pt-14 pb-20">
        <h1 className="font-display text-4xl font-bold text-center mb-2">Reset your password</h1>
        <p className="text-center text-siddhi-black/60 mb-8">
          Enter your registered email and we'll send you a secure link to set a new password.
        </p>

        {status === 'sent' ? (
          <div className="rounded-2xl border border-siddhi-black/10 bg-white p-6 text-center">
            <div className="text-3xl mb-3">🪔</div>
            <h2 className="font-display text-2xl font-bold mb-2">Check your inbox</h2>
            <p className="text-siddhi-black/70">
              If an account exists for <strong>{email.trim().toLowerCase()}</strong>, a reset link is on its way.
              The link expires in 60 minutes.
            </p>
            <p className="text-sm text-siddhi-black/50 mt-4">
              Didn't get it? Check spam, or{' '}
              <button
                type="button"
                onClick={() => { setStatus('idle'); setMessage(''); }}
                className="text-siddhi-saffron underline"
              >
                try again
              </button>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-siddhi-black/10 bg-white p-6">
            <label className="block text-sm font-medium mb-2" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-siddhi-black/15 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-siddhi-saffron"
              required
            />

            {status === 'error' && (
              <p className="text-sm text-red-600 mb-4">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-siddhi-saffron text-white font-semibold py-3 hover:opacity-90 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send reset link'}
            </button>

            <p className="text-center text-sm text-siddhi-black/60 mt-5">
              Remembered it?{' '}
              <Link href="/login" className="text-siddhi-saffron underline">Back to login</Link>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
