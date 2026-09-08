# API Contracts & REST API Specification

## 1. Global API Conventions & Standards

* **Base URL**: `/api/v1`
* **Transport**: HTTPS (in production), JSON payloads (`Content-Type: application/json`).
* **Authentication**: Cookie-based session (`sms_session`) validated via server-side session store.
* **Authorization**: Granular permission checks evaluated per endpoint via NestJS `Guards` (`@RequirePermissions('create_sale')`).
* **Standard Pagination & Sorting Parameters**:
  * `page`: Integer (default `1`, min `1`)
  * `limit`: Integer (default `25`, max `100`)
  * `sortBy`: String (column name e.g. `createdAt`, `name`, `saleDate`)
  * `sortOrder`: `asc` | `desc` (default `desc`)
  * `search`: String (searches across name, SKU, barcode, phone, invoiceNumber)

### Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 1420,
    "totalPages": 57
  },
  "message": "Operation completed successfully"
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `422`, `500`):
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Requested quantity exceeds available inventory in Main Warehouse",
    "details": [
      { "productId": "uuid-1", "available": 2.0, "requested": 5.0 }
    ]
  }
}
```

---

## 2. Authentication & Session Endpoints (`/auth`)

> **Architectural Standard**: IMS utilizes **ONE Single Common Authentication System** with a **Single Universal Admin Access Model (DECISION-016)**. All authenticated users operate with full operational permissions across the platform. There are no separate role-specific login/registration endpoints.

### `POST /api/v1/auth/login`
* **Purpose**: Universal common login endpoint for all users. Authenticates credentials and issues secure HttpOnly session cookie.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "identifier": "admin_user",
    "password": "Password123!",
    "rememberMe": true
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "username": "admin_user",
        "email": "admin@example.com",
        "fullName": "Store Administrator",
        "accessLevel": "Admin",
        "permissions": ["create_sale", "view_products", "manage_inventory", "view_sales", "...all 38 permissions"]
      }
    }
  }
  ```

### `POST /api/v1/auth/register`
* **Purpose**: Universal common user registration endpoint.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "username": "rahul_cashier",
    "password": "Password123!"
  }
  ```
* **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Registration successful. Please verify your email.",
      "userId": "uuid"
    }
  }
  ```

### `GET /api/v1/auth/google`
* **Purpose**: Initiate Google OAuth 2.0 authorization-code redirect flow with CSRF state protection.
* **Permission**: Public
* **Response (`302 Redirect`)**: Redirects browser to `accounts.google.com/o/oauth2/v2/auth` with `client_id`, `redirect_uri`, `scope`, and `state`. Sets secure HttpOnly `google_oauth_state` cookie.

### `GET /api/v1/auth/google/callback`
* **Purpose**: OAuth 2.0 redirect callback endpoint. Exchanges authorization code, cryptographically verifies ID token via `google-auth-library`, provisions/links user account, creates session, and redirects to frontend application.
* **Permission**: Public
* **Query Params**: `code` (string), `state` (string), `error` (string, optional)
* **Response (`302 Redirect`)**: Sets HttpOnly `sms_session` cookie and redirects to `${FRONTEND_URL}/` (or `/login?error=...` on failure).

### `POST /api/v1/auth/google`
* **Purpose**: Google OAuth ID token verification (for Google Identity Services / One-Tap / programmatic clients).
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "idToken": "google_oauth_id_token_string"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@gmail.com",
        "fullName": "Google User",
        "accessLevel": "Admin",
        "permissions": ["create_sale", "view_products", "manage_inventory", "...all 38 permissions"]
      }
    }
  }
  ```

### `POST /api/v1/auth/verify-email-link`
* **Purpose**: Email verification endpoint validating cryptographic link token.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "token": "email_verification_token_string"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Email successfully verified."
    }
  }
  ```

### `POST /api/v1/auth/verify-email-otp`
* **Purpose**: Email verification endpoint validating 6-digit OTP code.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otpCode": "123456"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Email successfully verified."
    }
  }
  ```

### `POST /api/v1/auth/resend-verification`
* **Purpose**: Resend email verification token & OTP code via Gmail SMTP.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Verification email sent if account exists."
    }
  }
  ```

### `POST /api/v1/auth/forgot-password`
* **Purpose**: Request a password reset link sent via Gmail SMTP. Preserves anti-enumeration response.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "If an account exists with this email, a password reset link has been sent."
    }
  }
  ```

### `POST /api/v1/auth/reset-password`
* **Purpose**: Reset user password using verified one-time token and invalidates all active sessions.
* **Permission**: Public
* **Request Body**:
  ```json
  {
    "token": "password_reset_token_hex",
    "newPassword": "NewSecurePassword123!"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password has been reset successfully. Please sign in with your new password."
    }
  }
  ```

### `POST /api/v1/auth/logout`
* **Purpose**: Invalidate current session on server and clear authentication cookie.
* **Permission**: Authenticated

### `GET /api/v1/auth/me`
* **Purpose**: Fetch current authenticated user profile and all system permissions.
* **Permission**: Authenticated
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "username": "admin_user",
      "email": "admin@example.com",
      "fullName": "Store Administrator",
      "accessLevel": "Admin",
      "permissions": ["create_sale", "view_products", "manage_inventory", "view_sales", "...all 38 permissions"]
    }
  }
  ```

