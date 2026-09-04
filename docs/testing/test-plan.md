# Test Plan

## 1. Scope of Automated Testing

### Critical Business Journeys Covered:
1. **Authentication**: Login, session cookie issuance, password reset, rate-limiting lockout.
2. **Authorization**: RBAC permissions for Admin, Manager, and Cashier; masked purchase prices for cashiers.
3. **POS Sale Transaction**: Multi-item cart checkout, GST calculations, split payments, stock decrements, invoice numbering.
4. **Void & Cancellation**: Sale void with reason, inventory restock compensation, audit log entry.
5. **Sales Returns**: Partial/full item returns, credit note generation, inventory increase.
6. **Procurement**: Inward purchase invoice recording, inventory stock additions, supplier ledger update.
7. **Stock Adjustments**: Manual discrepancy adjustments with mandatory reason validation.
8. **Customer Credit**: Credit limit enforcement during checkout.

---

## 2. Test Execution Commands

```bash
# Run all backend unit & service tests
pnpm --filter @sms/api test

# Run backend integration / E2E tests
pnpm --filter @sms/api test:e2e

# Run frontend unit & component tests
pnpm --filter @sms/web test

# Run typechecks across workspace
pnpm run typecheck
```

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
