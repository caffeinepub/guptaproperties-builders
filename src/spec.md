# Specification

## Summary
**Goal:** Improve deployment retry documentation and add a global UI indicator for the user’s current admin status.

**Planned changes:**
- Complete `frontend/DEPLOYMENT_RETRY.md` with an end-to-end, copy/paste-ready procedure to clean install/build and redeploy canisters + frontend for both draft and live, plus a final verification checklist confirming the bootstrap admin principal is recognized as admin via the existing Admin Panel diagnostics UI.
- Add an always-available admin-status indicator in a global UI location (e.g., header) that shows “Admin” vs “Not admin” for authenticated users, uses the existing `useIsCallerAdmin()` query, and includes a manual refresh control to re-check status without navigating to the Admin page.
- Ensure the indicator behaves safely when unauthenticated (hidden or unauthenticated state) and all user-facing text remains in English.

**User-visible outcome:** Users can follow a complete redeploy/retry guide for both draft and live with a clear admin verification step, and authenticated users can always see (and manually refresh) whether they are an admin from anywhere in the app.
