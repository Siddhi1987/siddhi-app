import '../styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FeedbackButton from '../components/FeedbackButton';

// Per-page titles for better SEO + link previews
const PAGE_TITLES = {
  '/': 'SIDDHI — India\'s first Communication AI',
  '/interview': 'Interview Coach — SIDDHI',
  '/payment': 'Upgrade to Pro — SIDDHI',
  '/feedback': 'Share Your Feedback — SIDDHI',
  '/privacy': 'Privacy Policy — SIDDHI',
  '/terms': 'Terms & Conditions — SIDDHI',
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const title = PAGE_TITLES[router.pathname] || 'SIDDHI — Ancient Wisdom. Modern AI.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
      <FeedbackButton />
    </>
  );
}
