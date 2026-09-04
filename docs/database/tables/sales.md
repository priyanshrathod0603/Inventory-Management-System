# Table: `sales`

## 1. Description
The `sales` table stores completed POS checkout transactions, totals, GST calculations, and tender outcomes.

## 2. Schema Definition

```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    user_id UUID NOT NULL REFERENCES users(id),
    sale_date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    item_discount_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    order_discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    order_discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cgst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    sgst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    igst_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    change_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    due_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(30) NOT NULL,
    sale_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_customer ON sales(customer_id);
```

## 3. Relationships
* Belongs to `Customer` (`customerId`)
* Belongs to `Warehouse` (`warehouseId`)
* Belongs to `User` / Cashier (`userId`)
* Has many `SaleItem` records
* Has one `Invoice` record
* Has many `SalesReturn` records
