# Media pipeline

Admin uploads images at `/admin/media`. Processing runs **server-side** with
[`sharp`](https://sharp.pixelplumbing.com/); only optimized WebP variants are
stored in Supabase Storage. Public pages use `CmsImageSlot` + `next/image`.

## Goals (implemented)

- Upload via admin only (no stock URLs hardcoded on public pages).
- Optimize server-side before storing public versions.
- Store responsive WebP variants (not the original upload).
- Track metadata in `media_assets` (path, alt, caption, width, height, mime, size).
- Public pages resolve `services.image_path` / section paths via `resolvePublicStorageUrl`.

## Limits

| Rule | Value |
| ---- | ----- |
| Input types | `image/jpeg`, `image/png`, `image/webp` |
| Max upload size | **8 MB** (raw input) |
| Server Action body limit | **10 MB** (`next.config` experimental.serverActions.bodySizeLimit) |
| Output | WebP quality **82** |
| Variants | **480 / 768 / 1200 / 1600** (`withoutEnlargement`) |
| Canonical path in DB | `…/w1200.webp` (or largest requested slot) |

AVIF is not generated in this version (WebP only for broad compatibility).

## Storage layout

Bucket: **`site-assets`** (public read; admin write via RLS / service role on server).

```
media/{yyyy}/{mm}/{assetId}/w480.webp
media/{yyyy}/{mm}/{assetId}/w768.webp
media/{yyyy}/{mm}/{assetId}/w1200.webp
media/{yyyy}/{mm}/{assetId}/w1600.webp
```

`media_assets.path` stores the **primary** object (`w1200.webp`). Other widths
sit beside it for future `srcset` use.

## Schema

Table `media_assets` (+ migration `20260805180000_media_assets_caption.sql` adds `caption`).

Run in Supabase if not applied:

```sql
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS caption text;
```

Requires env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server-only, used after `isAdmin()` for Storage upload).

## Admin usage

1. Open `/admin/media`.
2. Upload file + required **alt text** (+ optional caption).
3. Copy path or open detail to edit alt/caption.
4. On `/admin/services/[id]`, pick the path for `image_path` (or paste manually).
5. Public `/uslugi/[slug]` shows the image via `CmsImageSlot`; empty path → placeholder.

## Homepage / About image slots

Hero and about slots on `/` read:

1. Dedicated published sections `hero_image` / `about_image` (JSON `image_path` + `image_alt`)
2. Fallback: `image_path` embedded in `hero_supporting` / `intro` content

Edit via `/admin/pages` → page slug **`home`** (same section editor as other pages).
Seed helpers: `supabase/seed/005_home_image_sections.sql`.

Service cards on the homepage also show `services.image_path` when set.

## Public fallbacks

If no path is set, pages keep calm placeholder blocks (no external stock images).

## Security

- Browser never sees the service role key.
- Upload/update only after `isAdmin()`.
- Public may read `is_public` media metadata and public Storage URLs.
- Consultation requests and other private tables are unchanged.
