# Media pipeline (planned)

Images for the public site will be uploaded through the **admin panel** later.
This document describes the intended pipeline so public layouts can reserve slots now
(`CmsImageSlot`, `services.image_path`, `page_sections` image content, `media_assets`).

## Goals

- Upload via admin only (no hardcoded stock URLs on public pages).
- Optimize **server-side** before storing public versions.
- Store **optimized variants**, not only originals.
- Prefer **WebP / AVIF** where supported.
- Generate responsive widths: **480, 768, 1200, 1600**.
- Track metadata: width, height, alt text, caption, storage path, mime type, file size.
- Public pages use optimized variants + Next.js `next/image`.

## Current schema hooks

| Source | Field / table | Public usage |
| ------ | ------------- | ------------ |
| `services.image_path` | Storage path | Service detail hero (+ section slot) |
| `pages.og_image_path` | Storage path | Future OG / social |
| `page_sections` keys `hero_image`, `about_image` | JSON `image_path` / `path` / `src` | Homepage slots |
| `media_assets` | `path`, `alt_text`, `width`, `height`, `mime_type`, `size_bytes` | Alt + dimensions for slots |
| Storage bucket | `site-assets` | Public object URLs |

## Intended upload flow (not built yet)

1. Admin selects image in CMS.
2. Server receives original; validates type/size.
3. Server generates variants (AVIF/WebP + widths above).
4. Uploads variants to `site-assets` (e.g. `services/{slug}/hero-1200.webp`).
5. Upserts `media_assets` row with alt, caption, dimensions, mime, size.
6. Saves path on `services.image_path` or section JSON.
7. Public `resolvePublicStorageUrl` + `CmsImageSlot` render via `next/image`.

## Public fallbacks

If no path is set, pages show a calm placeholder block (no external stock images).
