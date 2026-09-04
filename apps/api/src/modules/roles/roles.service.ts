import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
  { code: 'manage_roles', module: 'Administration', description: 'Manage roles and permission matrix' },
  { code: 'view_audit_logs', module: 'Administration', description: 'View system audit trails' },
  { code: 'manage_settings', module: 'Administration', description: 'Manage store settings and GST config' },
];

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultRolesAndPermissions();
  }

  /**
   * Seeds permissions and default system roles in database if missing.
   */
  async seedDefaultRolesAndPermissions(): Promise<void> {
    try {
      // 1. Seed Permissions
      for (const perm of SYSTEM_PERMISSIONS) {
        await this.prisma.permission.upsert({
          where: { code: perm.code },
          update: { module: perm.module, description: perm.description },
          create: perm,
        });
      }

      // 2. Fetch all permissions map
      const allPermissions = await this.prisma.permission.findMany();
      const permMap = new Map(allPermissions.map((p) => [p.code, p.id]));

      // 3. Define Roles
      const adminRole = await this.prisma.role.upsert({
        where: { name: 'Admin' },
        update: { description: 'Super administrator with unrestricted access', isSystem: true },
        create: { name: 'Admin', description: 'Super administrator with unrestricted access', isSystem: true },
      });

      const managerRole = await this.prisma.role.upsert({
        where: { name: 'Manager' },
        update: { description: 'Store manager with operational and inventory access', isSystem: true },
        create: { name: 'Manager', description: 'Store manager with operational and inventory access', isSystem: true },
      });

      const cashierRole = await this.prisma.role.upsert({
        where: { name: 'Cashier' },
        update: { description: 'Counter staff for billing, sales, and payments', isSystem: true },
        create: { name: 'Cashier', description: 'Counter staff for billing, sales, and payments', isSystem: true },
      });

      const staffRole = await this.prisma.role.upsert({
        where: { name: 'Staff' },
        update: { description: 'General floor staff', isSystem: true },
        create: { name: 'Staff', description: 'General floor staff', isSystem: true },
      });

      // 4. Assign Admin all permissions
      for (const perm of allPermissions) {
        await this.prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
          update: {},
          create: { roleId: adminRole.id, permissionId: perm.id },
        });
      }

      // 5. Assign Cashier permissions
      const cashierPermCodes = [
        'view_products',
        'create_sale',
        'view_sales',
        'hold_resume_bill',
        'apply_manual_discount',
        'create_sales_return',
        'view_returns',
        'view_customers',
        'create_customer',
        'record_payment',
        'view_payments',
        'reconcile_cash_drawer',
      ];

      for (const code of cashierPermCodes) {
        const permId = permMap.get(code);
        if (permId) {
          await this.prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: cashierRole.id, permissionId: permId } },
            update: {},
            create: { roleId: cashierRole.id, permissionId: permId },
          });
        }
      }

      this.logger.log('Roles and permissions seeded successfully');
    } catch (err: any) {
      this.logger.error(`Failed to seed roles and permissions: ${err.message}`);
    }
  }

  /**
   * Retrieves default role for new registrations (Cashier or Staff).
   */
  async getDefaultRole(): Promise<{ id: string; name: string }> {
    let defaultRole = await this.prisma.role.findFirst({
      where: { name: 'Cashier' },
    });

    if (!defaultRole) {
      defaultRole = await this.prisma.role.findFirst();
    }

    if (!defaultRole) {
      // Create if none exists
      defaultRole = await this.prisma.role.create({
        data: { name: 'Cashier', description: 'Default counter billing role', isSystem: true },
      });
    }

    return { id: defaultRole.id, name: defaultRole.name };
  }

  /**
   * Finds role by name.
   */
  async findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
  }
}
