# Supabase schema — Цветелина Райкова CMS

Canonical schema documentation for database, auth, RLS, and storage.  
SQL source of truth: `supabase/migrations/20260805150000_initial_cms_schema.sql`

> **Apply status:** migrations are in the repo but may not yet be applied to the cloud project. Apply via Dashboard SQL Editor or `npx supabase db push` after `supabase link`.

---

## Overview

| Layer | Tool |
| ----- | ---- |
| Database | Postgres (Supabase) |
| Auth | Supabase Auth (`auth.users`) |
| Admin gate | `admin_profiles` + `is_admin()` |
| CMS content | `site_settings`, `pages`, `page_sections`, `services`, `faqs`, `testimonials`, `media_assets` |
| Leads | `consultation_requests` |
| Files | Storage bucket `site-assets` |

Official name: **Цветелина Райкова**. Display name is editable via `site_settings` (and `src/lib/brand.ts` until CMS is wired).

---

## Tables

### `admin_profiles`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | uuid PK | = `auth.users.id` |
| `email` | text | |
| `full_name` | text | nullable |
| `is_active` | bool | default true |
| `created_at` / `updated_at` | timestamptz | |

**Relationships:** 1:1 with `auth.users`.

**RLS:** authenticated users may `SELECT` own row or any row if `is_admin()`. No client insert/update/delete — manage via service role / SQL.

---

### `site_settings`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | uuid PK | |
| `key` | text UNIQUE | e.g. `display_name`, `phone`, `default_cta` |
| `value` | jsonb | flexible payload |
| `label` | text | admin UI label |
| `updated_by` | uuid | → `auth.users` |

**RLS:** public `SELECT`; admin write.

Suggested keys: `official_name`, `display_name`, `tagline`, `phone`, `email`, `address`, `social_links`, `default_cta_label`, `default_cta_href`, `og_image_path`.

---

### `pages`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `slug` | text UNIQUE | `home`, `about`, … |
| `title` | text | |
| `status` | text | `draft` \| `published` \| `archived` |
| `seo_title` / `seo_description` / `og_image_path` | text | |
| `sort_order` | int | |
| `published_at` | timestamptz | |
| `updated_by` | uuid | |

**RLS:** public reads `status = 'published'`; admins read/write all.

---

### `page_sections`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `page_id` | uuid FK → `pages` | CASCADE delete |
| `key` | text | unique per page |
| `section_type` | text | `text` \| `richtext` \| `image` \| `cta` \| `list` \| `custom` |
| `content` | jsonb | |
| `sort_order` | int | |
| `is_published` | bool | |

**RLS:** public reads when section published **and** parent page published; admins full access.

---

### `services`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `slug` | text UNIQUE | |
| `title`, `summary`, `body` | text | |
| `image_path`, `cta_label`, `cta_href` | text | |
| `sort_order` | int | |
| `status` | text | draft/published/archived |
| SEO fields | text | |
| `published_at`, `updated_by` | | |

**RLS:** same pattern as `pages`.

---

### `faqs`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `question` / `answer` | text | |
| `category` | text | optional |
| `sort_order` | int | |
| `is_published` | bool | |

---

### `testimonials`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `author_name` / `author_role` | text | |
| `quote` | text | |
| `avatar_path` | text | |
| `sort_order` / `is_published` | | |

---

### `media_assets`

Metadata for files in Storage (not the binary itself).

| Column | Type | Notes |
| ------ | ---- | ----- |
| `bucket` | text | default `site-assets` |
| `path` | text | unique with bucket |
| `alt_text`, `mime_type`, `width`, `height`, `size_bytes` | | |
| `is_public` | bool | default true |

---

### `consultation_requests`

Public lead form. **No health/medical fields.**

| Column | Type | Notes |
| ------ | ---- | ----- |
| `name` | text | required |
| `phone` | text | required |
| `email` | text | optional |
| `service_interest` | text | optional |
| `preferred_contact_method` | text | `phone` \| `email` \| `either` |
| `message` | text | optional |
| `consent` | bool | must be true (DB check) |
| `status` | text | `new` \| `contacted` \| `closed` \| `spam` |
| `created_at` | timestamptz | |

**RLS:** anon/authenticated `INSERT` when `consent = true`; only admins `SELECT`/`UPDATE`/`DELETE`.

App helper: `src/lib/consultations/submit.ts` (`submitConsultationRequest` server action).

---

## Relationships (simplified)

