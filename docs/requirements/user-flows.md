# User Flows

This document visualizes key operational workflows across IMS.

## 1. High-Velocity POS Counter Checkout Flow

```mermaid
flowchart TD
    A[Start: Open POS Screen] --> B[Default: Walk-in Customer]
    B --> C{Search Customer?}
    C -- Yes --> D[Type Mobile Phone / Select Customer]
    C -- No --> E[Scan Barcode / SKU]
    D --> E
    E --> F[Item Added to Cart]
    F --> G{Adjust Qty / Discount?}
    G -- Yes --> H[Update Line Item]
    G -- No --> I[Review Totals & GST]
    H --> I
    I --> J{Select Payment Method}
    J -- Cash --> K1[Enter Tendered Cash -> View Change Due]
    J -- UPI --> K2[Generate Dynamic QR -> Verify Payment]
    J -- Card/Bank --> K3[Enter Reference / Auth Code]
    J -- Credit --> K4[Check Customer Credit Limit]
    K1 --> L[Press F8 / Complete Sale]
    K2 --> L
    K3 --> L
    K4 --> L
    L --> M[Server Atomic Transaction: Deduct Stock, Record Payment, Generate Invoice #]
    M --> N[Auto-Print Thermal Receipt / WhatsApp Link]
    N --> O[Cart Reset -> Auto-Focus Barcode Input]
```

---

## 2. Sales Return & Restocking Flow

```mermaid
flowchart TD
    A[Customer Requests Return] --> B[Lookup Original Invoice #]
    B --> C[Display Invoice Line Items]
    C --> D[Select Specific Items & Return Quantities]
    D --> E[Select Return Reason: Damaged / Defective / Regret]
    E --> F[Select Refund Mode: Cash / Store Credit / Bank]
    F --> G[Submit Return Transaction]
    G --> H[Server: Increment Stock, Log Movement, Create Credit Note CN-XXXX]
    H --> I[Print Credit Note / Issue Refund]
```

---

## 3. Inward Procurement (Purchase) Flow

```mermaid
flowchart TD
    A[Receive Goods from Supplier] --> B[Open New Purchase Screen]
    B --> C[Select Supplier & Enter Vendor Invoice #]
    C --> D[Add Products, Received Quantities, Cost Price & GST]
    D --> E[Select Receiving Warehouse Location]
    E --> F[Select Payment Terms: Paid / Partial / Credit]
    F --> G[Confirm Inward Stock]
    G --> H[Server: Increment Warehouse Inventory, Log Movement PURCHASE, Update Supplier Ledger]
    H --> I[Purchase Bill Finalized]
```

---

## 4. Stock Adjustment Flow (High-Impact)

```mermaid
flowchart TD
    A[Physical Count Discrepancy / Damaged Goods Found] --> B[Open Stock Adjustment Dialog]
    B --> C[Select Product & Warehouse Location]
    C --> D[Select Adjustment Type: Increase + or Decrease -]
    D --> E[Enter Quantity to Adjust]
    E --> F[Review Visual Math: Old Stock ± Qty = Calculated New Stock]
    F --> G[Select Mandatory Reason & Enter Detailed Audit Note]
    G --> H[Manager PIN Authorization]
    H --> I[Execute Adjustment: Update Stock & Log Immutable Audit Entry]
```

---

## Source Reference
* Derived from: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md) and [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
