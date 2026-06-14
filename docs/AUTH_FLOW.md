# SiddhiAI Authentication Flow

## Purpose

This document defines how users should log in and access SiddhiAI.

---

## Core Rule

Login and subscription are separate.

Login:
Permanent account access.

Subscription:
Temporary dashboard access.

---

## Required Authentication Model

Primary login method:

Email + Password

Magic link / OTP:

Fallback only.

---

## Why Magic Link Should Not Be Primary

Magic links can hit rate limits.

This creates poor experience for paid users.

Paid users should not lose access because they requested too many login links.

---

## Ideal New User Flow

User pays
↓
Payment verified
↓
User creates email + password
↓
Supabase Auth user is created
↓
Subscription is linked to auth user ID
↓
Dashboard opens

---

## Ideal Returning User Flow

User enters email + password
↓
Supabase authenticates user
↓
Dashboard checks subscription
↓
If active: show dashboard
↓
If expired: show renewal screen

---

## Expired User Rule

Expired users should still be able to log in.

They should see:

- Subscription expired message
- Renew button
- Preserved history/reports

---

## Launch Blocker

Current auth flow must be inspected.

Need to verify:

- Whether email/password login exists
- Whether magic link is primary
- Whether paid user account is created after payment
- Whether auth user ID matches subscription user_id

Status:
OPEN
