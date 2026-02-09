# Specification

## Summary
**Goal:** Make property creation errors actionable, ensure video support works reliably (YouTube URLs + size-limited uploads), and clarify/admin-enable property CRUD access paths.

**Planned changes:**
- Update the property create/edit flow to surface specific failure reasons (permission/admin-only, request/payload too large, invalid input, generic backend failure) instead of always showing a generic error.
- Add clear UI guidance when a logged-in user is not an admin, and hide admin-only create/edit/delete controls for non-admin users.
- Make video attachments work end-to-end: reliably accept and validate YouTube URLs, validate video file uploads against a configured size limit before submit, and render videos on property cards (YouTube embed or HTML5 video).
- Enforce backend validation for video values (must be YouTube URL or `data:video/*` data URL) and enforce a maximum allowed size/length for the video field with clear trap messages that the frontend displays.
- Ensure the bootstrap admin Principal flow works out-of-the-box so authorized users can create/update/delete properties without authorization traps, and permission traps are shown as permission-specific errors.

**User-visible outcome:** Users trying to create/edit properties see clear, specific errors with guidance (especially for admin permissions and size limits). Admins can create/update/delete listings successfully, and property videos work reliably via YouTube links or size-limited uploads that play on listing cards.
