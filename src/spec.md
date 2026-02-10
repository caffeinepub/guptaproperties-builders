# Specification

## Summary
**Goal:** Make admin authorization persistent and reliable across installs/upgrades, and ensure the existing Admin UI works end-to-end with real backend admin state.

**Planned changes:**
- Bootstrap the specified principal (`enn3j-adkwy-i7cxf-gi4bs-ihisb-mpsqc-lozg5-coeen-cba7n-y352m-4ae`) as an admin automatically on fresh install, and preserve that status after upgrades.
- Persist admin authorization state in stable memory so admin assignments survive upgrades and do not reset between draft/live deployments.
- Ensure backend supports multiple admins with working grant/revoke endpoints compatible with the existing frontend Admin Management hooks.
- Fix admin diagnostics so `getAdminsList()` returns the actual current admin list from backend state (not hardcoded) and enforces admin-only access with clear English errors.
- Verify the `/admin` page flow: login prompt when unauthenticated, correct admin checks/diagnostics, and UI updates after grant/revoke via refetch/invalidation (without editing immutable frontend files).

**User-visible outcome:** After logging in, the bootstrap principal is immediately recognized as an admin; admins can view the real admin list and grant/revoke admin access in the Admin page, and changes persist across upgrades and reflect in the UI without a hard refresh.
