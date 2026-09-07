-- IMS Phase 10: Remove Multi-Role RBAC System
-- Authorized architectural change: Single Universal Admin Access Model
-- All authenticated users receive all system permissions.
-- The permissions table is preserved as the canonical permission catalog.

-- Step 1: Drop FK constraint users.roleId -> roles
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_roleId_fkey";

-- Step 2: Drop role_permissions (dependent on both roles and permissions)
DROP TABLE IF EXISTS "role_permissions";

-- Step 3: Drop roles table
DROP TABLE IF EXISTS "roles";

-- Step 4: Drop roleId column from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "roleId";
