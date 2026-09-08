# Bugs

## Resolved Issues (Full Repair & Audit Milestone)

### BUG-001: Fake Google OAuth Auto-Authentication Bypass
* **Issue**: The application automatically logged in a fake/demo account ("Google Test User") when clicking Google Auth buttons.
* **Root Cause**: Backend `GoogleOAuthService` had a `mock-google-token-` bypass returning hardcoded profiles, and frontend `login`/`register` buttons sent hardcoded mock token strings.
* **Resolution**: Removed mock token bypass in backend, added `GOOGLE_CLIENT_ID` configuration validation throwing `ServiceUnavailableException`, and updated frontend to check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and display honest disabled/not-configured state.

### BUG-002: Registration Form HTTP 400 Validation Error
* **Issue**: Registration returned HTTP 400 "Validation failed" on valid-looking input (such as usernames with spaces or unvalidated fields).
* **Root Cause**: Backend `RegisterDto` strictly enforces alphanumeric+underscore username regex (`/^[a-zA-Z0-9_]+$/`) with `forbidNonWhitelisted: true`, but the frontend had zero client-side regex validation and displayed only generic error messages without mapping the `details[]` array.
* **Resolution**: Added comprehensive client-side form validation (`validateForm()`), field-level error state (`fieldErrors`), dynamic error clearing on input change, and error response parser mapping backend validation details to individual form fields.

### BUG-003: CommonJS `cookie-parser` Runtime Crash
* **Issue**: Backend failed to start with `TypeError: (0 , cookie_parser_1.default) is not a function`.
* **Root Cause**: ES module default import mismatch under CommonJS compilation without `esModuleInterop`.
* **Resolution**: Updated to namespace import `import * as cookieParser from 'cookie-parser'`.

### BUG-004: Invalid Tailwind CSS Class `py-0.2`
* **Issue**: Vertical padding failed to render on badges in header, user menu, and dashboard.
* **Root Cause**: `py-0.2` is not a valid Tailwind CSS spacing scale utility.
* **Resolution**: Replaced with standard `py-0.5` across all occurrences.

### BUG-005: Typography Font Regression Falling Back to Default Browser Serif
* **Issue**: Application typography appeared unstyled with serif default fonts on login and register screens.
* **Root Cause**: Fonts (`Plus Jakarta Sans` and `IBM Plex Mono`) were configured in Tailwind and `:root` variables, but Google Fonts `@import` was missing from the stylesheet.
* **Resolution**: Added `@import` Google Fonts rules and font-family cascade to `apps/web/src/app/globals.css`.

### BUG-006: Disabled Google Auth Button in Frontend
* **Issue**: The Google button remained disabled even when Google Auth credentials were provided for the backend.
* **Root Cause**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` was only placed in `apps/api/.env` and was not accessible to the Next.js frontend client environment.
* **Resolution**: Created `apps/web/.env.local` containing `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and updated frontend to dynamically enable Google Auth with redirect handling.

### BUG-007: Incomplete Google OAuth Authorization-Code Redirect Flow
* **Issue**: Frontend Google buttons only showed a placeholder error and lacked real OAuth 2.0 authorization-code flow with PKCE/state protection.
* **Root Cause**: Backend had only `POST /auth/google` with ID token verification; it lacked `GET /auth/google` initiation and `GET /auth/google/callback` redirect exchange.
* **Resolution**: Implemented full authorization-code flow using `google-auth-library` `OAuth2Client` with secure HttpOnly `google_oauth_state` CSRF cookie, automatic user provisioning / account linking, and standard session issuance.

### BUG-008: Plain-Text Reset Token Logged and Missing Password Reset Email
* **Issue**: `AuthService.forgotPassword()` logged raw reset tokens to server console logs and never sent a password reset email.
* **Root Cause**: `MailService` lacked a `sendPasswordResetEmail()` method, and the token was output to `this.logger.log()`.
* **Resolution**: Added `MailService.sendPasswordResetEmail()` with branded HTML templates and 1-hour expiration link; removed raw token logging from `AuthService` (security fix).

---

## Active Bugs
* **Current Status**: Zero known active application bugs.
* **Quality Gate**: All 22 backend test suites (121 tests) pass, Next.js build passes (35 static routes), TypeScript typecheck passes across API and Web with 0 errors.