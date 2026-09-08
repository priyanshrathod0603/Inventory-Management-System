# Business Onboarding Architecture & Specification

## 1. Overview
The **Universal Business Onboarding** subsystem transforms the Inventory Management System (IMS) into an industry-agnostic business management platform. It allows merchants across retail, FMCG, groceries, apparel, electronics, furniture, hardware, pharmacies, and specialty stores to configure their business identity, tax settings, and operational scale immediately following account registration.

## 2. Core Architecture & Principles

### A. Server-Authoritative State
- `isOnboardingCompleted`: Stored directly on the `BusinessProfile` database entity and evaluated on the server.
- Session tokens, `@Get('/auth/me')`, `@Post('/auth/login')`, and `@Post('/auth/google')` compute and deliver `isOnboardingCompleted: Boolean(user.businessProfile?.isOnboardingCompleted)`.
- Client cannot bypass onboarding via manual URL manipulation; Next.js route guards inspect `user.isOnboardingCompleted` on all authenticated views under `/(app)/*` and redirect incomplete users to `/onboarding`.

### B. Universal Admin Access Model
- Every authenticated user possesses full system administrative privileges.
- Multi-warehouse operations are controlled via the `isMultiWarehouse: boolean` capability toggle, not user roles.

### C. Multi-Business Selection & Universal Foundation
- **Multi-Business Support**: Merchants may operate multiple business types (e.g. Footwear & Shoes + Clothing & Apparel).
- **Multi-Selection in Onboarding**: Step 1 enables selecting multiple business types simultaneously with clean toggle mechanics.
- **Multi-Business ≠ Multi-Warehouse Distinction**:
  - `Multi-Business` = Multiple retail verticals or business contexts operated by a merchant.
  - `Multi-Warehouse` = Multiple physical storage/inventory facilities for a business (controlled by `isMultiWarehouse`).
  - `isMultiWarehouse` is strictly an inventory facility feature, never Multi-Business support.
- **Business Type ≠ Product Category**:
  - Business Type defines the industry nature of the store.
  - Product Category defines actual persisted catalog items. Selecting a business type does NOT assume or auto-generate product categories.

### D. Resumable Onboarding Drafts
- Users can step through the 4-step setup wizard with server-persisted draft progress via `POST /api/v1/business-profile/draft`.
- If an onboarding session is interrupted, the user can resume exactly from their saved step on their next login.

## 3. Supported Business Categories
| Type Key | Display Name | Industry Preset / Focus |
|---|---|---|
| `GENERAL_STORE` | General Store | Multi-category FMCG, Kirana, Packaged Goods |
| `GROCERY` | Grocery & Supermarket | Perishables, Expiry Tracking, Weight/Volume Units |
| `FOOTWEAR` | Footwear & Shoes | Pairs, Sizes, Color Variants, Box Units |
| `CLOTHING` | Clothing & Apparel | Garments, Fabrics, Seasonal Collections |
| `ELECTRONICS` | Electronics & Gadgets | Serial Tracking, Warranty Periods, Model IDs |
| `FURNITURE` | Furniture & Decor | Dimensions, Assembly Sets, Heavy Cargo Units |
| `HARDWARE` | Hardware & Tools | Metrics, Spares, Tools, Fasteners |
| `PHARMACY` | Pharmacy & Health | Strict Batch Numbers, Expiry Alerting, Schedules |
| `RETAIL` | Specialty Retail | Gifts, Luxury, Boutique Goods |
| `OTHER` | Other / Custom | Dynamic user-specified industry name |

## 4. 4-Step Onboarding Flow

1. **Step 1: Business Type Selection (Multi-Select Enabled)**
   - Visual card selector showcasing all 10 business types with icons and descriptions.
   - **Multi-Selection Behavior**:
     - Clicking an unselected card → selects it.
     - Clicking an already-selected card → deselects it.
     - Multiple cards can remain selected simultaneously (e.g., Footwear + Clothing + Furniture).
     - At least one business type selection is required to advance to Step 2.
     - Visual state clearly distinguishes selected (coral accent border, badge) from unselected cards.
   - Dynamic custom text input when `OTHER` is selected.
2. **Step 2: Business Profile & Contact**
   - Store / Business Name (Required).
   - Owner / Manager Name (Optional).
   - Contact Phone, WhatsApp (for invoices/alerts), Email, Website.
   - Physical Street Address, City, State, Country, Postal Code.
3. **Step 3: Tax Compliance & Currency**
   - GST / Tax Registered toggle.
   - Formatted GSTIN / Tax ID field (auto-uppercase).
   - Base Operating Currency selection (`INR (₹)`, `USD ($)`, `EUR (€)`, `AED (د.إ)`).
4. **Step 4: Capabilities & Review**
   - Multi-Warehouse Mode toggle (`isMultiWarehouse`).
   - Profile summary card.
   - "Launch Store & Go to Dashboard" activation button.

## 5. API Endpoints

- `GET /api/v1/business-profile` — Retrieves the current user's profile and onboarding state.
- `POST /api/v1/business-profile/onboarding` — Submits full onboarding data, provisions a default warehouse if none exists, and sets `isOnboardingCompleted = true`.
- `POST /api/v1/business-profile/draft` — Saves progressive step draft data without marking onboarding complete.
- `PATCH /api/v1/business-profile` — Updates store master data from the Settings page.

## 6. Default Warehouse Provisioning
When `completeOnboarding` executes in a database transaction, it verifies whether active warehouses exist. If no warehouse exists, it automatically provisions:
- Name: `{Business Name} - Main Store`
- Code: `WH-01`
- IsDefault: `true`
- IsActive: `true`

This guarantees that inventory movements, stock adjustments, and POS sales function seamlessly right after onboarding.

## 7. Current Implementation vs. Future Scope Boundary
- **Current Phase 10 Implementation**:
  - Single `BusinessProfile` database record per user.
  - Multi-business selection in onboarding UI.
  - Dynamic store branding personalization in header and settings.
  - POS category filter driven dynamically by real merchant product categories.
- **Future Architecture Scope (Not in Phase 10)**:
  - Normalized multi-business tenant database entity modeling.
  - Active business context switcher in navigation header.
  - Multi-business catalog data segregation across transactions and ledgers.
  - Full invoice template engine and printing branding (Phase 11/12).

