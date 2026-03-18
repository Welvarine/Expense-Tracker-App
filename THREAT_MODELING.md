# Webtech Corrections: Threat Modeling & Security Review

This document outlines the basic threat modeling for the Expense Tracker application, identifying key assets, potential threats, and the implemented mitigations.

## 1. Assets
The primary assets of this application include:
- **User Accounts (Authentication Data):** Email addresses, passwords, and assigned roles (admin vs user).
- **Financial Data:** Income, expenses, budgets, and categorized transaction histories.
- **User Sessions:** Active login states that grant access to the application.
- **Application Logic/State:** The integrity of the Vue/Pinia store managing the platform.

## 2. Threat Modeling & Identified Risks

### Threat 1: Session Hijacking / Persistent Unauthorized Access
- **Description:** An attacker gains access to a user's device and opens the application. If the session persists indefinitely, the attacker can view or modify financial data.
- **Vulnerability:** Storing authentication state (`currentUser`) in `localStorage` means the session survives browser restarts and is not cleared until explicit logout.
- **Mitigation Implemented:** Moved session state from `localStorage` to `sessionStorage` in `useAuthStore.js`. The session is now inherently tied to the browser tab/window lifecycle and is automatically destroyed when the application is closed.

### Threat 2: Weak Authentication & Typo Errors
- **Description:** Users mistype their password during sign-up, locking themselves out or using an unintended weaker password.
- **Vulnerability:** Missing confirmation mechanism during account creation.
- **Mitigation Implemented:** Added a "Confirm Password" field with explicit validation (`isMatchPassword`) in `CreateAccountView.vue`. This ensures the user intentionally sets their desired password.

### Threat 3: Client-Side Input Manipulation (XSS / Injection)
- **Description:** Malicious users inject scripts or unexpected data types into transaction forms (e.g., negative amounts or script tags in descriptions).
- **Vulnerability:** Unvalidated form inputs processing raw data into the store.
- **Mitigation Implemented:** Form validation composables (`useFormValidation`) ensure `amount` is strictly a positive number and categories/dates are required. Store actions explicitly parse amounts via `parseFloat` and reject `NaN` or negative values. *Note: Since this is a client-only app without a backend database, persistent XSS is limited to the local machine's storage, but data sanitization prevents UI breaking.*

### Threat 4: Privilege Escalation (Role Bypassing)
- **Description:** A standard user attempts to access the Admin Console to view global platform totals or modify other users.
- **Vulnerability:** Missing route guards or exposed admin components.
- **Mitigation Implemented:** Vue Router employs `beforeEach` navigation guards (`to.meta.role !== auth.currentUser?.role`) to restrict access. Standard users are forcefully redirected to the dashboard if they attempt to navigate to `/admin/*` routes.

## 3. Recommended Future Mitigations (When adding a backend)
While the current app relies strictly on LocalStorage/SessionStorage, scaling to a standard backend requires migrating security boundaries:
1. **Move Auth to HttpOnly Cookies:** JWTs or Session IDs should *never* be accessible via JavaScript to prevent XSS exfiltration.
2. **Server-Side Validation:** All Vue composable form validations must be duplicated on the server to prevent API abuse.
3. **Password Hashing:** Passwords currently stored in plain text in LocalStorage for demo purposes must be hashed (e.g., bcrypt/Argon2) on the server.
