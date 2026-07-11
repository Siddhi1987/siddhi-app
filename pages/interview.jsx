import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const FREE_LIMIT = 3;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkoyyrbz';

const QUESTION_SETS = {
  fresher: [
    'Tell me about yourself.',
    'Walk me through a project, internship, or college activity you are proud of.',
    'What is your biggest strength, and how did you develop it?',
  ],
  experienced: [
    'Tell me about yourself and walk me through your career so far.',
    'Describe the most impactful project you have handled. What was your contribution?',
    'Tell me about a difficult professional situation and how you resolved it.',
  ],
};

const roleQuestions = {
  'HR Executive': [
    'Tell me about yourself and why you want to build your career in HR.',
    'Describe a time you handled a difficult employee or stakeholder conversation.',
    'How would you balance employee concerns with business requirements?',
  ],
  'HR / People Operations': [
    'Walk me through your HR journey and the most complex people problem you solved.',
    'Tell me about a difficult stakeholder or employee situation. What did you do?',
    'How do you measure HR impact in business terms?',
  ],
  'Sales / Business Development': [
    'Tell me about yourself and your approach to sales.',
    'Describe your most important win or a prospect you converted.',
    'Tell me about a deal you lost and what you learned from it.',
  ],
  'Software Engineer / Developer': [
    'Tell me about yourself and the systems you have worked on.',
    'Describe the most technically challenging problem you solved.',
    'Tell me about a production issue and how you handled it.',
  ],
};

const normalizeTier = (value) => {
  const text = String(value || '').toLowerCase();
  if (text.includes('student') || text.includes('fresher') || text.includes('graduate')) return 'fresher';
  return text ? 'experienced' : '';
};

const getDisplayName = (user) => {
  const metadata = user?.user_metadata || {};
  return (
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    user?.email?.split('@')?.[0] ||
    ''
  );
};

const analyseAnswers = (answers) => {
  const combined = answers.join(' ').trim();
  const words = combined ? combined.split(/\s+/).length : 0;
  const fillers = (combined.match(/\b(um|uh|like|basically|actually|you know)\b/gi) || []).length;
  const numbers = /\d+/.test(combined);
  const ownership = /\bI\s+(led|built|created|managed|improved|delivered|implemented|resolved|owned|drove)\b/i.test(combined);
  const averageWords = answers.length ? words / answers.length : 0;

  const clarity = Math.max(45, Math.min(95, Math.round(62 + averageWords * 0.18 - fillers * 2)));
  const structure = Math.max(45, Math.min(95, Math.round(58 + (averageWords >= 65 ? 18 : averageWords >= 35 ? 10 : 2) + (numbers ? 6 : 0))));
  const confidence = Math.max(45, Math.min(95, Math.round(64 + (ownership ? 10 : 2) - fillers * 3)));
  const professionalPresence = Math.max(45, Math.min(95, Math.round((clarity + structure + confidence) / 3 + (numbers ? 3 : 0))));
  const communicationScore = Math.round((clarity + structure + confidence + professionalPresence) / 4);

  const improvements = [];
  if (averageWords < 45) improvements.push('Add one concrete example with context, action and result.');
  if (!numbers) improvements.push('Use one measurable detail such as team size, time saved, revenue, percentage or volume.');
  if (!ownership) improvements.push('Use clear ownership language such as “I led”, “I improved” or “I resolved”.');
  if (fillers > 2) improvements.push('Replace filler words with a short pause to sound more confident.');
  if (!improvements.length) improvements.push('Prepare a second example for likely follow-up questions.');

  return {
    communicationScore,
    clarity,
    structure,
    confidence,
    professionalPresence,
    strength:
      numbers && ownership
        ? 'You communicate with ownership and support your points with evidence.'
        : ownership
          ? 'Your answers show clear personal ownership.'
          : 'Your answers communicate the main idea clearly.',
    improvements: improvements.slice(0, 3),
    wordCount: words,
  };
};

