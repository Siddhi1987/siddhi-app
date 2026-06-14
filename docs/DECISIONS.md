# SiddhiAI Decisions Log

This file records important product, technical, business, and launch decisions.

---

## Decision 001: Account and Subscription Are Separate

Date: 2026-06-14

Decision:
SiddhiAI account will be permanent.

Subscription will be temporary.

Reason:
Users should be able to log in even after subscription expiry.

Impact:
Dashboard access must depend on active subscription, not only login status.

---

## Decision 002: Email + Password Will Be Primary Login

Date: 2026-06-14

Decision:
Email/password login will become the primary login method.

Magic link / OTP will remain fallback only.

Reason:
Magic links can create rate-limit problems and are not ideal for paid SaaS users.

Impact:
Paid users should create password after first successful payment.

---

## Decision 003: Payment Must Be Backend Verified

Date: 2026-06-14

Decision:
Frontend payment success alone must not activate subscription.

Payment must be verified using backend verification and/or Razorpay webhook signature validation.

Reason:
Security and revenue protection.

Impact:
Subscription activation must happen only after verified payment.

---

## Decision 004: Subscription Duration Is 30 Days

Date: 2026-06-14

Decision:
Paid subscription access will last 30 days from activation.

Reason:
Simple monthly plan.

Impact:
Dashboard access must check current_period_end.

---

## Decision 005: Expired Users Can Still Login

Date: 2026-06-14

Decision:
Expired users should still be allowed to log in.

Reason:
Account identity, history, and renewal path must remain available.

Impact:
Expired users see renewal screen instead of full dashboard access.

---

## Decision 006: V1 Launch Services

Date: 2026-06-14

Decision:
SiddhiAI V1 launch will focus on:

- AI Mock Interview
- AI Feedback Report
- Interview History
- Weekly Career Intelligence Newsletter

Reason:
Keep launch simple and outcome-focused.

Impact:
Do not add unnecessary features before payment/login/reporting are stable.

---

## Decision 007: No Major Code Changes Without Diagnosis

Date: 2026-06-14

Decision:
Before Codex or Claude changes code, they must first provide:

- Current flow
- Root cause
- Files involved
- Risks
- Test cases

Reason:
Avoid random fixes and regression issues.

Impact:
Diagnosis first. Implementation second.
