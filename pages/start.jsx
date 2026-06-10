import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const paths = [
  {
    id: 'student',
    title: 'Student / Fresher',
    subtitle: 'Campus placement, first job, internship, or fresher interview.',
    focus: ['Tell me about yourself', 'Project explanation', 'Confidence building'],
  },
  {
    id: 'professional',
    title: 'Experienced Professional',
    subtitle: 'Job switch, promotion interview, leadership round, or career move.',
    focus: ['Career story', 'LinkedIn positioning', 'Impact examples'],
  },
  {
    id: 'placement',
    title: 'Placement Candidate',
    subtitle: 'Preparing for upcoming college or institute placement drives.',
    focus: ['HR round readiness', 'Communication score', 'Role-specific practice'],
  },
];

export default function StartAssessment() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState('student');
  const [targetRole, setTargetRole] = useState('');
  const [confidence, setConfidence] = useState('3');
  const [challenge, setChallenge] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const selected = paths.find((path) => path.id === selectedPath);

  const continueToLogin = () => {
    if (!targetRole.trim() || !challenge.trim()) {
      alert('Please add your target role and biggest interview challenge.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'siddhi_readiness_profile',
        JSON.stringify({
          selectedPath,
          targetRole,
          confidence,
          challenge,
          linkedin,
          savedAt: new Date().toISOString(),
        })
      );
    }

    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>
          <Link href="/login" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">
            Already started? Login
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <div>
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Free Interview Check
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-5">
              Do not let your first interview be your first practice.
            </h1>
            <p className="text-lg text-siddhi-black/65 mb-8">
              Tell SiddhiAI what you are preparing for. We will guide you into a short AI assessment,
              show your readiness preview, and help you improve before the real interview.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {paths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setSelectedPath(path.id)}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    selectedPath === path.id
                      ? 'border-siddhi-saffron bg-white shadow-xl'
                      : 'border-siddhi-black/10 bg-white/70 hover:border-siddhi-saffron/50'
                  }`}
                >
                  <h2 className="font-display text-xl font-bold mb-2">{path.title}</h2>
                  <p className="text-sm text-siddhi-black/60 mb-4">{path.subtitle}</p>
                  <div className="space-y-2">
                    {path.focus.map((item) => (
                      <div key={item} className="text-xs font-semibold text-siddhi-saffron">
                        {item}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-siddhi-black p-6 text-siddhi-ivory">
              <p className="text-sm uppercase tracking-widest text-siddhi-gold font-semibold mb-3">
                What happens next
              </p>
              <div className="grid sm:grid-cols-4 gap-4 text-sm">
                <div>1. Login with email</div>
                <div>2. Start AI assessment</div>
                <div>3. See readiness preview</div>
                <div>4. Unlock 30-day access</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-siddhi-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
              Interview Readiness Profile
            </p>
            <h2 className="font-display text-3xl font-bold mb-2">{selected?.title}</h2>
            <p className="text-sm text-siddhi-black/60 mb-6">
              This is not a clinical test. It helps us personalize your interview preparation.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Target role or interview type</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="Example: HR Executive, Software Developer, MBA placement"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Current interview confidence: {confidence}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={confidence}
                  onChange={(event) => setConfidence(event.target.value)}
                  className="w-full accent-siddhi-saffron"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Biggest interview challenge</label>
                <textarea
                  value={challenge}
                  onChange={(event) => setChallenge(event.target.value)}
                  placeholder="Example: I get nervous in Tell me about yourself, or I cannot explain my projects clearly."
                  rows={4}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  LinkedIn profile URL <span className="text-siddhi-black/45">(recommended for professionals)</span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(event) => setLinkedin(event.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={continueToLogin}
              className="mt-7 w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-xl hover:bg-siddhi-gold transition shadow-lg text-lg"
            >
              Continue to Free Assessment
            </button>

            <p className="text-xs text-siddhi-black/50 text-center mt-4">
              You will continue with secure email login. No password required.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
