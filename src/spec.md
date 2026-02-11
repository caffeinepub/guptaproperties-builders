# Specification

## Summary
**Goal:** Bootstrap and persist a backend admin principal list, expose admin-check/admin-management methods, and keep the existing Admin UI working end-to-end with Internet Identity.

**Planned changes:**
- Add the principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe` to the backend admin list in an additive way (preserve any existing admins).
- Persist the admin principal list across canister upgrades so admin membership is not reset on redeploy/upgrade.
- Implement `isCallerAdmin() : async Bool` to return whether the caller is in the persistent admin list.
- Wire `grantAdmin(Principal)`, `revokeAdmin(Principal)`, and `getAdminsList() : async [Text]` to the persistent admin list, restricting `getAdminsList()` to admin callers with a clear unauthorized trap message.
- Ensure the existing frontend Admin page continues to work: authenticated admins can access the Admin Panel, see admin-active state, grant/revoke admins successfully, and have diagnostics/status refresh after changes without a full reload.

**User-visible outcome:** An Internet Identity–authenticated admin can use the Admin page to confirm admin status and grant/revoke admin access (with results reflected immediately), and admin access persists through backend upgrades.
