import Link from 'next/link';
import { useState, useEffect } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkoyyrbz';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [modalModule, setModalModule] = useState(null);
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
          _subject: `Early Access: ${modalModule} - ${modalName || modalEmail}`,
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
      title: 'AI Interview Coach',
      desc: 'Practice role-specific interview answers and get instant feedback on clarity, structure, confidence, and relevance.',
      live: true,
      href: '/interview',
    },
    {
      emoji: '🧑‍💼',
      title: 'Real HR Mock Interview',
      desc: 'Premium 1:1 interview simulation with real HR-style feedback, pressure testing, and improvement actions.',
      live: false,
      module: 'Real HR Interview',
    },
    {
      emoji: '📄',
      title: 'Deep Interview Report',
      desc: 'A detailed performance report covering strengths, weak answers, communication gaps, and next practice plan.',
      live: false,
      module: 'Deep Interview Report',
    },
    {
      emoji: '🤝',
      title: 'Salary Negotiation',
      desc: 'Practice difficult conversations and salary discussions with structured, ethical negotiation coaching.',
      live: false,
      module: 'Negotiate',
    },
  ];

  const offers = [
    {
      name: 'AI Interview Practice',
      price: '₹499',
      tag: 'Fast start',
      desc: 'For students and professionals who want quick practice before interviews.',
      items: ['Role-specific AI mock interview', 'Instant communication feedback', 'Clarity and structure scoring', '3-question focused session'],
      cta: 'Start AI Practice',
      href: '/interview',
      primary: false,
    },
    {
      name: 'Deep Interview Analysis',
      price: '₹1,499',
      tag: 'Best for serious candidates',
      desc: 'For job seekers who want a deeper diagnosis before important interviews.',
      items: ['AI interview simulation', 'Detailed improvement report', 'Answer quality analysis', 'Personal practice roadmap'],
      cta: 'Join Priority List',
      module: 'Deep Interview Analysis',
      primary: true,
    },
    {
      name: 'Real HR Mock Interview',
      price: '₹3,999',
      tag: 'Premium',
      desc: 'For candidates preparing for high-stakes interviews with real HR-style evaluation.',
      items: ['Live HR-style mock interview', 'Pressure simulation', 'Resume and communication feedback', 'Action plan after session'],
      cta: 'Request HR Slot',
      module: 'Real HR Mock Interview',
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black overflow-x-hidden">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-siddhi-ivory/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="font-display text-2xl sm:text-3xl font-bold text-siddhi-saffron tracking-tight">SIDDHI</span>
            <span className="font-sanskrit text-xs sm:text-sm text-siddhi-gold">सिद्धि</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <a href="#offers" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">Pricing</a>
            <a href="#hr" className="hidden md:inline text-sm font-medium hover:text-siddhi-saffron transition">Real HR</a>
            <Link href="/interview" className="px-3 sm:px-5 py-2 bg-siddhi-saffron text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm whitespace-nowrap">
              Start Interview
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/50">
            <span className="font-sanskrit text-siddhi-gold text-lg">वाक् सिद्धि</span>
            <span className="mx-2 text-siddhi-gold/40">·</span>
            <span className="text-xs uppercase tracking-widest text-siddhi-black/60">Mastery of Speech</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-siddhi-black mb-6 leading-[1.1] md:leading-[1.05] break-words">
            India’s First Communication AI
            <br />
            <span className="text-siddhi-saffron italic">Inspired by Vak Siddhi</span>
          </h1>

          <p className="text-xl md:text-2xl text-siddhi-black/70 mb-3 font-light">Ancient Wisdom. Modern AI.</p>
          <p className="text-base md:text-lg text-siddhi-black/60 max-w-2xl mx-auto mb-10">
            SIDDHI helps students and professionals improve interview communication, answer structure, confidence, and hiring readiness through AI practice and premium HR-style evaluation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 max-w-md sm:max-w-none mx-auto">
            <Link href="/interview" className="px-6 sm:px-8 py-3 sm:py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg shadow-siddhi-saffron/20 text-base sm:text-lg text-center">
              Start AI Mock Interview →
            </Link>
            <button onClick={() => openModal('Real HR Mock Interview')} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-base sm:text-lg text-center">
              Request Real HR Interview
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-sm">
            <div className="bg-white/70 border border-siddhi-black/10 rounded-lg p-3">Built by HR experience</div>
            <div className="bg-white/70 border border-siddhi-black/10 rounded-lg p-3">Role-specific interview practice</div>
            <div className="bg-white/70 border border-siddhi-black/10 rounded-lg p-3">Free start, premium upgrade</div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Focused for 60 days</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Only interview communication. Nothing else.</h2>
            <p className="text-siddhi-black/60 max-w-2xl mx-auto">
              SIDDHI is not a generic advice AI. For now, it is a focused interview communication platform for serious candidates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const cardClasses = `p-6 rounded-lg border-2 transition text-left w-full ${
                f.live ? 'border-siddhi-saffron bg-siddhi-ivory hover:shadow-lg hover:scale-[1.02]' : 'border-siddhi-black/10 bg-siddhi-ivory/50 hover:border-siddhi-saffron/50 hover:shadow-md'
              }`;
              const cardContent = (
                <>
                  <div className="text-4xl mb-4">{f.emoji}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display text-xl font-bold">{f.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.live ? 'bg-siddhi-saffron text-white' : 'bg-siddhi-black/10 text-siddhi-black/60'}`}>
                      {f.live ? 'LIVE' : 'PRIORITY'}
                    </span>
                  </div>
                  <p className="text-sm text-siddhi-black/70 mb-3">{f.desc}</p>
                  <div className="text-xs font-semibold text-siddhi-saffron">{f.live ? 'Try now →' : 'Join priority list →'}</div>
                </>
              );

              return f.live ? (
                <Link key={f.title} href={f.href} className={cardClasses}>{cardContent}</Link>
              ) : (
                <button key={f.title} onClick={() => openModal(f.module)} className={cardClasses}>{cardContent}</button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="hr" className="py-12 sm:py-20 px-4 sm:px-6 bg-siddhi-ivory">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Real HR Layer</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">AI practice is the start. Real HR feedback is the premium edge.</h2>
            <div className="space-y-4 text-siddhi-black/75">
              <p>SIDDHI combines scalable AI interview practice with human HR-style judgment for candidates preparing for important opportunities.</p>
              <p>The goal is simple: better answers, better structure, stronger confidence, and clearer interview communication.</p>
              <p className="font-semibold text-siddhi-black">This is hiring confidence optimization, not generic life advice.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white border-2 border-siddhi-saffron/30 p-6 sm:p-8 shadow-xl">
            <h3 className="font-display text-2xl font-bold mb-4">What candidates get</h3>
            <ul className="space-y-3 text-sm text-siddhi-black/75">
              <li>✓ Role-specific AI interview simulation</li>
              <li>✓ Communication score across clarity, confidence, and structure</li>
              <li>✓ Real HR-style interview slot for premium users</li>
              <li>✓ Detailed improvement report and next-practice plan</li>
              <li>✓ Focus on Indian hiring context and professional expectations</li>
            </ul>
            <button onClick={() => openModal('Real HR Mock Interview')} className="mt-8 w-full px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg">
              Request HR Mock Interview →
            </button>
          </div>
        </div>
      </section>

      <section id="offers" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Interview Offers</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Simple pricing for the first growth sprint.</h2>
            <p className="text-siddhi-black/60 max-w-2xl mx-auto">Start with AI. Upgrade when the interview is serious.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.name} className={`p-7 rounded-lg border-2 relative ${offer.primary ? 'border-siddhi-saffron bg-gradient-to-br from-siddhi-ivory to-white shadow-xl' : 'border-siddhi-black/10 bg-siddhi-ivory/40'}`}>
                <div className="text-xs uppercase tracking-wider font-bold text-siddhi-saffron mb-3">{offer.tag}</div>
                <h3 className="font-display text-2xl font-bold mb-2">{offer.name}</h3>
                <p className="text-sm text-siddhi-black/60 mb-5 min-h-[48px]">{offer.desc}</p>
                <div className="text-4xl font-bold mb-6 text-siddhi-saffron">{offer.price}</div>
                <ul className="space-y-3 mb-8 text-sm text-siddhi-black/75">
                  {offer.items.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
                {offer.href ? (
                  <Link href={offer.href} className={`block text-center px-6 py-3 font-semibold rounded-md transition ${offer.primary ? 'bg-siddhi-saffron text-white hover:bg-siddhi-gold' : 'border-2 border-siddhi-black text-siddhi-black hover:bg-siddhi-black hover:text-white'}`}>
                    {offer.cta}
                  </Link>
                ) : (
                  <button onClick={() => openModal(offer.module)} className={`w-full px-6 py-3 font-semibold rounded-md transition ${offer.primary ? 'bg-siddhi-saffron text-white hover:bg-siddhi-gold' : 'border-2 border-siddhi-black text-siddhi-black hover:bg-siddhi-black hover:text-white'}`}>
                    {offer.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-sanskrit text-3xl text-siddhi-gold mb-4">वाक् सिद्धि</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Prepare before the interview prepares you.</h2>
          <p className="text-lg text-siddhi-ivory/70 mb-10">Use AI practice first. Upgrade to human HR feedback when the opportunity matters.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/interview" className="inline-block px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-2xl text-lg">Start AI Interview →</Link>
            <button onClick={() => openModal('Real HR Mock Interview')} className="inline-block px-8 py-4 border-2 border-siddhi-ivory text-siddhi-ivory font-semibold rounded-md hover:bg-siddhi-ivory hover:text-siddhi-black transition text-lg">Request HR Slot</button>
          </div>
        </div>
      </section>

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
            <a href="mailto:support@siddhiai.in" className="hover:text-siddhi-saffron transition">Contact</a>
          </div>
          <div className="text-xs">© 2026 SIDDHI · Ancient Wisdom. Modern AI.</div>
        </div>
      </footer>

      {modalModule && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-siddhi-black/40 hover:text-siddhi-black text-2xl leading-none" aria-label="Close">×</button>
            {!modalSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🧑‍💼</div>
                  <span className="inline-block text-xs px-2 py-0.5 bg-siddhi-gold/20 text-siddhi-gold rounded-full font-semibold mb-3 uppercase tracking-wider">Priority Access</span>
                  <h3 className="font-display text-2xl font-bold mb-2">{modalModule}</h3>
                  <p className="text-sm text-siddhi-black/60">Leave your email. We will contact early users first for premium interview feedback slots and launch updates.</p>
                </div>
                <form onSubmit={submitEarlyAccess} className="space-y-3">
                  <input type="text" value={modalName} onChange={(e) => setModalName(e.target.value)} placeholder="Your name" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
                  <input type="email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} placeholder="your@email.com" required className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
                  <button type="submit" disabled={modalSubmitting} className="w-full px-6 py-3 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition disabled:opacity-60">
                    {modalSubmitting ? 'Submitting…' : 'Join Priority List →'}
                  </button>
                </form>
                <p className="text-xs text-siddhi-black/50 text-center mt-4">No spam. We use this only for SIDDHI interview updates.</p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="font-display text-2xl font-bold mb-2">You are on the priority list.</h3>
                <p className="text-sm text-siddhi-black/60 mb-6">We will contact you when premium interview slots open.</p>
                <button onClick={closeModal} className="px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition">Continue</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
