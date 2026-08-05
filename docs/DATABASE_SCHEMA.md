# Draft database schema (documentation only)

> **Superseded for implementation.** Use **[docs/supabase-schema.md](./supabase-schema.md)** and  
> `supabase/migrations/20260805150000_initial_cms_schema.sql` as the source of truth.  
> This file is kept as historical draft notes.

---

> **Not final SQL.** This is a first-pass content model for the future CMS.
> Migrations will live under `supabase/migrations/` once approved.

## Goals

Editable site content for an admin panel: page copy, services, FAQ, testimonials,
SEO metadata, CTA labels, contact details, and images — without redeploying for copy changes.

## Auth & roles

| Table      | Purpose |
| ---------- | ------- |
| `auth.users` | Supabase Auth (built-in) |
| `profiles`   | App profile linked 1:1 to `auth.users` |

### `profiles` (draft)

| Column     | Type        | Notes |
| ---------- | ----------- | ----- |
| `id`       | uuid PK     | = `auth.users.id` |
| `email`    | text        | |
| `role`     | text        | e.g. `admin` \| `editor` |
| `full_name`| text        | nullable |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

## Site settings & contact

### `site_settings` (singleton / key-value)

Flexible key-value or typed columns. Suggested keys / columns:

| Key / column           | Example |
| ---------------------- | ------- |
| `display_name`         | Цвети / Цветелина Райнова |
| `official_name`        | Цветелина Райнова |
| `tagline`              | short brand line |
| `phone`                | |
| `email`                | |
| `address`              | |
| `social_links`         | jsonb |
| `default_cta_label`    | |
| `default_cta_href`     | |
| `og_image_path`        | storage path |

Alternatively split contact into `contact_details` if preferred.

## Pages & blocks

### `pages`

| Column         | Type    | Notes |
| -------------- | ------- | ----- |
| `id`           | uuid    | |
| `slug`         | text unique | e.g. `home`, `about`, `services` |
| `title`        | text    | |
| `status`       | text    | `draft` \| `published` |
| `seo_title`    | text    | |
| `seo_description` | text | |
| `og_image_path`| text    | |
| `published_at` | timestamptz | |
| `updated_at`   | timestamptz | |

### `page_blocks`

Reusable editable sections per page.

| Column       | Type  | Notes |
| ------------ | ----- | ----- |
| `id`         | uuid  | |
| `page_id`    | uuid FK | |
| `key`        | text  | e.g. `hero_headline`, `intro` |
| `block_type` | text  | `text` \| `richtext` \| `image` \| `cta` |
| `content`    | jsonb | structured payload |
| `sort_order` | int   | |

## Services

### `services`

| Column       | Type | Notes |
| ------------ | ---- | ----- |
| `id`         | uuid | |
| `slug`       | text unique | |
| `title`      | text | |
| `summary`    | text | |
| `body`       | jsonb / text | long content |
| `image_path` | text | |
| `cta_label`  | text | |
| `cta_href`   | text | |
| `sort_order` | int  | |
| `status`     | text | |
| `seo_title`  | text | |
| `seo_description` | text | |

## FAQ

### `faq_items`

| Column       | Type | Notes |
| ------------ | ---- | ----- |
| `id`         | uuid | |
| `question`   | text | |
| `answer`     | text / jsonb | |
| `category`   | text | optional |
| `sort_order` | int  | |
| `is_published` | bool | |

## Testimonials

### `testimonials`

| Column         | Type | Notes |
| -------------- | ---- | ----- |
| `id`           | uuid | |
| `author_name`  | text | |
| `author_role`  | text | optional |
| `quote`        | text | |
| `avatar_path`  | text | optional |
| `sort_order`   | int  | |
| `is_published` | bool | |

## Media

Prefer Supabase Storage buckets (e.g. `site-images`) plus optional metadata:

### `media_assets` (optional)

| Column       | Type | Notes |
| ------------ | ---- | ----- |
| `id`         | uuid | |
| `bucket`     | text | |
| `path`       | text | |
| `alt_text`   | text | |
| `width`      | int  | |
| `height`     | int  | |
| `created_at` | timestamptz | |

## RLS sketch (later)

- Public `SELECT` on published content only.
- `INSERT` / `UPDATE` / `DELETE` only for authenticated users with `profiles.role = 'admin'`.
- Storage: public read for published assets; write restricted to admins.
- Service role: server-only privileged jobs — never in the browser.

## Open decisions

1. Key-value `site_settings` vs strongly typed columns  
2. Rich text format (Markdown vs Portable/JSON)  
3. Multi-locale later (`bg` only at launch?)  
4. Draft / publish workflow depth  
