import { useState } from "react";
import Head from "next/head";

/* ------------------------------------------------------------------
   PAYMENT LINKS
   Paste your Razorpay Payment Link for each report option below.
   While a link is empty, that option's button falls back to WhatsApp
   so no buyer ever hits a dead end.
   ------------------------------------------------------------------ */
const PAYMENT_LINKS = {
  interview_499: "", // TODO: Razorpay link for Rs 499 interview report
  resume_799: "", // TODO: Razorpay link for Rs 799 resume & ATS report
  bundle_999: "", // TODO: Razorpay link for Rs 999 both reports
  intensive_4999: "https://rzp.io/rzp/yV8AaGDo", // live
};

const WHATSAPP = "919356785897";

const REPORTS = [
  {
    id: "interview_499",
    price: "499",
    name: "Interview report",
    line: "Your mock read in full, weakest answer rewritten. Emailed instantly.",
  },
  {
    id: "bundle_999",
    price: "999",
    name: "Both reports",
    saving: "Save 299",
    line: "Resume and interview as one picture. Resume part within 24 hours.",
  },
  {
    id: "resume_799",
    price: "799",
    name: "Resume and ATS report",
    line: "ATS check plus recruiter notes. Emailed within 24 hours.",
  },
];

function waLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const [choice, setChoice] = useState("bundle_999");
  const selected = REPORTS.find((r) => r.id === choice);

  const reportHref =
    PAYMENT_LINKS[choice] ||
    waLink(`Hi, I want the ${selected.name} (Rs ${selected.price}).`);

  return (
    <>
      <Head>
        <title>SiddhiAI: know why interviews are not converting</title>
        <meta
          name="description"
          content="Run a free AI mock interview, get your answers scored, and find out what is costing you offers. Reports from Rs 499."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <main className="page">
        <header className="bar">
          <a className="mark" href="/">
            <img src="/siddhi-logo.png" alt="SiddhiAI" />
          </a>
          <a className="quiet" href="/colleges">
            For colleges
          </a>
        </header>

        <section className="lede">
          <h1>Most people don’t fail the interview. They fail the answer.</h1>
          <p>See what yours is costing you.</p>
        </section>

        <section className="offers" aria-label="What we offer">
          {/* ---------------- Free ---------------- */}
          <article className="offer">
            <h2>AI mock interview</h2>
            <ul>
              <li>Three questions for your target role</li>
              <li>Scored, with your biggest gap named</li>
            </ul>
            <div className="base">
              <p className="price">Free</p>
              <a className="btn ghost" href="/start">
                Start a free mock
              </a>
            </div>
          </article>

          {/* ---------------- Reports ---------------- */}
          <article className="offer pick">
            <h2>Written diagnosis</h2>

            <div className="opts" role="radiogroup" aria-label="Choose a report">
              {REPORTS.map((r) => (
                <label
                  key={r.id}
                  className={`opt ${choice === r.id ? "on" : ""}`}
                >
                  <input
                    type="radio"
                    name="report"
                    value={r.id}
                    checked={choice === r.id}
                    onChange={() => setChoice(r.id)}
                  />
                  <span className="optname">{r.name}</span>
                  <span className="optprice">
                    ₹{r.price}
                    {r.saving ? <em>{r.saving}</em> : null}
                  </span>
                </label>
              ))}
            </div>

            <div className="base">
              <p className="fine">{selected.line}</p>
              <a className="btn solid" href={reportHref}>
                Get it for ₹{selected.price}
              </a>
            </div>
          </article>

          {/* ---------------- Intensive ---------------- */}
          <article className="offer premium">
            <h2>Interview intensive</h2>
            <ul>
              <li>Both reports included</li>
              <li>Sixty minutes live with a senior HR advisor, 14+ years</li>
              <li>Written plan within 48 hours</li>
            </ul>
            <div className="base">
              <p className="price">
                ₹4,999 <span>four seats a month</span>
              </p>
              <a className="btn solid" href={PAYMENT_LINKS.intensive_4999}>
                Book a seat
              </a>
            </div>
          </article>
        </section>

        <p className="swipe">Swipe to compare</p>

        <footer className="foot">
          <nav>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href={waLink("Hi, I have a question about SiddhiAI.")}>Contact</a>
          </nav>
        </footer>
      </main>

      <style jsx>{`
        .page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 3.4vh, 44px);
          padding: calc(18px + env(safe-area-inset-top, 0px))
            clamp(18px, 5vw, 72px)
            calc(16px + env(safe-area-inset-bottom, 0px));
          background: #0a0a0a;
          color: #f3efe6;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
          box-sizing: border-box;
        }

        .bar {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        .mark {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        .mark img {
          height: clamp(30px, 3.4vw, 42px);
          width: auto;
          display: block;
        }
        .quiet {
          color: #8e887c;
          text-decoration: none;
          font-size: 13px;
          border-bottom: 1px solid transparent;
        }
        .quiet:hover,
        .quiet:focus-visible {
          color: #f3efe6;
          border-bottom-color: #ff9933;
        }

        .lede {
          max-width: 26ch;
        }
        .lede h1 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-weight: 500;
          font-size: clamp(28px, 4.4vw, 54px);
          line-height: 1.1;
          margin: 0 0 10px;
        }
        .lede p {
          margin: 0;
          color: #99938a;
          font-size: clamp(14px, 1.25vw, 16px);
        }

        .offers {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 2vw, 32px);
          align-items: stretch;
        }

        .offer {
          display: flex;
          flex-direction: column;
          padding: clamp(18px, 2vw, 30px);
          background: #0e0e0e;
          border: 1px solid rgba(243, 239, 230, 0.09);
          box-sizing: border-box;
        }
        .offer.pick {
          background: #141210;
          border-color: rgba(255, 153, 51, 0.4);
        }
        .offer.premium {
          border-top: 3px solid #d4af37;
        }

        .offer h2 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-weight: 500;
          font-size: clamp(21px, 2.3vw, 30px);
          margin: 0 0 18px;
          line-height: 1.15;
        }

        .offer ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 12px;
        }
        .offer li {
          position: relative;
          padding-left: 17px;
          font-size: clamp(13px, 1.1vw, 15px);
          line-height: 1.55;
          color: #c6c0b4;
        }
        .offer li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.68em;
          width: 8px;
          height: 1px;
          background: #ff9933;
        }

        .opts {
          display: grid;
          gap: 8px;
        }
        .opt {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 13px;
          border: 1px solid rgba(243, 239, 230, 0.13);
          cursor: pointer;
        }
        .opt.on {
          border-color: #ff9933;
          background: rgba(255, 153, 51, 0.08);
        }
        .opt input {
          accent-color: #ff9933;
          margin: 0;
          flex: none;
        }
        .optname {
          flex: 1;
          font-size: clamp(13px, 1.1vw, 15px);
          color: #c6c0b4;
        }
        .opt.on .optname {
          color: #f3efe6;
        }
        .optprice {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(17px, 1.7vw, 21px);
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .optprice em {
          font-family: Inter, sans-serif;
          font-style: normal;
          font-size: 11px;
          color: #d4af37;
        }

        .base {
          margin-top: auto;
          padding-top: 20px;
        }
        .price {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(25px, 2.9vw, 36px);
          margin: 0 0 14px;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .price span {
          font-family: Inter, sans-serif;
          font-size: 12px;
          color: #d4af37;
        }
        .fine {
          margin: 0 0 14px;
          font-size: 12.5px;
          line-height: 1.5;
          color: #8e887c;
          min-height: 2.6em;
        }

        .btn {
          display: block;
          text-align: center;
          text-decoration: none;
          padding: 13px 14px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #ff9933;
        }
        .btn.solid {
          background: #ff9933;
          color: #0a0a0a;
        }
        .btn.ghost {
          color: #ff9933;
        }
        .btn.solid:hover,
        .btn.solid:focus-visible {
          background: #ffad5c;
        }
        .btn.ghost:hover,
        .btn.ghost:focus-visible {
          background: rgba(255, 153, 51, 0.12);
        }

        .swipe {
          display: none;
          margin: 0;
          text-align: center;
          font-size: 12px;
          color: #7d776c;
        }

        .foot {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
          justify-content: flex-end;
          align-items: center;
          border-top: 1px solid rgba(243, 239, 230, 0.09);
          padding-top: 13px;
          font-size: 12px;
          color: #7d776c;
        }
        .foot nav {
          display: flex;
          gap: 20px;
        }
        .foot a {
          color: #7d776c;
          text-decoration: none;
        }
        .foot a:hover,
        .foot a:focus-visible {
          color: #f3efe6;
        }

        :global(a:focus-visible) {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        /* Narrow laptops and tablets: keep all three side by side. */
        @media (max-width: 1100px) {
          .offers {
            gap: 14px;
          }
          .offer {
            padding: 18px;
          }
          .offer h2 {
            margin-bottom: 14px;
          }
        }

        /* Phones: still side by side, swiped horizontally. Never stacked. */
        @media (max-width: 760px) {
          .page {
            min-height: 0;
            gap: 22px;
          }
          .lede {
            max-width: none;
          }
          .offers {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            margin: 0 calc(-1 * clamp(18px, 5vw, 72px));
            padding: 2px clamp(18px, 5vw, 72px) 8px;
            scroll-padding-left: clamp(18px, 5vw, 72px);
          }
          .offers::-webkit-scrollbar {
            display: none;
          }
          .offer {
            flex: 0 0 84%;
            scroll-snap-align: center;
          }
          .offer.pick {
            order: -1;
          }
          .swipe {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
