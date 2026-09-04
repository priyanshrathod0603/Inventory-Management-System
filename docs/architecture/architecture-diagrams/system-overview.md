# System Architecture Diagrams

## 1. End-to-End System Context Diagram

```mermaid
graph TB
    subgraph Clients["Client Layer (Desktop Workstations / POS Counters)"]
        Browser["Next.js Web Client (apps/web)<br/>React 19 + Tailwind CSS"]
        Scanner["USB / Bluetooth Barcode Scanner"]
        Printer["58mm / 80mm ESC/POS Thermal Printer"]
    end

    subgraph Backend["API & Application Layer (apps/api)"]
        Gateway["NestJS API Gateway (/api/v1)<br/>Swagger Documentation"]
        AuthModule["Auth & Session Module"]
        SalesModule["POS & Sales Transaction Engine"]
        InvModule["Inventory & Stock Movement Engine"]
        LedgerModule["Customer & Supplier Ledger Engine"]
    end

    subgraph Data["Persistence & Storage Layer"]
        Prisma["Prisma ORM"]
        Postgres[(PostgreSQL 16+ Database)]
        Redis[(Redis 7 Session & Cache)]
    end

    Scanner -->|HID Keystrokes| Browser
    Browser -->|HTTPS / Session Cookie| Gateway
    Gateway --> AuthModule
    Gateway --> SalesModule
    Gateway --> InvModule
    Gateway --> LedgerModule

    SalesModule -->|Interactive Transaction| Prisma
    InvModule --> Prisma
    LedgerModule --> Prisma
    AuthModule --> Redis

    Prisma --> Postgres
    SalesModule -->|Direct Print Command| Printer
```

---

## 2. POS Checkout Transaction Boundary Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Cashier
    participant Web as Next.js POS UI
    participant API as NestJS SalesService
    participant DB as PostgreSQL (Prisma $transaction)
    participant Printer as Thermal Printer

    Cashier->>Web: Scan items, select Cash/UPI, press F8
    Web->>API: POST /api/v1/sales (Payload + Customer + Tender)
    activate API
    API->>DB: Begin Interactive Transaction
    activate DB
    DB-->>API: 1. Validate Available Stock
    DB-->>API: 2. Decrement warehouse_inventory
    DB-->>API: 3. Create StockMovement (SALE)
    DB-->>API: 4. Create Sale & SaleItems
    DB-->>API: 5. Create Payment & Invoice records
    DB-->>API: 6. Update Customer Ledger (if Credit)
    DB-->>API: Commit Transaction
    deactivate DB
    API-->>Web: 201 Created (Invoice & Receipt Payload)
    deactivate API
    Web->>Printer: Trigger ESC/POS Silent Print
    Web-->>Cashier: Clear Cart & Auto-Focus Barcode Input
```

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
