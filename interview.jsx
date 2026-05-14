import Link from 'next/link';
import { useState } from 'react';

// =================== ROLES ===================
const ROLES = [
  { id: 'pm', label: 'Product Manager', emoji: '📊', hasTiers: true },
  { id: 'sde', label: 'Software Engineer', emoji: '💻', hasTiers: true },
  { id: 'hr', label: 'HR / People', emoji: '🤝', hasTiers: true },
  { id: 'sales', label: 'Sales / BD', emoji: '📈', hasTiers: true },
  { id: 'general', label: 'General / Fresher', emoji: '🎓', hasTiers: false },
];

// =================== EXPERIENCE TIERS ===================
const TIERS = [
  {
    id: 'fresher',
    label: 'Fresher',
    range: '0–2 years',
    emoji: '🌱',
    description: 'Internships, projects, first job hunt',
  },
  {
    id: 'experienced',
    label: 'Experienced',
    range: '3+ years',
    emoji: '🚀',
    description: 'Shipped work, leadership stories, scale',
  },
];

// =================== QUESTION BANKS ===================
// 8 question banks: 4 professional roles × 2 tiers + 1 general
const QUESTIONS = {
  // Product Manager — Fresher
  pm_fresher: [
    'Tell me about yourself and why you want to be a Product Manager.',
    'Describe a project where you had to balance different priorities.',
    'If you joined our team tomorrow, how would you spend your first 30 days?',
  ],
  // Product Manager — Experienced
  pm_experienced: [
    'Walk me through the most impactful product you shipped. What was the measurable outcome?',
    'Tell me about a time you killed a feature. What was the data, and how did you align stakeholders?',
    'How do you prioritize when Engineering bandwidth is half of what you need for the quarter?',
  ],

  // Software Engineer — Fresher
  sde_fresher: [
    'Tell me about yourself and what excites you about software engineering.',
    'Walk me through a project you built. What did you learn the hard way?',
    'How do you approach a problem you have no idea how to solve?',
  ],
  // Software Engineer — Experienced
  sde_experienced: [
    'Describe the most technically challenging system you have designed or contributed to.',
    'Tell me about a production incident you led. What was the root cause and the fix?',
    'How do you balance speed vs. code quality when shipping under deadline?',
  ],

  // HR — Fresher
  hr_fresher: [
    'Tell me about yourself and what draws you to HR.',
    'If you had to design a one-week onboarding for new hires, what would you include?',
    'How would you handle a friend at work confiding in you about a manager problem?',
  ],
  // HR — Experienced
  hr_experienced: [
    'Walk me through your HR journey and the most complex people problem you solved.',
    'Tell me about a high-performer who was also a culture risk. How did you handle it?',
    'How do you measure HR impact in numbers leadership will actually respect?',
  ],

  // Sales — Fresher
  sales_fresher: [
    'Tell me about yourself and why sales over other careers.',
    'Sell me this pen. Take your time.',
    'How do you handle hearing "no" 9 times before you hear "yes"?',
  ],
  // Sales — Experienced
  sales_experienced: [
    'Describe your biggest deal. Walk me through the close — start to signed contract.',
    'Tell me about a prospect you lost. What would you do differently today?',
    'How do you build a pipeline in a market where your product is new and unknown?',
  ],

  // General / Fresher (universal entry)
  general: [
    'Tell me about yourself.',
    'What is your biggest strength, and how did you develop it?',
    'Where do you see yourself in 5 years — and why does that matter to you?',
  ],
};

const FREE_LIMIT = 3;

