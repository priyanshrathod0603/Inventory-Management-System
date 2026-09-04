# Security Rules & Protection Standards

## 1. Authentication & Session Security

1. **Single Common Authentication Model**:
   * All users authenticate through the single common login entry point (`/login`, `POST /api/v1/auth/login`). There are NO separate Admin, Manager, Staff, or role-specific login pages or endpoints.
   * Single common user registration entry point (`/register`, `POST /api/v1/auth/register`).
2. **Password Hashing & Credentials Protection**:
   * All passwords must be hashed using strong, salted algorithms (`Argon2id` or `bcrypt` with work factor ≥ 12).
   * Plaintext passwords must NEVER be saved, logged, cached, transmitted unencrypted, or exposed in any API response or error trace.
3. **Session Cookie Security**:
   * Sessions must be managed via secure cookies named `sms_session`.
   * Cookies MUST enforce: `HttpOnly = true`, `Secure = true` (in production/HTTPS), and `SameSite = Strict` (or `Lax` where justified).
   * Sessions must be invalidated immediately on server upon user logout, password reset, or account deactivation.
   * Do NOT store authentication tokens in browser `localStorage` or `sessionStorage`.
4. **Google OAuth & Email Verification Security (Planned)**:
   * Google OAuth ID tokens must be cryptographically verified on the backend via official Google Auth libraries before session creation.
   * Email verification tokens must be cryptographically secure, time-limited, and single-use.
5. **Brute Force & Rate Limiting**:
   * Rate limiting must be enforced on `/api/v1/auth/login` and `/api/v1/auth/register` (max 5 failed attempts per 15 minutes per IP/username before temporary lockout).
   * Sensitive API endpoints (password resets, payment reversals, manual stock adjustments) must enforce rate limiting and throttling.
6. **Implementation Deferral**:
   * Full implementation of authentication, sessions, OAuth, verification, and RBAC guards is scheduled strictly for Phase 6.

---

## 2. Server-Authoritative Authorization & RBAC

1. **Server as Sole Security Boundary**:
   * Frontend permission checks, hidden buttons, and disabled UI elements are strictly for **user experience guidance**.
   * The NestJS backend MUST independently authorize every incoming request using NestJS `Guards` and verify role permissions against the database/session cache.
2. **Granular Permission Checks**:
   * Endpoints must be protected by explicit permission guards (e.g. `@RequirePermissions('create_sale')`, `@RequirePermissions('adjust_stock')`).
   * Never rely on coarse role name string checks alone.
3. **Least Privilege Enforcement**:
   * **Cashier / Staff Restrictions**: Cashiers must never be authorized to view product cost/purchase prices, perform unrestricted stock adjustments, delete products, access system settings, or delete/void invoices without manager PIN approval.
   * Database credentials and service accounts must operate with minimal necessary table permissions.

---

## 3. Data Integrity & Financial Mistake Protection

1. **Zero Silent Deletion for Financial Records**:
   * Invoices, Sales, Purchases, Stock Movements, Payments, and Ledger entries must NEVER be deleted via standard CRUD operations.
   * Rectifications must execute via auditable business workflows: **Invoice Voiding / Cancellation** (with mandatory reason and manager authorization) or **Sales/Purchase Returns**.
2. **Transactional Boundary Protection**:
   * Multi-table state mutations (Sales checkout, Purchase receiving, Stock adjustments) must execute within atomic database transactions (`prisma.$transaction`).
   * If any step fails, all intermediate mutations must rollback completely to prevent partial financial or stock states.
3. **Negative Stock Enforcement**:
   * Disallow negative stock by default during POS billing to prevent inventory phantom states.

---

## 4. Input Validation, Injection & Output Encoding

1. **Input Validation (Allowlist Principle)**:
   * All incoming API request bodies, query parameters, and route parameters must be strictly validated using schema validators (`Zod` / `class-validator` DTOs).
   * Unknown or malformed payload fields must be stripped or rejected (`400 Bad Request`).
2. **SQL & Command Injection Prevention**:
   * All database queries must execute via Prisma ORM parameterized statements. Dynamic raw SQL concatenation is strictly forbidden.
3. **Cross-Site Scripting (XSS) Prevention**:
   * Next.js React JSX auto-escapes string output. Avoid `dangerouslySetInnerHTML`.
   * Server responses must sanitize and encode all user-supplied text.
4. **Cross-Site Request Forgery (CSRF)**:
   * Secure SameSite cookie configuration combined with custom request headers (`X-Requested-With` / JSON content type validation) to protect against cross-origin state-changing attacks.

---

## 5. Audit Logging & Zero Secret Leakage

1. **Immutable Audit Trail**:
   * The system must record every security and financial event in `audit_logs` (User, Action, Entity, Module, Timestamp, IP Address, Diff payload).
2. **Zero Secret Logging (Absolute Rule)**:
   * Passwords, authentication tokens, API keys, session cookies, and full credit card details must NEVER appear in:
     * Server application logs
     * Audit log JSON payloads
     * Database error messages
     * Client-facing error responses
   * Automated logging interceptors must sanitize and redact sensitive key names (`password`, `token`, `secret`, `authorization`, `pin`).

---

## 6. Environment & Git Repository Security

1. **Prohibition on Committing Secrets**:
   * **NEVER** commit `.env`, `.env.development`, `.env.staging`, `.env.production`, or `.env.example` containing real secrets to version control.
   * Private keys, certificates, database credentials, and local database dumps must be excluded via `.gitignore`.
2. **Environment Variable Ingestion**:
   * Secrets must be supplied via secure environment variables or secret managers at runtime.
3. **Git Safety & Control Policy**:
   * All staging, commit, and push operations are strictly controlled by the human.
   * Automated/unauthorized `git add`, `git commit`, `git push`, or destructive operations (`git reset --hard`, `git clean`) by AI are strictly forbidden.

---

## 7. Backup & Disaster Recovery Security

1. **Backup Encryption**:
   * Database backups (`pg_dump`) must be encrypted using AES-256 before storage on local or backup media.
2. **Restore Authorization**:
   * Database restore operations require high-privilege administrative credentials, explicit confirmation, and generate mandatory audit records.