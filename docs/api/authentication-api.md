# Authentication API

> **Architectural Standard**: IMS uses **ONE Single Common Authentication System**. All users (Admin, Manager, Cashier, Staff, etc.) authenticate via the common endpoints below. There are NO separate login/signup endpoints for different roles. Downstream authorization is handled via RBAC after authentication.

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates a user (via email/username and password) and sets the secure session cookie.

* **Permissions**: Public (No auth required)
* **Rate Limit**: Max 5 attempts per 15 minutes per IP/identifier.
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
      "email": "rahul@example.com",
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

### `POST /api/v1/auth/register`
Creates a new user account via the single common registration flow.

* **Permissions**: Public
* **Request Body**:
```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "username": "rahul_cashier",
  "password": "Password123!"
}
```
* **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "message": "Registration successful. Please verify your email.",
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
```

---

### `POST /api/v1/auth/google`
Planned Google OAuth authentication endpoint (Google Sign-In).

* **Permissions**: Public
* **Request Body**:
```json
{
  "idToken": "google_oauth_id_token_string"
}
```
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "user@gmail.com",
      "fullName": "Google User",
      "role": "Cashier",
      "permissions": ["create_sale", "view_products"]
    }
  }
}
```

---

### `POST /api/v1/auth/verify-email`
Planned email verification endpoint.

* **Permissions**: Public
* **Request Body**:
```json
{
  "token": "verification_token_string"
}
```
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "message": "Email successfully verified."
  }
}
```

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
