import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Canonical system permission catalog.
 *
 * IMS uses a single universal Admin access model:
 * ALL authenticated users receive ALL permissions listed here.
 * There is no role hierarchy, role assignment, or per-user permission restriction.
 *
 * This constant is the authoritative permission vocabulary for the entire system.
 * Permission codes are used by @RequirePermissions() decorators to declare
 * endpoint capability requirements (auditing / documentation purpose).
 */
export const SYSTEM_PERMISSIONS = [
  // Products
  { code: 'view_products', module: 'Products', description: 'View product catalog and prices' },
  { code: 'create_product', module: 'Products', description: 'Create new catalog products' },
  { code: 'edit_product', module: 'Products', description: 'Edit existing products' },
  { code: 'delete_product', module: 'Products', description: 'Delete catalog products' },
  { code: 'view_purchase_price', module: 'Products', description: 'View product cost/purchase price' },
  // Inventory
  { code: 'view_inventory', module: 'Inventory', description: 'View inventory stock levels' },
  { code: 'adjust_stock', module: 'Inventory', description: 'Perform stock adjustments' },
  { code: 'transfer_stock', module: 'Inventory', description: 'Initiate inter-warehouse stock transfers' },
  { code: 'view_stock_movements', module: 'Inventory', description: 'View auditable stock movement logs' },
  { code: 'view_valuation', module: 'Inventory', description: 'View inventory valuation reports' },
  // POS & Sales
  { code: 'create_sale', module: 'Sales', description: 'Create counter POS sales and issue bills' },
  { code: 'cancel_sale', module: 'Sales', description: 'Void or cancel an existing sale invoice' },
  { code: 'view_sales', module: 'Sales', description: 'View sales invoice history' },
  { code: 'apply_manual_discount', module: 'Sales', description: 'Apply manual cart discounts' },
  { code: 'hold_resume_bill', module: 'Sales', description: 'Hold and resume counter carts' },
  // Purchases
  { code: 'view_purchases', module: 'Purchases', description: 'View purchase invoices' },
  { code: 'create_purchase', module: 'Purchases', description: 'Create purchase orders/bills' },
  { code: 'edit_purchase', module: 'Purchases', description: 'Edit purchase orders/bills' },
  { code: 'cancel_purchase', module: 'Purchases', description: 'Cancel purchase orders' },
  // Returns
  { code: 'create_sales_return', module: 'Returns', description: 'Process customer sales returns' },
  { code: 'create_purchase_return', module: 'Returns', description: 'Process supplier purchase returns' },
  { code: 'view_returns', module: 'Returns', description: 'View returns history' },
  // Customers & Suppliers
  { code: 'view_customers', module: 'Customers', description: 'View customer list and Khata' },
  { code: 'create_customer', module: 'Customers', description: 'Register new customers' },
  { code: 'edit_customer', module: 'Customers', description: 'Update customer profiles' },
  { code: 'manage_credit_limit', module: 'Customers', description: 'Set customer credit limits' },
  { code: 'view_suppliers', module: 'Suppliers', description: 'View supplier vendor master' },
  { code: 'create_supplier', module: 'Suppliers', description: 'Create new supplier accounts' },
  { code: 'edit_supplier', module: 'Suppliers', description: 'Edit supplier details' },
  // Payments
  { code: 'record_payment', module: 'Payments', description: 'Record customer/supplier payment transactions' },
  { code: 'view_payments', module: 'Payments', description: 'View payment receipts' },
  { code: 'reconcile_cash_drawer', module: 'Payments', description: 'Open/close cash drawer reconciliation' },
  // Reports
  { code: 'view_reports', module: 'Reports', description: 'View standard business reports' },
  { code: 'view_profit_reports', module: 'Reports', description: 'View sensitive profit/loss reports' },
  { code: 'export_reports', module: 'Reports', description: 'Export reports to CSV/Excel/PDF' },
  // Administration
  { code: 'manage_users', module: 'Administration', description: 'Manage employee users and access' },
  { code: 'view_audit_logs', module: 'Administration', description: 'View system audit trails' },
  { code: 'manage_settings', module: 'Administration', description: 'Manage store settings and GST config' },
];

@Injectable()
export class PermissionsSeederService implements OnModuleInit {
  private readonly logger = new Logger(PermissionsSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSystemPermissions();
  }

  /**
   * Seeds the system permission catalog into the database.
   * All permissions listed in SYSTEM_PERMISSIONS are upserted on startup.
   * Every authenticated user receives the full catalog — no role assignment needed.
   */
  async seedSystemPermissions(): Promise<void> {
    try {
      for (const perm of SYSTEM_PERMISSIONS) {
        await this.prisma.permission.upsert({
          where: { code: perm.code },
          update: { module: perm.module, description: perm.description },
          create: perm,
        });
      }
      this.logger.log(`System permission catalog seeded: ${SYSTEM_PERMISSIONS.length} permissions`);
    } catch (err: any) {
      this.logger.error(`Failed to seed system permissions: ${err.message}`);
    }
  }

  /**
   * Returns the full permission catalog as an array of codes.
   * Used by session validation to grant all permissions to every authenticated user.
   */
  async getAllPermissionCodes(): Promise<string[]> {
    const permissions = await this.prisma.permission.findMany({
      select: { code: true },
    });
    return permissions.map((p) => p.code);
  }
}
