# Testing Strategy

## 1. Quality Assurance Philosophy
IMS is a business-critical system. Financial amounts, inventory quantities, and authorization checks must achieve high automated test reliability.

---

## 2. Test Pyramid & Tooling

```
      /\
     /  \     End-to-End Tests (Playwright) — POS checkout journeys
    /----\
   /      \   Integration & API Tests (Supertest) — REST endpoints & DB transactions
  /--------\
 /          \ Unit Tests (Jest) — Domain services, tax/margin math, custom hooks
/------------\
```

| Layer | Framework | Target Modules |
| :--- | :--- | :--- |
| **Backend Unit Tests** | Jest | NestJS Domain Services, Tax calculations, Stock math |
| **Backend API Tests** | Jest + Supertest | REST endpoints, Guards, DTO Validation, Prisma Rollbacks |
| **Frontend Unit Tests**| Jest + React Testing Library | Barcode scanner buffer hook, formatting utilities |
| **Frontend E2E Tests** | Playwright | Complete checkout flows (Scan -> Tender -> Receipt) |

---

## 3. Mandatory Coverage Rules
* 100% of Prisma interactive transaction boundaries must have rollback test coverage.
* 100% of protected endpoints must have authentication tests (verifying `401 Unauthorized` for unauthenticated requests) and universal admin authorization tests (verifying `200`/`201` for authenticated sessions per DECISION-016).
* Master form modals must adhere to Section 40 UX/UI standards.

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
