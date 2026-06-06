import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const FOUNDER_EMAIL = "paraggokhale1987@gmail.com";

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "Not tracked";
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function formatRevenue(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function percent(numerator, denominator) {
  if (!denominator || numerator === null || numerator === undefined) {
    return "N/A";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

export default function FounderAdmin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadMetrics = async () => {
    setLoading(true);
    setStatus("");

    if (!isSupabaseConfigured) {
      setStatus("Supabase is not configured yet.");
      setLoading(false);
      return;
    }

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    setUser(currentUser);

    if ((currentUser.email || "").toLowerCase() !== FOUNDER_EMAIL) {
      setStatus("Founder access only.");
      setLoading(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/admin-metrics", {
      headers: {
        Authorization: `Bearer ${session?.access_token || ""}`,
      },
    });

    const payload = await response.json();

    if (!response.ok) {
      setStatus(payload.message || "Admin metrics could not be loaded.");
      setLoading(false);
      return;
    }

    setMetrics(payload.metrics);
    setErrors(payload.errors || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const metricCards = useMemo(() => {
    if (!metrics) return [];

    return [
      {
        label: "Total Users",
        value: formatNumber(metrics.totalUsers),
        detail: "Supabase Auth users",
      },
      {
        label: "Readiness Profiles Submitted",
        value: formatNumber(metrics.readinessProfilesSubmitted),
        detail: "readiness_profiles rows",
      },
      {
        label: "Interviews Completed",
        value: formatNumber(metrics.interviewsCompleted),
        detail: "Tracked completed sessions",
      },
      {
        label: "Communication Reports Generated",
        value: formatNumber(metrics.communicationReportsGenerated),
        detail: "communication_reports rows",
      },
      {
        label: "Paid Users",
        value: formatNumber(metrics.paidUsers),
        detail: "Unique users in subscriptions",
      },
      {
        label: "Active Subscriptions",
        value: formatNumber(metrics.activeSubscriptions),
        detail: "Active and not expired",
      },
      {
        label: "Revenue",
        value: formatRevenue(metrics.revenueInr),
        detail: "Total subscription amount captured",
      },
    ];
  }, [metrics]);

  const funnel = metrics?.conversionFunnel || [];
  const knownFunnelMax = Math.max(...funnel.map((step) => step.value || 0), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
            Loading founder admin...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">Founder Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-siddhi-black/60 hover:text-siddhi-saffron">
              User dashboard
            </Link>
            <button
              type="button"
              onClick={loadMetrics}
              className="rounded-full border border-siddhi-black/15 px-4 py-2 font-semibold hover:border-siddhi-saffron"
            >
              Refresh
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            Founder visibility before launch
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Admin dashboard
          </h1>
          <p className="text-siddhi-black/60">
            Access: {user?.email || "Not logged in"}
          </p>
        </div>

        {status && (
          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            {status}{" "}
            {status.includes("Founder") ? null : (
              <Link href="/login" className="font-semibold underline">
                Login with founder email
              </Link>
            )}
          </div>
        )}

        {metrics && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-widest text-siddhi-black/45 font-semibold mb-3">
                    {card.label}
                  </p>
                  <p className="font-display text-3xl font-bold text-siddhi-saffron mb-2">
                    {card.value}
                  </p>
                  <p className="text-sm text-siddhi-black/55">{card.detail}</p>
                </div>
              ))}
            </div>

            <section className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-2">
                    Conversion Funnel
                  </p>
                  <h2 className="font-display text-3xl font-bold">
                    Visitor &rarr; Login &rarr; Assessment &rarr; Report &rarr; Payment
                  </h2>
                </div>
                <p className="text-sm text-siddhi-black/55">
                  Generated {new Date(metrics.generatedAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-4">
                {funnel.map((step, index) => {
                  const previousValue = index > 0 ? funnel[index - 1].value : null;
                  const width =
                    step.value === null ? 100 : Math.max((step.value / knownFunnelMax) * 100, 8);

                  return (
                    <div key={step.key}>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                          <p className="font-semibold">{step.label}</p>
                          {step.note && (
                            <p className="text-xs text-siddhi-black/50">{step.note}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl font-bold">
                            {formatNumber(step.value)}
                          </p>
                          <p className="text-xs text-siddhi-black/50">
                            From previous: {percent(step.value, previousValue)}
                          </p>
                        </div>
                      </div>
                      <div className="h-3 rounded-full bg-siddhi-black/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-siddhi-saffron"
                          style={{ width: `${width}%`, opacity: step.value === null ? 0.25 : 1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
                <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                  Data Notes
                </p>
                <ul className="space-y-3 text-sm text-siddhi-black/65">
                  {metrics.notes.map((note) => (
                    <li key={note}>- {note}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-lg">
                <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                  Data Health
                </p>
                {errors.length === 0 ? (
                  <p className="text-sm text-green-700">All admin metric queries returned successfully.</p>
                ) : (
                  <ul className="space-y-3 text-sm text-red-700">
                    {errors.map((error) => (
                      <li key={`${error.source}-${error.message}`}>
                        - {error.source}: {error.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
