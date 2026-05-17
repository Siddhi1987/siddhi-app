import Head from 'next/head';
import Link from 'next/link';

const pages = {
  'ai-mock-interview-india': {
    title: 'AI Mock Interview India | Practice Interviews with SIDDHI AI',
    description:
      'Practice AI mock interviews in India with SIDDHI AI. Improve interview communication, answer structure, confidence, and job readiness.',
    h1: 'AI Mock Interview Practice for India',
    intro:
      'SIDDHI AI helps students, freshers, and professionals prepare for interviews with role-specific AI mock interviews and communication feedback.',
    keywords: ['AI mock interview', 'mock interview India', 'AI interview practice', 'interview preparation India'],
    sections: [
      ['Practice before the real interview', 'Train your answers, confidence, clarity, and structure before important job interviews.'],
      ['Built for Indian candidates', 'SIDDHI focuses on practical interview communication for students and professionals preparing for modern hiring expectations.'],
      ['Upgrade when the interview is serious', 'Start with AI practice and move to real HR-style feedback when you need deeper preparation.'],
    ],
  },
  'hr-interview-practice': {
    title: 'HR Interview Practice | Real HR Feedback with SIDDHI AI',
    description:
      'Prepare for HR interviews with AI mock practice and real HR-style feedback. Improve confidence, communication, and answer quality.',
    h1: 'HR Interview Practice with AI + Real HR Feedback',
    intro:
      'Prepare for HR rounds with structured practice, communication scoring, and feedback designed to improve how you answer under pressure.',
    keywords: ['HR interview practice', 'HR mock interview', 'real HR feedback', 'HR interview preparation'],
    sections: [
      ['Improve HR round answers', 'Practice common HR questions and learn how to answer with clarity, confidence, and relevance.'],
      ['Communication-first preparation', 'SIDDHI helps you improve tone, structure, confidence, and professional presence.'],
      ['For students and professionals', 'Useful for freshers, job switchers, MBA students, and working professionals preparing for interviews.'],
    ],
  },
  'communication-ai': {
    title: 'Communication AI Inspired by Vak Siddhi | SIDDHI AI',
    description:
      'SIDDHI AI is India’s first communication AI inspired by Vak Siddhi, built for interview confidence and modern professional communication.',
    h1: 'India’s First Communication AI Inspired by Vak Siddhi',
    intro:
      'SIDDHI combines modern AI with the Indian idea of Vak Siddhi, the mastery of speech, to improve interview communication and career confidence.',
    keywords: ['communication AI', 'Vak Siddhi', 'AI communication coach', 'interview communication'],
    sections: [
      ['Ancient wisdom, modern AI', 'Vak Siddhi represents mastery of speech. SIDDHI applies this idea to modern interviews and professional communication.'],
      ['Not generic advice AI', 'SIDDHI stays focused on communication, interviews, confidence, answer structure, and real-world expression.'],
      ['Built for career outcomes', 'The goal is simple: help candidates communicate better when opportunities matter.'],
    ],
  },
  'interview-confidence': {
    title: 'Interview Confidence Training | SIDDHI AI Interview Coach',
    description:
      'Build interview confidence with AI mock interviews, structured feedback, and real HR-style preparation from SIDDHI AI.',
    h1: 'Build Interview Confidence with SIDDHI AI',
    intro:
      'Interview confidence is not magic. It improves when you practice answers, reduce hesitation, structure thoughts, and receive useful feedback.',
    keywords: ['interview confidence', 'interview communication skills', 'confidence for interviews', 'AI interview coach'],
    sections: [
      ['Reduce nervous answers', 'Practice helps convert scattered thinking into clearer, calmer, more structured answers.'],
      ['Speak with clarity', 'SIDDHI focuses on answer structure, tone, relevance, and confidence markers.'],
      ['Prepare with feedback', 'AI practice gives instant feedback, while premium HR-style evaluation can help with deeper preparation.'],
    ],
  },
  'real-hr-feedback': {
    title: 'Real HR Interview Feedback | SIDDHI AI Premium Interview Preparation',
    description:
      'Get real HR-style interview feedback after AI mock interview practice. Prepare for high-stakes interviews with SIDDHI AI.',
    h1: 'Real HR Interview Feedback for Serious Candidates',
    intro:
      'AI practice is useful. Human HR-style feedback becomes valuable when the interview is important and you need sharper preparation.',
    keywords: ['real HR feedback', 'HR interview feedback', 'premium mock interview', 'real HR mock interview'],
    sections: [
      ['Premium interview preparation', 'For candidates preparing for important job interviews, campus placements, or career switches.'],
      ['Understand your communication gaps', 'Get feedback on clarity, confidence, answer depth, body of thought, and professional readiness.'],
      ['AI + human judgment', 'SIDDHI uses AI for scalable practice and real HR-style evaluation for premium interview preparation.'],
    ],
  },
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(pages).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = pages[params.slug];
  return {
    props: {
      page,
      slug: params.slug,
    },
  };
}

export default function SeoLandingPage({ page, slug }) {
  const canonical = `https://siddhiai.in/${slug}`;

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
      </Head>

      <header className="border-b border-siddhi-black/10 bg-siddhi-ivory/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-siddhi-saffron tracking-tight">SIDDHI</span>
            <span className="font-sanskrit text-sm text-siddhi-gold">सिद्धि</span>
          </Link>
          <Link href="/interview" className="px-4 py-2 bg-siddhi-saffron text-white text-sm font-semibold rounded-md hover:bg-siddhi-gold transition">
            Start Interview
          </Link>
        </div>
      </header>

      <main>
        <section className="py-16 sm:py-24 px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-1.5 border border-siddhi-gold/40 rounded-full bg-white/50">
              <span className="font-sanskrit text-siddhi-gold text-lg">वाक् सिद्धि</span>
              <span className="mx-2 text-siddhi-gold/40">·</span>
              <span className="text-xs uppercase tracking-widest text-siddhi-black/60">Communication Mastery</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              {page.h1}
            </h1>
            <p className="text-lg md:text-xl text-siddhi-black/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              {page.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/interview" className="px-7 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg">
                Start AI Mock Interview →
              </Link>
              <Link href="/#offers" className="px-7 py-3 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-siddhi-ivory transition">
                View Interview Offers
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {page.sections.map(([title, body]) => (
              <article key={title} className="p-6 rounded-lg border-2 border-siddhi-black/10 bg-siddhi-ivory/40">
                <h2 className="font-display text-2xl font-bold mb-3">{title}</h2>
                <p className="text-siddhi-black/70 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 px-4 sm:px-6 bg-siddhi-black text-siddhi-ivory text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Prepare before the interview prepares you.</h2>
            <p className="text-siddhi-ivory/70 mb-8">Practice with AI first. Upgrade to real HR-style feedback when the opportunity matters.</p>
            <Link href="/interview" className="inline-block px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition">
              Begin Practice →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
