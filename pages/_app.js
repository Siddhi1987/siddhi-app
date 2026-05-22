import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import FeedbackButton from '../components/FeedbackButton';

const GA_MEASUREMENT_ID = 'G-FHBXT2SDGL';
const CLARITY_PROJECT_ID = 'wsfvfc784e';

const PAGE_TITLES = {
  '/': 'SIDDHI — India\'s First Communication AI Inspired by Vak Siddhi',
  '/interview': 'AI Mock Interview Practice — SIDDHI',
  '/payment': 'Upgrade to Pro — SIDDHI',
  '/feedback': 'Share Your Feedback — SIDDHI',
  '/privacy': 'Privacy Policy — SIDDHI',
  '/terms': 'Terms & Conditions — SIDDHI',
};

const PAGE_DESCRIPTIONS = {
  '/': 'SIDDHI AI helps students and professionals practice AI mock interviews, improve interview communication, and access real HR interview feedback.',
  '/interview': 'Practice AI mock interviews with SIDDHI and improve clarity, confidence, structure, and interview communication skills.',
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const title = PAGE_TITLES[router.pathname] || 'SIDDHI — Ancient Wisdom. Modern AI.';
  const description =
    PAGE_DESCRIPTIONS[router.pathname] ||
    'SIDDHI AI is a communication intelligence platform for interview practice, confidence, and real HR-style feedback.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content={description} />
        <meta name="google-site-verification" content="49cNfGOm3AErY1UlCqSAeG2ruVhUndmdnKjss9ao5BY" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhiai.in" />
        <link rel="canonical" href={`https://siddhiai.in${router.pathname === '/' ? '' : router.pathname}`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `}
      </Script>

      <main>
        <Component {...pageProps} />
      </main>
      <FeedbackButton />
    </>
  );
}