```
auth.users 1──1 admin_profiles
pages 1──* page_sections
auth.users ──? updated_by (many content tables)
media_assets.path  ← referenced by pages/services image fields (soft, not FK)
storage.buckets site-assets ← media file blobs
```

---

## RLS strategy

| Actor | Content tables | consultation_requests | admin_profiles | storage `site-assets` |
| ----- | -------------- | --------------------- | -------------- | --------------------- |
| `anon` | read published only | insert with consent | none | read |
| `authenticated` non-admin | read published only | insert with consent | own row select | read |
| `authenticated` admin (`is_admin()`) | full CRUD | full read/manage | select all | upload/update/delete |
| service role | bypass RLS | bypass RLS | create admins | bypass |

`public.is_admin()` = exists active row in `admin_profiles` for `auth.uid()`.

**Never** put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` or Client Components. Server-only: `src/lib/supabase/admin.ts`.

---

## Admin role strategy

1. User signs up / is created in Supabase Auth.
2. A row is inserted into `admin_profiles` (manual SQL or service role) with matching `id`.
3. App checks: session user **and** `isAdmin()` / `getAdminProfile()`.
4. `/admin` (protected layout): no user → `/admin/login`; user not admin → `/admin/unauthorized`.
5. Authenticated ≠ admin.

Helpers: `src/lib/auth/admin.ts`.

---

## Storage strategy

| Item | Choice |
| ---- | ------ |
| Bucket | `site-assets` (public bucket) |
| Public visitors | read objects |
| Admins | insert / update / delete objects |
| Metadata | `media_assets` table |
| App usage | Next.js `Image` + public Storage URLs (`*.supabase.co/storage/v1/object/public/site-assets/...`) |
| Now | **no real uploads yet** — policies + bucket only |

Paths convention (future): `pages/{slug}/…`, `services/{slug}/…`, `avatars/…`.

---

## Future CMS editing flow

1. Admin logs in at `/admin/login` (email/password via Supabase Auth).
2. Dashboard lists pages, services, FAQs, testimonials, settings, media, consultation requests.
3. Edits go through Server Actions using SSR anon client (RLS enforces admin).
4. Publish toggles `status` / `is_published` / `published_at`.
5. Public site reads published rows only (Server Components).
6. Optional: draft preview for admins later.

---

## How to create the first admin (manual)

1. Apply migration `20260805150000_initial_cms_schema.sql` in **SQL Editor** (or CLI push).
2. **Authentication → Users → Add user** (email + password), or sign up once Auth is enabled.
3. Copy the user’s **UUID**.
4. Run in SQL Editor:

```sql
INSERT INTO public.admin_profiles (id, email, full_name, is_active)
VALUES (
  'PASTE-USER-UUID-HERE',
  'admin@example.com',
  'Цветелина Райкова',
  true
);
```

5. Confirm:

```sql
SELECT * FROM public.admin_profiles;
```

6. Log in at `/admin/login` with that email and password.

---

## Vercel environment variables

Add the same keys as `.env.local` in Vercel → **Settings → Environment Variables** (Production, Preview, Development):

| Variable | Scope |
| -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | server only — never expose to browser |
| `NEXT_PUBLIC_SITE_URL` | production URL |

Auth URLs: **Authentication → URL Configuration** — Site URL = production domain; Redirect URLs include `http://localhost:3000/**` and `https://YOUR-DOMAIN/**`.

Vercel project settings: Framework **Next.js**, Root Directory **`./`**.

---

## Apply migrations

```powershell
# Option A — Dashboard: SQL Editor → paste migration file → Run

# Option B — CLI (after login + link)
npx supabase login
npx supabase link --project-ref jnvbsiydahnkfpkdhkps
npx supabase db push
```

Generate TypeScript types after apply:

```powershell
npx supabase gen types typescript --project-id jnvbsiydahnkfpkdhkps > src/types/database.ts
```

---

## App code map

| Concern | Path |
| ------- | ---- |
| Browser client | `src/lib/supabase/client.ts` |
| SSR client | `src/lib/supabase/server.ts` |
| Middleware session | `src/lib/supabase/middleware.ts` |
| Service role (server only) | `src/lib/supabase/admin.ts` |
| Admin checks | `src/lib/auth/admin.ts` |
| Consultation insert | `src/lib/consultations/submit.ts` |
| Protected admin UI | `src/app/admin/(protected)/` |
| Login (public) | `src/app/admin/login/` |
| Unauthorized | `src/app/admin/unauthorized/` |
