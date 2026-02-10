# Specification

## Summary
**Goal:** Show the Admin navbar link only to authenticated admins, always positioned after Home, Properties, and Inquiries across desktop and mobile navigation.

**Planned changes:**
- Update the header navigation to consistently order links as: Home, Properties, Inquiries, then Admin.
- Render the Admin link conditionally based on the current authenticated user’s admin status (hidden for non-admins).
- Ensure the Inquiries link is present on the Home page navigation so the Admin link can consistently appear after it.
- Fix admin-status detection by aligning the frontend admin-check with the backend method (either expose `isCallerAdmin()` or consistently use the existing `checkIfCallerIsAdmin()`).

**User-visible outcome:** Non-admin users see Home/Properties/Inquiries only; admin users additionally see an Admin link after Inquiries, consistently in both desktop and mobile headers.
