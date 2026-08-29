export default function Privacy() {
  return (
    <div className="min-h-screen bg-siddhi-ivory text-siddhi-black px-6 py-16 max-w-3xl mx-auto">
      <a href="/" className="text-sm text-siddhi-saffron underline mb-6 inline-block">← Back home</a>
      <h1 className="font-display text-4xl font-bold text-siddhi-saffron mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>
      <div className="prose prose-lg space-y-6">
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">1. Information We Collect</h2>
          <p>SIDDHI collects information you provide directly: name, email, phone (for Razorpay), and interview practice content. We collect technical data (IP, device, usage analytics) automatically.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">2. How We Use Your Data</h2>
          <p>To provide the interview coaching service, process payments via Razorpay, improve our AI models, and send service-related communications. We do not sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">3. Data Storage</h2>
          <p>Data is stored securely on Vercel and our backend providers. Payment data is handled exclusively by Razorpay (PCI-DSS compliant) — we never store card details.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">4. Your Rights</h2>
          <p>You may request access, correction, or deletion of your data at any time by emailing <a href="mailto:support@siddhiai.in" className="text-siddhi-saffron underline">support@siddhiai.in</a>.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold mb-2">5. Contact</h2>
          <p>For privacy questions: <a href="mailto:support@siddhiai.in" className="text-siddhi-saffron underline">support@siddhiai.in</a></p>
        </section>
      </div>
    </div>
  );
}
