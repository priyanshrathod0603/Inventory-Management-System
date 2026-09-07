import type { AuthUser } from './auth-context';

/**
 * Permission check utilities — IMS Universal Admin Access Model
 *
 * All authenticated users receive the complete system permission catalog.
 * Therefore, hasPermission/hasAnyPermission/hasAllPermissions will always return true
 * for authenticated users in normal operation.
 *
 * IMPORTANT: Frontend permission checks are for UX guidance ONLY (hiding/disabling controls).
 * The NestJS backend remains the authoritative security enforcement boundary.
 * Never rely on frontend checks for actual security decisions.
 */

/**
 * Checks whether the current user has a specific granular permission code.
 * All authenticated users have the full permission catalog.
 */
export function hasPermission(
  user: AuthUser | null | undefined,
  permissionCode: string,
): boolean {
  if (!user) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permissionCode);
}

/**
 * Checks whether the user has AT LEAST ONE of the specified permission codes.
 * All authenticated users have the full catalog — this will always return true for authenticated users.
 */
export function hasAnyPermission(
  user: AuthUser | null | undefined,
  permissionCodes: string[],
): boolean {
  if (!user) return false;
  if (!Array.isArray(user.permissions)) return false;
  return permissionCodes.some((code) => user.permissions.includes(code));
}

/**
 * Checks whether the user has ALL of the specified permission codes.
 * All authenticated users have the full catalog — this will always return true for authenticated users.
 */
export function hasAllPermissions(
  user: AuthUser | null | undefined,
  permissionCodes: string[],
): boolean {
  if (!user) return false;
  if (!Array.isArray(user.permissions)) return false;
  return permissionCodes.every((code) => user.permissions.includes(code));
}
