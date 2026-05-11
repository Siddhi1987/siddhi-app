import Link from 'next/link';
import { useState } from 'react';

const ROLES = [
  { id: 'pm', label: 'Product Manager', emoji: '📊' },
  { id: 'sde', label: 'Software Engineer', emoji: '💻' },
  { id: 'hr', label: 'HR / People', emoji: '🤝' },
  { id: 'sales', label: 'Sales / BD', emoji: '📈' },
  { id: 'general', label: 'General / Fresher', emoji: '🎓' },
];

const QUESTIONS = {
  pm: [
    'Tell me about yourself and what draws you to product management.',
    "Walk me through a product you launched. What worked, what didn't?",
    'How would you prioritize features for a product with limited engineering bandwidth?',
  ],
  sde: [
    'Tell me about yourself and your engineering background.',
    "Describe the most technically challenging problem you've solved.",
    'How do you approach debugging a production issue?',
  ],
  hr: [
    'Tell me about yourself and your HR journey so far.',
    'How do you handle a high-performer who is also a culture risk?',
    'Walk me through how you would design an onboarding program from scratch.',
  ],
  sales: [
    'Tell me about yourself and your sales experience.',
    'Describe your biggest deal — how did you close it?',
    'How do you handle a prospect who has gone silent for 3 weeks?',
  ],
  general: [
    'Tell me about yourself.',
    'What is your biggest strength, and how did you develop it?',
    'Where do you see yourself in 5 years?',
  ],
};

const FREE_LIMIT = 3;

export default function Interview() {
  const [step, setStep] = useState('select');
  const [role, setRole] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const startPractice = (selectedRole) => {
    if (sessionsUsed >= FREE_LIMIT) {
      setStep('limit');
      return;
    }
    setRole(selectedRole);
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
    setFeedback({
      clarity: Math.min(95, 60 + wordCount * 0.5),
      structure: wordCount > 80 ? 88 : wordCount > 40 ? 72 : 55,
      fillerCount: fillerWords,
      wordCount,
      strengths: [
        wordCount > 60 ? 'Good depth in your response' : 'Concise delivery',
        'Clear opening',
      ],
      improvements: [
        fillerWords > 2
          ? `Reduce filler words (you used ${fillerWords})`
          : 'Consider adding a specific example',
        wordCount < 50
          ? 'Expand with more context — interviewers expect 1-2 minute answers'
          : 'Strong length, now work on structure',
      ],
    });
    setSessionsUsed((n) => n + 1);
    setStep('feedback');
  };

  const nextQuestion = () => {
    const questions = QUESTIONS[role.id];
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1);
      setAnswer('');
      setFeedback(null);
      setStep('practice');
    } else {
      setStep('select');
      setRole(null);
      setAnswer('');
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-siddhi-black/60">
              Free sessions: <strong>{FREE_LIMIT - sessionsUsed}/{FREE_LIMIT}</strong>
            </span>
            <Link
              href="/payment"
              className="px-4 py-2 bg-siddhi-saffron text-white text-sm font-semibold rounded-md hover:bg-siddhi-gold transition"
            >
              Upgrade Pro
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 'select' && (
          <div>
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Interview Coach
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Pick your role to begin
              </h1>
              <p className="text-siddhi-black/60">
                We'll tailor questions to your domain. Each session: 3 questions, ~10 minutes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => startPractice(r)}
                  className="p-6 bg-white border-2 border-siddhi-black/10 rounded-lg hover:border-siddhi-saffron hover:shadow-lg transition text-left group"
                >
                  <div className="text-3xl mb-3">{r.emoji}</div>
                  <div className="font-display text-xl font-bold mb-1 group-hover:text-siddhi-saffron transition">
                    {r.label}
                  </div>
                  <div className="text-sm text-siddhi-black/60">
                    {QUESTIONS[r.id].length} questions
                  </div>
                </button>
              ))}
            </div>

            {sessionsUsed > 0 && (
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

        {step === 'practice' && role && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm">
              <span className="text-siddhi-black/60">
                {role.emoji} {role.label} · Question {qIndex + 1} of {QUESTIONS[role.id].length}
              </span>
              <button
                onClick={() => setStep('select')}
                className="text-siddhi-black/60 hover:text-siddhi-saffron"
              >
                ← Back
              </button>
            </div>

            <div className="bg-white border-2 border-siddhi-saffron/30 rounded-lg p-8 mb-6">
              <div className="text-xs uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Question
              </div>
              <p className="font-display text-2xl md:text-3xl leading-relaxed">
                {QUESTIONS[role.id][qIndex]}
              </p>
            </div>

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
                  className="px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Get Feedback →
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'feedback' && feedback && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-siddhi-saffron/10 border border-siddhi-saffron/30 rounded-full text-sm text-siddhi-saffron font-semibold mb-4">
                ✓ Analysis Complete
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Your feedback</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg border border-siddhi-black/10">
                <div className="text-xs uppercase tracking-widest text-siddhi-black/50 mb-2">
                  Clarity
                </div>
                <div className="text-3xl font-bold text-siddhi-saffron">
                  {Math.round(feedback.clarity)}
                  <span className="text-lg text-siddhi-black/40">/100</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-siddhi-black/10">
                <div className="text-xs uppercase tracking-widest text-siddhi-black/50 mb-2">
                  Structure
                </div>
                <div className="text-3xl font-bold text-siddhi-saffron">
                  {Math.round(feedback.structure)}
                  <span className="text-lg text-siddhi-black/40">/100</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-6 mb-4">
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

            <div className="bg-white border border-siddhi-black/10 rounded-lg p-6 mb-6">
              <h3 className="font-display text-lg font-bold mb-3 text-siddhi-saffron">
                → To improve
              </h3>
              <ul className="space-y-2 text-sm">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg p-4 mb-6 text-sm">
              <strong>Pro tip:</strong> Pro users get deep voice analysis (pace, filler-word counts, tone shifts) and 50+ role-specific question banks.{' '}
              <Link href="/payment" className="text-siddhi-saffron font-semibold underline">
                Try Pro
              </Link>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full px-6 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition text-lg"
            >
              {qIndex + 1 < QUESTIONS[role.id].length ? 'Next Question →' : 'Complete Session ✓'}
            </button>
          </div>
        )}

        {step === 'limit' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="font-display text-4xl font-bold mb-4">
              You've used all 3 free sessions
            </h2>
            <p className="text-siddhi-black/60 mb-8 max-w-md mx-auto">
              Unlock unlimited practice, deep AI feedback, and all role banks with SIDDHI Pro.
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
