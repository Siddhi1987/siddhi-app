import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

/* ──────────────────────────────────────────────────────────────────────────
   CONFIG — fill these before deploy. The page is AUTH-FREE and does NOT import
   Supabase: the database can stay paused and nothing here breaks.
   ────────────────────────────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '919356785897';             // SiddhiAI brand WhatsApp (dedicated dongle number)
const WHATSAPP_MSG =
  'Hi, I want my free Career Signal Audit. The role I am targeting is: ';
const TALLY_URL = 'https://tally.so/r/XXXXXX';       // resume-upload + voice-link form (secondary)
const RAZORPAY_4999_LINK = 'https://rzp.io/rzp/yV8AaGDo'; // ₹4,999 Razorpay Payment Link (direct buy)
const OFFER_DEADLINE = '2026-10-11T23:59:59+05:30';  // 7-day founding window (IST)
const SEATS = 10;

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const FOUNDING_STACK = [
  'Enterprise ATS Resume Rewrite & Match Score',
  'AI Voice / Pitch Diagnostic Report',
  'Live 45-min 1:1 Grilling & Strategy Session with a 14-yr HR Head',
  'The HR "Blackbox" Debrief & 30-Day Placement Roadmap',
  'Ancient Governance / Persuasion Framework Integration',
];

const pains = [
  'You apply to 40 roles and hear nothing — the ATS bins you before a human ever sees your experience.',
  'In the interview you know you are capable, but your answers wander and the panel drifts.',
  'You get "we went with someone more aligned" — and nobody tells you what to actually fix.',
  'You are worth more than your last CTC, but you have no frame to anchor the negotiation.',
];

function useCountdown(deadline) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const target = new Date(deadline).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setLeft({ d: 0, h: 0, m: 0, over: true }); return; }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        over: false,
      });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [deadline]);
  return left;
}

export default function Home() {
  const left = useCountdown(OFFER_DEADLINE);

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black overflow-x-hidden">
      <Head>
        <title>SIDDHI — ATS & Interview Diagnostic for Experienced Switchers</title>
        <meta
          name="description"
          content="Stop getting auto-rejected. A senior HR advisor + AI diagnose exactly why your resume and interview answers fail — and rebuild them. Founding price ₹4,999."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-siddhi-ivory/90 backdrop-blur-md shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron tracking-tight">SIDDHI</span>
            <span className="font-sanskrit text-xs text-siddhi-gold">सिद्धि</span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-siddhi-saffron text-white text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm whitespace-nowrap"
          >
            Free Career Signal Audit →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 sm:pt-32 pb-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-5 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/60">
            <span className="text-xs uppercase tracking-widest text-siddhi-black/70">For switchers with 3–10 years' experience</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
            Your experience isn't the problem.
            <br />
            <span className="text-siddhi-saffron italic">The filter is.</span>
          </h1>
          <p className="text-lg sm:text-xl text-siddhi-black/70 mb-4 font-light">
            An AI + a senior HR/IR advisor diagnose exactly why your resume gets auto-rejected and why your interview answers lose the room — then rebuild both.
          </p>
          <p className="text-base text-siddhi-black/55 max-w-xl mx-auto mb-8">
            Start with a free Career Signal Score. If it's sharp, upgrade to the full Founding Cohort remediation — ₹4,999.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto mb-5">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg text-center"
            >
              Get my free audit on WhatsApp →
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-lg text-center"
            >
              Or send your resume on WhatsApp →
            </a>
          </div>
          <p className="text-xs text-siddhi-black/50">Free score in 24 hours · No account · No card</p>

          {/* SCARCITY */}
          <div className="mt-8 inline-flex flex-col items-center gap-1 px-6 py-3 rounded-lg bg-siddhi-black text-siddhi-ivory">
            <span className="text-sm font-semibold text-siddhi-gold">Only {SEATS} founding seats at ₹4,999</span>
            {left && !left.over && (
              <span className="text-xs text-siddhi-ivory/70">
                Founding price closes in {left.d}d {left.h}h {left.m}m
              </span>
            )}
            {left && left.over && (
              <span className="text-xs text-siddhi-ivory/70">Founding window closed — join the next cohort</span>
            )}
          </div>
        </div>
      </section>

      {/* PAIN / SPECIFICITY */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 text-center">
            If you're switching, you already feel this:
          </h2>
          <div className="space-y-4">
            {pains.map((p) => (
              <div key={p} className="flex gap-3 items-start bg-siddhi-ivory/60 border border-siddhi-black/10 rounded-lg p-4">
                <span className="text-siddhi-saffron font-bold text-lg leading-6">✗</span>
                <p className="text-siddhi-black/80">{p}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg font-semibold mt-8">
            The gap isn't your competence. It's your <span className="text-siddhi-saffron">signal</span> — and signal is fixable.
          </p>
        </div>
      </section>

      {/* THE FREE HOOK */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Start free</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Your Career Signal Score</h2>
          <p className="text-siddhi-black/65 max-w-xl mx-auto mb-8">
            Send your resume and a 3-minute voice pitch. In 24 hours you get a scored diagnostic — ATS score, interview-voice score, and the single biggest reason you're being filtered out. Free.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg"
          >
            Claim my free Career Signal Score →
          </a>
        </div>
      </section>

      {/* FOUNDING COHORT — the ₹4,999 card (₹35,000 struck → ₹4,999, direct pay) */}
      <section id="offer" className="py-14 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-siddhi-gold font-semibold mb-3">The full remediation</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Founding Cohort</h2>
            <p className="text-siddhi-ivory/60 max-w-md mx-auto">
              The free score tells you what's broken. This fixes it — resume, interview narrative, and negotiation, with a senior human who has sat on the hiring side.
            </p>
          </div>

          <div className="relative p-8 rounded-2xl border-2 border-siddhi-saffron bg-white text-siddhi-black shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-siddhi-saffron text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
              FOUNDING COHORT · {SEATS} SEATS
            </div>

            <div className="text-xs uppercase tracking-wider font-bold text-siddhi-saffron mb-4 text-center">
              ATS & Voice Diagnostic + Remediation
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-base text-siddhi-black/45">
                <span className="line-through">₹35,000</span>{' '}
                <span className="text-siddhi-black/60 text-sm">value</span>
              </div>
              <div className="text-5xl font-bold text-siddhi-saffron leading-tight">₹4,999</div>
              <div className="inline-block mt-2 text-xs font-bold text-green-800 bg-green-100 px-3 py-0.5 rounded-full">
                Founding offer · 7-day window
              </div>
            </div>

            {/* Value stack */}
            <ul className="space-y-3 mb-8 text-sm text-siddhi-black/80">
              {FOUNDING_STACK.map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <span className="text-siddhi-saffron font-bold leading-5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={RAZORPAY_4999_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full px-6 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg"
            >
              Pay ₹4,999 → Book your slot
            </a>
            <p className="text-xs text-siddhi-black/55 text-center mt-3">
              After payment you'll get your booking link + Google Meet invite within 24 hours. Weekend slots only (Sat & Sun).
            </p>
          </div>

          <p className="text-center text-sm text-siddhi-ivory/60 mt-6 max-w-md mx-auto">
            Not ready to commit? <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-siddhi-gold underline">Get the free Career Signal Score first →</a>
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-sanskrit text-2xl text-siddhi-gold mb-3">अभयम्</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">The zero-risk guarantee</h2>
          <p className="text-siddhi-black/75 text-lg leading-relaxed">
            Show up to the 45-minute call having sent your resume and pitch. If you leave without a sharper, recruiter-proof narrative you can use in your very next application — tell me on the call and I refund the full ₹4,999. No forms, no argument. I only keep your money if you walk away with something that changes how you'll apply tomorrow.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              ['1', 'Send your signals', 'Message on WhatsApp with your resume + a 3-min voice pitch. Two minutes of effort.'],
              ['2', 'Get your free score', 'In 24 hours, a scored diagnostic + your single biggest leak. Decide if the full fix is worth it.'],
              ['3', 'Rebuild on the call', '45-min 1:1 with a senior advisor: resume, interview narrative, and negotiation — rebuilt live.'],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-white border border-siddhi-black/10 rounded-2xl p-6 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-siddhi-saffron text-white flex items-center justify-center font-bold mb-4">{n}</div>
                <h3 className="font-display text-lg font-bold mb-2">{t}</h3>
                <p className="text-sm text-siddhi-black/60">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-14 px-4 sm:px-6 bg-siddhi-ivory">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4 text-siddhi-saffron">This is for you if…</h3>
            <ul className="space-y-2 text-sm text-siddhi-black/75">
              <li>✓ You have 3–10 years' experience and are actively switching</li>
              <li>✓ You're getting silence or late-stage rejections</li>
              <li>✓ You're serious enough to do a 3-minute pitch and show up</li>
            </ul>
          </div>
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4 text-siddhi-black/50">This is not for you if…</h3>
            <ul className="space-y-2 text-sm text-siddhi-black/60">
              <li>✗ You're a fresher with no work experience yet</li>
              <li>✗ You want a resume typed for you, not a career signal rebuilt</li>
              <li>✗ You won't put in the 2 minutes to send your pitch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Who grades you</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">A senior HR/IR advisor — not a bot</h2>
          <p className="text-siddhi-black/70 leading-relaxed">
            Your audit and call are led by a senior HR/IR leader with 14+ years across manufacturing, industrial and defence — the rooms where one unclear sentence costs a plant shutdown or a union standoff. SiddhiAI's scoring does the data; the human does the judgment. You get the recruiter's-eye view most candidates never hear.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-sanskrit text-3xl text-siddhi-gold mb-4">वाक् सिद्धि</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-5">Stop guessing why you're getting filtered out.</h2>
          <p className="text-siddhi-ivory/70 mb-8">Get the free score first. {left && !left.over ? `Founding price closes in ${left.d}d ${left.h}h.` : 'Join the next founding cohort.'}</p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-2xl text-lg"
          >
            Get my free Career Signal Audit →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory/60 border-t border-siddhi-ivory/10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-siddhi-saffron transition">Privacy</Link>
            <Link href="/terms" className="hover:text-siddhi-saffron transition">Terms</Link>
            <a href="mailto:hello@siddhiai.in" className="hover:text-siddhi-saffron transition">Contact</a>
          </div>
          <div className="text-xs">© 2026 SIDDHI · Ancient Wisdom. Modern AI.</div>
        </div>
      </footer>
    </div>
  );
}
