# Release Process

## 1. Versioning Standard
IMS follows Semantic Versioning (`MAJOR.MINOR.PATCH`):
* `MAJOR`: Breaking architectural changes or complete database restructuring.
* `MINOR`: New business modules (e.g. Sales Returns, Stock Transfers) without breaking previous API contracts.
* `PATCH`: Bug fixes, calculation optimizations, and UI refinements.

---

## 2. Pre-Release Checklist
- [ ] All automated tests pass (`pnpm run test`).
- [ ] Typechecks pass across all apps (`pnpm run typecheck`).
- [ ] Production builds succeed without warnings (`pnpm run build`).
- [ ] Database migrations tested against staging PostgreSQL instance.
- [ ] `.ai/CHANGELOG.md` and `.ai/CURRENT_STATE.md` updated.
- [ ] Pre-release database snapshot executed.

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
