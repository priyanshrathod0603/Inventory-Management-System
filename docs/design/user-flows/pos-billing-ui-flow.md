# POS Billing UI Flow

## 1. Visual Layout Grid

```
┌────────────────────────────────────────────────────────┬─────────────────────────────────────────┐
│ 🔍 [F2] Scan Barcode / Search Product...               │ Customer: [Walk-in Customer ▾] [+ New]  │
├────────────────────────────────────────────────────────┼─────────────────────────────────────────┤
│ CART ITEMS (Live interactive table)                    │ BILLING SUMMARY                         │
│ • Item row (Name, SKU in mono, Qty Stepper, Line Total)│ • Subtotal / Discounts / GST Slabs      │
│ • Real-time line item discount (%)                     │ • Grand Total (Large Bold Heading)      │
│ • Instant delete button [🗑]                           ├─────────────────────────────────────────┤
│                                                        │ TENDER / PAYMENT                        │
│                                                        │ • Fast modes: Cash, UPI (QR), Card, Khata│
│                                                        │ • Paid amount & Change due display      │
├────────────────────────────────────────────────────────┼─────────────────────────────────────────┤
│ QUICK SHORTCUT TILES (Category Filter Chips)           │ [F6] Hold Bill     [F8] COMPLETE SALE   │
└────────────────────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 2. Interaction Step Progression

1. **Step 1: Product Input**: Cashier scans barcode or searches name. Item appears in cart immediately.
2. **Step 2: Cart Adjustment**: Stepper buttons or keyboard arrows change quantities.
3. **Step 3: Customer Assignment**: Optional mobile phone lookup for regular Khata customers.
4. **Step 4: Tender Selection**: Cashier selects payment method or enters cash tender.
5. **Step 5: Completion**: Cashier hits `F8` (or `Enter` in tender mode). The invoice is confirmed, inventory reduced, and thermal print dialogue invoked.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
