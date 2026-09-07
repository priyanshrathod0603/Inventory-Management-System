# Table: `stock_movements`

## 1. Description
The `stock_movements` table is the immutable chronological ledger of every inventory mutation across IMS.

## 2. Schema Definition

```sql
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    batch_id UUID REFERENCES product_batches(id),
    movement_type VARCHAR(30) NOT NULL,
    quantity DECIMAL(10, 3) NOT NULL,
    before_stock DECIMAL(10, 3) NOT NULL,
    after_stock DECIMAL(10, 3) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id UUID NOT NULL,
    reference_number VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_prod_date ON stock_movements(product_id, movement_date DESC);
CREATE INDEX idx_stock_movements_ref ON stock_movements(reference_type, reference_id);
```

## 3. Movement Types
* `OPENING`: Initial stock setup.
* `PURCHASE`: Inward stock from supplier.
* `SALE`: Outward stock deduction during POS checkout.
* `SALES_RETURN`: Restocked items returned by customer.
* `PURCHASE_RETURN`: Outward stock returned to vendor.
* `ADJUSTMENT_INCREASE` / `ADJUSTMENT_DECREASE`: Manual stock corrections.
* `TRANSFER_IN` / `TRANSFER_OUT`: Inter-warehouse reallocations.
