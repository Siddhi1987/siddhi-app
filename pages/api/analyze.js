// pages/api/analyze.js
// AI interview-answer coach via OpenRouter.
// The API key lives ONLY here (server-side) and never reaches the browser.
// Returns strict JSON the interview page can render. On any failure it returns
// an error and the frontend falls back to the rule-based feedback.

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

  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';
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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

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
      return res.status(502).json({ error: 'AI upstream error', detail: t.slice(0, 200) });
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content || '';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Some models wrap JSON in text — try to extract the first {...} block.
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) return res.status(502).json({ error: 'AI returned unparseable output' });
      try { parsed = JSON.parse(m[0]); } catch { return res.status(502).json({ error: 'AI returned unparseable output' }); }
    }

    // light validation
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
    };
    return res.status(200).json(out);
  } catch (e) {
    return res.status(502).json({ error: 'AI request failed', detail: String(e).slice(0, 120) });
  }
}
