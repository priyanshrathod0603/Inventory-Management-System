# Troubleshooting Guide

This document assists developers and counter staff in diagnosing and resolving common operational issues.

## 1. Developer Setup Issues

### Issue: `Cannot connect to PostgreSQL database`
* **Symptom**: `PrismaClientInitializationError` when running API server.
* **Resolution**: Ensure Docker daemon is running and verify PostgreSQL container health:
  ```bash
  docker compose ps
  docker compose up -d postgres
  ```

### Issue: `Prisma client out of sync with schema`
* **Resolution**: Regenerate the Prisma client after any schema changes:
  ```bash
  pnpm --filter @ims/api prisma:generate
  ```

---

## 2. Operational & Counter Billing Issues

### Issue: `Barcode scanner not adding items to cart`
* **Symptom**: Scanner beeps, but item does not appear in cart.
* **Resolution**:
  1. Ensure the barcode scanner is configured in **USB HID Keyboard Emulation Mode** with `CR/LF (Enter)` suffix enabled.
  2. Verify that the scanned barcode exists in the product catalog under `/products`.

### Issue: `Thermal printer not triggering silent print`
* **Resolution**: Verify browser print settings have "Silent Printing / Kiosk Mode" enabled and default destination set to the thermal printer device (`58mm` or `80mm`).

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
