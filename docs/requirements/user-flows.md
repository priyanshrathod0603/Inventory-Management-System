# User Flows

This document visualizes key operational workflows across SMS / Universal Inventory Platform.

## 0. Universal Business Onboarding Flow

```mermaid
flowchart TD
    A[Start: User Registers / First Login] --> B[Redirect to /onboarding]
    B --> C[Step 1: Multi-Business Type Selection]
    C --> D[Select One or Multiple Verticals: Footwear, Clothing, etc.]
    D --> E[Step 2: Business Profile Details: Name, Phone, Address]
    E --> F[Step 3: Tax & Currency Settings: GSTIN, State]
    F --> G[Step 4: Warehouse Setup: Single or Multi-Warehouse]
    G --> H[Server: Save BusinessProfile & Provision Default Warehouse]
    H --> I[Mark isOnboardingCompleted = true]
    I --> J[Redirect to /dashboard]
```

---

## 1. High-Velocity POS Counter Checkout Flow

```mermaid
flowchart TD
    A[Start: Open POS Screen] --> B[Default: Walk-in Customer]
    B --> C{Filter Category?}
    C -- Yes --> D1[Click Dynamic Category Tab - Sourced from real inventory]
    C -- No / All --> D2[View All Products]
    D1 --> E[Scan Barcode / SKU / Click Product]
    D2 --> E
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
    G --> H[Submit Adjustment with Universal Admin Authorization]
    H --> I[Execute Adjustment: Update Stock & Log Immutable Audit Entry]
```

---

## Source Reference
* Derived from: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md), [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md), and [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
