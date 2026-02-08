# Specification

## Summary
**Goal:** Fix admin access so the bootstrap Principal and assigned admins are correctly recognized on `/admin` after Internet Identity login, including after canister upgrades.

**Planned changes:**
- Update `backend/main.mo` to expose the exact admin authorization methods the frontend calls: `isCallerAdmin()`, `assignCallerUserRole(...)`, and `_initializeAccessControlWithSecret(secret)`.
- Ensure the bootstrap admin Principal `enn3j-adkwy-i7cxf-gi4bs-ihisb-mpsqc-lozg5-coeen-cba7n-y352m-4ae` is automatically granted admin privileges on install and after upgrade (additive, not dependent on any secret).
- Persist role assignments in stable storage so admin grants/removals survive canister upgrades, adding conditional migration only if required to preserve existing stable data.
- Enforce authorization on role assignment so only admins can call `assignCallerUserRole`; non-admin calls must trap with an error containing "Unauthorized".
- Adjust the Admin page UX to show a clear message when admin detection fails due to backend API errors, while keeping existing unauthenticated and access-denied behaviors.

**User-visible outcome:** Logging in as the bootstrap Principal (or a Principal granted admin by an admin) reliably shows admin access on `/admin`, including after upgrades; if the backend admin check errors, `/admin` displays a helpful status message instructing the user to refresh/try again.
