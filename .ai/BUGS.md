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

---

## Active Bugs
* **Current Status**: Zero known active application bugs.
* **Quality Gate**: All 15 backend test suites (70 tests) pass, Next.js build passes (34 static routes), TypeScript typecheck passes across API and Web with 0 errors.