export default function Interview() {
  // Flow steps: select_role → select_tier → pro_onboarding → practice → feedback → limit
  const [step, setStep] = useState('select_role');
  const [role, setRole] = useState(null);
  const [tier, setTier] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Pro onboarding state — simulated Pro mode toggle
  const [isProUser, setIsProUser] = useState(false);
  const [proProfile, setProProfile] = useState({
    currentRole: '',
    yearsExp: '',
    targetCompany: '',
    biggestWeakness: '',
    languagePref: '',
  });
  const [proOnboarded, setProOnboarded] = useState(false);

  // ============ HELPERS ============
  const getQuestionKey = () => {
    if (!role) return null;
    if (!role.hasTiers) return role.id; // 'general'
    if (!tier) return null;
    return `${role.id}_${tier.id}`;
  };

  const currentQuestions = () => {
    const key = getQuestionKey();
    return key ? QUESTIONS[key] || [] : [];
  };

  // ============ FLOW HANDLERS ============
  const pickRole = (selectedRole) => {
    if (sessionsUsed >= FREE_LIMIT && !isProUser) {
      setStep('limit');
      return;
    }
    setRole(selectedRole);
    setTier(null);

    if (selectedRole.hasTiers) {
      setStep('select_tier');
    } else {
      // General role — skip tier, go straight to practice (or pro onboarding if Pro & not onboarded)
      if (isProUser && !proOnboarded) {
        setStep('pro_onboarding');
      } else {
        setQIndex(0);
        setAnswer('');
        setStep('practice');
      }
    }
  };

  const pickTier = (selectedTier) => {
    setTier(selectedTier);
    if (isProUser && !proOnboarded) {
      setStep('pro_onboarding');
    } else {
      setQIndex(0);
      setAnswer('');
      setStep('practice');
    }
  };

  const submitProProfile = () => {
    if (!proProfile.currentRole.trim() || !proProfile.yearsExp.trim()) {
      alert('Please fill in your current role and years of experience.');
      return;
    }
    setProOnboarded(true);
    setQIndex(0);
    setAnswer('');
    setStep('practice');
  };

  const submitAnswer = () => {
    if (answer.trim().length < 20) {
      alert('Please give a more detailed answer (at least 20 characters).');
      return;
    }
    const wordCount = answer.trim().split(/\s+/).length;
    const fillerWords = (answer.match(/\b(um|uh|like|basically|actually|you know)\b/gi) || []).length;

    // Calibrate feedback intensity by tier
    const isFresher = tier?.id === 'fresher' || (role && !role.hasTiers);

    setFeedback({
      clarity: Math.min(95, 60 + wordCount * 0.5),
      structure: wordCount > 80 ? 88 : wordCount > 40 ? 72 : 55,
      fillerCount: fillerWords,
      wordCount,
      strengths: isFresher
        ? [
            wordCount > 50 ? 'Good attempt to add detail' : 'Concise opening',
            'Clear enthusiasm — interviewers value that',
          ]
        : [
            wordCount > 60 ? 'Solid depth in your response' : 'Concise delivery',
            'Strong structural opening',
          ],
      improvements: isFresher
        ? [
            fillerWords > 2
              ? `Try to slow down — you used ${fillerWords} filler words. Pause instead of saying "um".`
              : 'Add a specific example from your project or internship',
            wordCount < 50
              ? 'Aim for 60-90 seconds of answer — that\'s ~120-180 words spoken'
              : 'Try the STAR format: Situation, Task, Action, Result',
          ]
        : [
            fillerWords > 2
              ? `Reduce filler words (you used ${fillerWords}) — at your level, executive presence matters`
              : 'Lead with the business impact, then the technical detail',
            wordCount < 80
              ? 'Senior roles expect more context — aim for 90-120 seconds with concrete numbers'
              : 'Strong length — now sharpen with metric-driven examples',
          ],
      isPro: isProUser && proOnboarded,
      proPersonalization: isProUser && proOnboarded
        ? `Based on your ${proProfile.yearsExp} years in ${proProfile.currentRole}, focus on ${proProfile.biggestWeakness || 'storytelling structure'}.`
        : null,
    });
    setSessionsUsed((n) => n + 1);
    setStep('feedback');
  };

  const nextQuestion = () => {
    const qs = currentQuestions();
    if (qIndex + 1 < qs.length) {
      setQIndex(qIndex + 1);
      setAnswer('');
      setFeedback(null);
      setStep('practice');
    } else {
      // Session complete — back to start
      setStep('select_role');
      setRole(null);
      setTier(null);
      setAnswer('');
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="font-display text-xl sm:text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-xs sm:text-sm text-siddhi-gold">सिद्धि</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Demo Pro toggle (for testing) */}
            <button
              onClick={() => {
                setIsProUser(!isProUser);
                if (isProUser) setProOnboarded(false);
              }}
              className={`text-xs px-2 py-1 rounded-full font-semibold transition ${
                isProUser
                  ? 'bg-siddhi-gold text-white'
                  : 'bg-siddhi-black/10 text-siddhi-black/60'
              }`}
              title="Demo: toggle Pro mode"
            >
              {isProUser ? '👑 Pro' : 'Free'}
            </button>
            <span className="text-xs text-siddhi-black/60 hidden sm:inline">
              Sessions: <strong>{isProUser ? '∞' : `${FREE_LIMIT - sessionsUsed}/${FREE_LIMIT}`}</strong>
            </span>
            {!isProUser && (
              <Link
                href="/payment"
                className="px-3 sm:px-4 py-2 bg-siddhi-saffron text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-siddhi-gold transition whitespace-nowrap"
              >
                Upgrade Pro
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ============ STEP 1: ROLE SELECTION ============ */}
        {step === 'select_role' && (
          <div>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Interview Coach · Step 1 of {role?.hasTiers ? '3' : '2'}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Pick your role to begin
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base">
                We'll tailor questions to your domain. Each session: 3 questions, ~10 minutes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => pickRole(r)}
                  className="p-5 sm:p-6 bg-white border-2 border-siddhi-black/10 rounded-lg hover:border-siddhi-saffron hover:shadow-lg transition text-left group"
                >
                  <div className="text-3xl mb-3">{r.emoji}</div>
                  <div className="font-display text-lg sm:text-xl font-bold mb-1 group-hover:text-siddhi-saffron transition">
                    {r.label}
                  </div>
                  <div className="text-xs sm:text-sm text-siddhi-black/60">
                    {r.hasTiers ? 'Fresher or Experienced' : '3 starter questions'}
                  </div>
                </button>
              ))}
            </div>

            {sessionsUsed > 0 && !isProUser && (
              <div className="mt-8 p-4 bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg text-center text-sm">
                You've completed <strong>{sessionsUsed}</strong> free session
                {sessionsUsed > 1 ? 's' : ''}.{' '}
                <Link href="/payment" className="text-siddhi-saffron font-semibold underline">
                  Go unlimited with Pro →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ============ STEP 2: EXPERIENCE TIER ============ */}
        {step === 'select_tier' && role && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm">
              <button
                onClick={() => setStep('select_role')}
                className="text-siddhi-black/60 hover:text-siddhi-saffron"
              >
                ← Back to roles
              </button>
              <span className="text-siddhi-black/60">
                {role.emoji} {role.label}
              </span>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Step 2 of {isProUser && !proOnboarded ? '3' : '2'}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                What's your experience level?
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base">
                We'll calibrate questions and feedback to your stage.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => pickTier(t)}
                  className="p-6 bg-white border-2 border-siddhi-black/10 rounded-lg hover:border-siddhi-saffron hover:shadow-lg transition text-left group"
                >
                  <div className="text-4xl mb-3">{t.emoji}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-xl font-bold group-hover:text-siddhi-saffron transition">
                      {t.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-siddhi-black/10 text-siddhi-black/60 rounded-full font-semibold">
                      {t.range}
                    </span>
                  </div>
                  <p className="text-sm text-siddhi-black/65">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ STEP 2.5: PRO ONBOARDING (Pro users only) ============ */}
        {step === 'pro_onboarding' && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm">
              <button
                onClick={() => setStep(role?.hasTiers ? 'select_tier' : 'select_role')}
                className="text-siddhi-black/60 hover:text-siddhi-saffron"
              >
                ← Back
              </button>
              <span className="text-siddhi-black/60">
                {role?.emoji} {role?.label}
                {tier && ` · ${tier.label}`}
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 bg-siddhi-gold/20 text-siddhi-gold rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                👑 Pro Personalization
              </div>
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Step 3 of 3 · 1 minute
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                Help us coach you better
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base max-w-xl mx-auto">
                Pro members get feedback tailored to their specific career, weaknesses, and goals.
                Answer 5 quick questions — we'll never share this.
              </p>
            </div>

            <div className="space-y-4 bg-white border border-siddhi-black/10 rounded-lg p-5 sm:p-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your current role / job title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={proProfile.currentRole}
                  onChange={(e) => setProProfile({ ...proProfile, currentRole: e.target.value })}
                  placeholder="e.g. Senior PM at FinTech startup"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Total years of experience <span className="text-red-500">*</span>
                </label>
                <select
                  value={proProfile.yearsExp}
                  onChange={(e) => setProProfile({ ...proProfile, yearsExp: e.target.value })}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-white"
                >
                  <option value="">Choose…</option>
                  <option value="0-1 year">0–1 year</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5-10 years">5–10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Target company type
                </label>
                <select
                  value={proProfile.targetCompany}
                  onChange={(e) => setProProfile({ ...proProfile, targetCompany: e.target.value })}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-white"
                >
                  <option value="">Skip / not sure</option>
                  <option value="Big Tech (FAANG, Microsoft, etc.)">Big Tech (FAANG, Microsoft, etc.)</option>
                  <option value="Indian Unicorn / Late-stage startup">Indian Unicorn / Late-stage startup</option>
                  <option value="Early-stage startup (Series A-B)">Early-stage startup (Series A-B)</option>
                  <option value="MNC corporate (Accenture, TCS, etc.)">MNC corporate (Accenture, TCS, etc.)</option>
                  <option value="Indian conglomerate (Tata, Reliance, etc.)">Indian conglomerate (Tata, Reliance, etc.)</option>
                  <option value="Consulting (McKinsey, BCG, etc.)">Consulting (McKinsey, BCG, etc.)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your biggest communication weakness
                </label>
                <select
                  value={proProfile.biggestWeakness}
                  onChange={(e) => setProProfile({ ...proProfile, biggestWeakness: e.target.value })}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-white"
                >
                  <option value="">Choose…</option>
                  <option value="Rambling / no clear structure">Rambling / no clear structure</option>
                  <option value="Nervousness / filler words">Nervousness / filler words</option>
                  <option value="Storytelling — I just list facts">Storytelling — I just list facts</option>
                  <option value="Tough questions / pushback">Tough questions / pushback</option>
                  <option value="Body language / confidence">Body language / confidence</option>
                  <option value="Switching between Hindi & English">Switching between Hindi & English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Preferred coaching language
                </label>
                <select
                  value={proProfile.languagePref}
                  onChange={(e) => setProProfile({ ...proProfile, languagePref: e.target.value })}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Hinglish (mix)">Hinglish (mix)</option>
                </select>
              </div>
            </div>

            <button
              onClick={submitProProfile}
              className="w-full mt-6 px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg"
            >
              Save profile & start practice →
            </button>

            <p className="text-xs text-siddhi-black/50 text-center mt-3">
              You can update this anytime in your Pro settings.
            </p>
          </div>
        )}

        {/* ============ STEP 3: PRACTICE ============ */}
        {step === 'practice' && role && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm">
              <span className="text-siddhi-black/60 truncate">
                {role.emoji} {role.label}
                {tier && ` · ${tier.emoji} ${tier.label}`} · Question {qIndex + 1} of {currentQuestions().length}
              </span>
              <button
                onClick={() => {
                  setStep('select_role');
                  setRole(null);
                  setTier(null);
                }}
                className="text-siddhi-black/60 hover:text-siddhi-saffron flex-shrink-0 ml-2"
              >
                ← Restart
              </button>
            </div>

            <div className="bg-white border-2 border-siddhi-saffron/30 rounded-lg p-6 sm:p-8 mb-6">
              <div className="text-xs uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Question
              </div>
              <p className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed">
                {currentQuestions()[qIndex]}
              </p>
            </div>

            {isProUser && proOnboarded && (
              <div className="mb-4 p-3 bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg text-xs">
                <strong>👑 Pro tip:</strong> Given your background ({proProfile.yearsExp} in {proProfile.currentRole}),
                lead with a specific story, not a generic answer.
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Your answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                placeholder="Speak (or type) your answer as if the interviewer were sitting across from you..."
                className="w-full p-4 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-siddhi-black/50">
                  {answer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  onClick={submitAnswer}
                  disabled={answer.trim().length < 20}
                  className="px-5 sm:px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Get Feedback →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ STEP 4: FEEDBACK ============ */}
        {step === 'feedback' && feedback && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-siddhi-saffron/10 border border-siddhi-saffron/30 rounded-full text-sm text-siddhi-saffron font-semibold mb-4">
                ✓ Analysis Complete
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Your feedback</h2>
              {feedback.isPro && (
                <p className="text-xs text-siddhi-gold mt-2">👑 Pro personalized analysis</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-siddhi-black/10">
                <div className="text-xs uppercase tracking-widest text-siddhi-black/50 mb-2">Clarity</div>
                <div className="text-2xl sm:text-3xl font-bold text-siddhi-saffron">
                  {Math.round(feedback.clarity)}
                  <span className="text-base sm:text-lg text-siddhi-black/40">/100</span>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-siddhi-black/10">
                <div className="text-xs uppercase tracking-widest text-siddhi-black/50 mb-2">Structure</div>
                <div className="text-2xl sm:text-3xl font-bold text-siddhi-saffron">
                  {Math.round(feedback.structure)}
                  <span className="text-base sm:text-lg text-siddhi-black/40">/100</span>
                </div>
              </div>
            </div>

            {feedback.proPersonalization && (
              <div className="bg-gradient-to-br from-siddhi-gold/10 to-siddhi-saffron/10 border-2 border-siddhi-gold/40 rounded-lg p-4 sm:p-5 mb-4">
                <div className="text-xs uppercase tracking-widest text-siddhi-gold font-bold mb-2">
                  👑 Personalized for you
                </div>
                <p className="text-sm">{feedback.proPersonalization}</p>
              </div>
            )}

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-5 sm:p-6 mb-4">
              <h3 className="font-display text-lg font-bold mb-3 text-green-700">✓ Strengths</h3>
              <ul className="space-y-2 text-sm">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-5 sm:p-6 mb-6">
              <h3 className="font-display text-lg font-bold mb-3 text-siddhi-saffron">→ To improve</h3>
              <ul className="space-y-2 text-sm">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {!isProUser && (
              <div className="bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg p-4 mb-6 text-sm">
                <strong>Pro unlocks:</strong> Personalized coaching based on YOUR role + experience + weakness.
                Deeper voice analysis (pace, filler-words, tone). 50+ role-specific question banks.{' '}
                <Link href="/payment" className="text-siddhi-saffron font-semibold underline">
                  Try Pro
                </Link>
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="w-full px-6 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition text-base sm:text-lg"
            >
              {qIndex + 1 < currentQuestions().length ? 'Next Question →' : 'Complete Session ✓'}
            </button>
          </div>
        )}

        {/* ============ STEP X: FREE LIMIT REACHED ============ */}
        {step === 'limit' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              You've used all 3 free sessions
            </h2>
            <p className="text-siddhi-black/60 mb-8 max-w-md mx-auto">
              Unlock unlimited practice, personalized Pro coaching, and all role banks.
            </p>
            <Link
              href="/payment"
              className="inline-block px-8 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg"
            >
              Upgrade to Pro — ₹499/month
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
