# SiddhiAI System Architecture

## Purpose

This document provides the high-level architecture of SiddhiAI.

It should allow any engineer, AI agent, consultant, or founder to understand how the system works.

---

# Product Overview

SiddhiAI is an AI-powered interview intelligence and career readiness platform.

Primary outcome:

Help users improve interview performance through AI-powered practice and feedback.

---

# Core User Journey

Visitor
↓
Assessment
↓
Readiness Report
↓
Subscription
↓
Payment
↓
Account Creation
↓
Dashboard
↓
Mock Interview
↓
AI Feedback
↓
Interview History
↓
Renewal

---

# Technology Stack

Frontend:
Next.js (Pages Router)

Backend:
Supabase

Authentication:
Supabase Auth

Database:
PostgreSQL (Supabase)

Payments:
Razorpay

Hosting:
Vercel

Email:
TBD

---

# System Components

## Homepage

Purpose:

Convert visitors into subscribers.

Key Actions:

- Learn about SiddhiAI
- Start Assessment
- View Value Proposition

---

## Assessment Engine

Purpose:

Understand user readiness.

Captures:

- Target Interview Type
- Experience Level
- Key Challenges

Output:

Readiness Score

---

## Payment System

Purpose:

Convert assessment users into paid subscribers.

Provider:

Razorpay

Required:

- Payment Verification
- Signature Validation
- Subscription Activation

Reference:

PAYMENT_FLOW.md

---

## Authentication System

Purpose:

Identify users.

Preferred Model:

Email + Password

Fallback:

Magic Link

Reference:

AUTH_FLOW.md

---

## Subscription System

Purpose:

Control premium access.

Rules:

Active Subscription:
Access Granted

Expired Subscription:
Access Blocked
Renewal Offered

Reference:

PAYMENT_FLOW.md

---

## Dashboard

Purpose:

User command center.

Displays:

- Subscription Status
- Days Remaining
- Reports
- Interview History
- Career Intelligence

---

## Interview Engine

Purpose:

Run AI mock interviews.

Interview Types:

- HR
- Sales
- Leadership
- Management
- Fresher

Output:

AI Evaluation

---

## Reporting Engine

Purpose:

Generate improvement reports.

Metrics:

- Communication
- Confidence
- Structure
- Leadership

Output:

Interview Feedback Report

---

## History Engine

Purpose:

Track user growth.

Stores:

- Interview Attempts
- Scores
- Reports

---

## Newsletter System

Purpose:

Increase retention.

Content:

- Interview Tips
- Hiring Trends
- Career Intelligence
- Communication Improvement

---

# Database Overview

## auth.users

Purpose:

User identity.

---

## subscriptions

Purpose:

Subscription management.

Key Fields:

- user_id
- status
- plan
- current_period_start
- current_period_end

Relationship:

subscriptions.user_id
=
auth.users.id

---

## interview_history

Purpose:

Store completed interviews.

---

## reports

Purpose:

Store generated reports.

---

# Security Requirements

## Authentication

Users can only access their own data.

---

## Payments

Only verified payments activate subscriptions.

---

## Dashboard

Access controlled through subscription status.

---

# Current Launch Risks

1. Payment Activation
2. Subscription Linking
3. Authentication Flow
4. Expiry Handling
5. Confirmation Emails

Status:
UNDER REVIEW

---

# Future Architecture

Phase 2

- Resume Intelligence
- JD Match Analysis
- Career Coach

Phase 3

- Communication Intelligence Platform
- AI Career Advisor
- Multi-Agent Architecture

---

# Source Of Truth

For payment behavior:
PAYMENT_FLOW.md

For authentication:
AUTH_FLOW.md

For business decisions:
DECISIONS.md

For launch validation:
QA.md