---

## 3. Product Catalog Endpoints (`/products`, `/categories`, `/brands`)

### `GET /api/v1/products`
* **Purpose**: Query paginated product catalog with category, brand, and stock status filters.
* **Permission**: `view_products`
* **Query Params**: `page`, `limit`, `search`, `categoryId`, `brandId`, `stockStatus` (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`), `warehouseId`.
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Basmati Rice 5kg",
        "sku": "SKU-1049",
        "barcode": "8901024001",
        "category": { "id": "uuid", "name": "Grains" },
        "brand": { "id": "uuid", "name": "India Gate" },
        "unit": "Bags",
        "purchasePrice": 450.00,
        "sellingPrice": 580.00,
        "mrp": 620.00,
        "taxRate": 5.00,
        "currentStock": 140.000,
        "minStockAlert": 10.000,
        "stockStatus": "IN_STOCK",
        "isActive": true
      }
    ]
  }
  ```
  *(Note: `purchasePrice` is masked and omitted if user lacks `view_purchase_price` permission).*

### `GET /api/v1/products/barcode/:barcode`
* **Purpose**: Ultra-fast POS barcode lookup.
* **Permission**: `view_products`

### `POST /api/v1/products`
* **Purpose**: Create a new product with opening stock and tax configuration.
* **Permission**: `create_product`
* **Request Body**:
  ```json
  {
    "name": "Fortune Sunlite Oil 1L",
    "sku": "SKU-2091",
    "barcode": "890123456789",
    "categoryId": "uuid-cat",
    "brandId": "uuid-brand",
    "unit": "Bottles",
    "purchasePrice": 130.00,
    "sellingPrice": 165.00,
    "mrp": 180.00,
    "taxRate": 5.00,
    "isTaxInclusive": true,
    "minStockAlert": 5.000,
    "initialOpeningStock": 50.000,
    "warehouseId": "uuid-wh"
  }
  ```

---

## 4. POS & Counter Sales Endpoints (`/sales`)

### `POST /api/v1/sales`
* **Purpose**: Execute atomic counter sale transaction (Invoice + Stock deduction + Payment + Customer Ledger).
* **Permission**: `create_sale`
* **Request Body**:
  ```json
  {
    "customerId": "uuid-cust",
    "warehouseId": "uuid-wh",
    "orderDiscountPercent": 5.00,
    "orderDiscountAmount": 60.00,
    "items": [
      {
        "productId": "uuid-prod-1",
        "batchId": null,
        "quantity": 2.000,
        "unitPrice": 420.00,
        "discountAmount": 0.00,
        "taxRate": 5.00
      },
      {
        "productId": "uuid-prod-2",
        "batchId": null,
        "quantity": 1.000,
        "unitPrice": 275.00,
        "discountAmount": 40.00,
        "taxRate": 18.00
      }
    ],
    "payments": [
      {
        "paymentMethod": "UPI",
        "amount": 1140.00,
        "transactionReference": "UPI-1234567890"
      }
    ],
    "notes": "Counter sale"
  }
  ```
* **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "saleId": "uuid-sale",
      "invoiceNumber": "INV-2026-001092",
      "grandTotal": 1140.00,
      "paidAmount": 1140.00,
      "changeAmount": 0.00,
      "paymentStatus": "PAID",
      "invoice": {
        "id": "uuid-inv",
        "invoiceNumber": "INV-2026-001092",
        "pdfUrl": "/api/v1/invoices/INV-2026-001092/pdf",
        "thermalPayload": "..."
      }
    }
  }
  ```

### `POST /api/v1/sales/:id/void`
* **Purpose**: Cancel/void a sale invoice, restock inventory, issue refund record, and log mandatory audit entry.
* **Permission**: `cancel_sale`
* **Request Body**:
  ```json
  {
    "reason": "Cashier Billing Mistake",
    "notes": "Customer cancelled order at billing counter",
    "managerPin": "1234"
  }
  ```

### `POST /api/v1/sales/held-bills` & `GET /api/v1/sales/held-bills`
* **Purpose**: Park active cart (`F6`) and list/resume active held carts (`F7`).
* **Permission**: `hold_resume_bill`

---

## 5. Sales Returns & Credit Notes (`/sales/returns`)

### `POST /api/v1/sales/returns`
* **Purpose**: Process customer goods return, restock inventory, and generate credit note.
* **Permission**: `create_sales_return`
* **Request Body**:
  ```json
  {
    "saleId": "uuid-sale",
    "warehouseId": "uuid-wh",
    "reason": "Defective / Leaking Package",
    "refundMethod": "CASH",
    "items": [
      {
        "saleItemId": "uuid-item",
        "productId": "uuid-prod",
        "quantity": 1.000,
        "refundAmount": 275.00
      }
    ]
  }
  ```
* **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "returnNumber": "CN-2026-00045",
      "totalRefundAmount": 275.00,
      "status": "COMPLETED"
    }
  }
  ```

---

