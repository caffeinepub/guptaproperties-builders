# Specification

## Summary
**Goal:** Grant Internet Identity principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe` the `#admin` role in the live backend admin system without impacting existing admins, and ensure it persists across upgrades and deployments.

**Planned changes:**
- Add the principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe` to the backend’s admin role set without removing or replacing existing admin principals.
- Ensure the admin grant is stored in a way that survives canister upgrades and remains consistent across draft and production deployments (including any required state migration to preserve existing data).

**User-visible outcome:** When logged in as `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe`, admin checks succeed and admin-only backend methods can be called without “Unauthorized: Admin access required”, and this remains true after upgrades.
