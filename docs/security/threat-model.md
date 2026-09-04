# Threat Model & Mitigation Matrix

This document identifies potential security threats to SMS and documents approved mitigations.

| Threat / Vector | Risk Level | Mitigation Strategy |
| :--- | :--- | :--- |
| **Brute-Force Credential Guessing** | High | Rate-limiting on `/api/v1/auth/login` (5 attempts/15 mins), Argon2id hashing with per-user salt. |
| **Session Hijacking / XSS Token Theft** | High | `HttpOnly`, `Secure`, `SameSite=Strict` session cookies; tokens never stored in browser `localStorage`. |
| **SQL / Command Injection** | Critical | 100% Parameterized queries via Prisma ORM; zero dynamic SQL concatenation. |
| **Unauthorized Cashier Stock Manipulation** | High | Server-authoritative NestJS permission guards (`@RequirePermissions('adjust_stock')`). |
| **Orphaned / Phantom Financial Transactions** | High | Atomic interactive database transactions (`prisma.$transaction`) with automatic full rollback. |
| **Credential Exposure in Version Control** | Critical | Comprehensive `.gitignore` protecting `.env*`, `.pem`, `.key`, and database dumps. |
| **Accidental Invoice Destruction** | High | Legal document policy: Invoices cannot be deleted; only Voided/Cancelled with audit logs. |

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
