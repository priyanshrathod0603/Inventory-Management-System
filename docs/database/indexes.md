# Database Indexes & Performance Optimization

## 1. High-Performance Index Catalog

```sql
-- Product Catalog & POS Barcode Lookups (< 5ms response time)
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;

-- Real-time Stock Movement Ledger
CREATE INDEX idx_stock_movements_prod_date ON stock_movements(productId, movementDate DESC);
CREATE INDEX idx_stock_movements_ref ON stock_movements(referenceType, referenceId);

-- Sales & Invoices
CREATE INDEX idx_sales_date ON sales(saleDate DESC);
CREATE INDEX idx_sales_customer ON sales(customerId);
CREATE INDEX idx_invoices_number ON invoices(invoiceNumber);

-- Double-Entry Ledger History Lookups
CREATE INDEX idx_customer_ledger_cust_date ON customer_ledger(customerId, transactionDate DESC);
CREATE INDEX idx_supplier_ledger_supp_date ON supplier_ledger(supplierId, transactionDate DESC);

-- Batch Expiry & Out-of-Stock Alert Checks
CREATE INDEX idx_batches_expiry ON product_batches(expiryDate) WHERE quantity > 0;
CREATE INDEX idx_notifications_unread ON notifications(isRead) WHERE isRead = FALSE;
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```

---

## 2. Performance Design Rationale
* **Partial Indexes**: Used on `product_batches` and `notifications` to only index active batches and unread alerts, minimizing index tree sizes.
* **Compound Indexes**: Used on `(customerId, transactionDate DESC)` for sub-millisecond Khata ledger loading.

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
