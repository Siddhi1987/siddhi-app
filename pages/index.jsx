import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Config. Fill these before deploy. The page is auth-free and does not import
// Supabase, so the database can stay paused and nothing here breaks.
const WHATSAPP_NUMBER = '919356785897';
const WHATSAPP_MSG = 'Hi, I want my free Career Signal Audit. The role I am targeting is: ';
const TALLY_URL = 'https://tally.so/r/XXXXXX';
const RAZORPAY_4999_LINK = 'https://rzp.io/rzp/yV8AaGDo';
const OFFER_DEADLINE = '2026-10-11T23:59:59+05:30';
const SEATS = 10;

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const FOUNDING_STACK = [
  'Enterprise ATS Resume Rewrite and Match Score',
  'AI Voice and Pitch Diagnostic Report',
  'Live 45-minute one-on-one grilling and strategy session with a 14-year HR head',
  'The HR "Blackbox" debrief and 30-day placement roadmap',
  'Ancient governance and persuasion framework integration',
];

const pains = [
  'You apply to 40 roles and hear nothing back. The system filters your resume out before a human ever sees your experience.',
  'You know you are capable, but in the interview your answers wander and the panel loses interest.',
  'You get a polite "we went with someone more aligned", and nobody tells you what to actually fix.',
  'You are worth more than your last salary, but you have no clear way to anchor the negotiation.',
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
        <title>SIDDHI | ATS and Interview Diagnostic for Experienced Switchers</title>
        <meta
          name="description"
          content="Stop getting auto-rejected. A senior HR advisor and AI find exactly why your resume and interview answers fail, then rebuild them. Founding price 4,999."
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
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-siddhi-saffron text-white text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm whitespace-nowrap">
            Free Career Signal Audit
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 sm:pt-32 pb-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-5 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/60">
            <span className="text-xs uppercase tracking-widest text-siddhi-black/70">For professionals with 3 to 10 years of experience</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
            Your experience isn't the problem.
            <br />
            <span className="text-siddhi-saffron italic">The filter is.</span>
          </h1>
          <p className="text-lg sm:text-xl text-siddhi-black/70 mb-4 font-light">
            A senior HR advisor and our AI find exactly why your resume gets auto-rejected and why your interview answers lose the room. Then we rebuild both with you.
          </p>
          <p className="text-base text-siddhi-black/55 max-w-xl mx-auto mb-8">
            Start with a free Career Signal Score. If it helps, upgrade to the full Founding Cohort programme at 4,999.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto mb-5">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg text-center">
              Get my free audit on WhatsApp
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-lg text-center">
              Or send your resume on WhatsApp
            </a>
          </div>
          <p className="text-xs text-siddhi-black/50">Free score in 24 hours. No account, no card.</p>

          {/* SCARCITY */}
          <div className="mt-8 inline-flex flex-col items-center gap-1 px-6 py-3 rounded-lg bg-siddhi-black text-siddhi-ivory">
            <span className="text-sm font-semibold text-siddhi-gold">Only {SEATS} founding seats at 4,999</span>
            {left && !left.over && (
              <span className="text-xs text-siddhi-ivory/70">Founding price closes in {left.d}d {left.h}h {left.m}m</span>
            )}
            {left && left.over && (
              <span className="text-xs text-siddhi-ivory/70">Founding window closed. Join the next cohort.</span>
            )}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 text-center">
            If you are switching, you already know the feeling
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
            The gap is not your ability. It is your <span className="text-siddhi-saffron">signal</span>, and signal can be fixed.
          </p>
        </div>
      </section>

      {/* FREE HOOK */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Start free</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Your Career Signal Score</h2>
          <p className="text-siddhi-black/65 max-w-xl mx-auto mb-8">
            Send us your resume and a 3-minute voice pitch. Within 24 hours you get a scored report: your ATS score, your interview voice score, and the single biggest reason you keep getting filtered out. It is free.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg">
            Claim my free Career Signal Score
          </a>
        </div>
      </section>

      {/* FOUNDING COHORT */}
      <section id="offer" className="py-14 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-siddhi-gold font-semibold mb-3">The complete programme</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Founding Cohort</h2>
            <p className="text-siddhi-ivory/60 max-w-md mx-auto">
              The free score shows you what is broken. This programme fixes it: your resume, your interview narrative, and your negotiation, guided by a senior HR who has sat on the hiring side.
            </p>
          </div>

          <div className="relative p-8 rounded-2xl border-2 border-siddhi-saffron bg-white text-siddhi-black shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-siddhi-saffron text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
              FOUNDING COHORT, {SEATS} SEATS
            </div>

            <div className="text-xs uppercase tracking-wider font-bold text-siddhi-saffron mb-4 text-center">
              ATS and Voice Diagnostic plus Remediation
            </div>

            <div className="text-center mb-6">
              <div className="text-base text-siddhi-black/45">
                <span className="line-through">₹35,000</span>{' '}
                <span className="text-siddhi-black/60 text-sm">value</span>
              </div>
              <div className="text-5xl font-bold text-siddhi-saffron leading-tight">₹4,999</div>
              <div className="inline-block mt-2 text-xs font-bold text-green-800 bg-green-100 px-3 py-0.5 rounded-full">
                Founding offer, 7-day window
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-siddhi-black/80">
              {FOUNDING_STACK.map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <span className="text-siddhi-saffron font-bold leading-5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href={RAZORPAY_4999_LINK} target="_blank" rel="noopener noreferrer"
              className="block text-center w-full px-6 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg">
              Pay ₹4,999 and book your slot
            </a>
            <p className="text-xs text-siddhi-black/55 text-center mt-3">
              After payment, we send your booking link and Google Meet invite within 24 hours. Sessions run on weekends only, Saturday and Sunday.
            </p>
          </div>

          <p className="text-center text-sm text-siddhi-ivory/60 mt-6 max-w-md mx-auto">
            Not ready to commit yet? <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-siddhi-gold underline">Get the free Career Signal Score first</a>
          </p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-sanskrit text-2xl text-siddhi-gold mb-3">अभयम्</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">The zero-risk guarantee</h2>
          <p className="text-siddhi-black/75 text-lg leading-relaxed">
            Come to the 45-minute call having sent your resume and pitch. If you leave without a sharper, recruiter-ready narrative that you can use in your very next application, tell me on the call and I will refund the full 4,999. No forms, no arguments. I keep your money only if you walk away with something that changes how you apply tomorrow.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              ['1', 'Send your signals', 'Message us on WhatsApp with your resume and a 3-minute voice pitch. It takes two minutes.'],
              ['2', 'Get your free score', 'Within 24 hours you get a scored report and your single biggest weak spot. Then you decide if the full fix is worth it.'],
              ['3', 'Rebuild on the call', 'A 45-minute session with a senior advisor to rebuild your resume, your interview answers, and your negotiation, live.'],
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

      {/* WHO IT IS FOR */}
      <section className="py-14 px-4 sm:px-6 bg-siddhi-ivory">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4 text-siddhi-saffron">This is for you if</h3>
            <ul className="space-y-2 text-sm text-siddhi-black/75">
              <li>✓ You have 3 to 10 years of experience and are actively switching</li>
              <li>✓ You are getting silence or late-stage rejections</li>
              <li>✓ You are serious enough to record a short pitch and show up</li>
            </ul>
          </div>
          <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-4 text-siddhi-black/50">This is not for you if</h3>
            <ul className="space-y-2 text-sm text-siddhi-black/60">
              <li>✗ You are a fresher with no work experience yet</li>
              <li>✗ You just want a resume typed out, not your career signal rebuilt</li>
              <li>✗ You will not spare two minutes to send your pitch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Who grades you</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">A senior HR advisor, not a bot</h2>
          <p className="text-siddhi-black/70 leading-relaxed">
            Your audit and your call are handled by a senior HR and IR leader with over 14 years across manufacturing, industrial and defence, the rooms where one unclear sentence can cost a shutdown or trigger a union standoff. The AI handles the data. The human handles the judgement. You get the recruiter view that most candidates never hear.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-sanskrit text-3xl text-siddhi-gold mb-4">वाक् सिद्धि</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-5">Stop guessing why you keep getting filtered out.</h2>
          <p className="text-siddhi-ivory/70 mb-8">Get your free score first. {left && !left.over ? `Founding price closes in ${left.d}d ${left.h}h.` : 'Join the next founding cohort.'}</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-2xl text-lg">
            Get my free Career Signal Audit
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
            <a href="https://wa.me/919356785897?text=Hi%2C%20I%20have%20a%20question%20about%20SiddhiAI." className="hover:text-siddhi-saffron transition">Contact</a>
          </div>
          <div className="text-xs">Copyright 2026 SIDDHI. Ancient Wisdom. Modern AI.</div>
        </div>
      </footer>
    </div>
  );
}
