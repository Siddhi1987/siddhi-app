import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="SIDDHI — Ancient Wisdom. Modern AI. India's first Communication AI Model." />
        <meta name="keywords" content="SIDDHI, AI interview coach, communication AI, India AI" />
        <meta property="og:title" content="SIDDHI — Ancient Wisdom. Modern AI." />
        <meta property="og:description" content="वाक् सिद्धि — Mastery of Speech. India's first Communication AI Model." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
