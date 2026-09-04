# Integration Testing Guide

## 1. Overview
Integration tests execute against a live PostgreSQL test database using `Supertest` to verify full HTTP request/response lifecycles, Guards, DTO pipes, and database queries.

## 2. Key Scenarios Verified
1. **Endpoint Authorization**: Testing endpoint execution with valid session cookies vs. unauthenticated requests (`401`) and unauthorized roles (`403`).
2. **Database Interactive Transactions**: Simulating mid-checkout failures (e.g. stock shortfall on item #3 of 5) and asserting that ZERO records remain in `sales` or `payments` (full rollback).
3. **Double-Entry Khata Ledgers**: Verifying that recording a customer sale and subsequent payment updates the customer's `outstandingBalance` and running ledger accurately.

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