export default function Interview() {
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [step, setStep] = useState('register');
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState('');
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [report, setReport] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  const sessionKey = useMemo(
    () => `siddhi_interview_sessions_${user?.id || email.trim().toLowerCase() || 'guest'}`,
    [user?.id, email]
  );

  const questions = useMemo(() => {
    return roleQuestions[targetRole] || QUESTION_SETS[tier] || QUESTION_SETS.fresher;
  }, [targetRole, tier]);

  useEffect(() => {
    let mounted = true;

    const loadAccount = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) setLoadingAccount(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getUser();
        const currentUser = data?.user;

        if (error || !currentUser) {
          if (mounted) setLoadingAccount(false);
          return;
        }

        const [profileResult, subscriptionResult] = await Promise.all([
          supabase
            .from('readiness_profiles')
            .select('user_type,target_role,confidence_level,biggest_challenge,created_at')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('subscriptions')
            .select('status,current_period_end')
            .eq('user_id', currentUser.id)
            .eq('status', 'active')
            .gt('current_period_end', new Date().toISOString())
            .order('current_period_end', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (!mounted) return;

        const latestProfile = profileResult.data || null;
        const activeSubscription = subscriptionResult.data || null;
        const metadata = currentUser.user_metadata || {};

        setUser(currentUser);
        setName(getDisplayName(currentUser));
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || metadata.phone || metadata.mobile || '');
        setProfile(latestProfile);
        setIsPaid(Boolean(activeSubscription));
        setSubscriptionEnd(activeSubscription?.current_period_end || '');

        if (latestProfile) {
          setTier(normalizeTier(latestProfile.user_type));
          setTargetRole(latestProfile.target_role || '');
          setStep('ready');
        } else {
          setStep('setup');
        }
      } catch (error) {
        console.error('Interview account loading failed:', error);
      } finally {
        if (mounted) setLoadingAccount(false);
      }
    };

    loadAccount();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || loadingAccount) return;
    const stored = Number(window.localStorage.getItem(sessionKey) || 0);
    setSessionsUsed(Number.isFinite(stored) ? stored : 0);
  }, [loadingAccount, sessionKey]);

  const saveSessionCount = (nextCount) => {
    setSessionsUsed(nextCount);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(sessionKey, String(nextCount));
    }
  };

  const continueAsGuest = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanName.length < 2) return alert('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return alert('Please enter a valid email address.');
    if (cleanPhone.length < 10) return alert('Please enter a valid mobile number.');

    setName(cleanName);
    setEmail(cleanEmail);
    setPhone(cleanPhone);

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: 'Interview Guest Registration',
        name: cleanName,
        email: cleanEmail,
        mobile: cleanPhone,
        submitted_at: new Date().toISOString(),
      }),
    }).catch(() => {});

    setStep('setup');
  };

  const beginPractice = () => {
    if (!tier) return alert('Please choose your experience level.');
    if (!targetRole.trim()) return alert('Please enter your target role.');
    if (!isPaid && sessionsUsed >= FREE_LIMIT) {
      setStep('limit');
      return;
    }

    setQuestionIndex(0);
    setAnswer('');
    setAnswers([]);
    setReport(null);
    setSaveStatus('');
    setStep('practice');
  };

  const saveReport = async (generatedReport) => {
    if (!user || !isSupabaseConfigured || !supabase) {
      setSaveStatus('Sign in to save this report to your dashboard.');
      return;
    }

    const { error } = await supabase.from('communication_reports').insert({
      user_id: user.id,
      user_type: tier,
      target_role: targetRole.trim(),
      communication_score: generatedReport.communicationScore,
      clarity_score: generatedReport.clarity,
      confidence_score: generatedReport.confidence,
      structure_score: generatedReport.structure,
      professional_presence_score: generatedReport.professionalPresence,
      strength: generatedReport.strength,
      improvement_area: generatedReport.improvements.join(' '),
      is_preview: !isPaid,
    });

    setSaveStatus(error ? 'Report generated, but saving failed. Please try again from your dashboard.' : 'Report saved to your SiddhiAI account.');
  };

  const submitAnswer = async () => {
    if (answer.trim().length < 20) {
      alert('Please give a fuller answer of at least 20 characters.');
      return;
    }

    const nextAnswers = [...answers, answer.trim()];

    if (questionIndex < questions.length - 1) {
      setAnswers(nextAnswers);
      setQuestionIndex((index) => index + 1);
      setAnswer('');
      return;
    }

    const generatedReport = analyseAnswers(nextAnswers);
    setAnswers(nextAnswers);
    setReport(generatedReport);
    saveSessionCount(sessionsUsed + 1);
    setStep('report');
    await saveReport(generatedReport);
  };

  const restart = () => {
    if (!isPaid && sessionsUsed >= FREE_LIMIT) {
      setStep('limit');
      return;
    }
    setStep(profile ? 'ready' : 'setup');
    setQuestionIndex(0);
    setAnswer('');
    setAnswers([]);
    setReport(null);
    setSaveStatus('');
  };

  if (loadingAccount) {
    return (
      <div className="min-h-screen bg-siddhi-ivory text-siddhi-black flex items-center justify-center px-6">
        <div className="bg-white border border-siddhi-black/10 rounded-2xl p-8 shadow-lg text-center">
          <p className="font-display text-2xl font-bold mb-2">Preparing your interview workspace</p>
          <p className="text-sm text-siddhi-black/60">Loading your account and practice profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link href={user ? '/dashboard' : '/'} className="flex items-baseline gap-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-sm text-siddhi-gold">सिद्धि</span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            {isPaid ? (
              <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
                30-Day Access Active
              </span>
            ) : (
              <span className="text-siddhi-black/60">
                Free: <strong>{Math.max(0, FREE_LIMIT - sessionsUsed)}/{FREE_LIMIT}</strong>
              </span>
            )}
            {user ? (
              <Link href="/dashboard" className="font-semibold hover:text-siddhi-saffron">Dashboard</Link>
            ) : (
              <Link href="/login" className="font-semibold hover:text-siddhi-saffron">Sign in</Link>
            )}
            {!isPaid && (
              <Link href="/payment" className="px-3 py-2 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition">
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {step === 'register' && (
          <section>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">First visit only</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Let’s get you interview-ready</h1>
              <p className="text-siddhi-black/60">Already have an account? Sign in and we will reuse your saved profile automatically.</p>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 sm:p-8 shadow-lg space-y-5">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Mobile number" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
              <button onClick={continueAsGuest} className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">Continue as guest →</button>
              <Link href="/login" className="block text-center font-semibold text-siddhi-saffron hover:underline">Sign in to use my saved details</Link>
            </div>
          </section>
        )}

        {step === 'ready' && profile && (
          <section>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Welcome back{ name ? `, ${name}` : '' }</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Your practice room is ready</h1>
              <p className="text-siddhi-black/60">We loaded your saved readiness profile. No forms, no déjà vu.</p>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 sm:p-8 shadow-lg mb-5">
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-siddhi-black/45 mb-1">Practice level</p>
                  <p className="font-display text-2xl font-bold capitalize">{tier}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-siddhi-black/45 mb-1">Target role</p>
                  <p className="font-display text-2xl font-bold">{targetRole || 'General interview'}</p>
                </div>
              </div>
              {subscriptionEnd && (
                <p className="text-sm text-green-700 mb-5">Paid access valid until {new Date(subscriptionEnd).toLocaleDateString('en-IN')}.</p>
              )}
              <button onClick={beginPractice} className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">Start interview practice →</button>
            </div>

            <button onClick={() => setStep('setup')} className="w-full text-sm font-semibold text-siddhi-black/60 hover:text-siddhi-saffron">Change practice focus</button>
          </section>
        )}

        {step === 'setup' && (
          <section>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Practice setup</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Choose today’s interview focus</h1>
              <p className="text-siddhi-black/60">This takes a few seconds and can be changed before every session.</p>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['fresher', 'Fresher / Student', 'College, internship or first-job interviews'],
                  ['experienced', 'Experienced Professional', 'Role, impact and leadership interviews'],
                ].map(([value, label, description]) => (
                  <button key={value} onClick={() => setTier(value)} className={`p-5 rounded-xl border-2 text-left transition ${tier === value ? 'border-siddhi-saffron bg-siddhi-saffron/5' : 'border-siddhi-black/10 hover:border-siddhi-saffron/50'}`}>
                    <p className="font-display text-xl font-bold mb-1">{label}</p>
                    <p className="text-sm text-siddhi-black/60">{description}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Target role</label>
                <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Example: HR Executive" className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none" />
              </div>

              <button onClick={beginPractice} className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">Begin practice →</button>
            </div>
          </section>
        )}

        {step === 'practice' && (
          <section>
            <div className="flex items-center justify-between mb-5 text-sm">
              <span className="font-semibold text-siddhi-saffron">Question {questionIndex + 1} of {questions.length}</span>
              <span className="text-siddhi-black/50">{targetRole}</span>
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 sm:p-8 shadow-lg">
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-6">{questions[questionIndex]}</h1>
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={10} placeholder="Write your answer as you would speak it in the interview…" className="w-full p-4 border-2 border-siddhi-black/15 rounded-xl focus:border-siddhi-saffron focus:outline-none resize-y" />
              <div className="flex items-center justify-between mt-3 mb-6 text-xs text-siddhi-black/50">
                <span>Aim for 60–90 seconds</span>
                <span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span>
              </div>
              <button onClick={submitAnswer} className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">
                {questionIndex === questions.length - 1 ? 'Generate my communication report →' : 'Save answer and continue →'}
              </button>
            </div>
          </section>
        )}

        {step === 'report' && report && (
          <section>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Communication report</p>
              <h1 className="font-display text-5xl font-bold mb-3">{report.communicationScore}/100</h1>
              <p className="text-siddhi-black/60">Overall interview communication score</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                ['Clarity', report.clarity],
                ['Confidence', report.confidence],
                ['Structure', report.structure],
                ['Professional Presence', report.professionalPresence],
              ].map(([label, value]) => (
                <div key={label} className="bg-white border border-siddhi-black/10 rounded-xl p-5 shadow-sm">
                  <p className="text-sm text-siddhi-black/50 mb-1">{label}</p>
                  <p className="font-display text-3xl font-bold">{value}/100</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-6 sm:p-8 shadow-lg mb-5">
              <h2 className="font-display text-2xl font-bold mb-2">Your strongest signal</h2>
              <p className="text-siddhi-black/70 mb-6">{report.strength}</p>
              <h2 className="font-display text-2xl font-bold mb-3">Next improvements</h2>
              <ul className="space-y-3 text-siddhi-black/70">
                {report.improvements.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
              {saveStatus && <p className="mt-6 text-sm text-siddhi-black/55">{saveStatus}</p>}
            </div>

            {!isPaid && (
              <div className="bg-siddhi-saffron/10 border border-siddhi-saffron/30 rounded-2xl p-6 mb-5 text-center">
                <h2 className="font-display text-2xl font-bold mb-2">Unlock uninterrupted 30-day practice</h2>
                <p className="text-sm text-siddhi-black/65 mb-4">Paid access removes the free-session limit and keeps reports linked to your account.</p>
                <Link href="/payment" className="inline-flex px-6 py-3 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">View 30-Day Access</Link>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <button onClick={restart} className="px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">Practice again</button>
              <Link href={user ? '/dashboard' : '/'} className="px-6 py-4 bg-white border-2 border-siddhi-black/15 font-bold rounded-lg text-center hover:border-siddhi-saffron transition">Back to {user ? 'dashboard' : 'home'}</Link>
            </div>
          </section>
        )}

        {step === 'limit' && (
          <section className="text-center">
            <div className="bg-white border border-siddhi-black/10 rounded-2xl p-8 sm:p-10 shadow-lg">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">Free practice completed</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Keep building your interview edge</h1>
              <p className="text-siddhi-black/60 mb-7">Your three free sessions are complete. Activate 30-day access to continue practicing without the free-session limit.</p>
              <Link href="/payment" className="inline-flex px-7 py-4 bg-siddhi-saffron text-white font-bold rounded-lg hover:bg-siddhi-gold transition">Unlock 30-Day Access →</Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
