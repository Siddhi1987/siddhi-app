import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-siddhi-ivory/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-siddhi-saffron tracking-tight">
              SIDDHI
            </span>
            <span className="font-sanskrit text-sm text-siddhi-gold hidden sm:inline">सिद्धि</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">
              Features
            </a>
            <a href="#pricing" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">
              Pricing
            </a>
            <Link
              href="/interview"
              className="px-5 py-2 bg-siddhi-saffron text-white text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm"
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Sanskrit vision line */}
          <div className="inline-block mb-6 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/50">
            <span className="font-sanskrit text-siddhi-gold text-lg">वाक् सिद्धि</span>
            <span className="mx-2 text-siddhi-gold/40">·</span>
            <span className="text-xs uppercase tracking-widest text-siddhi-black/60">Mastery of Speech</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-6xl md:text-8xl font-bold text-siddhi-black mb-6 leading-[1.05]">
            India's first
            <br />
            <span className="text-siddhi-saffron italic">Communication AI</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-siddhi-black/70 mb-3 font-light">
            Ancient Wisdom. Modern AI.
          </p>
          <p className="text-base md:text-lg text-siddhi-black/60 max-w-2xl mx-auto mb-10">
            From interview confidence to negotiation mastery — train your voice with an AI
            rooted in Indian heritage and built for the modern professional.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/interview"
              className="px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg shadow-siddhi-saffron/20 text-lg"
            >
              Start Free Interview Practice →
            </Link>
            <Link
              href="/payment"
              className="px-8 py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-lg"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center justify-center gap-2 text-sm text-siddhi-black/50">
            <div className="flex -space-x-2">
              {['🧑‍💼', '👩‍💻', '🧑‍🎓', '👨‍🏫'].map((e, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white border-2 border-siddhi-ivory flex items-center justify-center text-sm shadow"
                >
                  {e}
                </div>
              ))}
            </div>
            <span className="ml-2">Trusted by early users across India</span>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              The SIDDHI Way
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Four pillars of mastery
            </h2>
            <p className="text-siddhi-black/60 max-w-2xl mx-auto">
              Built for the way Indians actually communicate — interviews, negotiations, leadership, life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🎯',
                title: 'Interview',
                desc: 'Mock interviews with real-time feedback on clarity, structure, and confidence.',
                live: true,
              },
              {
                emoji: '🤝',
                title: 'Negotiate',
                desc: 'Practice salary talks, deal-making, and difficult conversations.',
                live: false,
              },
              {
                emoji: '🎤',
                title: 'Speak',
                desc: 'Master public speaking — pitches, presentations, town halls.',
                live: false,
              },
              {
                emoji: '👑',
                title: 'Lead',
                desc: 'Coach feedback, conflict resolution, and executive presence.',
                live: false,
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`p-6 rounded-lg border-2 transition ${
                  f.live
                    ? 'border-siddhi-saffron bg-siddhi-ivory hover:shadow-lg'
                    : 'border-siddhi-black/10 bg-siddhi-ivory/50'
                }`}
              >
                <div className="text-4xl mb-4">{f.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-xl font-bold">{f.title}</h3>
                  {f.live ? (
                    <span className="text-xs px-2 py-0.5 bg-siddhi-saffron text-white rounded-full font-semibold">
                      LIVE
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-siddhi-black/10 text-siddhi-black/60 rounded-full font-semibold">
                      SOON
                    </span>
                  )}
                </div>
                <p className="text-sm text-siddhi-black/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY SIDDHI ============ */}
      <section className="py-20 px-6 bg-siddhi-ivory">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Why SIDDHI
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Built for India, by an Indian.
            </h2>
            <div className="space-y-4 text-siddhi-black/75">
              <p>
                Generic interview tools were trained on Western contexts. They miss the nuances
                of Indian hiring — the questions, the cultural codes, the language switches.
              </p>
              <p>
                SIDDHI understands that "tell me about yourself" in a Bangalore startup interview
                is different from one in a Mumbai MNC. We're building communication AI that gets it.
              </p>
              <p className="font-semibold text-siddhi-black">
                Rooted in heritage. Powered by AI. Made for you.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-siddhi-saffron via-siddhi-gold to-siddhi-saffron/60 rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-2xl">
              <div className="font-sanskrit text-6xl md:text-7xl mb-4 leading-none">वाक्</div>
              <div className="font-sanskrit text-6xl md:text-7xl mb-6 leading-none">सिद्धि</div>
              <div className="w-12 h-px bg-white/60 mb-4" />
              <div className="font-display text-xl italic">"Mastery of Speech"</div>
              <div className="text-sm mt-2 opacity-80">— from Sanskrit tradition</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Pricing
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Start free. Upgrade when ready.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-lg border-2 border-siddhi-black/10 bg-siddhi-ivory/40">
              <h3 className="font-display text-2xl font-bold mb-1">Free</h3>
              <p className="text-sm text-siddhi-black/60 mb-6">Try the experience</p>
              <div className="text-4xl font-bold mb-6">
                ₹0<span className="text-base font-normal text-siddhi-black/60">/forever</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li>✓ 3 interview practice sessions</li>
                <li>✓ Basic feedback</li>
                <li>✓ Sample question bank</li>
              </ul>
              <Link
                href="/interview"
                className="block text-center px-6 py-3 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-white transition"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-lg border-2 border-siddhi-saffron bg-gradient-to-br from-siddhi-ivory to-white relative shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-siddhi-saffron text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="font-display text-2xl font-bold mb-1">Pro</h3>
              <p className="text-sm text-siddhi-black/60 mb-6">Master the craft</p>
              <div className="text-4xl font-bold mb-6 text-siddhi-saffron">
                ₹499<span className="text-base font-normal text-siddhi-black/60">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li>✓ Unlimited practice sessions</li>
                <li>✓ Deep AI feedback (clarity, tone, structure)</li>
                <li>✓ Role-specific questions (PM, SDE, Sales, HR…)</li>
                <li>✓ Voice analysis & filler-word tracking</li>
                <li>✓ Early access to Negotiate, Speak, Lead modules</li>
              </ul>
              <Link
                href="/payment"
                className="block text-center px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg"
              >
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-sanskrit text-3xl text-siddhi-gold mb-4">वाक् सिद्धि</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Your voice, perfected.
          </h2>
          <p className="text-lg text-siddhi-ivory/70 mb-10">
            Join the first wave of Indians training their communication with AI that understands them.
          </p>
          <Link
            href="/interview"
            className="inline-block px-10 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-2xl text-lg"
          >
            Begin Your Practice →
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-10 px-6 bg-siddhi-black text-siddhi-ivory/60 border-t border-siddhi-ivory/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-siddhi-saffron transition">Privacy</Link>
            <Link href="/terms" className="hover:text-siddhi-saffron transition">Terms</Link>
            <a href="mailto:support@siddhiai.in" className="hover:text-siddhi-saffron transition">
              Contact
            </a>
          </div>
          <div className="text-xs">© 2026 SIDDHI · Ancient Wisdom. Modern AI.</div>
        </div>
      </footer>
    </div>
  );
}
