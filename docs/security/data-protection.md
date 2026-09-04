# Data Protection & Secrets Policy

## 1. Secrets Management Policy
* **Prohibition on Git Commits**: `.env`, `.env.*`, `.env.example` containing real secrets, SSL private keys, certificates, and database backup dumps are **STRICTLY EXCLUDED** from version control via `.gitignore`.
* **Runtime Ingestion**: Secrets are injected via environment variables (`process.env.SESSION_SECRET`, `process.env.DATABASE_URL`) at deployment runtime.

## 2. PII & Financial Data Handling
* Customer phone numbers, addresses, and GSTINs are protected via role-based access.
* Product cost prices (`purchasePrice`) are automatically redacted from responses when requested by users lacking `view_purchase_price` permissions.

## 3. Log Sanitization
* All logging interceptors sanitize incoming and outgoing JSON payloads, replacing values for keys named `password`, `token`, `secret`, `pin`, `authorization`, or `creditCard` with `[REDACTED]`.

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
* Decisions Log: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
