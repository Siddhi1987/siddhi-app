# SiddhiAI QA Checklist

## Purpose

This document defines the minimum quality checks required before deployment.

No release should happen without QA verification.

---

# P0 Launch Checks

## Payment Flow

Verify:

- Razorpay payment succeeds
- Payment verification works
- Webhook executes correctly
- Subscription row created
- Duplicate payment handling works

Status:
OPEN

---

## Authentication

Verify:

- User can create account
- Email/password login works
- Logout works
- Login again works
- Password reset works

Status:
OPEN

---

## Subscription Access

Verify:

- Active subscription unlocks dashboard
- Expired subscription blocks dashboard
- Renewal restores access
- User history preserved

Status:
OPEN

---

## Dashboard

Verify:

Dashboard displays:

- Subscription Status
- Expiry Date
- Days Remaining
- Last Interview Score

Status:
OPEN

---

## Interview Flow

Verify:

- Interview starts correctly
- Questions load
- Responses save
- AI evaluation completes
- Report generated

Status:
OPEN

---

## Interview History

Verify:

- History saves correctly
- History displays correctly
- Previous reports accessible

Status:
OPEN

---

## Email Flow

Verify:

- Welcome email
- Payment confirmation
- Expiry reminder
- Renewal confirmation

Status:
OPEN

---

# Security Checks

Verify:

- Supabase RLS policies
- Payment verification
- Unauthorized dashboard access blocked
- Environment variables protected

Status:
OPEN

---

# Release Approval Checklist

Before production deployment:

□ Payment Tested

□ Login Tested

□ Dashboard Tested

□ Interview Tested

□ Reports Tested

□ Subscription Expiry Tested

□ Renewal Tested

□ Security Reviewed

□ QA Approved

---

# QA Reporting Format

For every issue:

## Problem

## Root Cause

## Files Involved

## Risk

## Recommended Fix

## Test Cases

## Status
