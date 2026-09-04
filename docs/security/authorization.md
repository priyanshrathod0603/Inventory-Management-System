# Authorization & RBAC

## 1. Role-Based Access Control Structure

```
User ──► Role ──► RolePermissions ──► Granular Permissions
```

### System Roles:
1. **Admin**: Unrestricted system administration, audit log inspection, store settings, user/role management.
2. **Manager**: Full operational access across POS, products, inventory adjustments, purchase receiving, sales returns, and reports.
3. **Cashier / Staff**: High-velocity POS billing, customer lookup, receipt printing, and WhatsApp invoice dispatch.

---

## 2. Granular Permission Enforcement
* Every protected API endpoint is tagged with `@RequirePermissions('permission_code')`.
* The `PermissionsGuard` intercepts requests, resolves the user's role from the session, and verifies capability before invoking domain logic.

---

## 3. Explicit Staff Restrictions
* Cashier / Staff roles are **STRICTLY BLOCKED** from:
  * Viewing product cost / purchase prices.
  * Performing manual stock adjustments without Manager approval.
  * Deleting products or voiding invoices without Manager PIN.
  * Viewing business net profit reports.

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
* Feature Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
