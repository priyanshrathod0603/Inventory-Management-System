# Authorization & Universal Permissions

## 1. Single Universal Admin Access Model (DECISION-016)

```
User ──► Authenticated Session ──► Universal Full Permissions (All 38 System Capabilities)
```

### Access Model Overview:
* **Universal Capabilities**: All authenticated users operate with full operational capabilities across all modules (POS billing, product catalog, categories, brands, inventory adjustments, multi-warehouse transfers, batches, purchases, sales returns, ledgers, reports, and settings).
* **Super-Admin Bypass**: The `accessLevel` is standardized to `'Admin'`, granting automatic full access across all platform resources.
* **Simplified Security Model**: Eliminates role assignment bottlenecks and administrative overhead for retail and wholesale business operators.
* **Superseded Multi-Role RBAC**: Historical complex multi-role hierarchy (Admin, Manager, Cashier, Staff) and the `roles` / `role_permissions` tables have been permanently removed and superseded via migration `20260907000000_remove_role_system`.

---

## 2. Granular Permission Enforcement
* Protected API endpoints maintain explicit `@RequirePermissions('permission_code')` guards.
* The `PermissionsGuard` verifies the authenticated session and grants access based on the 38 system permissions seeded in the database.
* Unauthenticated requests are rejected with `401 Unauthorized`.

---

## 3. Historical Restrictions Superseded
* Prior restrictions limiting cashier visibility of purchase prices or restricting stock adjustments to manager PINs are marked as **SUPERSEDED (DECISION-016)**.
* Server-authoritative audit logging continues to capture operator identity, timestamps, and diff payloads for complete operational traceability.

---

## Source Reference
* Authoritative Specification: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
