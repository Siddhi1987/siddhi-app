import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />

        {/* Favicon — SIDDHI saffron + S */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Primary SEO */}
        <meta name="description" content="SIDDHI — India's first Communication AI. Master interviews, negotiation, and public speaking with AI rooted in Indian heritage. Ancient Wisdom. Modern AI." />
        <meta name="keywords" content="SIDDHI, AI interview coach India, communication AI, mock interview AI, Indian interview prep, वाक् सिद्धि, communication training India" />
        <meta name="author" content="Parag Gokhale" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (LinkedIn, WhatsApp link previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SIDDHI" />
        <meta property="og:title" content="SIDDHI — India's first Communication AI" />
        <meta property="og:description" content="वाक् सिद्धि · Mastery of Speech. Train your voice with AI built for Indian professionals. Free interview practice today." />
        <meta property="og:url" content="https://siddhiai.in" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SIDDHI — India's first Communication AI" />
        <meta name="twitter:description" content="Ancient Wisdom. Modern AI. Train your communication with an AI that gets the Indian context." />

        {/* Theme color (browser tab bar on mobile) */}
        <meta name="theme-color" content="#FF9933" />

        {/* Preconnect to Google Fonts — speeds up font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
