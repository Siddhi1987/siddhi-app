import Link from 'next/link';
import { useState } from 'react';

// Formspree endpoint for SIDDHI feedback form
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkoyyrbz';

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    worked: '',
    didnt_work: '',
    pricing: '',
    quote_permission: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please give a star rating.');
      return;
    }
    if (!form.worked.trim() && !form.didnt_work.trim()) {
      alert('Please share at least one thought — what worked or what didn\'t.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...form,
          rating: `${rating}/5`,
          submitted_at: new Date().toISOString(),
          _subject: `SIDDHI Feedback from ${form.name || 'Anonymous'} (${rating}/5)`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Scroll to top to show success
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Something went wrong. Please email us directly at support@siddhiai.in');
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
        <nav className="border-b border-siddhi-black/10 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
              <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Thank you, sincerely.
          </h1>
          <p className="text-lg text-siddhi-black/70 mb-2">
            Your feedback shapes what SIDDHI becomes.
          </p>
          <p className="font-sanskrit text-2xl text-siddhi-gold mt-8 mb-2">वाक् सिद्धि</p>
          <p className="text-sm text-siddhi-black/50 italic mb-10">
            "Mastery of Speech" — built with your voice in mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/interview"
              className="px-6 py-3 bg-siddhi-saffron text-white font-semibold rounded-md hover:bg-siddhi-gold transition"
            >
              Try Another Practice Session
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border-2 border-siddhi-black text-siddhi-black font-semibold rounded-md hover:bg-siddhi-black hover:text-white transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black">
      <nav className="border-b border-siddhi-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-siddhi-saffron">SIDDHI</span>
            <span className="font-sanskrit text-siddhi-gold">सिद्धि</span>
          </Link>
          <Link href="/" className="text-sm text-siddhi-black/60 hover:text-siddhi-saffron">
            ← Back home
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-widest text-siddhi-saffron font-semibold mb-3">
            Help Shape SIDDHI
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your honest feedback matters.
          </h1>
          <p className="text-siddhi-black/60">
            You're one of the first to experience SIDDHI. Tell us what's working, what isn't,
            and what would make this 10× better. Every line is read by the founder.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="bg-white border border-siddhi-black/10 rounded-lg p-6">
            <label className="block text-sm font-semibold mb-3">
              How was your overall experience?
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-4xl transition transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  {(hoverRating || rating) >= star ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-siddhi-black/60 mt-3">
                {rating === 5 && '✨ Loved it! Thank you.'}
                {rating === 4 && '👍 Glad you liked it!'}
                {rating === 3 && '🤔 Honest — we have work to do.'}
                {rating === 2 && '😔 Sorry — please tell us what went wrong.'}
                {rating === 1 && '🙏 Brutal honesty welcomed. Help us fix this.'}
              </p>
            )}
          </div>

          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Your name <span className="text-siddhi-black/40 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Parag"
                className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email <span className="text-siddhi-black/40 font-normal">(if you want a reply)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none"
              />
            </div>
          </div>

          {/* Role tested */}
          <div>
            <label className="block text-sm font-semibold mb-2">Which role did you test?</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none bg-white"
            >
              <option value="">Choose one…</option>
              <option value="Product Manager">📊 Product Manager</option>
              <option value="Software Engineer">💻 Software Engineer</option>
              <option value="HR / People">🤝 HR / People</option>
              <option value="Sales / BD">📈 Sales / BD</option>
              <option value="General / Fresher">🎓 General / Fresher</option>
              <option value="Didn't try interview yet">Just browsed the site</option>
            </select>
          </div>

          {/* What worked */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              ✓ What worked well for you?
            </label>
            <textarea
              value={form.worked}
              onChange={(e) => setForm({ ...form, worked: e.target.value })}
              rows={4}
              placeholder="The questions felt realistic… the feedback was specific… the brand looks beautiful…"
              className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none resize-none"
            />
          </div>

          {/* What didn't work */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              → What didn't work, or what's confusing?
            </label>
            <textarea
              value={form.didnt_work}
              onChange={(e) => setForm({ ...form, didnt_work: e.target.value })}
              rows={4}
              placeholder="Be brutally honest — this is the most useful section for us. Bugs, confusing flows, missing features, anything..."
              className="w-full p-3 border-2 border-siddhi-black/15 rounded-lg focus:border-siddhi-saffron focus:outline-none resize-none"
            />
          </div>

          {/* Pricing willingness */}
          <div className="bg-white border border-siddhi-black/10 rounded-lg p-5">
            <label className="block text-sm font-semibold mb-3">
              Would you pay <span className="text-siddhi-saffron">₹499/month</span> for unlimited Pro access?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'yes', label: 'Yes', emoji: '✅' },
                { value: 'maybe', label: 'Maybe', emoji: '🤔' },
                { value: 'no', label: 'No', emoji: '❌' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, pricing: option.value })}
                  className={`p-3 rounded-lg border-2 font-semibold transition ${
                    form.pricing === option.value
                      ? 'border-siddhi-saffron bg-siddhi-saffron/10 text-siddhi-saffron'
                      : 'border-siddhi-black/15 hover:border-siddhi-saffron/40'
                  }`}
                >
                  <span className="text-xl block mb-1">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quote permission */}
          <label className="flex items-start gap-3 cursor-pointer p-4 bg-siddhi-gold/10 border border-siddhi-gold/30 rounded-lg">
            <input
              type="checkbox"
              checked={form.quote_permission}
              onChange={(e) => setForm({ ...form, quote_permission: e.target.checked })}
              className="mt-1 w-5 h-5 accent-siddhi-saffron flex-shrink-0"
            />
            <span className="text-sm">
              <strong>Can we quote you publicly?</strong> If you check this, we may use your
              feedback (with your name) as a testimonial on the SIDDHI website. We'll always ask
              before publishing.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-siddhi-saffron text-white font-bold rounded-md hover:bg-siddhi-gold transition shadow-lg text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending…' : 'Send Feedback 🙏'}
          </button>

          <p className="text-center text-xs text-siddhi-black/50">
            Every response is read personally by Parag, the founder.
          </p>
        </form>
      </div>
    </div>
  );
}
