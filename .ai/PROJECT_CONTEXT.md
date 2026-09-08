# Project Context

## Project
**Project Name:** Stock Management System (SMS) / Universal Inventory & Retail Management Platform

**Project Type:** Production-grade universal inventory, stock management, and retail POS platform.

**Primary Goal:** Build a reliable, scalable, industry-agnostic system for managing business onboarding, multi-industry catalog, products, inventory, purchases, sales, customers, suppliers, billing, payments, reports, users, permissions, and operational settings.

The system serves any retail or wholesale business vertical (Footwear, Clothing, Grocery, Electronics, Pharmacy, Hardware, Furniture, General Store, etc.) with zero hardcoded industry assumptions.

## Core Philosophy
The system provides:
* **Universal Business Platform**: Dynamic user/business-defined data modeling across all verticals
* **Multi-Business Support**: Step 1 multi-selection during onboarding for multi-vertical merchants
* **Single Universal Admin Access**: Full operational capabilities for all authenticated users (DECISION-016)
* **Real-time inventory updates**: Fractional precision, multi-warehouse locations, and batch/expiry tracking
* **Reliable transactional operations**: Interactive Prisma transactions with zero partial states
* **Fast counter billing (POS)**: Dynamic category filters driven strictly by real persisted inventory
* **Accurate stock tracking**: Immutable StockMovement ledger and authorized adjustments
* **Warm Luxury SaaS Aesthetic**: Premium, clean, spacious UI (`#FF7048` coral, `#FCF9F6` warm ivory, `#111722` deep navy)
* **Canonical Form UX/UI Standard**: Spacious, accessible, consistent modal/form experiences (`h-11` inputs, `#FAF7F4` surfaces, clear label indicators)
* **Comprehensive auditability**: Server-authoritative logging of all operational events
* **Professional invoices**: Thermal receipts (58mm/80mm) and A4 GST tax invoices
* **Extensible architecture**: Clean separation between Next.js frontend, NestJS backend, and PostgreSQL database

## Current Development Stage
**Phase 10 Complete — Products + Inventory, Universal Business Onboarding & Master Form UX/UI Audit**

The core monorepo architecture, database schema, single common authentication, desktop navigation shell, Warm Luxury SaaS design system, API integration layer, Universal Business Onboarding wizard, Product catalog CRUD, multi-warehouse inventory, batch/expiry tracking, and application-wide Form UX/UI redesign are fully implemented and verified.

## Scope Summary
* **Current Scope (Phase 10 Foundation):** Production-grade web-based desktop application with Universal Business Onboarding, Product catalog, Categories, Brands, Multi-Warehouse Inventory, Stock Movements, Adjustments, Transfers, and Batch/Expiry tracking. Single `BusinessProfile` entity per user account holding business identity, multi-type selection, GST parameters, and multi-warehouse capability flag.
* **Immediate Roadmap (Phases 11–17):** Phase 11 (Purchase + Sales + POS), Phase 12 (Payments + Khata Ledger), Phase 13 (Invoices + Thermal Receipts), Phase 14 (Reports & Business Intelligence), Phase 15 (Notifications & Settings), Phase 16 (E2E Testing & Security Audit), Phase 17 (Production Deployment).
* **Future Evolution:** Normalized multi-business tenant entity switching, mobile/PWA interfaces, camera barcode scanning, AI demand forecasting, and external accounting/e-Invoicing integrations.