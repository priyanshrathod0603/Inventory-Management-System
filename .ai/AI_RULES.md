# AI Rules & Development Constitution

This document is the permanent constitution governing all current and future AI coding agents working on the Stock Management System (SMS) project.

## 1. Cardinal Rule: The .ai/ Project Brain is Supreme

The `.ai/` directory is the permanent single source of truth for all business requirements, architecture, technical stack decisions, database schemas, API contracts, security rules, and UI/UX design specifications.

1. **Never Assume**: Always read and verify against the `.ai/` documentation before planning, modifying code, or answering structural questions.
2. **User-Approved Decisions Win**: User-approved requirements and architectural decisions override generic AI suggestions, external prompt trends, and personal coding preferences.
3. **Preserve History**: Never delete or rewrite historical records, changelogs, or past decisions in `.ai/` files. Always update by appending and maintaining full chronological context.

---

## 2. Before Any Modification (Mandatory Pre-Flight)

Before writing or editing a single line of code or documentation, AI MUST:

1. Read `PROJECT_CONTEXT.md` for master scope and principles.
2. Read `PRODUCT_REQUIREMENTS.md` for detailed feature workflows and business rules.
3. Read `ARCHITECTURE.md` and `TECH_STACK.md` for technical boundaries.
4. Read `DATABASE.md` and `API_CONTRACTS.md` for relational schemas and endpoint contracts.
5. Read `UI_RULES.md` for locked design system, fonts, colors, and layout rules.
6. Read `SECURITY_RULES.md` and `CODING_RULES.md` for security and engineering standards.
7. Read `CURRENT_STATE.md` and `TASKS.md` to identify active stage and pending scope.
8. Inspect existing source code and directory structure to verify actual implementation reality.

---

## 3. Strict Scope & Layer Boundaries

* **Frontend vs. Backend Discipline**:
  * If a task is Backend-only: Inspect frontend contracts, but DO NOT modify frontend code.
  * If a task is Frontend-only: Inspect API contracts, but DO NOT modify backend controllers/services.
  * Cross-layer modifications require explicit justification and minimal scope.
* **Locked Visual Design System**:
  * The approved fonts (`Plus Jakarta Sans`, `IBM Plex Mono`), palette (Refined Indigo, Emerald, Amber, Rose), Top-Navigation layout, and Desktop-first scope are **STRICTLY LOCKED**.
  * Never introduce new fonts, dark themes, sidebars, mobile layouts, or neon glassmorphism.

---

## 4. Prohibition on Fake / Mock Data

* AI must NEVER generate fake business entities (fake products, fake invoices, demo numbers) or fake API success simulations when real functionality is expected.
* Render proper loading skeletons, clean empty states, or error retry states when data is absent.

---

## 5. Change Discipline & Non-Destructive Refactoring

* **Minimum Change Principle**: Make only the smallest change necessary to fulfill the authorized user request.
* **No Unsolicited "Cleanup"**: Do not refactor unrelated working components, rename files, upgrade dependencies, or restructure folders without explicit authorization.
* **No Silent Feature Removal**: Never remove fields, buttons, tables, routes, or permissions from existing specifications or code.

---

## 6. Post-Change Protocol (Mandatory After-Action)

Upon completing any development or documentation step, AI MUST:

1. Run automated tests to verify zero regressions.
2. Verify that no secrets, credentials, or `.env` files are exposed or committed.
3. Update `CURRENT_STATE.md` by appending the latest accurate state.
4. Update `TASKS.md` (move completed items to Completed; keep implementation tasks in Pending).
5. Update `CHANGELOG.md` with a chronological entry.
6. Update `SESSION_STATE.md` summarizing the session.
7. Record any newly established user decisions in `DECISIONS.md`.