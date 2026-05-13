import Link from 'next/link';
import { useState, useEffect } from 'react';

// Formspree endpoint for early-access signups
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkoyyrbz';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [modalModule, setModalModule] = useState(null); // null | 'Negotiate' | 'Speak' | 'Lead'
  const [modalEmail, setModalEmail] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openModal = (moduleName) => {
    setModalModule(moduleName);
    setModalEmail('');
    setModalName('');
    setModalSuccess(false);
  };

  const closeModal = () => {
    setModalModule(null);
    setModalSuccess(false);
  };

  const submitEarlyAccess = async (e) => {
    e.preventDefault();
    if (!modalEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalEmail)) {
      alert('Please enter a valid email.');
      return;
    }
    setModalSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: modalName || 'Anonymous',
          email: modalEmail,
          module_interest: modalModule,
          source: 'Early Access Signup',
          submitted_at: new Date().toISOString(),
          _subject: `🎯 Early Access: ${modalModule} — ${modalName || modalEmail}`,
        }),
      });

      if (response.ok) {
        setModalSuccess(true);
      } else {
        alert('Something went wrong. Please email support@siddhiai.in');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const features = [
    {
      emoji: '🎯',
      title: 'Interview',
      desc: 'Mock interviews with real-time feedback on clarity, structure, and confidence.',
      live: true,
      href: '/interview',
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
  ];

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-siddhi-ivory/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="font-display text-2xl sm:text-3xl font-bold text-siddhi-saffron tracking-tight">
              SIDDHI
            </span>
            <span className="font-sanskrit text-sm text-siddhi-gold hidden sm:inline">सिद्धि</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <a href="#features" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">
              Features
            </a>
            <a href="#pricing" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">
              Pricing
            </a>
            <Link
              href="/interview"
              className="px-3 sm:px-5 py-2 bg-siddhi-saffron text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm whitespace-nowrap"
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/50">
            <span className="font-sanskrit text-siddhi-gold text-lg">वाक् सिद्धि</span>
            <span className="mx-2 text-siddhi-gold/40">·</span>
            <span className="text-xs uppercase tracking-widest text-siddhi-black/60">Mastery of Speech</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-siddhi-black mb-6 leading-[1.1] md:leading-[1.05] break-words">
            India's first
            <br />
            <span className="text-siddhi-saffron italic">Communication AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-siddhi-black/70 mb-3 font-light">
            Ancient Wisdom. Modern AI.
          </p>
          <p className="text-base md:text-lg text-siddhi-black/60 max-w-2xl mx-auto mb-10">
            From interview confidence to negotiation mastery — train your voice with an AI
            rooted in Indian heritage and built for the modern professional.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/interview"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg shadow-siddhi-saffron/20 text-base sm:text-lg text-center"
            >
              Start Free Interview Practice →
            </Link>
            <Link
              href="/payment"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-base sm:text-lg text-center"
            >
              Upgrade to Pro
            </Link>
          </div>

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

      {/* ============ FEATURES (clickable) ============ */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              The SIDDHI Way
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Four pillars of mastery
            </h2>
            <p className="text-siddhi-black/60 max-w-2xl mx-auto">
              Built for the way Indians actually communicate — interviews, negotiations, leadership, life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const cardClasses = `p-6 rounded-lg border-2 transition cursor-pointer text-left w-full ${
                f.live
                  ? 'border-siddhi-saffron bg-siddhi-ivory hover:shadow-lg hover:scale-[1.02]'
                  : 'border-siddhi-black/10 bg-siddhi-ivory/50 hover:border-siddhi-saffron/50 hover:shadow-md'
              }`;

              const cardContent = (
                <>
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
                  <p className="text-sm text-siddhi-black/70 mb-3">{f.desc}</p>
                  <div className="text-xs font-semibold text-siddhi-saffron">
                    {f.live ? 'Try now →' : 'Get early access →'}
                  </div>
                </>
              );

              return f.live ? (
                <Link key={f.title} href={f.href} className={cardClasses}>
                  {cardContent}
                </Link>
              ) : (
                <button key={f.title} onClick={() => openModal(f.title)} className={cardClasses}>
                  {cardContent}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY SIDDHI ============ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-siddhi-ivory">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Why SIDDHI
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
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
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Start free. Upgrade when ready.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-sanskrit text-3xl text-siddhi-gold mb-4">वाक् सिद्धि</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
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
      <footer className="py-8 sm:py-10 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory/60 border-t border-siddhi-ivory/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-siddhi-saffron transition">Privacy</Link>
            <Link href="/terms" className="hover:text-siddhi-saffron transition">Terms</Link>
            <Link href="/feedback" className="hover:text-siddhi-saffron transition">Feedback</Link>
            <a href="mailto:support@siddhiai.in" className="hover:text-siddhi-saffron transition">
              Contact
            </a>
          </div>
          <div className="text-xs">© 2026 SIDDHI · Ancient Wisdom. Modern AI.</div>
        </div>
      </footer>

      {/* ============ EARLY ACCESS MODAL ============ */}
      {modalModule && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-siddhi-black/40 hover:text-siddhi-black text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>

            {!modalSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">
                    {modalModule === 'Negotiate' && '🤝'}
                    {modalModule === 'Speak' && '🎤'}
                    {modalModule === 'Lead' && '👑'}
                  </div>
                  <span className="inline-block text-xs px-2 py-0.5 bg-siddhi-gold/20 text-siddhi-gold rounded-full font-semibold mb-3 uppercase tracking-wider">
                    Coming Soon
                  </span>
                  <h3 className="font-display text-2xl font-bold mb-2">
                    SIDDHI {modalModule}
                  </h3>
                  <p className="text-sm text-siddhi-black/60">
                    Be the first to know when {modalModule} launches.
                    Founding members get <strong>lifetime 50% off</strong>.
                  </p>
                </div>

                <form onSubmit={submitEarlyAccess} className="space-y-3">
                  <input
                    type="text"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                  />
                  <input
                    type="email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="w-full px-6 py-3 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition disabled:opacity-60"
                  >
                    {modalSubmitting ? 'Joining…' : `Join the ${modalModule} waitlist →`}
                  </button>
                </form>

                <p className="text-xs text-siddhi-black/50 text-center mt-4">
                  No spam. We'll only email you when {modalModule} is ready.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="font-display text-2xl font-bold mb-2">You're on the list!</h3>
                <p className="text-sm text-siddhi-black/60 mb-6">
                  We'll notify you when SIDDHI {modalModule} launches. Founding member status secured.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition"
                >
                  Continue exploring SIDDHI
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
