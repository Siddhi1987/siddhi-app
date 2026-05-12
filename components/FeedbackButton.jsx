import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FeedbackButton() {
  const router = useRouter();

  // Don't show on the feedback page itself
  if (router.pathname === '/feedback') return null;

  return (
    <Link
      href="/feedback"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 px-4 py-3 bg-siddhi-saffron text-white font-semibold rounded-full shadow-2xl hover:bg-siddhi-gold hover:scale-105 transition-all duration-200"
      aria-label="Give feedback"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline text-sm">Feedback</span>
    </Link>
  );
}
