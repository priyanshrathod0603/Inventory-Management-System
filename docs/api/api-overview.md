# API Overview

## 1. Introduction
The SMS API is a RESTful API serving all Point of Sale, Inventory, Procurement, and Financial management operations.

* **Base URL**: `/api/v1`
* **Transport**: HTTPS (in production), JSON payloads (`Content-Type: application/json`).
* **Interactive Documentation**: OpenAPI / Swagger documentation is accessible at `/api/docs`.
* **Authentication**: Cookie-based session (`sms_session`).
* **Authorization**: Granular RBAC permissions enforced by NestJS Guards (`@RequirePermissions`).

---

## 2. Standard Response Format

### Success Response Envelope (`200 OK`, `201 Created`):
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

### Error Response Envelope (`400`, `401`, `403`, `404`, `422`, `500`):
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

## 3. Standard Query Parameters (Pagination, Search & Sort)

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `1` | Current page number (min `1`) |
| `limit` | Integer | `25` | Items per page (max `100`) |
| `search` | String | `""` | Search query across names, SKUs, barcodes, phones, or invoice numbers |
| `sortBy` | String | `"createdAt"` | Column name to sort by |
| `sortOrder` | String | `"desc"` | Sort direction (`asc` or `desc`) |

---

## Source Reference
* Authoritative Specification: [.ai/API_CONTRACTS.md](../../.ai/API_CONTRACTS.md)
