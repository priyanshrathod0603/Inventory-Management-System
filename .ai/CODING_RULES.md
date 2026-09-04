# Coding Rules & Engineering Standards

## 1. Core Engineering Philosophy

1. **Production-Grade Standard**: Treat SMS as a mission-critical, production enterprise system. Prioritize correctness, transactional integrity, security, data preservation, and maintainability above quick hacks.
2. **Separation of Concerns**: Strict architectural flow:
   ```
   Frontend (Next.js / React) → REST API Layer → Backend Domain Services (NestJS) → ORM Layer (Prisma) → Database (PostgreSQL)
   ```
   Business logic belongs strictly in backend domain services, not inside UI presentation components or raw database triggers.
3. **DRY & Modular Architecture**: Build reusable components, custom hooks, DTOs, and domain services. Avoid copy-pasting business logic across multiple modules.
4. **Explicit & Readable**: Prefer explicit, self-documenting code over clever, obscure patterns. Use strongly-typed TypeScript interfaces across all layers.

---

## 2. Frontend / Backend Layer Boundaries

1. **Backend-Only Tasks**:
   * Inspect frontend code only for API contract and schema compatibility.
   * MUST NOT modify frontend components, pages, or styles unless explicitly authorized by the user.
2. **Frontend-Only Tasks**:
   * Inspect backend endpoints and DTO schemas for request/response contracts.
   * MUST NOT modify backend controllers, services, database schemas, or migrations unless explicitly authorized.
3. **Cross-Layer Tasks**:
   * When a feature genuinely requires both frontend and backend changes (e.g., adding a new field to Product), identify both layers explicitly, make the minimal necessary changes, and verify end-to-end compatibility.

---

## 3. Prohibition on Fake / Mock Business Data

The application MUST NOT use fake or simulated business records when real system functionality is expected:
* **NO** hardcoded mock products, customers, invoices, or transactions in components.
* **NO** simulated fake API responses or fake success timers in production workflows.
* When backend data is unavailable or loading, the UI must render authentic system state patterns:
  * **Loading**: Shimmering Skeletons matching target geometry.
  * **Empty**: Clean Empty State cards with actionable CTAs.
  * **Error**: Human-readable error messages with `Retry` actions.
  * **Offline/Network Error**: Clear connection status alerts.

---

## 4. Testing Strategy & Quality Assurance

All critical business workflows must maintain high automated test coverage before deployment.

### 4.1 Frontend Testing
* **Unit & Hook Tests**: Jest + React Testing Library for utility functions, custom hooks (e.g. barcode scanner buffer, tax calculators).
* **Component Tests**: Verifying form validation, input masks, table rendering, and keyboard interactions.
* **End-to-End (E2E) Tests**: Playwright covering core counter billing flows (Scan item → Add discount → Select payment → Complete sale → Verify receipt).

### 4.2 Backend Testing
* **Unit & Service Tests**: Jest tests isolating domain business logic (e.g. stock movement math, margin calculation, tax splits).
* **Integration / API Tests**: Supertest running against a test PostgreSQL instance to verify endpoint contracts, request validation, authentication guards, and RBAC permissions.
* **Database & Transaction Tests**: Verifying Prisma interactive transaction rollback behavior during simulated failure scenarios.

### 4.3 Mandatory Test Coverage Matrix
* Authentication & Session Invalidation
* Role & Granular Permission Enforcement
* POS Sale Transaction (Stock deduction + Payment + Invoice numbering)
* Sale Void / Cancellation (Stock restoration + Audit log)
* Sales Return & Credit Note Generation
* Purchase Inward Stock Receiving & Supplier Ledger Update
* Stock Adjustment Math & Mandatory Audit Reason Validation
* Inter-Warehouse Stock Transfers
* Customer Credit Limit Enforcement

---

## 5. Required AI Workflow & Pre/Post Checklists

Every development task must follow this 10-step sequence:

```
STEP 1: READ        → Read relevant .ai/ rules, requirements, and decisions.
STEP 2: INSPECT     → Inspect actual existing source files before writing code.
STEP 3: SCOPE       → Identify authorized layers (Frontend, Backend, or Database).
STEP 4: CONFLICT    → Verify compliance with locked UI, locked tech stack, and locked requirements.
STEP 5: PLAN        → Formulate a minimal, non-destructive implementation plan.
STEP 6: ASK         → If ambiguity or conflict exists, STOP AND ASK the user.
STEP 7: IMPLEMENT   → Execute only the minimal required code changes.
STEP 8: TEST        → Execute automated unit/integration tests covering affected areas.
STEP 9: VERIFY      → Ensure no UI regressions, no fake data, and no secret leakage.
STEP 10: DOCUMENT   → Update .ai/ files (CURRENT_STATE, CHANGELOG, TASKS) preserving history.
```

### Pre-Change Checklist:
- [ ] User request and scope understood.
- [ ] Relevant `.ai/` documentation reviewed.
- [ ] Existing codebase inspected; no redundant files created.
- [ ] Frontend/backend boundary respected.
- [ ] Locked UI system (colors, fonts, layout) preserved.
- [ ] Locked Tech Stack (Next.js, NestJS, PostgreSQL, Prisma) respected.

### Post-Change Checklist:
- [ ] Automated tests pass.
- [ ] Existing features and workflows remain unbroken.
- [ ] Zero fake business data or mocked API success states.
- [ ] Authorization and permission guards verified on backend.
- [ ] Error, loading, and empty states verified.
- [ ] Zero secrets or `.env` files committed.
- [ ] `.ai/` state and changelog updated by append (history preserved).

---

## 6. Absolute Prohibitions (NEVER DO)

1. **NEVER** delete historical financial transactions (Sales, Invoices, Payments, Stock Movements).
2. **NEVER** redesign approved UI, change locked fonts (`Plus Jakarta Sans`, `IBM Plex Mono`), or alter locked colors (Indigo, Emerald, Amber, Rose).
3. **NEVER** replace top navigation with a sidebar or introduce mobile layouts in Phase 1.
4. **NEVER** modify frontend files during a backend-only task or vice versa.
5. **NEVER** commit `.env`, `.env.example`, private keys, or credentials to version control.
6. **NEVER** erase historical entries in `.ai/` files (`DECISIONS.md`, `CHANGELOG.md`, `CURRENT_STATE.md`).
7. **NEVER** silently change architecture, database schemas, or API contracts without explicit documentation and user approval.