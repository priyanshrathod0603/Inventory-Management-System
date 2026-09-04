# Security Architecture

## 1. Core Security Philosophy
1. **Server-Authoritative Enforcement**: The NestJS API Gateway and domain services are the sole security boundary. Client-side UI controls provide user experience guidance only.
2. **Defense in Depth**: Multi-layer security combining secure cookie session tokens, granular permission guards, DTO input allowlisting, ORM parameterized statements, and audit event recording.
3. **Zero Secret Leakage**: Plaintext passwords, authentication tokens, API credentials, and secrets are strictly excluded from logs, error responses, and version control.

---

## 2. Security Boundaries & Protection Layers

```
┌────────────────────────────────────────────────────────┐
│ 1. Network / Transport: HTTPS, CORS, Secure Cookies    │
├────────────────────────────────────────────────────────┤
│ 2. API Gateway: Rate Limiting & SessionAuthGuard       │
├────────────────────────────────────────────────────────┤
│ 3. Authorization: PermissionsGuard (@RequirePermission)│
├────────────────────────────────────────────────────────┤
│ 4. Validation: Zod DTO Allowlisting & Sanitization     │
├────────────────────────────────────────────────────────┤
│ 5. Persistence: Prisma ORM Parameterized SQL           │
├────────────────────────────────────────────────────────┤
│ 6. Observability: Immutable Audit Log with Redaction   │
└────────────────────────────────────────────────────────┘
```

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
* Architecture Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