## 6. Procurement & Purchases (`/purchases`)

### `POST /api/v1/purchases`
* **Purpose**: Record supplier purchase bill, inward inventory into warehouse, and update supplier ledger.
* **Permission**: `create_purchase`
* **Request Body**:
  ```json
  {
    "supplierId": "uuid-supp",
    "supplierInvoiceNumber": "SUPP-INV-8812",
    "warehouseId": "uuid-wh",
    "purchaseDate": "2026-09-04",
    "items": [
      {
        "productId": "uuid-prod",
        "batchNumber": "BATCH-2026-09",
        "expiryDate": "2027-09-01",
        "quantity": 100.000,
        "purchasePrice": 130.00,
        "taxRate": 5.00
      }
    ],
    "paidAmount": 5000.00,
    "paymentMethod": "BANK_TRANSFER",
    "notes": "Direct distributor delivery"
  }
  ```

---

## 7. Inventory & Stock Traceability (`/inventory`)

### `GET /api/v1/inventory/movements`
* **Purpose**: Query immutable historical stock movements ledger with entity references.
* **Permission**: `view_stock_movements`
* **Query Params**: `productId`, `warehouseId`, `movementType`, `startDate`, `endDate`.

### `POST /api/v1/inventory/adjustments`
* **Purpose**: High-impact stock correction (increases or decreases) with mandatory audit reason.
* **Permission**: `adjust_stock`
* **Request Body**:
  ```json
  {
    "productId": "uuid-prod",
    "warehouseId": "uuid-wh",
    "adjustmentType": "DECREASE",
    "quantity": 5.000,
    "reasonCategory": "DAMAGED_GOODS",
    "notes": "Water leakage in shelf B-4"
  }
  ```

### `POST /api/v1/inventory/transfers`
* **Purpose**: Transfer inventory stock between warehouses.
* **Permission**: `transfer_stock`

---

## 8. Customers & Suppliers (`/customers`, `/suppliers`)

### `GET /api/v1/customers/:id/ledger`
* **Purpose**: Retrieve double-entry Khata ledger for a customer.
* **Permission**: `view_customers`

### `POST /api/v1/customers/:id/payments`
* **Purpose**: Record customer debt settlement payment against outstanding balance.
* **Permission**: `record_payment`

---

## 9. Reports & Analytics (`/reports`)

### `GET /api/v1/reports/dashboard-summary`
* **Purpose**: Real-time KPI metrics for Operations Dashboard.
* **Permission**: `view_reports`

### `GET /api/v1/reports/sales`
* **Purpose**: Daily/monthly sales reports with category and product aggregates.
* **Permission**: `view_reports`

### `GET /api/v1/reports/profit-loss`
* **Purpose**: Comprehensive profit calculations (Revenue - Cost of Goods Sold).
* **Permission**: `view_profit_reports`

---

## 10. Audit Logs & System Settings (`/audit-logs`, `/settings`)

### `GET /api/v1/audit-logs`
* **Purpose**: Query system audit trail with user, module, and diff filters.
* **Permission**: `view_audit_logs`

### `GET /api/v1/settings` & `PUT /api/v1/settings/:group`
* **Purpose**: Read and update store configurations.
* **Permission**: `manage_settings`

---

## 11. Business Profile & Onboarding Endpoints (`/business-profile`)

### `GET /api/v1/business-profile`
* **Purpose**: Fetch the active authenticated user's `BusinessProfile` entity.
* **Permission**: Authenticated
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "userId": "uuid",
      "businessName": "Apex Retail Store",
      "businessType": "FOOTWEAR,CLOTHING",
      "customBusinessType": null,
      "ownerName": "Priyansh",
      "phone": "+91 9876543210",
      "whatsapp": "+91 9876543210",
      "email": "contact@apexretail.com",
      "website": "https://apexretail.com",
      "address": "123 Commercial Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "postalCode": "400001",
      "logoUrl": null,
      "isGstRegistered": true,
      "gstin": "27AAPFU0939F1ZV",
      "taxNumber": null,
      "currency": "INR",
      "currencySymbol": "₹",
      "isMultiWarehouse": false,
      "isOnboardingCompleted": true,
      "onboardingStep": 4
    }
  }
  ```

### `PUT /api/v1/business-profile`
* **Purpose**: Upsert / update the authenticated user's business profile data.
* **Permission**: Authenticated
* **Request Body**: Partial or complete `BusinessProfileDto` payload.

### `POST /api/v1/business-profile/complete-step`
* **Purpose**: Save step progress during multi-step onboarding wizard (`/onboarding`).
* **Permission**: Authenticated
* **Request Body**:
  ```json
  {
    "step": 1,
    "data": {
      "businessType": "FOOTWEAR,CLOTHING"
    }
  }
  ```

### `POST /api/v1/business-profile/complete-onboarding`
* **Purpose**: Finalize onboarding wizard, mark `isOnboardingCompleted = true`, and provision default warehouse if not present.
* **Permission**: Authenticated
* **Request Body**:
  ```json
  {
    "businessName": "Apex Retail Store",
    "businessType": "FOOTWEAR,CLOTHING",
    "isMultiWarehouse": false
  }
  ```