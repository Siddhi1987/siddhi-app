import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
// =================== DROPDOWN OPTIONS ===================
const GRADUATION_FIELDS = [
  'B.Tech / B.E. (Engineering)',
  'B.Com (Commerce)',
  'BBA (Business Administration)',
  'BCA (Computer Applications)',
  'BSc (Science)',
  'BA (Arts / Humanities)',
  'B.Pharm (Pharmacy)',
  'BDS / MBBS (Medical)',
  'LLB (Law)',
  'B.Arch (Architecture)',
  'CA Foundation / Inter',
  'Hotel Management',
  'Mass Communication / Journalism',
  'Fashion / Design',
  'Other',
];
const POST_GRADUATION_FIELDS = [
  'None / Not pursuing',
  'MBA / PGDM',
  'M.Tech / ME',
  'MCA',
  'M.Sc',
  'MA',
  'M.Com',
  'PhD',
  'CA (Chartered Accountant)',
  'CFA / FRM',
  'Currently pursuing',
  'Other',
];
const EXPERIENCED_FIELDS = [
  'Product Manager',
  'Software Engineer / Developer',
  'HR / People Operations',
  'Sales / Business Development',
  'Marketing / Growth',
  'Data Scientist / Analyst',
  'Designer (UX/UI/Visual)',
  'Operations / Project Management',
  'Finance / Accounting',
  'Consulting (Strategy)',
  'Customer Support / Success',
  'Other',
];
// Free users get `free` (3 questions). Pro users get free + pro (6 questions).
const FRESHER_QUESTIONS = {
  free: [
    'Tell me about yourself.',
    'Walk me through a project from your studies that you are most proud of.',
    'What is your biggest strength, and how did you develop it?',
  ],
  pro: [
    'Describe a time you had to learn something difficult quickly. How did you approach it?',
    'Tell me about a disagreement in a team project. What did you do about it?',
    'Where do you see yourself in three years, and what are you doing now to get there?',
  ],
};
const EXPERIENCED_QUESTIONS = {
  'Product Manager': {
    free: [
      'Walk me through the most impactful product you shipped. What was the measurable outcome?',
      'Tell me about a time you killed a feature. What was the data, and how did you align stakeholders?',
      'How do you prioritize when Engineering bandwidth is half of what you need for the quarter?',
    ],
    pro: [
      'Tell me about a product decision you got wrong. How did you find out, and what changed?',
      'How do you decide what NOT to build? Give a concrete example.',
      'Describe how you turn a vague executive ask into a shipped, measurable outcome.',
    ],
  },
  'Software Engineer / Developer': {
    free: [
      'Describe the most technically challenging system you have designed or contributed to.',
      'Tell me about a production incident you led. What was the root cause and the fix?',
      'How do you balance speed vs. code quality when shipping under deadline?',
    ],
    pro: [
      'Tell me about a time you disagreed with a senior engineer on an approach. How did it resolve?',
      'Walk me through how you would improve the performance of a slow endpoint.',
      'Describe a piece of tech debt you championed paying down. How did you justify it?',
    ],
  },
  'HR / People Operations': {
    free: [
      'Walk me through your HR journey and the most complex people problem you solved.',
      'Tell me about a high-performer who was also a culture risk. How did you handle it?',
      'How do you measure HR impact in numbers leadership will actually respect?',
    ],
    pro: [
      'Describe a difficult termination you managed. How did you protect both the person and the company?',
      'How have you improved retention in a specific team? What did you actually change?',
      'Tell me about a policy you introduced that changed behaviour across the org.',
    ],
  },
  'Sales / Business Development': {
    free: [
      'Describe your biggest deal. Walk me through the close — start to signed contract.',
      'Tell me about a prospect you lost. What would you do differently today?',
      'How do you build a pipeline in a market where your product is new and unknown?',
    ],
    pro: [
      'Tell me about a time you turned a "no" into a "yes." What shifted?',
      'How do you handle a prospect who says your price is too high?',
      'Walk me through how you research and qualify a new account before the first call.',
    ],
  },
  'Marketing / Growth': {
    free: [
      'Walk me through a campaign you owned end to end. What was the measurable result?',
      'Tell me about a channel that stopped working. How did you diagnose and respond?',
      'How do you decide where to spend a limited marketing budget?',
    ],
    pro: [
      'Describe an experiment that failed. What did you learn and do next?',
      'How do you connect a marketing metric to actual revenue?',
      'Tell me about a time you grew something with almost no budget.',
    ],
  },
  'Data Scientist / Analyst': {
    free: [
      'Walk me through an analysis that changed a real business decision.',
      'Tell me about a time your data contradicted what leadership believed. What happened?',
      'How do you make a complex finding land with a non-technical audience?',
    ],
    pro: [
      'Describe a model or analysis that did not work in production. Why?',
      'How do you decide whether a result is signal or noise?',
      'Tell me about a metric you helped define. Why did it matter?',
    ],
  },
  'Designer (UX/UI/Visual)': {
    free: [
      'Walk me through a design you are proud of, from problem to shipped solution.',
      'Tell me about a time user research changed your design direction.',
      'How do you handle feedback that you disagree with from a stakeholder?',
    ],
    pro: [
      'Describe a design that tested well but failed with real users. What did you learn?',
      'How do you balance business goals with what is best for the user?',
      'Tell me about a time you had to design under heavy constraints.',
    ],
  },
  'Operations / Project Management': {
    free: [
      'Walk me through a project you delivered against a tight deadline.',
      'Tell me about a time a project went off the rails. How did you recover it?',
      'How do you keep multiple stakeholders aligned when priorities conflict?',
    ],
    pro: [
      'Describe a process you built or fixed that saved real time or money.',
      'How do you decide what to escalate versus solve yourself?',
      'Tell me about a risk you spotted early. What did you do?',
    ],
  },
  'Finance / Accounting': {
    free: [
      'Walk me through a financial analysis that influenced a real decision.',
      'Tell me about a time you found an error or discrepancy. What did you do?',
      'How do you explain a financial concept to a non-finance stakeholder?',
    ],
    pro: [
      'Describe a time you had to deliver bad financial news. How did you handle it?',
      'How do you approach building a forecast under high uncertainty?',
      'Tell me about a control or process you strengthened.',
    ],
  },
  'Consulting (Strategy)': {
    free: [
      'Walk me through a recommendation you made that a client actually implemented.',
      'Tell me about a time your analysis changed a client’s direction.',
      'How do you structure your thinking on an ambiguous problem?',
    ],
    pro: [
      'Describe a time a client pushed back hard. How did you handle it?',
      'How do you make a recommendation when the data is incomplete?',
      'Tell me about the most complex stakeholder situation you navigated.',
    ],
  },
  'Customer Support / Success': {
    free: [
      'Walk me through how you turned an unhappy customer into a happy one.',
      'Tell me about a time you handled an angry customer under pressure.',
      'How do you know when to escalate versus solve it yourself?',
    ],
    pro: [
      'Describe a time you spotted a churn risk early. What did you do?',
      'How do you turn support feedback into a product or process change?',
      'Tell me about the hardest account you saved.',
    ],
  },
  default: {
    free: [
      'Tell me about yourself and walk me through your career so far.',
      'Describe the most impactful project you have worked on. What was your specific contribution?',
      'Tell me about a time you failed. What did you learn, and what would you do differently?',
    ],
    pro: [
      'Tell me about a time you led without authority.',
      'Describe a decision you made with incomplete information.',
      'Where do you want to grow next, and what are you doing about it?',
    ],
  },
};
const FREE_LIMIT = 3;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkoyyrbz';
const PREMIUM_REPORT_SECTIONS = [
  'Hiring Manager Impression',
  'Leadership Potential',
  'Interview Readiness',
  'Career Growth Roadmap',
  'Personalized Recommendations',
];
const clampScore = (score) => Math.max(35, Math.min(96, Math.round(score)));
const band = (v) => (v >= 80 ? 'high' : v >= 65 ? 'solid' : 'developing');
// Generates the REAL Pro report content from the candidate's scores.
const buildPremiumSections = (r, feedback, isFresher) => {
  const impression = {
    high: 'A hiring manager would likely finish this conversation impressed. You come across as clear, credible, and in control of your material — the kind of answer that moves you to the next round.',
    solid: 'You would come across as competent and hireable. There is a real signal of ability here; tightening one or two areas below would move you from "safe" to "memorable".',
    developing: 'Right now a hiring manager may be left unsure. The substance is there, but the delivery is not yet doing it justice — the recommendations below are where the fastest gains are.',
  }[band(r.communicationScore)];
  const lead = {
    high: 'You show strong leadership signal — ownership language, structured thinking, and calm delivery. This reads as someone who can be trusted with scope.',
    solid: 'There is leadership potential here. Adding more "I owned / I decided / I drove" framing and one clear result would sharpen how senior you sound.',
    developing: 'Leadership signal is still emerging. Lead with a decision you made and the outcome you owned, rather than describing the situation around you.',
  }[band(Math.round((r.confidenceScore + r.structureScore) / 2))];
  const readiness = {
    high: 'You are interview-ready for roles at this level. Keep practising to stay sharp and to build a second and third example for follow-up questions.',
    solid: 'You are close. A few focused practice sessions on structure and specifics would get you consistently interview-ready.',
    developing: 'You are in build mode. Run several more practice sessions, focusing on one weakness at a time — you will see the score climb quickly.',
  }[band(r.communicationScore)];
  const weakest = [
    ['clarity', r.clarityScore],
    ['confidence', r.confidenceScore],
    ['structure', r.structureScore],
    ['professional presence', r.professionalPresenceScore],
  ].sort((a, b) => a[1] - b[1])[0][0];
  const roadmap = `Over the next 2 weeks: (1) Do 3 practice sessions focused on ${weakest} — your lowest score today. (2) Prepare one "signature story" with a clear result and numbers, and rehearse it until it flows. (3) Record yourself once and re-watch — you will catch fillers and pacing you cannot feel in the moment.`;
  const recs = (feedback.improvements || []).slice(0, 3).map((i) => i.detail).filter(Boolean);
  return [
    { title: 'Hiring Manager Impression', body: impression },
    { title: 'Leadership Potential', body: lead },
    { title: 'Interview Readiness', body: readiness },
    { title: 'Career Growth Roadmap', body: roadmap },
    { title: 'Personalized Recommendations', body: recs.length ? recs.join(' ') : 'Keep adding one concrete example with a measurable result to every answer — it is the fastest way to sound more senior.' },
  ];
};
const buildCommunicationReport = (feedback, profileLabel) => {
  const clarityScore = clampScore(feedback.clarity);
  const structureScore = clampScore(feedback.structure);
  const confidenceScore = clampScore(
    68 + Math.min(feedback.wordCount, 180) * 0.08 - feedback.fillerCount * 7 + (feedback.sentences >= 3 ? 6 : 0)
  );
  const professionalPresenceScore = clampScore(
    62 + (feedback.hasNumbers ? 14 : 0) + (feedback.fillerCount <= 1 ? 10 : 0) + (feedback.wordCount >= 70 ? 8 : 0)
  );
  const communicationScore = clampScore(
    clarityScore * 0.28 + confidenceScore * 0.24 + structureScore * 0.24 + professionalPresenceScore * 0.24
  );
  const topStrength = feedback.strengths?.[0] || 'You are able to communicate your intent clearly.';
  const firstImprovement = feedback.improvements?.[0];
  const biggestImprovementArea = firstImprovement
    ? `${firstImprovement.title.replace(/[^\w\s:.-]/g, '').trim()}: ${firstImprovement.detail}`
    : 'Add one specific example with measurable outcome to make your answer more convincing.';
  const base = {
    profileLabel,
    communicationScore,
    clarityScore,
    confidenceScore,
    structureScore,
    professionalPresenceScore,
    topStrength,
    biggestImprovementArea,
    scoreCards: [
      { label: 'Clarity', value: clarityScore, hint: 'How easy your answer is to understand.' },
      { label: 'Confidence', value: confidenceScore, hint: 'How steady and direct your answer feels.' },
      { label: 'Structure', value: structureScore, hint: 'Whether the answer has a clear beginning, middle, and result.' },
      { label: 'Professional Presence', value: professionalPresenceScore, hint: 'How credible you sound to a hiring manager.' },
    ],
  };
  base.premium = buildPremiumSections(base, feedback, profileLabel);
  return base;
};
// =================== SEARCHABLE DROPDOWN COMPONENT ===================
function SearchableDropdown({ label, options, value, onChange, otherValue, onOtherChange, required, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );
  const isOther = value === 'Other';
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full p-3 border-2 ${
            value ? 'border-siddhi-saffron/40' : 'border-siddhi-black/15'
          } rounded-lg bg-white text-left flex justify-between items-center hover:border-siddhi-saffron/60 focus:border-siddhi-saffron focus:outline-none transition`}
        >
          <span className={value ? 'text-siddhi-black' : 'text-siddhi-black/40'}>
            {value || placeholder || 'Choose…'}
          </span>
          <span className="text-siddhi-black/40 text-sm">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border-2 border-siddhi-saffron/30 rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-siddhi-black/10 sticky top-0 bg-white">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search field…"
                autoFocus
                className="w-full p-2 border border-siddhi-black/15 rounded-md focus:border-siddhi-saffron focus:outline-none text-sm"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="p-3 text-sm text-siddhi-black/50 text-center">
                  No matches. Pick "Other" to type your own.
                </div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setSearch('');
                      setOpen(false);
                    }}
                    className={`w-full text-left p-3 text-sm hover:bg-siddhi-saffron/10 transition ${
                      value === opt ? 'bg-siddhi-saffron/15 font-semibold text-siddhi-saffron' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {isOther && (
        <div className="mt-3">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Specify your field…"
            autoFocus
            className="w-full p-3 border-2 border-siddhi-gold/40 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-siddhi-gold/5"
          />
          <p className="text-xs text-siddhi-black/50 mt-1">
            💡 Tell us your field — we use this to expand our coverage.
          </p>
        </div>
      )}
    </div>
  );
}
// =================== MAIN COMPONENT ===================
export default function Interview() {
  const [step, setStep] = useState('register');
  const [tier, setTier] = useState(null);
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [gradField, setGradField] = useState('');
  const [gradOther, setGradOther] = useState('');
  const [pgField, setPgField] = useState('None / Not pursuing');
  const [pgOther, setPgOther] = useState('');
  const [expField, setExpField] = useState('');
  const [expOther, setExpOther] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [communicationReport, setCommunicationReport] = useState(null);
  const [reportSaveStatus, setReportSaveStatus] = useState('');
  const [sessionRating, setSessionRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sessionComment, setSessionComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  // On load: logged-in users skip the guest form and are checked for an active plan.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active || !user) return;
      if (user.email) setUserEmail(user.email);
      const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
      if (metaName) setUserName(metaName);
      setRegistered(true);
      setStep((s) => (s === 'register' ? 'select_tier' : s));
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .limit(1)
        .maybeSingle();
      if (active && data) setHasPaid(true);
    })();
    return () => { active = false; };
  }, []);

  const isFresher = tier === 'fresher';
  const getEffectiveField = () => {
    if (!isFresher) return expField === 'Other' ? expOther : expField;
    return gradField === 'Other' ? gradOther : gradField;
  };
  const getQuestions = () => {
    if (isFresher) {
      return hasPaid ? FRESHER_QUESTIONS.free.concat(FRESHER_QUESTIONS.pro) : FRESHER_QUESTIONS.free;
    }
    const field = expField === 'Other' ? null : expField;
    const bank = EXPERIENCED_QUESTIONS[field] || EXPERIENCED_QUESTIONS.default;
    return hasPaid ? bank.free.concat(bank.pro) : bank.free;
  };
  const saveCommunicationReport = async (report) => {
    setReportSaveStatus('');
    if (!isSupabaseConfigured || !supabase) {
      setReportSaveStatus('Preview generated. Login is required to save it.');
      return;
    }
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) {
        setReportSaveStatus('Preview generated. Login is required to save it.');
        return;
      }
      const { error } = await supabase.from('communication_reports').insert({
        user_id: user.id,
        user_type: tier,
        target_role: getEffectiveField() || report.profileLabel || 'General interview practice',
        communication_score: report.communicationScore,
        clarity_score: report.clarityScore,
        confidence_score: report.confidenceScore,
        structure_score: report.structureScore,
        professional_presence_score: report.professionalPresenceScore,
        strength: report.topStrength,
        improvement_area: report.biggestImprovementArea,
        is_preview: !hasPaid,
      });
      setReportSaveStatus(error ? 'Report shown. Saving will retry after login.' : (hasPaid ? 'Report saved to your SiddhiAI account.' : 'Preview saved to your SiddhiAI account.'));
    } catch (error) {
      setReportSaveStatus('Report shown. Saving will retry after login.');
    }
  };
  const pickTier = (selectedTier) => {
    if (!hasPaid && sessionsUsed >= FREE_LIMIT) {
      setStep('limit');
      return;
    }
    setTier(selectedTier);
    setStep('fill_details');
  };
  const canProceed = () => {
    if (isFresher) {
      if (!gradField) return false;
      if (gradField === 'Other' && !gradOther.trim()) return false;
      if (pgField === 'Other' && !pgOther.trim()) return false;
      return true;
    }
    if (!expField) return false;
    if (expField === 'Other' && !expOther.trim()) return false;
    return true;
  };
  const startPractice = () => {
    if (!canProceed()) {
      alert('Please complete the required fields.');
      return;
    }
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: 'Interview Start',
        name: userName,
        mobile: userMobile,
        email: userEmail,
        tier,
        plan: hasPaid ? 'Pro' : 'Free',
        graduation: isFresher ? (gradField === 'Other' ? gradOther : gradField) : null,
        post_graduation: isFresher ? (pgField === 'Other' ? pgOther : pgField) : null,
        experienced_field: !isFresher ? (expField === 'Other' ? expOther : expField) : null,
        submitted_at: new Date().toISOString(),
        _subject: `Interview Start: ${userName} (${tier} - ${getEffectiveField()})`,
      }),
    }).catch(() => {});
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
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const hasNumbers = /\d+/.test(answer);
    const hasIChange = /\bI\s+(led|built|shipped|launched|owned|drove|managed)\b/i.test(answer);
    const startsWithSituation = /^(in my|at my|during|when i|while)/i.test(answer.trim());
    const improvements = [];
    if (isFresher) {
      if (wordCount < 50) {
        improvements.push({
          title: '🎯 Your answer was too short',
          detail: `You used ${wordCount} words. Interviewers expect 60-90 seconds (120-180 words). Add one concrete example from your project, internship, or college work.`,
          example: 'Example: Instead of "I worked on a project", say "I built a sales tracker for my college fest using Google Sheets — handled ₹2 lakh in payments across 3 days."',
        });
      } else if (wordCount > 200) {
        improvements.push({
          title: '✂️ You over-explained',
          detail: `${wordCount} words is too long. Interviewers lose focus after 90 seconds. Cut the middle 30% — keep your strongest opening + sharpest closing.`,
        });
      }
      if (fillerWords > 2) {
        improvements.push({
          title: `🗣️ ${fillerWords} filler words detected`,
          detail: `You said "um/uh/like/basically/actually" ${fillerWords} times. This makes you sound less confident. Practice pausing silently for 1 second instead — it makes you sound thoughtful, not nervous.`,
          example: 'Try this: Record yourself answering for 60 seconds. Count fillers. Re-record until under 2.',
        });
      }
      if (!startsWithSituation && wordCount > 30) {
        improvements.push({
          title: '📐 Use STAR format',
          detail: 'Your answer didn\'t follow a clear structure. Fresher interviews love the STAR format: Situation → Task → Action → Result.',
          example: '"In my final semester (Situation), I had to organize the tech fest (Task). I led a team of 8 and managed ₹5L budget (Action). We had 400+ attendees and made ₹50k profit (Result)."',
        });
      }
      if (!hasNumbers) {
        improvements.push({
          title: '🔢 Add specific numbers',
          detail: 'Your answer had no numbers. Even fresher answers feel 10x more credible with one specific number: team size, duration, percentage, marks, hours saved.',
          example: 'Weak: "I improved the website." Strong: "I improved the website load time by 40% over 2 weeks."',
        });
      }
      if (improvements.length === 0) {
        improvements.push({
          title: '🚀 Take it to the next level',
          detail: 'Strong answer for a fresher. To stand out further: prepare one 2-minute version of your "best project" story — practice it 5 times until it flows naturally.',
        });
      }
    } else {
      if (wordCount < 80) {
        improvements.push({
          title: '🎯 Your answer felt thin for your level',
          detail: `You used ${wordCount} words. At 3+ years experience, interviewers expect 90-120 seconds (180-240 words) with depth. Add: context, your specific role, the trade-offs you faced, the measurable outcome.`,
          example: 'Frame it: Context (1 line) → Challenge (2 lines) → Your action (3 lines, use "I" not "we") → Result with numbers (2 lines) → What you learned (1 line).',
        });
      } else if (wordCount > 280) {
        improvements.push({
          title: '✂️ Too long — sharpen it',
          detail: `${wordCount} words is too long. Senior interviewers test if you can be concise under pressure. Cut by 30% and lead with the BIGGEST impact first.`,
        });
      }
      if (!hasIChange) {
        improvements.push({
          title: '👤 Use "I" not "We"',
          detail: 'You didn\'t use ownership verbs like "I led / I built / I shipped / I owned." Senior interviews probe for individual contribution. "We" is a red flag — interviewers will ask "what did YOU do?"',
          example: 'Weak: "We launched the product." Strong: "I owned the GTM strategy and led the launch — partnered with marketing, set up analytics, ran the post-launch retro."',
        });
      }
      if (!hasNumbers) {
        improvements.push({
          title: '🔢 No measurable impact mentioned',
          detail: 'Senior roles are evaluated on impact. Your answer had zero numbers. Add: revenue, users, time saved, % improvement, team size, deadline beaten.',
          example: '"My change reduced API latency from 800ms to 120ms — saving the team 15 hours/week of customer escalations."',
        });
      }
      if (fillerWords > 2) {
        improvements.push({
          title: `🗣️ Executive presence dropped — ${fillerWords} fillers`,
          detail: `At your level, filler words ("um/uh/basically/actually") cost you executive presence. Senior interviewers notice this. Replace with confident silence — pause 1 second instead.`,
        });
      }
      if (sentences > 0 && wordCount / sentences > 35) {
        improvements.push({
          title: '✂️ Sentences too long',
          detail: 'Your average sentence had ' + Math.round(wordCount / sentences) + ' words. Interviewers lose track after 25-word sentences. Break long thoughts into 2-3 punchy sentences.',
        });
      }
      if (improvements.length === 0) {
        improvements.push({
          title: '🚀 Polish for top-tier interviews',
          detail: 'Strong answer. To go from good to great: prepare 2 follow-up examples in case interviewer asks "give me another example" or "what would you do differently?"',
        });
      }
    }
    const topImprovements = improvements.slice(0, 3);
    setFeedback({
      clarity: Math.min(95, 60 + wordCount * 0.4 - fillerWords * 3),
      structure: wordCount > 80 ? 88 : wordCount > 40 ? 72 : 55,
      wordCount,
      fillerCount: fillerWords,
      sentences,
      hasNumbers,
      strengths: isFresher
        ? [
            wordCount > 50 ? `Good length — ${wordCount} words shows you can articulate` : 'Concise — you didn\'t ramble',
            hasNumbers ? 'You included specifics — interviewers love that' : 'Clear enthusiasm comes through',
            fillerWords < 2 ? 'Confident delivery — minimal fillers' : 'You engaged with the question seriously',
          ]
        : [
            wordCount > 80 ? `Solid depth — ${wordCount} words shows mature thinking` : 'Concise delivery',
            hasIChange ? 'Strong ownership language — used "I" verbs' : 'Clear narrative structure',
            hasNumbers ? 'Quantified impact — that\'s senior-level' : 'Professional tone throughout',
          ],
      improvements: topImprovements,
    });
    setSessionsUsed((n) => n + 1);
    setStep('feedback');
  };
  const nextQuestion = () => {
    const qs = getQuestions();
    if (qIndex + 1 < qs.length) {
      setQIndex(qIndex + 1);
      setAnswer('');
      setFeedback(null);
      setCommunicationReport(null);
      setReportSaveStatus('');
      setStep('practice');
    } else {
      const report = buildCommunicationReport(feedback, isFresher ? 'Fresher interview practice' : getEffectiveField());
      setCommunicationReport(report);
      saveCommunicationReport(report);
      setStep('communication_report');
    }
  };
  const submitSessionRating = () => {
    if (sessionRating < 1) {
      alert('Please rate your session before continuing.');
      return;
    }
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: 'Session Rating',
        name: userName,
        mobile: userMobile,
        email: userEmail,
        tier,
        field: getEffectiveField(),
        rating: `${sessionRating}/5`,
        comment: sessionComment.trim() || '(no comment)',
        submitted_at: new Date().toISOString(),
        _subject: `Session Rating: ${userName} (${sessionRating}/5)`,
      }),
    }).catch(() => {});
    setRatingSubmitted(true);
    setTimeout(() => {
      setStep('select_tier');
      setTier(null);
      setGradField('');
      setGradOther('');
      setPgField('None / Not pursuing');
      setPgOther('');
      setExpField('');
      setExpOther('');
      setAnswer('');
      setFeedback(null);
      setCommunicationReport(null);
      setReportSaveStatus('');
      setSessionRating(0);
      setHoverRating(0);
      setSessionComment('');
      setRatingSubmitted(false);
    }, 2500);
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
            <span className="text-xs text-siddhi-black/60 hidden sm:inline">
              {hasPaid ? <strong className="text-siddhi-saffron">Pro · Active</strong> : <>Free: <strong>{FREE_LIMIT - sessionsUsed}/{FREE_LIMIT}</strong></>}
            </span>
            {!hasPaid && (
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
        {step === 'register' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Quick details · 30 seconds
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Let's get started
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base max-w-md mx-auto">
                We need a few details before you begin. We use this only to send you your interview report and product updates.
              </p>
            </div>
            <div className="bg-white border border-siddhi-black/10 rounded-xl p-5 sm:p-7 space-y-5 shadow-sm">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Your name"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="Your number"
                  maxLength={15}
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
                <p className="text-xs text-siddhi-black/50 mt-1">10-digit number (India). We never call you — only WhatsApp updates.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
                />
                <p className="text-xs text-siddhi-black/50 mt-1">We send your interview score report here.</p>
              </div>
              <div className="text-xs text-siddhi-black/55 bg-siddhi-ivory/50 border border-siddhi-gold/20 rounded-lg p-3">
                🔒 Your details are private. We don't sell data. Read our{' '}
                <Link href="/privacy" className="underline text-siddhi-saffron">privacy policy</Link>.
              </div>
            </div>
            <button
              onClick={() => {
                const nameOk = userName.trim().length >= 2;
                const mobileDigits = userMobile.replace(/\D/g, '');
                const mobileOk = mobileDigits.length >= 10 && mobileDigits.length <= 15;
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim());
                if (!nameOk) { alert('Please enter your name (at least 2 characters).'); return; }
                if (!mobileOk) { alert('Please enter a valid mobile number (at least 10 digits).'); return; }
                if (!emailOk) { alert('Please enter a valid email address.'); return; }
                fetch(FORMSPREE_ENDPOINT, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify({
                    source: 'Interview Registration',
                    name: userName.trim(),
                    mobile: userMobile.trim(),
                    email: userEmail.trim().toLowerCase(),
                    submitted_at: new Date().toISOString(),
                    _subject: `New SIDDHI signup: ${userName.trim()}`,
                  }),
                }).catch(() => {});
                setRegistered(true);
                setStep('select_tier');
              }}
              className="w-full mt-6 px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-base sm:text-lg"
            >
              Continue →
            </button>
            <p className="text-xs text-siddhi-black/50 text-center mt-3">
              By continuing, you agree to receive interview reports and product updates.
            </p>
          </div>
        )}
        {step === 'select_tier' && (
          <div>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                {hasPaid ? 'Pro · Interview Coach' : 'Interview Coach · Step 1 of 2'}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Who are you today?
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base max-w-md mx-auto">
                {hasPaid
                  ? 'Your Pro access is active — 6-question sessions, full role banks, and your complete report.'
                  : "We'll tailor your interview questions based on where you are in your journey."}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => pickTier('fresher')}
                className="p-6 sm:p-8 bg-white border-2 border-siddhi-black/10 rounded-xl hover:border-siddhi-saffron hover:shadow-xl transition text-left group"
              >
                <div className="text-5xl mb-4">🌱</div>
                <div className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-siddhi-saffron transition">
                  Fresher
                </div>
                <div className="text-xs px-2 py-0.5 bg-siddhi-black/10 text-siddhi-black/60 rounded-full font-semibold inline-block mb-3">
                  0–2 years
                </div>
                <p className="text-sm text-siddhi-black/65">
                  Recent grad, internships, first job hunt, campus placements.
                </p>
              </button>
              <button
                onClick={() => pickTier('experienced')}
                className="p-6 sm:p-8 bg-white border-2 border-siddhi-black/10 rounded-xl hover:border-siddhi-saffron hover:shadow-xl transition text-left group"
              >
                <div className="text-5xl mb-4">🚀</div>
                <div className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-siddhi-saffron transition">
                  Experienced
                </div>
                <div className="text-xs px-2 py-0.5 bg-siddhi-black/10 text-siddhi-black/60 rounded-full font-semibold inline-block mb-3">
                  3+ years
                </div>
                <p className="text-sm text-siddhi-black/65">
                  Career professional, switching roles, climbing the ladder, leadership.
                </p>
              </button>
            </div>
            {sessionsUsed > 0 && !hasPaid && (
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
        {step === 'fill_details' && tier && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm">
              <button
                onClick={() => setStep('select_tier')}
                className="text-siddhi-black/60 hover:text-siddhi-saffron"
              >
                ← Back
              </button>
              <span className="text-siddhi-black/60">
                {isFresher ? '🌱 Fresher' : '🚀 Experienced'}
              </span>
            </div>
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Step 2 of 2
              </p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                {isFresher ? 'Your educational background' : 'Your field / function'}
              </h1>
              <p className="text-siddhi-black/60 text-sm sm:text-base">
                {isFresher
                  ? "We'll calibrate questions to your stream. Pick from the list or choose 'Other' to type your own."
                  : "Pick your field. Don't see it? Choose 'Other' and we'll tailor for you."}
              </p>
            </div>
            <div className="bg-white border border-siddhi-black/10 rounded-xl p-5 sm:p-6 space-y-5">
              {isFresher ? (
                <>
                  <SearchableDropdown
                    label="Graduation field"
                    options={GRADUATION_FIELDS}
                    value={gradField}
                    onChange={setGradField}
                    otherValue={gradOther}
                    onOtherChange={setGradOther}
                    required={true}
                    placeholder="Choose your graduation field…"
                  />
                  <SearchableDropdown
                    label="Post-graduation field (optional)"
                    options={POST_GRADUATION_FIELDS}
                    value={pgField}
                    onChange={setPgField}
                    otherValue={pgOther}
                    onOtherChange={setPgOther}
                    required={false}
                    placeholder="Choose if applicable…"
                  />
                </>
              ) : (
                <SearchableDropdown
                  label="Your professional field"
                  options={EXPERIENCED_FIELDS}
                  value={expField}
                  onChange={setExpField}
                  otherValue={expOther}
                  onOtherChange={setExpOther}
                  required={true}
                  placeholder="Choose your field…"
                />
              )}
            </div>
            <button
              onClick={startPractice}
              disabled={!canProceed()}
              className="w-full mt-6 px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start practice →
            </button>
            <p className="text-xs text-siddhi-black/50 text-center mt-3">
              {hasPaid ? '6 questions · full report · Pro access' : '3 questions · ~10 minutes · Free to try'}
            </p>
          </div>
        )}
        {step === 'practice' && tier && (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm gap-2">
              <span className="text-siddhi-black/60 truncate">
                {isFresher ? '🌱 Fresher' : '🚀 Experienced'} ·{' '}
                <span className="font-semibold text-siddhi-saffron">{getEffectiveField()}</span> ·
                Q {qIndex + 1}/{getQuestions().length}
              </span>
              <button
                onClick={() => {
                  setStep('select_tier');
                  setTier(null);
                }}
                className="text-siddhi-black/60 hover:text-siddhi-saffron flex-shrink-0"
              >
                ← Restart
              </button>
            </div>
            <div className="bg-white border-2 border-siddhi-saffron/30 rounded-lg p-6 sm:p-8 mb-6">
              <div className="text-xs uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                Question
              </div>
              <p className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed">
                {getQuestions()[qIndex]}
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
                  className="px-5 sm:px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition disabled:opacity-40 disabled:cursor-not-allowed"
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
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Your feedback</h2>
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
              <h3 className="font-display text-lg font-bold mb-4 text-siddhi-saffron">→ How to improve (specific actions)</h3>
              <div className="space-y-4">
                {feedback.improvements.map((imp, i) => (
                  <div key={i} className="border-l-4 border-siddhi-saffron pl-4 py-1">
                    <div className="font-semibold text-sm sm:text-base mb-1.5">{imp.title}</div>
                    <p className="text-sm text-siddhi-black/75 leading-relaxed mb-2">{imp.detail}</p>
                    {imp.example && (
                      <div className="bg-siddhi-ivory/60 border border-siddhi-gold/30 rounded p-3 text-xs sm:text-sm">
                        <span className="font-semibold text-siddhi-gold">💡 Example: </span>
                        <span className="text-siddhi-black/80">{imp.example}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-siddhi-black/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-siddhi-black/50">Words</div>
                  <div className="font-bold text-siddhi-saffron">{feedback.wordCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-siddhi-black/50">Fillers</div>
                  <div className={`font-bold ${feedback.fillerCount > 2 ? 'text-red-500' : 'text-green-600'}`}>{feedback.fillerCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-siddhi-black/50">Sentences</div>
                  <div className="font-bold text-siddhi-saffron">{feedback.sentences}</div>
                </div>
                <div className="text-center">
                  <div className="text-siddhi-black/50">Numbers</div>
                  <div className={`font-bold ${feedback.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>{feedback.hasNumbers ? '✓' : '✗'}</div>
                </div>
              </div>
            </div>
            {!hasPaid && (
              <div className="bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg p-4 mb-6 text-sm">
                <strong>Pro unlocks:</strong> unlimited practice, 6-question sessions, tailored question banks for every role, and your complete Communication Intelligence Report.{' '}
                <Link href="/payment" className="text-siddhi-saffron font-semibold underline">
                  Try Pro
                </Link>
              </div>
            )}
            <button
              onClick={nextQuestion}
              className="w-full px-6 py-4 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition text-base sm:text-lg"
            >
              {qIndex + 1 < getQuestions().length ? 'Next Question →' : 'Complete Session ✓'}
            </button>
          </div>
        )}
        {step === 'communication_report' && communicationReport && (
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-siddhi-black text-white p-6 sm:p-8 mb-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-siddhi-saffron/30 via-transparent to-siddhi-gold/25" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs sm:text-sm font-semibold mb-5">
                  {hasPaid ? 'Communication Intelligence Report' : 'Communication Intelligence Preview'}
                </div>
                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <p className="text-white/65 text-sm uppercase tracking-[0.25em] mb-3">
                      Your interview signal
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      You are closer than you think.
                    </h2>
                    <p className="text-white/70 mt-4 max-w-xl">
                      SiddhiAI analysed your answer for clarity, confidence, structure, and professional presence.
                    </p>
                  </div>
                  <div className="bg-white text-siddhi-black rounded-2xl p-6 text-center shadow-xl min-w-[180px]">
                    <div className="text-xs uppercase tracking-widest text-siddhi-black/45 mb-2">
                      Overall Score
                    </div>
                    <div className="text-6xl font-bold text-siddhi-saffron">
                      {communicationReport.communicationScore}
                    </div>
                    <div className="text-siddhi-black/50 font-semibold">/100</div>
                  </div>
                </div>
              </div>
            </div>
            {reportSaveStatus && (
              <div className="mb-5 rounded-lg border border-siddhi-gold/30 bg-siddhi-gold/10 px-4 py-3 text-sm text-siddhi-black/70">
                {reportSaveStatus}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {communicationReport.scoreCards.map((score) => (
                <div key={score.label} className="bg-white border border-siddhi-black/10 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-display text-lg font-bold">{score.label}</div>
                      <p className="text-xs text-siddhi-black/55 mt-1">{score.hint}</p>
                    </div>
                    <div className="text-2xl font-bold text-siddhi-saffron">{score.value}</div>
                  </div>
                  <div className="h-2 bg-siddhi-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-siddhi-saffron to-siddhi-gold rounded-full"
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="text-xs uppercase tracking-widest text-green-700 font-bold mb-2">
                  Top Strength
                </div>
                <p className="text-sm sm:text-base text-siddhi-black/80 leading-relaxed">
                  {communicationReport.topStrength}
                </p>
              </div>
              <div className="bg-siddhi-ivory border border-siddhi-gold/35 rounded-xl p-5">
                <div className="text-xs uppercase tracking-widest text-siddhi-saffron font-bold mb-2">
                  Biggest Improvement Area
                </div>
                <p className="text-sm sm:text-base text-siddhi-black/80 leading-relaxed">
                  {communicationReport.biggestImprovementArea}
                </p>
              </div>
            </div>

            {hasPaid ? (
              <div className="bg-white border border-siddhi-black/10 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-siddhi-saffron font-bold">Your full report</p>
                    <h3 className="font-display text-2xl font-bold mt-1">Communication Intelligence Report</h3>
                  </div>
                  <div className="rounded-full border border-siddhi-saffron/30 px-4 py-2 text-sm font-bold text-siddhi-saffron bg-siddhi-saffron/10 whitespace-nowrap">
                    Pro · Active
                  </div>
                </div>
                <div className="space-y-4">
                  {communicationReport.premium.map((sec) => (
                    <div key={sec.title} className="border-l-4 border-siddhi-gold pl-4 py-1">
                      <div className="font-semibold text-sm sm:text-base mb-1 text-siddhi-black/85">{sec.title}</div>
                      <p className="text-sm text-siddhi-black/75 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-siddhi-black/10 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-siddhi-saffron font-bold">
                      Full report locked
                    </p>
                    <h3 className="font-display text-2xl font-bold mt-1">
                      Unlock the full Communication Intelligence Report
                    </h3>
                  </div>
                  <div className="rounded-full border border-siddhi-saffron/30 px-4 py-2 text-sm font-bold text-siddhi-saffron bg-siddhi-saffron/10">
                    30-Day Access
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {PREMIUM_REPORT_SECTIONS.map((section) => (
                    <div
                      key={section}
                      className="relative overflow-hidden rounded-lg border border-siddhi-black/10 bg-siddhi-black/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-siddhi-black/75">{section}</span>
                        <span className="text-xs uppercase tracking-wider text-siddhi-black/40 font-bold">Locked</span>
                      </div>
                      <div className="mt-3 h-2 w-4/5 rounded bg-siddhi-black/10" />
                      <div className="mt-2 h-2 w-2/3 rounded bg-siddhi-black/10" />
                    </div>
                  ))}
                </div>
                <Link
                  href="/payment"
                  className="block w-full text-center px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-base sm:text-lg"
                >
                  Unlock Full Communication Intelligence Report
                  <span className="block text-sm font-semibold text-white/85 mt-1">₹499 for 30-Day Access</span>
                </Link>
              </div>
            )}
            <button
              onClick={() => setStep('session_rating')}
              className="w-full px-6 py-4 border-2 border-siddhi-black/15 text-siddhi-black font-semibold rounded-md hover:border-siddhi-saffron hover:text-siddhi-saffron transition"
            >
              Continue to session rating
            </button>
          </div>
        )}
        {step === 'session_rating' && (
          <div>
            {!ratingSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
                    Session complete · One last step
                  </p>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                    How was your session, {userName.split(' ')[0]}?
                  </h1>
                  <p className="text-siddhi-black/60 text-sm sm:text-base max-w-md mx-auto">
                    Your rating helps us improve SIDDHI for the next person.
                  </p>
                </div>
                <div className="bg-white border border-siddhi-black/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-center">
                      Your rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setSessionRating(star)}
                          className="text-4xl sm:text-5xl transition-transform hover:scale-125 focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <span className={
                            (hoverRating || sessionRating) >= star
                              ? 'text-siddhi-saffron'
                              : 'text-siddhi-black/15'
                          }>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    {sessionRating > 0 && (
                      <p className="text-center text-sm mt-3 text-siddhi-saffron font-semibold">
                        {sessionRating === 5 && '🎉 Loved it!'}
                        {sessionRating === 4 && '😊 Liked it'}
                        {sessionRating === 3 && '🙂 It was okay'}
                        {sessionRating === 2 && '😐 Could be better'}
                        {sessionRating === 1 && '😕 Needs work'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Tell us more (optional)
                    </label>
                    <textarea
                      value={sessionComment}
                      onChange={(e) => setSessionComment(e.target.value)}
                      rows={4}
                      placeholder="What worked? What was confusing? What should we add?"
                      className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none resize-none text-sm"
                    />
                    <p className="text-xs text-siddhi-black/50 mt-1">
                      💬 Every word is read by the founder. Honest feedback helps us most.
                    </p>
                  </div>
                </div>
                <button
                  onClick={submitSessionRating}
                  disabled={sessionRating < 1}
                  className="w-full mt-6 px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit rating →
                </button>
                <p className="text-xs text-siddhi-black/50 text-center mt-3">
                  Required to complete your session.
                </p>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🙏</div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                  Thank you, {userName.split(' ')[0]}!
                </h2>
                <p className="text-siddhi-black/60 max-w-md mx-auto">
                  Your {sessionRating}-star rating is recorded. Returning to home…
                </p>
              </div>
            )}
          </div>
        )}
        {step === 'limit' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              You've used all 3 free sessions
            </h2>
            <p className="text-siddhi-black/60 mb-8 max-w-md mx-auto">
              Unlock unlimited practice, 6-question sessions, tailored role banks, and your full report.
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
