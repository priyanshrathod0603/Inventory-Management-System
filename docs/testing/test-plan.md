# Test Plan

## 1. Scope of Automated Testing

### Critical Business Journeys Covered:
1. **Authentication**: Login, session cookie issuance, Google OAuth, email verification, password reset, rate-limiting lockout.
2. **Authorization**: Single Universal Admin Access Model (DECISION-016), granting full 38 permissions to authenticated sessions.
3. **Universal Onboarding**: Multi-business selection, draft state persistence, default warehouse initialization.
4. **Product Master & Forms**: Category hierarchy, SKU/barcode generation, Section 40 modal UX/UI validation.
5. **Inventory & Movements**: Multi-warehouse stock tracking, immutable StockMovement ledger, atomic stock adjustments and transfers.
6. **POS Sale Transaction**: Multi-item cart checkout, dynamic category filters, GST calculations, split payments, stock decrements, invoice numbering.
7. **Void & Cancellation**: Sale void with reason, inventory restock compensation, audit log entry.
8. **Sales Returns**: Partial/full item returns, credit note generation, inventory increase.
9. **Procurement**: Inward purchase invoice recording, inventory stock additions, supplier ledger update.
10. **Stock Adjustments**: Manual discrepancy adjustments with mandatory reason validation.
11. **Customer Credit**: Credit limit enforcement during checkout.

---

## 2. Test Execution Commands

```bash
# Run all backend unit & service tests
pnpm --filter @ims/api test

# Run backend integration / E2E tests
pnpm --filter @ims/api test:e2e

# Run frontend unit & component tests
pnpm --filter @ims/web test

# Run typechecks across workspace
pnpm run typecheck
```

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
