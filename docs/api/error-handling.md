# API Error Handling

## 1. Error Response Structure

All API errors return a standard JSON error envelope with appropriate HTTP status codes:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of the error",
    "details": []
  }
}
```

---

## 2. Standard HTTP Status Codes & Error Codes

| HTTP Status | Error Code (`code`) | Description |
| :--- | :--- | :--- |
| **`400 Bad Request`** | `VALIDATION_FAILED` | Request payload failed DTO validation rules |
| | `INVALID_PAYMENT_AMOUNT` | Tender amount does not match grand total |
| **`401 Unauthorized`** | `UNAUTHENTICATED` | Session cookie missing, expired, or invalid |
| | `INVALID_CREDENTIALS` | Incorrect username or password |
| **`403 Forbidden`** | `FORBIDDEN` | User role lacks required permission code |
| | `CREDIT_LIMIT_EXCEEDED` | Customer balance exceeds authorized credit limit |
| **`404 Not Found`** | `RESOURCE_NOT_FOUND` | Target entity ID does not exist |
| | `PRODUCT_NOT_FOUND` | Barcode or SKU does not match any product |
| **`409 Conflict`** | `DUPLICATE_ENTRY` | Unique constraint violation (e.g. duplicate SKU or Barcode) |
| | `INSUFFICIENT_STOCK` | Requested quantity exceeds available inventory in warehouse |
| **`429 Too Many Requests`**| `RATE_LIMIT_EXCEEDED` | Too many requests; brute-force protection active |
| **`500 Internal Server Error`**| `INTERNAL_SERVER_ERROR`| Unhandled server error (stack trace is logged privately, never exposed) |

---

## 3. Client Handling Best Practices
* **401 Unauthorized**: Redirect user to `/login` and preserve target URL in redirect query.
* **403 Forbidden**: Display in-app permission banner (`Requires permission: [code]`).
* **409 Conflict (Insufficient Stock)**: Highlight the affected cart item with live available stock badge.
* **429 Rate Limit**: Render cooldown timer before allowing next login attempt.

---

## Source Reference
* Authoritative Specification: [.ai/API_CONTRACTS.md](../../.ai/API_CONTRACTS.md)
* Security Rules: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
