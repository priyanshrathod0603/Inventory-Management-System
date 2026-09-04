# Authentication Security

## 1. Single Common Authentication Model
* **One Common Login Entry Point**: All users (Admin, Manager, Cashier, Staff, etc.) authenticate through the single common `/login` entry point. There are NO role-specific login pages or endpoints.
* **One Common Signup Flow**: Unified `/register` flow for account registration.
* **Planned Authentication Methods**: Email + Password, Google Authentication (Google OAuth 2.0 / Sign-In), and Email Verification.
* **Separation of Concerns**: Authentication verifies identity. Downstream authorization (RBAC) governs permissions inside the application.

## 2. Password Hashing
* **Algorithm**: `Argon2id` (or `bcrypt` with work factor ≥ 12) with cryptographically secure per-user random salts.
* Plaintext passwords are never stored, logged, or returned in API responses.

## 3. Session Management
* **Cookie Token**: Sessions are managed via an `HttpOnly` cookie named `sms_session`.
* **Cookie Flags**:
  * `HttpOnly = true` (Prevents access from browser JavaScript, mitigating XSS token theft).
  * `Secure = true` (Transmitted only over HTTPS in production environments).
  * `SameSite = Strict` (Mitigates Cross-Site Request Forgery).
* **Storage**: Sessions are stored server-side in PostgreSQL / Redis with an explicit `expiresAt` timestamp.
* **Revocation**: User logout, password change, or admin account deactivation immediately deletes the server-side session record.

## 4. Brute-Force & Rate Limiting
* `/api/v1/auth/login` and `/api/v1/auth/register` are rate-limited to 5 failed attempts per 15 minutes per IP/identifier before triggering exponential cooldowns.

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
