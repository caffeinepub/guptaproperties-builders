# Specification

## Summary
**Goal:** Add a new admin principal to the backend admin authorization list without impacting existing admins, and ensure it is applied in both draft and production deployments.

**Planned changes:**
- Update the backend admin authorization logic/data to include principal `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe` alongside existing admin principals (no removals/replacements).
- Apply the same admin addition to both the draft canister deployment and the production canister deployment.

**User-visible outcome:** When authenticated as `fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe`, admin-only backend checks (e.g., `checkIfCallerIsAdmin()`) succeed in both draft and production environments, while existing admins continue to have admin access.
