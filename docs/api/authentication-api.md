# Authentication API

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates a user and sets the secure session cookie.

* **Permissions**: Public (No auth required)
* **Rate Limit**: Max 5 attempts per 15 minutes per IP/username.
* **Request Body**:
```json
{
  "identifier": "rahul_cashier",
  "password": "Password123!",
  "rememberMe": true
}
```
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "username": "rahul_cashier",
      "fullName": "Rahul Sharma",
      "role": "Cashier",
      "permissions": ["create_sale", "view_products", "view_sales"]
    }
  },
  "message": "Login successful"
}
```
* **Cookie Set**: `Set-Cookie: sms_session=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`

---

### `POST /api/v1/auth/logout`
Invalidates the current session on the server and clears the cookie.

* **Permissions**: Authenticated
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `GET /api/v1/auth/me`
Fetches the current authenticated user profile, active role, and granular permission list.

* **Permissions**: Authenticated
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "rahul_cashier",
    "fullName": "Rahul Sharma",
    "role": "Cashier",
    "permissions": ["create_sale", "view_products", "view_sales"]
  }
}
```

---

## Source Reference
* Authoritative Specification: [.ai/API_CONTRACTS.md](../../.ai/API_CONTRACTS.md)
* Security Policy: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
