import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const DASHBOARD_FEATURES = [
  {
    title: 'AI Interview Practice',
    description: 'Start your free interview check and practice focused questions.',
    href: '/interview',
  },
  {
    title: 'Previous Reports',
    description: 'Your saved readiness reports will appear here after report storage is enabled.',
  },
  {
    title: 'Communication Score',
    description: 'Track clarity, structure, and confidence once reports are connected.',
  },
  {
    title: 'Interview History',
    description: 'Review practice history after the next reporting phase.',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (userError || !currentUser) {
        router.replace('/login');
        return;
      }

      setUser(currentUser);

      const { data, error } = await supabase
        .from('subscriptions')
        .select('status,current_period_end')
        .eq('user_id', currentUser.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setSubscriptionError('Subscription status could not be loaded yet.');
      }

      setSubscription(data || null);
      setLoading(false);
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = Boolean(subscription);

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">SiddhiAI</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            SiddhiAI Dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your practice workspace
          </h1>
          <p className="text-siddhi-black/60">
            Account: {user?.email || 'Supabase not configured yet'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            Supabase environment variables are not configured yet. Add the Phase 1 keys to enable login.
          </div>
        )}

        {subscriptionError && (
          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            {subscriptionError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-siddhi-black/50 mb-2">Subscription status</p>
            <p className="font-display text-3xl font-bold text-siddhi-saffron">
              {hasActiveSubscription ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-siddhi-black/50 mb-2">Access plan</p>
            <p className="font-display text-3xl font-bold">30-Day Access</p>
          </div>
        </div>

        {!hasActiveSubscription ? (
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-8 shadow-lg">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Upgrade Required
            </p>
            <h2 className="font-display text-3xl font-bold mb-4">
              Unlock SiddhiAI 30-Day Access &#8377;499
            </h2>
            <p className="text-siddhi-black/60 mb-6">
              Start with a free interview check, then unlock 30-day access when you are ready for deeper practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/interview"
                className="inline-flex px-6 py-3 rounded-full bg-siddhi-saffron text-white font-bold hover:bg-siddhi-gold transition justify-center"
              >
                Start Free Interview Check
              </Link>
              <Link
                href="/payment"
                className="inline-flex px-6 py-3 rounded-full border-2 border-siddhi-black text-siddhi-black font-bold hover:bg-siddhi-black hover:text-white transition justify-center"
              >
                Unlock 30-Day Access &#8377;499
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {DASHBOARD_FEATURES.map((feature) =>
              feature.href ? (
                <Link key={feature.title} href={feature.href} className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg hover:border-siddhi-saffron/50 transition">
                  <h2 className="font-display text-xl font-bold mb-2">{feature.title}</h2>
                  <p className="text-siddhi-black/60">{feature.description}</p>
                </Link>
              ) : (
                <div key={feature.title} className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
                  <h2 className="font-display text-xl font-bold mb-2">{feature.title}</h2>
                  <p className="text-siddhi-black/60">{feature.description}</p>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
