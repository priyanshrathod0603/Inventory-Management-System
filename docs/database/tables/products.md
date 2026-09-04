# Table: `products`

## 1. Description
The `products` table stores master product catalog data, pricing, unit definitions, and aggregated inventory balances.

## 2. Schema Definition

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    category_id UUID NOT NULL REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    unit VARCHAR(20) NOT NULL,
    purchase_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    is_tax_inclusive BOOLEAN NOT NULL DEFAULT TRUE,
    min_stock_alert DECIMAL(10, 3) NOT NULL DEFAULT 5.000,
    current_stock DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    has_batch_tracking BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
```

## 3. Relationships
* Belongs to `Category` (`categoryId`)
* Belongs to `Brand` (`brandId`, optional)
* Has many `WarehouseInventory`
* Has many `SaleItems`
* Has many `PurchaseItems`
* Has many `StockMovements`
