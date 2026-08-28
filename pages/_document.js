import { Html, Head, Main, NextScript } from 'next/document';

// Loads the brand fonts the logo and headings depend on:
//   Cormorant Garamond  -> font-display  (the "SIDDHI" wordmark + headings)
//   Tiro Devanagari Sanskrit -> font-sanskrit (the "सिद्धि" mark)
//   Inter -> font-sans (body)
// Without these, Tailwind's font-display / font-sanskrit fall back to a
// generic serif, which is what made the logo look broken.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Tiro+Devanagari+Sanskrit&display=swap"
        />
        <meta property="og:title" content="SIDDHI — India's First Communication AI" />
        <meta property="og:description" content="Ancient wisdom. Modern AI. Practice interviews with AI and get an honest communication scorecard." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
