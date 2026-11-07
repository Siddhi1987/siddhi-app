import Head from "next/head";

const FORMSPREE = "https://formspree.io/f/mkoyyrbz";
const WHATSAPP = "919356785897";

export default function Colleges() {
  return (
    <>
      <Head>
        <title>SiddhiAI for placement cells: batch interview readiness</title>
        <meta
          name="description"
          content="Every student gets an AI mock interview and a written report. Your placement cell gets a dashboard showing which students are ready and which are not."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="robots" content="noindex" />
      </Head>

      <main className="page">
        <header className="bar">
          <a className="mark" href="/">
            <img src="/siddhi-logo.png" alt="SiddhiAI" />
          </a>
          <a className="quiet" href="/">
            For students
          </a>
        </header>

        <section className="lede">
          <h1>You find out a student wasn’t ready after the company leaves.</h1>
          <p>
            Every student runs an AI mock interview and gets a written report.
            Your placement cell gets a dashboard showing who is ready, who is
            close, and who needs work, before the recruiters arrive.
          </p>
        </section>

        <section className="cols">
          <div className="col">
            <h2>What each student gets</h2>
            <ul>
              <li>A mock interview tuned to the role they are targeting</li>
              <li>
                Scores on clarity, confidence, structure and presence, with the
                reasoning behind each
              </li>
              <li>Their weakest answer rewritten, so they can see the gap</li>
              <li>A two-week plan they can actually follow</li>
            </ul>
          </div>

          <div className="col">
            <h2>What the placement cell gets</h2>
            <ul>
              <li>Readiness spread across the whole batch, not a list of names</li>
              <li>The dimensions your batch is weakest on this year</li>
              <li>Students who need intervention, flagged early</li>
              <li>Branch and stream comparison when you run more than one batch</li>
            </ul>
          </div>

          <div className="col">
            <h2>How it runs</h2>
            <ul>
              <li>We send one link carrying your college’s name alongside ours</li>
              <li>Students complete it themselves, on a phone or a lab machine</li>
              <li>Reports go straight to each student’s email</li>
              <li>Your dashboard fills as they finish. No software to install</li>
            </ul>
          </div>
        </section>

        <section className="ask">
          <div className="askcopy">
            <h2>Run one batch as a pilot</h2>
            <p>
              Start with a single batch so your team can see the reports and the
              dashboard against students you already know. Pricing is per
              student with volume tiers, quoted against your batch size.
            </p>
            <p className="fine">
              Or speak to us on WhatsApp:{" "}
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                  "Hi, I am from a placement cell and would like to discuss a pilot."
                )}`}
              >
                +91 93567 85897
              </a>
            </p>
          </div>

          <form className="form" action={FORMSPREE} method="POST">
            <input type="hidden" name="_subject" value="College pilot request" />
            <input type="hidden" name="source" value="colleges-page" />

            <label>
              <span>College or university</span>
              <input type="text" name="college" required />
            </label>

            <label>
              <span>Your name and role</span>
              <input
                type="text"
                name="contact_name"
                placeholder="Training and Placement Officer"
                required
              />
            </label>

            <div className="row">
              <label>
                <span>Students in the batch</span>
                <input type="number" name="batch_size" min="1" required />
              </label>
              <label>
                <span>Phone</span>
                <input type="tel" name="phone" required />
              </label>
            </div>

            <label>
              <span>Email</span>
              <input type="email" name="email" required />
            </label>

            <button type="submit">Request a pilot</button>
            <p className="fine">
              We reply within two working days with a quote for your batch size.
            </p>
          </form>
        </section>

        <footer className="foot">
          <nav>
            <a href="/">Student plans</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </nav>
        </footer>
      </main>

      <style jsx>{`
        .page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          gap: clamp(18px, 3vh, 36px);
          padding: calc(14px + env(safe-area-inset-top, 0px))
            clamp(16px, 5vw, 64px)
            calc(14px + env(safe-area-inset-bottom, 0px));
          background: #0a0a0a;
          color: #f3efe6;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
          box-sizing: border-box;
        }

        .bar {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid rgba(212, 175, 55, 0.22);
          padding-bottom: 10px;
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
          max-width: 54ch;
        }
        .lede h1 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-weight: 500;
          font-size: clamp(28px, 4vw, 48px);
          line-height: 1.14;
          margin: 0 0 10px;
        }
        .lede p {
          margin: 0;
          color: #a39d91;
          font-size: clamp(14px, 1.3vw, 16.5px);
          line-height: 1.55;
        }

        .cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2.4vw, 40px);
        }
        .col h2 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-weight: 500;
          font-size: clamp(18px, 1.9vw, 23px);
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(243, 239, 230, 0.12);
        }
        .col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 9px;
        }
        .col li {
          position: relative;
          padding-left: 16px;
          font-size: clamp(13px, 1.15vw, 14.5px);
          line-height: 1.5;
          color: #cdc7ba;
        }
        .col li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.66em;
          width: 7px;
          height: 1px;
          background: #ff9933;
        }

        .ask {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 56px);
          align-items: start;
          border-top: 3px solid #d4af37;
          padding-top: clamp(18px, 2.5vh, 30px);
        }
        .askcopy h2 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-weight: 500;
          font-size: clamp(22px, 2.6vw, 32px);
          margin: 0 0 10px;
        }
        .askcopy p {
          margin: 0 0 10px;
          color: #cdc7ba;
          font-size: clamp(13.5px, 1.2vw, 15px);
          line-height: 1.55;
          max-width: 46ch;
        }

        .form {
          display: grid;
          gap: 11px;
          background: #101010;
          border: 1px solid rgba(243, 239, 230, 0.12);
          padding: clamp(16px, 1.8vw, 26px);
        }
        .form label {
          display: grid;
          gap: 5px;
        }
        .form span {
          font-size: 12.5px;
          color: #8e887c;
        }
        .form input {
          background: #0a0a0a;
          border: 1px solid rgba(243, 239, 230, 0.18);
          color: #f3efe6;
          padding: 10px 11px;
          font-size: 14px;
          font-family: inherit;
          border-radius: 0;
        }
        .form input:focus-visible {
          outline: none;
          border-color: #ff9933;
        }
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }
        .form button {
          background: #ff9933;
          color: #0a0a0a;
          border: none;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          margin-top: 3px;
        }
        .form button:hover,
        .form button:focus-visible {
          background: #ffad5c;
        }

        .fine {
          font-size: 12px;
          color: #8e887c;
          line-height: 1.45;
          margin: 0;
        }
        .fine a {
          color: #ff9933;
          text-decoration: none;
        }

        .foot {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
          justify-content: space-between;
          border-top: 1px solid rgba(243, 239, 230, 0.1);
          padding-top: 11px;
          font-size: 12px;
          color: #7d776c;
        }
        .foot nav {
          display: flex;
          gap: 18px;
        }
        .foot a {
          color: #7d776c;
          text-decoration: none;
        }
        .foot a:hover,
        .foot a:focus-visible {
          color: #f3efe6;
        }

        :global(a:focus-visible),
        :global(button:focus-visible) {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        @media (max-width: 760px) {
          .cols,
          .ask,
          .row {
            grid-template-columns: 1fr;
          }
          .page {
            min-height: 0;
          }
        }
      `}</style>
    </>
  );
}
