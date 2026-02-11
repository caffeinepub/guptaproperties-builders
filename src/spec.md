# Specification

## Summary
**Goal:** Ensure the provided Principal ID is recognized as a backend admin without changing/removing existing admins.

**Planned changes:**
- Add principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe` to the backend admin principal list in an additive way within `backend/main.mo`.
- Ensure backend admin checks and `getAdminsList()` include/authorize this principal while preserving any pre-existing admins.

**User-visible outcome:** Calls to backend admin-gated methods succeed when made by principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe`, and `getAdminsList()` includes this principal.
