# Authentication API

> **Architectural Standard**: IMS uses **ONE Single Common Authentication System** with a **Single Universal Admin Access Model (DECISION-016)**. All authenticated users receive full operational permissions across the platform. The `/login` and `/register` UI screens are strictly protected and frozen (DECISION-010).

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates a user (via email/username and password) and sets the secure session cookie.

* **Permissions**: Public (No auth required)
* **Rate Limit**: Max 5 attempts per 15 minutes per IP/identifier.
* **Request Body**:
```json
{
  "identifier": "admin_user",
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
      "username": "admin_user",
      "email": "admin@example.com",
      "fullName": "Store Administrator",
      "accessLevel": "Admin",
      "permissions": ["create_sale", "view_products", "manage_inventory", "view_sales", "...all 38 permissions"]
    }
  },
  "message": "Login successful"
}
```
* **Cookie Set**: `Set-Cookie: sms_session=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`

---

### `POST /api/v1/auth/register`
Creates a new user account via the single common registration flow.

* **Permissions**: Public
* **Request Body**:
```json
{
  "fullName": "Store Administrator",
  "email": "admin@example.com",
  "username": "admin_user",
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
Google OAuth authentication endpoint (Google Sign-In).

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
      "accessLevel": "Admin",
      "permissions": ["create_sale", "view_products", "manage_inventory", "...all 38 permissions"]
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
