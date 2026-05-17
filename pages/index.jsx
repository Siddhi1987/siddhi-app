import Head from 'next/head';
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
        }),
      });

      if (response.ok) {
        setModalSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>SIDDHI AI | AI Mock Interviews + Real HR Interview Practice</title>
        <meta
          name="description"
          content="India's first communication AI inspired by Vak Siddhi. Practice AI mock interviews, improve communication skills, and get real HR interview feedback."
        />
        <meta
          name="keywords"
          content="AI interview practice, mock interview India, HR interview preparation, communication AI, interview communication skills, real HR mock interview"
        />
        <meta property="og:title" content="SIDDHI AI | India's First Communication AI" />
        <meta
          property="og:description"
          content="AI mock interviews and real HR feedback for students and professionals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhiai.in" />
        <link rel="canonical" href="https://siddhiai.in" />
      </Head>

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

            <Link href="/interview" className="px-3 sm:px-5 py-2 bg-siddhi-saffron text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-siddhi-gold transition shadow-sm whitespace-nowrap">
              Start Interview
            </Link>
          </div>
        </nav>

        <section className="pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/50">
              <span className="font-sanskrit text-siddhi-gold text-lg">वाक् सिद्धि</span>
              <span className="mx-2 text-siddhi-gold/40">·</span>
              <span className="text-xs uppercase tracking-widest text-siddhi-black/60">Mastery of Speech</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-siddhi-black mb-4 leading-[1.1] md:leading-[1.05] break-words">
              India’s First Communication AI
            </h1>

            <h2 className="text-siddhi-saffron italic text-2xl sm:text-3xl md:text-5xl font-semibold mb-6">
              Inspired by Vak Siddhi
            </h2>

            <p className="text-base md:text-xl text-siddhi-black/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              AI mock interviews and real HR interview feedback for students and professionals preparing for modern careers, communication confidence, and interview success.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 max-w-md sm:max-w-none mx-auto">
              <Link href="/interview" className="px-6 sm:px-8 py-3 sm:py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg shadow-siddhi-saffron/20 text-base sm:text-lg text-center">
                Start AI Mock Interview →
              </Link>

              <button onClick={() => openModal('Real HR Mock Interview')} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition text-base sm:text-lg text-center">
                Request Real HR Interview
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
