# Content Transfer Guide for Google Sites

This guide explains how to transfer the content from this website to Google Sites or another platform.

## Business Information

All business details are centralized in `frontend/src/data/siteData.ts`:

- **Company Name**: GuptaProperties&Builders
- **Address**: WZ-131, Shop No.1, Om Vihar Phase-1, Metro Pillar No. 703-704, Uttam Nagar, New Delhi-110059
- **Phone**: 9868599938
- **Social Links**: Google Maps, YouTube, Facebook, Instagram

## Property Listings

### Seed Properties
Default property listings are defined in `frontend/src/data/siteData.ts` in the `seedProperties` array. These can be copied directly to your new platform.

### Custom Properties
Properties added through the website interface are stored in the browser's localStorage under the key `guptaProperties`. To export these:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run: `JSON.parse(localStorage.getItem('guptaProperties'))`
4. Copy the output

## Images

Property images are stored as:
- **URLs**: Direct links to external images (e.g., Unsplash)
- **Data URLs**: Base64-encoded images uploaded from device (start with `data:image/`)

For Google Sites transfer:
- URL images can be used directly
- Data URL images should be saved as files and re-uploaded

## Local Storage Persistence

The website uses browser localStorage to persist property additions/edits without requiring a backend. This means:
- Changes are saved per-browser/device
- Clearing browser data will reset to seed properties
- Export custom properties before transferring platforms

## Transferring to Google Sites

1. Copy business info from `siteData.ts`
2. Export custom properties from localStorage
3. Download/save all property images
4. Recreate pages structure (Home, Properties)
5. Add social/contact buttons with the exact URLs from `siteData.ts`
