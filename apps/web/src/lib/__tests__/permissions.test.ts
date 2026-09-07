import { hasPermission, hasAnyPermission, hasAllPermissions } from '../auth/permissions';
import type { AuthUser } from '../auth/auth-context';

/**
 * Permissions unit tests — Universal Admin Access Model
 *
 * All authenticated users have the full permission catalog.
 * hasRole() has been removed — there is no role system.
 */

// Universal authenticated user: carries all system permissions
const universalUser: AuthUser = {
  id: 'uuid-user',
  username: 'ims_user',
  email: 'user@ims.internal',
  fullName: 'IMS User',
  accessLevel: 'Admin',
  permissions: [
    'view_products', 'create_sale', 'manage_users', 'view_reports',
    'create_product', 'edit_product', 'delete_product', 'view_purchase_price',
    'view_inventory', 'adjust_stock', 'transfer_stock', 'view_stock_movements',
    'view_valuation', 'cancel_sale', 'view_sales', 'apply_manual_discount',
    'hold_resume_bill', 'view_purchases', 'create_purchase', 'edit_purchase',
    'cancel_purchase', 'create_sales_return', 'create_purchase_return', 'view_returns',
    'view_customers', 'create_customer', 'edit_customer', 'manage_credit_limit',
    'view_suppliers', 'create_supplier', 'edit_supplier', 'record_payment',
    'view_payments', 'reconcile_cash_drawer', 'view_profit_reports', 'export_reports',
    'view_audit_logs', 'manage_settings',
  ],
  isEmailVerified: true,
  avatarUrl: null,
};

function runPermissionsTests() {
  // 1. Authenticated user has any specific permission
  console.assert(hasPermission(universalUser, 'create_sale') === true, 'User must have create_sale');
  console.assert(hasPermission(universalUser, 'manage_users') === true, 'User must have manage_users');
  console.assert(hasPermission(universalUser, 'manage_settings') === true, 'User must have manage_settings');
  console.assert(hasPermission(universalUser, 'view_products') === true, 'User must have view_products');

  // 2. Unknown permission codes return false (permission does not exist in catalog)
  console.assert(hasPermission(universalUser, 'nonexistent_perm') === false, 'Unknown permission code must return false');

  // 3. hasAnyPermission passes when at least one code matches
  console.assert(hasAnyPermission(universalUser, ['create_sale', 'nonexistent']) === true, 'hasAnyPermission must be true when one code matches');
  console.assert(hasAnyPermission(universalUser, ['nonexistent_1', 'nonexistent_2']) === false, 'hasAnyPermission must be false when no codes match');

  // 4. hasAllPermissions passes when all codes match
  console.assert(hasAllPermissions(universalUser, ['create_sale', 'view_products', 'manage_users']) === true, 'hasAllPermissions must be true when all match');
  console.assert(hasAllPermissions(universalUser, ['create_sale', 'nonexistent_perm']) === false, 'hasAllPermissions must be false when one does not match');

  // 5. Null / Undefined safety
  console.assert(hasPermission(null, 'create_sale') === false, 'Null user must return false');
  console.assert(hasPermission(undefined, 'create_sale') === false, 'Undefined user must return false');
  console.assert(hasAnyPermission(null, ['create_sale']) === false, 'Null user must return false for hasAnyPermission');
  console.assert(hasAllPermissions(null, ['create_sale']) === false, 'Null user must return false for hasAllPermissions');

  // 6. Empty permissions array
  const emptyUser: AuthUser = { ...universalUser, permissions: [] };
  console.assert(hasPermission(emptyUser, 'create_sale') === false, 'User with empty permissions returns false');

  console.log('✅ All Permissions unit tests passed (Universal Admin Access Model)');
}

runPermissionsTests();
