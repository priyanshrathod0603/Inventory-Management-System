-- IMS Phase 9 Final Correction: Remove deprecated manage_roles permission
-- With the multi-role RBAC system permanently removed, manage_roles is no longer part of the canonical permission catalog.

DELETE FROM "permissions" WHERE "code" = 'manage_roles';
