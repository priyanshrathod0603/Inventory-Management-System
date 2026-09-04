# Authentication Security

## 1. Password Hashing
* **Algorithm**: `Argon2id` (or `bcrypt` with work factor ≥ 12) with cryptographically secure per-user random salts.
* Plaintext passwords are never stored, logged, or returned in API responses.

## 2. Session Management
* **Cookie Token**: Sessions are managed via an `HttpOnly` cookie named `sms_session`.
* **Cookie Flags**:
  * `HttpOnly = true` (Prevents access from browser JavaScript, mitigating XSS token theft).
  * `Secure = true` (Transmitted only over HTTPS in production environments).
  * `SameSite = Strict` (Mitigates Cross-Site Request Forgery).
* **Storage**: Sessions are stored server-side in PostgreSQL / Redis with an explicit `expiresAt` timestamp.
* **Revocation**: User logout, password change, or admin account deactivation immediately deletes the server-side session record.

## 3. Brute-Force & Rate Limiting
* `/api/v1/auth/login` is rate-limited to 5 failed attempts per 15 minutes per IP/identifier before triggering exponential cooldowns.

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
