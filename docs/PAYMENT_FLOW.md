# SiddhiAI Payment Flow

## Purpose

This document defines the official SiddhiAI payment and subscription activation process.

---

# Business Rule

Account and Subscription are separate.

Account:
Permanent identity.

Subscription:
Temporary access entitlement.

Users can always log in.

Dashboard access depends on active subscription.

---

# Ideal Flow

Visitor
↓
Homepage
↓
Readiness Assessment
↓
AI Readiness Report
↓
Subscription Page
↓
Razorpay Payment
↓
Payment Verification
↓
Account Creation
↓
Subscription Activation
↓
Dashboard Access

---

# Detailed Flow

## Step 1: Assessment

User completes readiness assessment.

Data captured:

- Name
- Email (optional)
- Target Interview Type
- Experience Level
- Key Challenge

---

## Step 2: Payment

User selects plan.

Current Plan:

₹499 / Month

Payment Provider:

Razorpay

---

## Step 3: Payment Verification

Payment must be verified by backend.

Verification methods:

1. Razorpay Webhook
2. Signature Validation

Frontend success page alone must NOT activate access.

---

## Step 4: Account Creation

After verified payment:

User creates:

- Email
- Password

Supabase Auth account is created.

Permanent user identity established.

---

## Step 5: Subscription Creation

System creates:

subscriptions

Fields:

- user_id
- status
- plan
- amount
- starts_at
- current_period_start
- current_period_end
- razorpay_payment_id

Relationship:

subscriptions.user_id
=
auth.users.id

---

## Step 6: Dashboard Access

Dashboard checks:

1. User authenticated
2. Active subscription exists
3. current_period_end > current date

If all conditions pass:

Access Granted

---

## Step 7: Expiry

At expiry:

Login:
Allowed

Dashboard Premium Access:
Blocked

Renew Button:
Visible

Interview Creation:
Blocked

History:
Retained

Reports:
Retained

---

## Step 8: Renewal

User pays again.

Subscription extended.

History remains intact.

Reports remain intact.

No new account required.

---

# Launch Validation Tests

Test 1

New User
→ Pay
→ Create Account
→ Dashboard Access

Expected:
PASS

---

Test 2

Logout
→ Login Again

Expected:
Dashboard Access Retained

---

Test 3

Subscription Expires

Expected:
Login Works
Dashboard Locked

---

Test 4

Renew Subscription

Expected:
Access Restored

---

# Current Launch Blocker

Need verification that:

Payment
↓
Subscription
↓
Dashboard Access

is working correctly in production.

Status:
OPEN
