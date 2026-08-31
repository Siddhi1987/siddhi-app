// pages/api/analyze.js
// AI interview-answer coach via OpenRouter.
// The API key lives ONLY here (server-side) and never reaches the browser.
// Returns strict JSON the interview page can render. On any failure it returns
// an error and the frontend falls back to the rule-based feedback.
//
// FREE-MODEL FALLBACK CHAIN: it tries a list of free models in order. If one is
// rate-limited, congested, or errors, it automatically tries the next — so a
// single busy model never dead-ends the user. Only if ALL models fail does it
// return an error (and the interview page then shows rule-based feedback).

// Default chain = free models, best first. Override in Vercel with
// OPENROUTER_MODELS (comma-separated) to change models without touching code.
const DEFAULT_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'meta-llama/llama-3.3-70b-instruct:free',
];

function getModels() {
  const raw = process.env.OPENROUTER_MODELS || process.env.OPENROUTER_MODEL || '';
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return list.length ? list : DEFAULT_MODELS;
}

async function callModel({ model, key, system, user }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://siddhiai.in',
        'X-Title': 'SiddhiAI Interview Coach',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 900,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      const t = await upstream.text().catch(() => '');
      return { ok: false, detail: `HTTP ${upstream.status} ${t.slice(0, 160)}` };
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content || '';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Some models wrap JSON in prose — extract the first {...} block.
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) return { ok: false, detail: 'unparseable output' };
      try { parsed = JSON.parse(m[0]); } catch { return { ok: false, detail: 'unparseable output' }; }
    }
    return { ok: true, parsed };
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, detail: String(e).slice(0, 120) };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question = '', answer = '', role = 'General', level = 'experienced', mode = 'feedback' } = req.body || {};

  if (!answer || answer.trim().length < 20) {
    return res.status(400).json({ error: 'Answer too short to analyse.' });
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(503).json({ error: 'AI is not configured yet.' });
  }

  const isFresher = level === 'fresher';

  const system = [
    'You are SIDDHI, an expert interview coach and senior hiring manager.',
    `You are evaluating a ${isFresher ? 'fresher / early-career (0-2 yrs)' : 'experienced (3+ yrs)'} candidate for a "${role}" role.`,
    isFresher
      ? 'Be encouraging and constructive — this person is early in their career. Still be honest about what to fix.'
      : 'Hold a senior bar. Probe for ownership ("I" not "we"), measurable impact, and executive presence.',
    'Read the candidate\'s ACTUAL answer and give SPECIFIC feedback that references what they actually said — never generic filler.',
    'Always give at least one concrete example of a stronger way to phrase or structure their answer.',
    '',
    'Return ONLY a valid JSON object with EXACTLY this shape (no markdown, no prose outside the JSON):',
    '{',
    '  "clarity": <integer 0-100>,',
    '  "confidence": <integer 0-100>,',
    '  "structure": <integer 0-100>,',
    '  "presence": <integer 0-100>,',
    '  "strengths": [<2-3 short specific strings>],',
    '  "improvements": [',
    '    { "title": "<short title>", "detail": "<specific, actionable advice referencing their answer>", "example": "<a concrete better phrasing or structure>" }',
    '  ],',
    '  "summary": "<one honest, encouraging sentence>"',
    '}',
    'Give 2-3 improvements. Scores must reflect the answer honestly (a weak answer scores low).',
  ].join('\n');

  const user = `Interview question: ${question}\nRole / level: ${role} (${isFresher ? 'fresher' : 'experienced'})\n\nCandidate's answer:\n"""${answer.slice(0, 4000)}"""`;

  const models = getModels();
  const tried = [];
  let parsed = null;
  let usedModel = null;

  for (const model of models) {
    const r = await callModel({ model, key, system, user });
    if (r.ok) { parsed = r.parsed; usedModel = model; break; }
    tried.push(`${model}: ${r.detail}`);
  }

  if (!parsed) {
    return res.status(502).json({ error: 'All AI models unavailable', detail: tried.join(' | ').slice(0, 300) });
  }

  // light validation + clamp
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  const out = {
    clarity: clamp(parsed.clarity),
    confidence: clamp(parsed.confidence),
    structure: clamp(parsed.structure),
    presence: clamp(parsed.presence),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3).map(String) : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.slice(0, 3).map((i) => ({
          title: String(i.title || 'Improve this'),
          detail: String(i.detail || ''),
          example: i.example ? String(i.example) : '',
        }))
      : [],
    summary: String(parsed.summary || ''),
    source: 'ai',
    model: usedModel,
  };
  return res.status(200).json(out);
}
