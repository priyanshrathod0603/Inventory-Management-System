# Unit Testing Guide

## 1. Overview
Unit tests focus on testing pure domain logic in isolation, mocking all database and external network dependencies.

## 2. Target Test Modules
* **Tax Calculator Service**: Validates CGST/SGST splits, IGST assessment, and rounding to 2 decimal places.
* **Margin & Profit Service**: Tests Gross Margin % formulas `(Revenue - Cost) / Revenue * 100`.
* **Stock Math Service**: Tests stock movement before/after calculation logic.
* **Frontend Custom Hooks**: Tests the `useBarcodeScanner` keypress interval detection.

## 3. Example Unit Test (`HealthController`)
```typescript
it('should return health status ok', () => {
  const result = controller.check();
  expect(result.status).toBe('ok');
  expect(result.service).toBe('sms-api');
  expect(result.timestamp).toBeDefined();
});
```

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
