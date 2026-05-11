# SIDDHI — Complete & Ready to Run

Everything is already built. **No code to paste. No files to edit.** Just 2 commands.

---

## 🚀 Run on your laptop

Open Command Prompt inside this folder (type `cmd` in the folder's address bar) and run:

```
npm install
```
Wait 2–3 minutes for it to finish.

Then:
```
npm run dev
```

Open Chrome → **http://localhost:3000**

You'll see the live SIDDHI site with:
- 🏠 Landing page with hero, features, pricing
- 🎯 Interview Coach (`/interview`) — 5 roles, 3 questions each, mock AI feedback
- 💳 Payment page (`/payment`) — Razorpay integrated, demo mode by default
- 📜 Privacy Policy (`/privacy`)
- 📜 Terms & Conditions (`/terms`)

To stop the server: press `Ctrl + C` in the command prompt.

---

## ✏️ To customize later (optional)

| What | Where |
|---|---|
| Change colors | `tailwind.config.js` |
| Edit landing page text | `pages/index.jsx` |
| Add interview questions | `pages/interview.jsx` (top of file, `QUESTIONS` object) |
| Change pricing | `pages/payment.jsx` (top of file, `PLANS` array) |
| Update Privacy / Terms | `pages/privacy.jsx`, `pages/terms.jsx` |

---

## 💳 To enable real Razorpay payments

The payment page works in **demo mode** by default — it shows a popup instead of opening Razorpay.

To accept real payments:

1. Sign up at https://razorpay.com (free)
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy your Key ID (starts with `rzp_test_`)
4. Open `.env.example` → rename it to `.env.local` → paste your key:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
   ```
5. Stop the server (`Ctrl + C`) and run `npm run dev` again

---

## 🌐 To deploy to siddhiai.in

Once you're happy with how it looks locally:

1. **Push to GitHub** (use GitHub Desktop app — easiest)
2. **Sign up at vercel.com** with your GitHub account
3. **Import the repo** → Vercel auto-deploys in 2 min
4. **Add domain** in Vercel → paste DNS records into BigRock control panel
5. Done. https://siddhiai.in is live.

Detailed steps available — just ask Claude when ready.

---

**🙏 Built with intention. Rooted in heritage. Powered by AI.**
