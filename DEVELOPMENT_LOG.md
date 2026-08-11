# Development Log — Цветелина Райкова

Shared project memory for Cursor / Codex / developers.  
**Convention:** newest entries at the **top**. Append a new dated entry after every meaningful change; do not rewrite history.

---

## 2026-08-11 — Service detail CTA from admin (landing link)

**Status:** `/uslugi/[slug]` hero and bottom buttons use `services.cta_label` / `services.cta_href` from CMS. Admin can set landing page text and URL per service.

### Behavior
- Fields: existing `cta_label`, `cta_href` (no migration)
- Empty label → «Виж лендинг страницата»
- Empty href → `/bezplatna-konsultatsia?usluga=<slug>`
- Set href → internal (`/path`) or external (`https://…`); `CtaLink` opens externals in new tab
- Admin save validates href format; trims values
- Service cards unchanged («Научи повече» → detail page)

### Files
- `src/lib/cms/public-content.ts` — `resolveServiceCta` updated
- `src/lib/cms/services.ts` — CTA href validation helpers
- `src/app/admin/(protected)/services/[id]/service-form.tsx`, `actions.ts`
- `src/app/uslugi/[slug]/page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- Build not run (per task). Lint optional.

### Manual checks
1. Admin → Услуги → edit service: set button text + landing URL → save
2. Open `/uslugi/<slug>` — button shows admin label, links correctly
3. Clear href — falls back to consultation form with `?usluga=`
4. External URL opens in new tab

---

## 2026-08-11 — Persistent two-tier public navigation

**Status:** Services subnav is now always visible under the main header on all public pages (not only `/uslugi`). Active service pill derives from URL via `usePathname`.

### Navigation
- Level 1 (main): Начало, Услуги, За Цвети, Въпроси, Контакти + CTA — unchanged
- Level 2 (services): always-on pill bar under header, centered, warm cream background, horizontal scroll on mobile
- `getPublicSiteChrome()` now returns `services` (published, by `sort_order`) for subnav
- `PublicHeader` renders `ServicesSubnav` centrally — removed duplicate subnav from `/uslugi` pages
- Active state only on `/uslugi/[slug]`; neutral on `/uslugi` and other pages

### Files
- `src/components/public/public-header.tsx`
- `src/components/public/services-subnav.tsx`
- `src/lib/cms/public-content.ts`
- `src/app/page.tsx`, `uslugi/page.tsx`, `uslugi/[slug]/page.tsx`
- `src/app/za-cveti/page.tsx`, `kontakti/page.tsx`, `bezplatna-konsultatsia/page.tsx`, `politika-za-poveritelnost/page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- Build not run (per task). Lint optional.

### Manual checks
1. Homepage, About, Contact — services pills visible under header
2. `/uslugi/[slug]` — correct active pill
3. Mobile — horizontal scroll, header not broken
4. No duplicate subnav on service pages

---

## 2026-08-11 — Public nav: single «Услуги» + secondary services subnav

**Status:** Main header no longer lists each service as a top-level link. One «Услуги» tab → `/uslugi`. Individual services appear in a secondary horizontal nav on `/uslugi` and `/uslugi/[slug]` (no dropdown).

### Navigation
- Main nav: Начало, Услуги (`/uslugi`), За Цвети, Въпроси, Контакти (+ CTA)
- Secondary `ServicesSubnav`: published services by `sort_order`, short labels via `NAV_SERVICE_LABELS` (fallback: CMS title)
- Active service marked with `aria-current="page"` + distinct border/fill (not color-only)
- Mobile: horizontal scroll, no layout overflow; empty list → no render
- Homepage services cards unchanged; `#uslugi` anchor kept for in-page CTA

### Files
- `src/lib/cms/public-nav.ts`
- `src/lib/cms/public-content.ts`
- `src/components/public/services-subnav.tsx`
- `src/app/uslugi/page.tsx`, `src/app/uslugi/[slug]/page.tsx`
- `docs/launch-checklist.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm.cmd run lint` — pass
- `npm.cmd run build` — pass

### Manual checks
1. Header shows one «Услуги», not four service links
2. `/uslugi` and `/uslugi/[slug]` show secondary nav; active slug highlighted
3. Mobile menu stays short; subnav scrolls horizontally
4. Public URLs remain `/uslugi/...`

---

## 2026-08-10 — Homepage visual redesign toward premium holistic reference

**Status:** Homepage now follows the supplied visual direction: warm light background, sage/olive accents, large serif hero, CMS-driven image slots, benefit strip, approach collage, refined service cards, and final green CTA band.

### Done
- Redesigned `/` with a large first-viewport hero: text/CTA on the left, admin-managed hero image slot on the right.
- Preserved CMS data loading for hero copy, intro copy, services, FAQ, testimonials, site settings, and CTA.
- Kept image handling admin-driven: no hardcoded local/stock images; hero/about/service images still come from CMS/media paths.
- Improved empty image placeholders so future admin-uploaded photos have intentional reserved visual space.
- Added a benefit strip under hero, a calmer approach section with collage-style image slots, a 4-column services section, and a final green CTA band.
- Refined public header, CTA buttons, public container width, and service cards to better match the reference style.

### Files
- `src/app/page.tsx`
- `src/components/public/public-header.tsx`
- `src/components/public/cta-link.tsx`
- `src/components/public/cms-image-slot.tsx`
- `src/components/public/service-card.tsx`
- `src/components/public/public-container.tsx`

### Commands
- `npm.cmd run lint` — pass
- `npm.cmd run build` — pass
- Safety scan in `src` for old name / medical-claim phrases — clean

### Manual checks
1. Open the homepage on desktop and mobile.
2. Upload/set the hero and about images via `/admin/pages` → `home`.
3. Optionally set images per service via `/admin/services`.
4. Confirm the design still feels balanced after real photos are added.

---

## 2026-08-10 — Supabase heartbeat cron (3×/week)

**Status:** Vercel cron + protected API route upserts `maintenance_heartbeats` via service role; admin readiness shows cron/heartbeat status.

### Cron
- Route: `GET /api/cron/supabase-heartbeat`
- Auth: `Authorization: Bearer ${CRON_SECRET}` → else `401`
- `export const dynamic = "force-dynamic"`
- Schedule (`vercel.json`): `0 7 * * 1,3,5` — Mon/Wed/Fri 07:00 UTC

### Database
- Migration: `20260810120000_maintenance_heartbeats.sql`
- Table `maintenance_heartbeats` (id, last_seen_at, run_count, last_status, last_error)
- RPC `record_maintenance_heartbeat()` — atomic upsert for `id = supabase-heartbeat`
- Admin SELECT via RLS `is_admin()`; writes service-role only

### Env
- `CRON_SECRET` — Vercel Production (+ local for manual curl)
- Existing `SUPABASE_SERVICE_ROLE_KEY` (server-only, not exposed in UI)

### Admin / docs
- `/admin/readiness`: CRON_SECRET configured/missing + last heartbeat row
- `docs/heartbeat-cron.md` — schedule, env, manual test, Vercel logs
- `docs/launch-checklist.md` updated

### Files
- `src/app/api/cron/supabase-heartbeat/route.ts`
- `src/lib/maintenance/heartbeat.ts`
- `supabase/migrations/20260810120000_maintenance_heartbeats.sql`
- `vercel.json`, `.env.example`, `src/lib/admin/readiness.ts`, `src/types/database.ts`
- `docs/heartbeat-cron.md`, `docs/launch-checklist.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — pass
- `npm run build` — pass (`/api/cron/supabase-heartbeat` listed)

### Manual checks
1. Apply migration in Supabase SQL Editor
2. Set `CRON_SECRET` in Vercel Production env
3. `curl` without header → 401; with `Bearer CRON_SECRET` → 200
4. Verify row in `maintenance_heartbeats`; check `/admin/readiness`
5. After deploy: Vercel cron logs on Production (Mon/Wed/Fri)

---

## 2026-08-05 — Launch polish + admin readiness

**Status:** New `/admin/readiness` status page; public UX polish; privacy draft labeling strengthened; safety scan clean in public copy.

### Admin readiness (`/admin/readiness`)
- Checks: site_settings, published services, page SEO, home hero/about image paths, service images, FAQ, testimonials (optional), `NEXT_PUBLIC_SITE_URL`, Resend env configured/missing (no secret values)
- Privacy legal-review warning
- Quick links to home/za-cveti/kontakti/privacy editors, services, media, FAQ, testimonials
- Nav + dashboard entry «Готовност»

### Public polish
- `tel:` links on homepage + footer
- Consultation consent links to privacy
- Hide empty FAQ/testimonials sections on homepage
- Hide empty/placeholder qualifications on `/za-cveti`; soft story fallback (no `[Добавете…]` brackets)
- Remove empty second image slot on `/uslugi/[slug]`
- Privacy: always-visible draft badge + amber legal-review notice; contact link always shown
- Admin services copy no longer says public pages are “coming soon”

### Docs / seeds
- `docs/launch-checklist.md` references `/admin/readiness`
- `004` story/qualifications placeholders softened for future re-runs

### Safety scan
- `Райнова` only in corrective seed/docs/checklist mentions
- No medical-claim phrases in `src` public copy

### Files
- `src/lib/admin/readiness.ts`, `src/app/admin/(protected)/readiness/page.tsx`
- `src/app/admin/(protected)/layout.tsx`, `page.tsx`, `pages/page.tsx`, `services/page.tsx`
- `src/lib/cms/placeholder-copy.ts`
- `src/app/page.tsx`, `za-cveti/page.tsx`, `politika-za-poveritelnost/page.tsx`, `uslugi/[slug]/page.tsx`
- `src/components/public/consultation-form.tsx`, `public-footer.tsx`
- `supabase/seed/004_page_content_cms.sql`
- `docs/launch-checklist.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — pass
- `npm run build` — pass (`/admin/readiness` listed)

### Manual actions remaining
1. Open `/admin/readiness` and clear warn/missing items
2. Configure production `NEXT_PUBLIC_SITE_URL` + optional Resend
3. Upload home/service images via media + pages CMS
4. Legal review of privacy before treating as final
5. Re-run `004` only if you want seed placeholder text refreshed (overwrites section content)

---

## 2026-08-05 — Production-readiness follow-up (email message + seed fix)

**Status:** Confirmed prior pack (`cc6f08b`) covers homepage CMS images, Resend notify, admin filters, launch checklist. This follow-up: include brief form message in notify email (truncated); harden `005` seed; re-verify lint/build + safety scan.

### Done (verified / updated)
- Homepage `/` reads `hero_image` / `about_image` via existing `/admin/pages` editor; `CmsImageSlot` fallbacks; service cards use `services.image_path`
- Email after successful insert: name, phone, email, service, contact preference, optional brief message (≤280 chars), admin link — no clinical framing; form succeeds without Resend env
- Admin `/admin/consultation-requests`: status filter, name/phone/email search, newest first
- `docs/launch-checklist.md` present
- Safety scan: no `Райново` / medical claim phrases in `src`; `Райнова` only in corrective seed `002`

### Files
- `src/lib/consultations/notify.ts`, `submit.ts`
- `supabase/seed/005_home_image_sections.sql`
- `docs/launch-checklist.md`
- `DEVELOPMENT_LOG.md`

### Env vars
- Optional: `RESEND_API_KEY`, `CONSULTATION_NOTIFY_TO`, `CONSULTATION_NOTIFY_FROM`
- Existing: Supabase public + service role (server-only), `NEXT_PUBLIC_SITE_URL`

### Commands
- `npm run lint` — pass
- `npm run build` — pass

### Manual checks
1. Paste full `005_home_image_sections.sql` in SQL Editor (empty tab → Studio Zod “query too small”)
2. Set home images via `/admin/pages` → `home`
3. Submit consultation with/without Resend; confirm brief message appears in email when filled
4. Walk `docs/launch-checklist.md`

---

## 2026-08-05 — Fix `005_home_image_sections.sql` empty-query / empty path

**Status:** Seed rewritten so slots omit empty `image_path` (matches admin save) and fail clearly if `home` page is missing. The Studio error `query: Too small: expected string to have >=1 characters` means the SQL Editor sent an empty query string — paste the full file and Run (do not run an empty tab).

### Files
- `supabase/seed/005_home_image_sections.sql`
- `DEVELOPMENT_LOG.md`

---

## 2026-08-05 — Production-readiness pack (home images, email, QA)

**Status:** Homepage image sections wired through existing Pages CMS; optional Resend notify on consultation submit; admin request filters; launch checklist; safety scan clean for public copy.

### Homepage images
- `/` already used `CmsImageSlot` for hero/about
- Loader now resolves `hero_image` / `about_image` sections, with fallbacks from `hero_supporting` / `intro` `image_path`
- Seed `005_home_image_sections.sql` creates empty image sections on `home`
- Service cards show optional `services.image_path` thumbnails (placeholders if empty)
- Edit images via `/admin/pages` → slug `home` (no duplicate editor)

### Email notifications
- `src/lib/consultations/notify.ts` + hook in `submitConsultationRequest`
- Env: `RESEND_API_KEY`, `CONSULTATION_NOTIFY_TO`, `CONSULTATION_NOTIFY_FROM`
- If unset/misconfigured → form still succeeds; email skipped
- Email body: name, phone, email, service, contact preference + admin link (no form message / health details)
- Dependency: `resend`

### Admin consultation
- Filters: status + search (name/phone/email); newest-first sort kept

### Docs
- `docs/launch-checklist.md`
- `.env.example` updated
- `docs/media-pipeline.md` homepage image notes
- `supabase/seed/README.md` includes `005`

### Safety scan
- `Райнова` only in corrective seed/docs (intentional)
- No `Райново` / medical claim phrases in public app copy
- Historical DEVELOPMENT_LOG entries left unchanged

### Files
- `src/lib/cms/public-content.ts`, `src/components/public/service-card.tsx`
- `src/lib/consultations/notify.ts`, `submit.ts`
- `src/app/admin/(protected)/consultation-requests/page.tsx`
- `src/app/admin/(protected)/pages/page.tsx`
- `supabase/seed/005_home_image_sections.sql`
- `docs/launch-checklist.md`, `docs/media-pipeline.md`, `.env.example`
- `package.json` / lockfile (`resend`)
- `DEVELOPMENT_LOG.md`

### Env vars needed
- Existing Supabase + site URL
- Optional: `RESEND_API_KEY`, `CONSULTATION_NOTIFY_TO`, `CONSULTATION_NOTIFY_FROM`

### Commands
- `npm run lint` — pass
- `npm run build` — pass

### Manual checks
1. Run `005_home_image_sections.sql`; set paths on home `hero_image` / `about_image` via admin Pages
2. Submit consultation without Resend → still saves
3. With Resend env → email arrives (no message body)
4. Filter requests by status / search
5. Walk `docs/launch-checklist.md`

### Next step
- Legal review of privacy draft; configure production Resend domain; fill real About qualifications via CMS.

---

## 2026-08-05 — Page Content CMS (`/admin/pages`)

**Status:** Admin can edit `pages` + `page_sections`. Public `/za-cveti`, `/kontakti`, `/politika-za-poveritelnost` read published CMS content with safe fallbacks. Homepage still uses existing home sections.

### Pre-change summary
- Public pages mostly hardcoded; home already used `page_sections`.
- Media library + services `image_path` existed.

### Hardcoded text before → after
| Page | Before | After |
| ---- | ------ | ----- |
| `/` | CMS sections + some chrome | unchanged (still home sections) |
| `/za-cveti` | Fully hardcoded | CMS keys `intro/story/approach/values/qualifications/cta` + fallbacks |
| `/kontakti` | Hardcoded + site_settings contacts | CMS `intro/cta/disclaimer` + site_settings phone/email/social |
| `/politika-za-poveritelnost` | Hardcoded draft | CMS sections + draft fallbacks; still noindex |
| `/uslugi`, `/bezplatna-konsultatsia` | Service/form copy | unchanged (out of scope) |

### Admin
- `/admin/pages` list; `/admin/pages/[id]` page SEO + sections list
- `/admin/pages/[id]/sections/new` and `/sections/[sectionId]`
- Section fields: key, type, heading, eyebrow, body, image_path (+ media pick), image_alt, CTA, sort_order, is_published
- Nav + dashboard «Страници»

### Seed / manual SQL
- Apply `supabase/seed/004_page_content_cms.sql` in SQL Editor (not auto-applied)
- Reminder: `20260805180000_media_assets_caption.sql` if caption not yet applied

### Remaining hardcoded (intentional)
- Layout chrome, nav labels, consultation form UI copy
- Qualification placeholders until filled in CMS
- Emergency disclaimer fallback if CMS missing
- Brand direction strings as last-resort SEO fallbacks

### Files
- `src/lib/cms/pages.ts`, `public-pages.ts`
- `src/app/admin/(protected)/pages/**`
- `src/app/za-cveti/page.tsx`, `kontakti/page.tsx`, `politika-za-poveritelnost/page.tsx`
- `supabase/seed/004_page_content_cms.sql`, `seed/README.md`
- Admin layout/dashboard, `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; routes include `/admin/pages` and section editors

### Manual checks
1. Run `004_page_content_cms.sql`
2. `/admin/pages` → edit `za-cveti` section + SEO
3. Set section image path from media library
4. Confirm `/za-cveti` updates; missing sections still fall back safely

### Next step
- Email notifications, or homepage hero/about image editing via Pages CMS (`home` sections `hero_image` / `about_image`).

---

## 2026-08-05 — Admin media upload + sharp optimization

**Status:** Admins can upload images at `/admin/media`; server-side sharp generates WebP variants in `site-assets`; services can set `image_path` from the library.

### Pre-change summary
- Public image slots (`CmsImageSlot`) existed; `media_assets` + Storage bucket existed; no upload UI.

### Implemented
- `/admin/media` upload form (file, required alt, optional caption) + grid list
- `/admin/media/[id]` edit alt/caption, copy path
- `sharp` WebP variants: 480 / 768 / 1200 / 1600 (quality 82); max input 8 MB; JPG/PNG/WebP only
- Canonical DB path = `media/{yyyy}/{mm}/{uuid}/w1200.webp`
- Service editor: pick/paste `image_path`
- Nav + dashboard link «Медия»
- Docs: `docs/media-pipeline.md` updated with real pipeline
- Homepage hero/about still via `page_sections` (documented; no awkward Site Settings hack)

### Storage / RLS
- Bucket `site-assets` (existing public-read + admin write policies)
- Upload uses **server-only** service role after `isAdmin()` (never in browser)
- Metadata insert/update on `media_assets`; public select remains `is_public` only
- Migration: `20260805180000_media_assets_caption.sql` adds `caption`

### Dependencies
- `sharp` (also pulled by Next; declared in app dependencies)

### Files
- `src/lib/media/optimize.ts`, `store.ts`
- `src/app/admin/(protected)/media/*`
- `src/app/admin/(protected)/services/[id]/*` (image_path)
- `src/types/database.ts`, `next.config.ts` (bodySizeLimit 10mb)
- `supabase/migrations/20260805180000_media_assets_caption.sql`
- `docs/media-pipeline.md`, `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; routes include `/admin/media` and `/admin/media/[id]`

### Manual checks
1. Apply caption migration in Supabase SQL Editor if needed
2. Upload at `/admin/media` — confirm Storage objects + `media_assets` row
3. Set service `image_path` → check `/uslugi/[slug]`
4. Confirm pages without images still show placeholders
5. Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only env

### Next step
- Email notifications for consultation requests, or page-sections editor for homepage hero/about images.

---

## 2026-08-05 — About, Contacts, Privacy + SEO (sitemap/robots)

**Status:** Public About/Contact/Privacy pages live; nav/footer updated; sitemap + robots added. Admin consultation inbox already existed from prior entry.

### Pre-change summary
- Public `/`, `/uslugi/[slug]`, `/bezplatna-konsultatsia` + admin CMS + consultation admin.
- Missing dedicated `/za-cveti`, `/kontakti`, `/politika-za-poveritelnost`, sitemap/robots.

### Part 1 — Admin consultation (already shipped)
- `/admin/consultation-requests` + `/[id]` with status updates (unchanged this pass).

### Part 2 — `/za-cveti`
- Intro, story placeholder, approach, values, qualification placeholders
- Image slots via `CmsImageSlot`
- CTA → `/bezplatna-konsultatsia`
- No invented education/certificates/titles

### Part 3 — `/kontakti`
- Phone/email/social from `site_settings`
- CTA + emergency/urgent medical disclaimer
- Link to privacy draft

### Part 4 — `/politika-za-poveritelnost`
- Bulgarian draft privacy placeholder (form data, purpose, no sensitive medical details, legal review needed)
- `robots: noindex` on page metadata

### Part 5 — Nav / footer
- За Цвети → `/za-cveti`; Контакти → `/kontakti`
- Footer: За Цвети, Контакти, Политика, consultation CTA

### Part 6 — SEO
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`
- `src/app/sitemap.ts` — public routes + published services only (no `/admin`)
- `src/app/robots.ts` — disallow `/admin`
- Admin root layout: `robots: noindex,nofollow`
- Page metadata on new routes; existing pages already had titles

### Privacy notes
- Consultation requests remain admin-only
- Privacy page marked as draft / not final legal advice

### Files
- `src/app/za-cveti/page.tsx`, `kontakti/page.tsx`, `politika-za-poveritelnost/page.tsx`
- `src/app/sitemap.ts`, `robots.ts`, `admin/layout.tsx`, `layout.tsx`
- `src/lib/cms/public-nav.ts`, `public-paths.ts`
- `src/components/public/public-footer.tsx`, `src/app/page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; includes `/za-cveti`, `/kontakti`, `/politika-za-poveritelnost`, `/sitemap.xml`, `/robots.txt`

### Manual checks
1. `/admin/consultation-requests`
2. `/za-cveti`, `/kontakti`, `/politika-za-poveritelnost`
3. `/sitemap.xml`, `/robots.txt`
4. Public nav: За Цвети / Контакти
5. `/admin` disallowed / noindex

### Remaining / next
- Fill real About qualifications via CMS (no inventions)
- Legal review of privacy draft
- Media upload/optimization pipeline
- Email notifications for new consultation requests
- Optionally publish FAQ/testimonials when real content exists

---

## 2026-08-05 — Admin consultation requests list/detail

**Status:** Admins can list and open consultation requests and update status. Public cannot read requests (RLS + protected layout).

### Pre-change summary
- Public form at `/bezplatna-konsultatsia` inserts into `consultation_requests`.
- No admin UI for viewing submissions.

### Implemented
- `/admin/consultation-requests` — list newest first
- `/admin/consultation-requests/[id]` — full message + contact fields + status form
- Status update via server action (session + RLS): `new` | `contacted` | `closed` | `spam`
- Nav link «Заявки» + dashboard CMS row
- Empty state when no rows
- No delete, no email notifications

### Fields displayed
List: created_at, name, phone, email, service_interest, preferred_contact_method, status, message preview  
Detail: above + full message, consent, updated_at

### Status update behavior
- Admin-only `updateConsultationRequestStatus`
- Sets `status` + `updated_by`
- Revalidates list and detail paths
- Does not log request contents

### Privacy notes
- Requests treated as private admin data
- Protected by `(protected)` layout + `consultation_requests_admin_select/update` RLS
- No health-data fields added
- Message treated as short context only

### Files
- `src/lib/consultations/admin.ts`
- `src/app/admin/(protected)/consultation-requests/page.tsx`
- `src/app/admin/(protected)/consultation-requests/[id]/page.tsx`
- `src/app/admin/(protected)/consultation-requests/actions.ts`
- `src/app/admin/(protected)/consultation-requests/status-form.tsx`
- `src/app/admin/(protected)/layout.tsx`, `page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; routes include `/admin/consultation-requests` and `/admin/consultation-requests/[id]`

### Manual checks
1. Submit test request from `/bezplatna-konsultatsia`
2. Confirm it appears in `/admin/consultation-requests`
3. Open detail, update status
4. Confirm logged-out / non-admin cannot access admin list

### Next step
- Email notifications on new requests, or media upload pipeline.

---

## 2026-08-05 — Public consultation form (`/bezplatna-konsultatsia`)

**Status:** Public consultation request page inserts into `consultation_requests` via anon SSR client + RLS. Primary CTAs normalize to `/bezplatna-konsultatsia`.

### Pre-change summary
- Homepage + `/uslugi/[slug]` live; flat service nav; image slots reserved.
- `submitConsultationRequest` helper existed but no public form UI.
- CTAs still defaulted to `/#consultation`.

### Implemented
- Route `/bezplatna-konsultatsia` with calm intro + form
- Client form → server action `submitConsultationRequest` (no service role)
- Fields: name, phone, email (optional), service_interest, preferred_contact_method, message, consent
- Loading / success / error states
- Privacy note: do not submit diagnoses, medication, tests, or detailed health history
- CTA normalization: empty/`#consultation`/`/#consultation` → `/bezplatna-konsultatsia` (external https kept)
- Header, homepage, service fallback CTAs, footer link wired
- Optional `?usluga=` prefills service interest from slug
- Seed + admin placeholders updated; optional patch `003_consultation_cta_urls.sql` for live DB

### Contact method note
- UI: Телефон / Имейл / Viber
- DB CHECK remains `phone | email | either`; Viber maps to `either` + message note «Предпочитан канал: Viber»

### Validation
- Required: name, phone, service_interest, preferred_contact_method, consent
- Email format only when provided
- Server-side validation with field errors (BG copy)

### Privacy / sensitive data
- No health-history fields
- Visible copy asks for a short intro conversation only
- Success: «Благодаря ти! Заявката беше изпратена успешно. Ще се свържа с теб възможно най-скоро.»

### Files
- `src/app/bezplatna-konsultatsia/page.tsx`
- `src/components/public/consultation-form.tsx`, `public-footer.tsx`
- `src/lib/consultations/submit.ts`, `options.ts`
- `src/lib/cms/public-paths.ts`, `public-content.ts`
- `src/app/uslugi/[slug]/page.tsx`
- Admin CTA placeholders; `supabase/seed/001_*.sql`, `003_consultation_cta_urls.sql`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; route includes `/bezplatna-konsultatsia`

### Manual checks
1. `/bezplatna-konsultatsia` renders
2. Empty required fields → validation
3. Invalid email → validation
4. Successful submit → row in `consultation_requests`
5. CTAs from `/` and `/uslugi/[slug]` → form (legacy `#consultation` normalized)
6. Optionally run `003_consultation_cta_urls.sql` if DB still has old CTA URLs

### Next step
- Admin list for consultation requests, or email notifications, or media upload pipeline.

---

## 2026-08-05 — Public `/uslugi/[slug]` + flat service nav + image slots

**Status:** Service detail pages at `/uslugi/[slug]`; each published service is a top-level nav item (no dropdown); image slots reserved for future Storage uploads.

### Pre-change summary
- Homepage CMS shell existed; `/uslugi` routes were partially migrated; header still used generic «Услуги» link.
- Official name: Цветелина Райкова. DB table remains `services`.

### `/uslugi` URL decision
- Public URLs use Bulgarian transliteration `/uslugi` / `/uslugi/[slug]`.
- Admin stays `/admin/services`; Supabase table `services` unchanged.
- Redirects: `/services` → `/uslugi`, `/services/:slug` → `/uslugi/:slug`.

### Navigation
- Flat top-level items (no services dropdown):
  - Начало `/`
  - Биорезонанс `/uslugi/biorezonans`
  - Тревожност `/uslugi/ot-trevoga-kam-spokoystvie`
  - Хранене `/uslugi/hranitelna-programa`
  - Избери себе си `/uslugi/izberi-sebe-si`
  - За Цвети `/#about`
  - Въпроси `/#faq`
  - Контакти `/#contact`
  - CTA «Запази консултация»
- Labels via `NAV_SERVICE_LABELS`; items built from **published** services + fixed anchors.
- Desktop: full row from `xl`; below that: mobile «Меню» panel.

### Service detail pages
- Route `src/app/uslugi/[slug]/page.tsx` — slug + `status=published` or `notFound()`
- Fields: title, slug, summary, body, cta_*, seo_*, `image_path`
- Layout: breadcrumb, hero + image slot, body, process, CTA, health disclaimer
- Safe wording only; external `cta_href` supported; missing CTA → `/#consultation`

### Image slot planning
- `CmsImageSlot` + `resolvePublicStorageUrl` / `buildImageRef`
- Service hero from `services.image_path` (+ `media_assets` alt/dims when present)
- Homepage hero/about slots from `page_sections` keys `hero_image` / `about_image` (JSON path)
- Calm placeholder when no path — no stock URLs hardcoded
- Future pipeline documented in `docs/media-pipeline.md` (admin upload, server optimize, WebP/AVIF, widths 480/768/1200/1600, metadata)

### CMS fields used
`services`: title, slug, summary, body, image_path, cta_label, cta_href, seo_title, seo_description, status  
`media_assets` (optional): alt_text, width, height  
`page_sections`: hero_headline, hero_supporting, intro, hero_image, about_image

### Fallback behavior
- Unpublished/missing slug → 404
- SEO / CTA / body fallbacks as before
- Empty image path → placeholder block with descriptive alt

### Files
- `src/app/uslugi/[slug]/page.tsx`, `src/app/uslugi/page.tsx`
- `src/app/page.tsx`, `src/components/public/public-header.tsx`, `cms-image-slot.tsx`, `service-card.tsx`
- `src/lib/cms/public-content.ts`, `public-nav.ts`, `public-paths.ts`, `media.ts`
- `docs/media-pipeline.md`, `next.config.ts`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed (no errors)
- `npm run build` — passed; routes include `/uslugi` and `/uslugi/[slug]`

### Manual checks
1. `/uslugi/biorezonans`
2. `/uslugi/ot-trevoga-kam-spokoystvie`
3. `/uslugi/hranitelna-programa`
4. `/uslugi/izberi-sebe-si`
5. Header shows four service links + mobile menu
6. `/#contact`, `/#about`, `/#faq`
7. Unpublished slug → 404

### Next step
- Consultation form → `consultation_requests`, or admin media upload + optimization pipeline.

---

## 2026-08-05 — Public service URLs → `/uslugi/[slug]`

**Status:** Public service routes use Bulgarian-transliterated `/uslugi`. DB table remains `services`. Admin stays at `/admin/services`.

### Change
- Moved `src/app/services/*` → `src/app/uslugi/*`
- Cards / nav / breadcrumbs use `/uslugi` and `/uslugi/[slug]`
- Homepage section anchor `id="uslugi"` (was `#services`)
- Helper: `PUBLIC_USLUGI_BASE`, `publicServicePath(slug)` in `public-content.ts`
- Permanent redirects: `/services` → `/uslugi`, `/services/:slug` → `/uslugi/:slug`
- Admin service save revalidates `/`, `/uslugi`, `/uslugi/[slug]`

### Expected public URLs
- `/uslugi/biorezonans`
- `/uslugi/ot-trevoga-kam-spokoystvie`
- `/uslugi/hranitelna-programa`
- `/uslugi/izberi-sebe-si`

### Files
- `src/app/uslugi/page.tsx`, `src/app/uslugi/[slug]/page.tsx` (moved)
- `src/app/services/*` removed
- `src/components/public/service-card.tsx`, `public-header.tsx`
- `src/app/page.tsx`, `src/lib/cms/public-content.ts`
- `src/app/admin/(protected)/services/[id]/actions.ts`
- `next.config.ts`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; routes include `/uslugi` and `/uslugi/[slug]` (no public `/services`)

### Next step
- Consultation form → `consultation_requests`, or publish FAQ/testimonials.

---

## 2026-08-05 — Public service detail pages (`/services/[slug]`)

**Status:** _(Superseded for public paths)_ Originally shipped as `/services/[slug]`; migrated to `/uslugi/[slug]` in the entry above. Admin CMS paths unchanged.

**Status (historical):** Published services had public detail pages; homepage cards linked to `/services/[slug]`. Optional `/services` index included.

### Implemented
- Dynamic route `src/app/services/[slug]/page.tsx` — published-only by slug; otherwise `notFound()`
- Optional index `src/app/services/page.tsx` reusing `ServiceCard`
- CMS helpers: `getPublishedServiceBySlug`, `getPublishedServices`, `getPublicSiteChrome`, `resolveServiceCta`, `isExternalHref`
- `CtaLink` supports external `http(s)` URLs (`target=_blank`, `rel=noopener`)
- Homepage `ServiceCard` → internal detail link («Научи повече»)
- Header nav anchors use `/#…` so they work from service pages
- Layout: breadcrumb, hero, body, gentle process section, CTA, generic health disclaimer (no schema disclaimer field)
- Safe wording only (подкрепа / насоки / подпомага / индивидуален подход); no medical claims

### CMS fields used
`title`, `slug`, `summary`, `body`, `cta_label`, `cta_href`, `seo_title`, `seo_description`, `status`

### Fallback behavior
- Missing/unpublished slug → `notFound()`
- SEO: `seo_title` → `{title} · {officialName}`; `seo_description` → `summary` → `brand.direction`
- Empty `cta_href` → `/#consultation`
- Empty `cta_label` → «Запази безплатна консултация»
- Empty `body` → calm placeholder (no invented claims)
- External `cta_href` → external link

### Files created/modified
- `src/app/services/[slug]/page.tsx` (new)
- `src/app/services/page.tsx` (new)
- `src/lib/cms/public-content.ts`
- `src/components/public/cta-link.tsx`
- `src/components/public/service-card.tsx`
- `src/components/public/public-header.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed; routes include `/services` and `/services/[slug]`

### Manual checks
1. `/services/biorezonans`
2. `/services/ot-trevoga-kam-spokoystvie`
3. `/services/hranitelna-programa`
4. `/services/izberi-sebe-si`
5. Unpublished or unknown slug → 404
6. Homepage service cards navigate to detail pages
7. If a service `cta_href` is set to `https://…`, CTA opens externally

### Next step
- Consultation form wired to `consultation_requests`, or publish FAQ/testimonials for homepage previews.

---

## 2026-08-05 — Public homepage shell from CMS

**Status:** Public `/` reads published CMS content (settings, services, FAQs, testimonials, homepage sections) with brand fallbacks.

### Pre-change summary
- CMS editors complete; name = Цветелина Райкова / Цвети.
- `002_fix_raykova.sql` may still need manual run in Supabase (do not assume applied).
- Public page was still a placeholder.

### Implemented
- Public components: Header, Footer, Container, CtaLink, ServiceCard, FaqAccordion, TestimonialPreview
- `getPublicHomeContent()` loader in `src/lib/cms/public-content.ts`
- Homepage sections: Hero, Services, About, FAQ, Testimonials, Final CTA
- Filters: services `status=published`; FAQs/testimonials `is_published=true`
- Main CTA default: **Запази безплатна консултация**
- Metadata from `seo_title` / `seo_description` with brand fallbacks
- No service detail pages yet (cards link to CTA / #consultation)

### CMS tables used
`site_settings`, `services`, `faqs`, `testimonials`, `pages` + `page_sections` (home)

### Fallback behavior
If Supabase env missing or rows empty → `brand` defaults + calm empty-state copy (no invented testimonials).

### Manual checks
1. Optionally run `002_fix_raykova.sql` if not done.
2. Open `/` — hero + 4 published services.
3. FAQ/testimonials sections: empty-state until items are published in admin.
4. Publish one FAQ in `/admin/faqs` → appears on `/`.

### Files
- `src/lib/cms/public-content.ts`
- `src/components/public/*`
- `src/app/page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed (after unused import fix)
- `npm run build` — passed (`/` dynamic)

### Next step
- Service detail pages, consultation form wired to `consultation_requests`, or publish FAQ/testimonials for homepage previews.

---

## 2026-08-05 — Name correction to Цветелина Райкова + CMS polish

**Status:** Official name corrected everywhere in source/docs/seed. Testimonials editor already existed — polished admin dashboard CMS status instead.

### Name correction
| From | To |
| ---- | -- |
| Цветелина Райнова | **Цветелина Райкова** |
| Informal display | **Цвети** (`brand.displayName`) |
| package.json name | `cvetelina-raykova` (npm package only; GitHub/Vercel/Supabase project names unchanged) |

Historical log mentions of deleted `vemidi-dev/cvetelina-raynova` repo/URLs left as factual history.

### Supabase data patch
- Added `supabase/seed/002_fix_raykova.sql` — run in SQL Editor to update already-seeded rows.
- Seed `001` source also updated for future re-runs.

### CMS polish (testimonials already shipped)
- Dashboard: CMS status list for settings / services / FAQ / testimonials
- Pre-deploy checklist note including name patch
- Nav already includes all sections

### Files changed (high level)
- `src/lib/brand.ts`, admin UI defaults, seed, docs, README, migration comment
- `supabase/seed/002_fix_raykova.sql` (new)
- `src/app/admin/(protected)/page.tsx`
- `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` / `npm run build` — this pass

### Manual checks
1. Run `002_fix_raykova.sql` in Supabase.
2. `/admin/site-settings` → official name shows Райкова (or save after patch).
3. Spot-check services SEO titles / homepage section HTML.

### Next step
- Public site shell reading CMS content, or media upload.

---

## 2026-08-05 — Admin Testimonials CMS editor

**Status:** Testimonials list / create / edit implemented. Soft unpublish only; no service FK in schema.

### Pre-change summary
- FAQ editor done; seed executed; public site still placeholder.
- `testimonials`: author_name, author_role, quote, avatar_path, sort_order, is_published.

### Implemented
- `/admin/testimonials` — ordered by sort_order, then created_at
- `/admin/testimonials/new` — create (default author „Клиент (шаблон)“)
- `/admin/testimonials/[id]` — edit
- Validation: quote + author_name required; sort_order numeric
- Soft unpublish; avatar_path as text path only (no upload UI)
- Nav links + empty state

### Manual checks
1. `/admin/testimonials` — 2 seeded placeholders, unpublished
2. Edit → save → success
3. Create new → redirect to edit
4. Do not publish invented quotes

### Files
- `src/lib/cms/testimonials.ts`
- `src/app/admin/(protected)/testimonials/**`
- `layout.tsx`, `page.tsx`, `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed

### Blockers
- None for admin CRUD. Media upload still pending.

### Next step
- Public site shell reading site_settings + published services/FAQs/testimonials, or media upload.

---

## 2026-08-05 — Admin FAQ CMS editor

**Status:** FAQ list / create / edit implemented. Schema has no page/service FK — uses `category` + `is_published`.

### Pre-change summary
- Seed executed; site-settings + services editors exist.
- `faqs`: question, answer, category, sort_order, is_published.

### Implemented
- `/admin/faqs` — list ordered by category, then sort_order
- `/admin/faqs/new` — create
- `/admin/faqs/[id]` — edit
- Validation: question, answer required; sort_order numeric
- Soft unpublish (no hard delete)
- Empty state + nav links
- Session + RLS only

### Manual checks
1. `/admin/faqs` — expect 3 seeded items (category „Общи“, unpublished)
2. Edit one → save → success
3. Create new → redirects to edit
4. „Отпубликувай“ when published

### Files
- `src/lib/cms/faqs.ts`
- `src/app/admin/(protected)/faqs/**`
- `layout.tsx`, `page.tsx`, `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed

### Blockers
- None for admin FAQ CRUD against current schema.

### Next step
- Testimonials editor, or public site reading published FAQs/services/settings.

---

## 2026-08-05 — Seed confirmed executed; Services editor verified/docs polish

**Status:** User confirmed seed SQL executed in Supabase. Services CMS editor already shipped (`/admin/services`, `/admin/services/[id]`); polish + log update this pass.

### Current state summary
| Item | Status |
| ---- | ------ |
| Migration | applied |
| First admin + login | user-verified |
| Seed `001_initial_content.sql` | **executed by user** |
| `/admin/site-settings` | exists |
| `/admin/services` list + edit | exists (by **id**, not slug) |
| Public site | still placeholder |

### Why `[id]` not `[slug]`
Slug is editable; routing by UUID avoids broken edit URLs after rename. Schema has unique `slug` + `id` PK — **id is safer**.

### Expected seeded services in UI (sort_order 0–3)
1. Биорезонанс (`biorezonans`)
2. От тревога към спокойствие (`ot-trevoga-kam-spokoystvie`)
3. Хранителна програма (`hranitelna-programa`)
4. Избери себе си (`izberi-sebe-si`)

### Schema ↔ form mapping
| Concept | Column |
| ------- | ------ |
| short description | `summary` |
| full description | `body` |
| external landing URL | `cta_href` (+ `cta_label`) |
| publish | `status` (`draft`/`published`/`archived`) |
| subtitle / disclaimer | not in schema — omitted |

### This pass changes
- List copy updated for executed seed + empty-state troubleshooting
- Edit page note about field mapping
- DEVELOPMENT_LOG updated

### Manual checks (user)
1. Open `/admin/services` — should list 4 services.
2. Open one → edit title/summary → Save → success message.
3. Confirm status/sort_order/cta_href display on list.

### Commands
- `npm run lint` / `npm run build` — run this pass

### Next recommended step
- FAQ admin editor, or public homepage reading `site_settings` + published services.

---

## 2026-08-05 — Admin Services CMS editor

**Status:** Services list + edit by UUID implemented under `/admin/services`. Mapped to existing schema columns (no subtitle/disclaimer columns).

### Pre-change summary
- Auth + site-settings editor working; seed SQL exists (manual apply).
- `services` table: title, slug, summary, body, cta_label, cta_href, sort_order, status, seo_*.

### Implemented
- `/admin/services` — list by `sort_order` (title, slug, summary, status, cta_href, edit link)
- `/admin/services/[id]` — edit form (id safer than slug when renaming)
- Validation: title, URL-safe slug, numeric sort_order; status draft/published/archived
- Save via server action + SSR client + RLS; loading/success/error
- Empty state + seed reminder if no rows
- Nav links in header + dashboard

### Schema mapping (requested → actual)
| UI | Column |
| -- | ------ |
| short description | `summary` |
| full description | `body` |
| external / CTA URL | `cta_href` (+ `cta_label`) |
| publish state | `status` (not `is_published`) |
| subtitle / disclaimer | **not in schema** — omitted |

### Files
- `src/lib/cms/services.ts`
- `src/app/admin/(protected)/services/page.tsx`
- `src/app/admin/(protected)/services/[id]/page.tsx`
- `src/app/admin/(protected)/services/[id]/service-form.tsx`
- `src/app/admin/(protected)/services/[id]/actions.ts`
- `src/app/admin/(protected)/layout.tsx`, `page.tsx`
- `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed

### Blockers
- If list empty: apply `supabase/seed/001_initial_content.sql` manually.

### Next step
- FAQ editor, testimonials editor, or public pages reading services/settings.

---

## 2026-08-05 — Production checklist, CMS seed, Site Settings editor

**Status:** Production env checklist documented; seed SQL added (manual apply); first CMS editor `/admin/site-settings` live. Login/logout + first admin already user-verified.

### Pre-change summary
- Admin auth complete and verified.
- Migration applied in cloud (user-confirmed earlier).
- No CMS editors / seed content yet.

### Part 1 — Production env
- Reviewed `.env.example`: URL, anon, service role (server-only), site URL.
- Added `docs/PRODUCTION_CHECKLIST.md` (Vercel vars, Auth URLs, Framework Next.js, Root `./`, security).
- Documented: `SUPABASE_SERVICE_ROLE_KEY` never client-side; CMS edits use session + RLS.

### Part 2 — Seed
- `supabase/seed/001_initial_content.sql` + `supabase/seed/README.md`
- Seeds: site_settings (official Цветелина Райкова / display Цвети), pages, homepage sections, 4 services, FAQ/testimonial placeholders
- **Not auto-applied** — user runs in SQL Editor

### Part 3 — Site Settings editor
- Route `/admin/site-settings` (inside protected layout)
- Fields: official/display name, phone, email, CTA label/URL, Instagram/Facebook, SEO title/description
- Server action upsert via SSR client (admin session); loading/success/error; required-field validation
- Nav links from dashboard + admin header

### Files created/modified
- `docs/PRODUCTION_CHECKLIST.md`
- `supabase/seed/001_initial_content.sql`, `supabase/seed/README.md`
- `src/lib/cms/site-settings.ts`
- `src/app/admin/(protected)/site-settings/*`
- `src/app/admin/(protected)/layout.tsx`, `page.tsx`
- `README.md`, `DEVELOPMENT_LOG.md`

### Commands
- `npm run lint` — passed
- `npm run build` — passed (`/admin/site-settings` listed)

### Blockers
- Seed must be applied manually before editor has rows (form still works with defaults/upsert).
- Production Vercel env still user-confirmed separately.

### Next step
1. Apply seed SQL in Supabase.
2. Test `/admin/site-settings` save.
3. Confirm Vercel env checklist.
4. Next CMS: services editor or public home reading settings.

---

## 2026-08-05 — Harden admin login gate + docs (login already implemented)

**Status:** Email/password admin login/logout were already implemented and user-verified. This pass adds non-admin redirect consistency, empty-field validation message, and README/schema setup docs.

### Current state summary (confirmed in code)
| Item | Status |
| ---- | ------ |
| App Router `src/app` | yes |
| Migration file | `supabase/migrations/20260805150000_initial_cms_schema.sql` |
| Cloud migration | applied + first admin — user confirmed earlier (“готово”); agent cannot re-verify cloud |
| `/admin/login` | real form (`signInWithPassword`), not placeholder |
| `/admin` gate | server-side `getCurrentUser` + `isAdmin()` / `admin_profiles` |
| Logout | server action in protected header |
| Service role in browser | not used (login uses anon browser client) |

### Completed this step
- Empty email/password → clear BG error before Supabase call
- Logged-in non-admin visiting `/admin/login` → redirect `/admin/unauthorized`
- README: admin setup steps + Vercel env vars; routes table updated
- `docs/supabase-schema.md`: Vercel env + Auth URL notes

### Files changed
- `src/app/admin/login/login-form.tsx`
- `src/app/admin/login/page.tsx`
- `README.md`
- `docs/supabase-schema.md`
- `DEVELOPMENT_LOG.md`

### Commands run
- `npm run lint` — passed
- `npm run build` — passed

### Assumptions
- User’s earlier confirmation still valid: migration applied, admin row exists, local login works.
- Cloud state not re-queried in this session.

### Blockers
- None for local admin auth.
- Production login still depends on Vercel env vars + Supabase Auth redirect URLs (user may still need to confirm).

### Next recommended steps
1. Confirm Vercel env vars + Auth redirect URLs for production `/admin/login`.
2. CMS seed (`site_settings` / pages) and editors, or public site shell.

---

## 2026-08-05 — Migration applied + first admin confirmed

**Status:** Cloud Supabase schema applied; first admin user created and login verified by user (“готово”).

### Confirmed by user
- SQL migration ran successfully (after order fix).
- Auth user + `admin_profiles` row created.
- Admin login flow works end-to-end.

### Still pending (product)
- Full CMS CRUD UI
- Public marketing pages driven by CMS
- Confirm Vercel env vars match `.env.local` (if not already)
- Supabase Auth redirect URLs for production domain

### Next recommended step
1. Double-check Vercel Environment Variables + Auth URL config for production.
2. Begin CMS seed + editors (site_settings / pages) OR public site shell — pick based on priority.

### Checks this entry
- No code changes; documentation/status only.

---

## 2026-08-05 — Fix migration order: create admin_profiles before is_admin()

**Status:** Migration SQL failed in Dashboard because `is_admin()` referenced `admin_profiles` before the table existed. Order fixed in the same migration file.

### Cause
`ERROR: 42P01: relation "public.admin_profiles" does not exist` at `is_admin()` body.

### Fix
Reorder: `set_updated_at` → `CREATE TABLE admin_profiles` → `is_admin()` → RLS policy → remaining tables.

### User action
Re-run the full fixed file in SQL Editor (safe to re-run helpers via `CREATE OR REPLACE`; tables use `CREATE TABLE` — if a partial run created nothing after the failure, full re-run is fine).

### Checks
- Code lint/build not re-run (SQL-only fix)

---

## 2026-08-05 — Admin login/logout UI + manual migration guide

**Status:** Real `/admin/login` (email/password) and logout implemented. Cloud migration still **manual / pending** (not applied by agent).

**Latest update:** 2026-08-05 ~16:05 UTC+3

### Already in place before this step
- Migration file `supabase/migrations/20260805150000_initial_cms_schema.sql`
- `src/lib/auth/admin.ts` + protected admin layout gate
- SSR/browser Supabase clients; login page was placeholder

### Implemented
- Client login form: `signInWithPassword` → success message → redirect `/admin` + refresh
- Loading / error / success UI states
- Login page redirects existing admins to `/admin`
- Server action `logoutAdmin` + logout button in protected header
- Logout also on `/admin/unauthorized`

### Files created or modified
- `src/app/admin/login/login-form.tsx` (new)
- `src/app/admin/login/page.tsx`
- `src/lib/auth/actions.ts` (new)
- `src/components/admin/logout-button.tsx` (new)
- `src/app/admin/(protected)/layout.tsx`
- `src/app/admin/(protected)/page.tsx`
- `src/app/admin/unauthorized/page.tsx`
- `docs/supabase-schema.md` (login step wording)

### Migration applied?
- **No** — still pending user action in Supabase SQL Editor (see guide in chat / docs).

### First admin (manual)
1. Apply migration SQL in Dashboard.
2. Auth → Add user (email/password).
3. `INSERT INTO admin_profiles …` with that UUID.
4. Sign in at `/admin/login`.

### Checks
- `npm run lint` — passed
- `npm run build` — passed (`/admin`, `/admin/login` dynamic)

### Next recommended step
1. User applies migration + creates first admin.
2. Verify login → `/admin` and logout locally.
3. Ensure Vercel env vars match `.env.local`.
4. Then CMS CRUD screens.

---

## 2026-08-05 — Supabase CMS foundation (schema, RLS, admin gate)

**Status:** Database/auth/storage foundation added in repo. Migrations **not applied** to cloud Supabase yet. Full public site / CMS UI still not built.

**Latest update:** 2026-08-05 ~15:10 UTC+3

### Summary of current project state (pre-change)
- Next.js App Router with `src/app` confirmed.
- Vercel Framework Preset fixed to **Next.js**; Root Directory `./`.
- Phase 0 placeholders + Supabase SSR clients existed; admin only checked login, not `admin_profiles`.

### Completed this step
- SQL migration with all required tables, `is_admin()`, RLS, and `site-assets` storage bucket + policies.
- Admin helpers (`getCurrentUser`, `getAdminProfile`, `isAdmin`).
- Protected `/admin` layout: login redirect + unauthorized for non-admins.
- Public `/admin/unauthorized` page.
- Server action stub for consultation requests (RLS-safe insert, no service role).
- Canonical docs: `docs/supabase-schema.md`.
- Hand-written `src/types/database.ts` aligned to migration.

### Files created or modified
**Created**
- `supabase/migrations/20260805150000_initial_cms_schema.sql`
- `docs/supabase-schema.md`
- `src/lib/auth/admin.ts`
- `src/lib/consultations/submit.ts`
- `src/app/admin/unauthorized/page.tsx`

**Modified**
- `src/app/admin/(protected)/layout.tsx` — admin_profiles gate
- `src/app/admin/(protected)/page.tsx` — dashboard notes
- `src/types/database.ts` — typed tables
- `docs/DATABASE_SCHEMA.md` — points to canonical doc
- `README.md` — docs links
- Removed `supabase/migrations/.gitkeep`

### Important decisions
| Decision | Reason |
| -------- | ------ |
| `admin_profiles` not client-writable | First admin via Dashboard SQL / service role only |
| `page_sections` public read requires parent page published + section published | Prevent draft leaks |
| Consultation insert via anon SSR + RLS | No service role in browser; consent required in DB |
| Bucket `site-assets` public read / admin write | Public website images; no uploads yet |
| Authenticated ≠ admin | Explicit `admin_profiles` check |

### Environment / setup notes
- Local `.env.local` has Supabase URL/keys (not committed).
- Project ref: `jnvbsiydahnkfpkdhkps`
- Migrations **not applied** in this session (no `supabase link` / db push run).
- Vercel: keep Framework **Next.js**, Root Directory **`./`**.

### Commands run
- `npm run lint` — **passed** (exit 0)
- `npm run build` — **passed** (exit 0); routes: `/`, `/admin`, `/admin/login`, `/admin/unauthorized`

### Known blockers
- Cloud DB still empty until migration is applied in Supabase SQL Editor or CLI.
- Admin login UI still placeholder (no `signInWithPassword` form yet).
- First admin user must be created manually after migration.
- Nested local folder `cveti-raykova/` is gitignored (accidental gitlink briefly pushed then removed in follow-up commit `5c081d9`).

### Next recommended steps
1. Apply `20260805150000_initial_cms_schema.sql` in Supabase SQL Editor.
2. Create Auth user + `INSERT` into `admin_profiles` (see docs).
3. Wire `/admin/login` to Supabase Auth.
4. Then CMS editors and public content pages.

### Pending
- [ ] Apply migration to Supabase cloud
- [ ] First admin user
- [ ] Real admin login form
- [ ] Public marketing pages
- [ ] CMS CRUD UI

---

## 2026-08-05 — Diagnosis: Vercel 404 (NOT_FOUND) — not a Next.js routing bug

**Status:** App structure is valid. Preview/production hostnames return Vercel platform `404 NOT_FOUND` (`X-Vercel-Error: NOT_FOUND`), not Next.js `_not-found`.

**Latest update:** 2026-08-05 ~14:40 UTC+3

### Checks performed (no code refactor)

| Check | Result |
| ----- | ------ |
| 1. Homepage route | ✅ `src/app/page.tsx` exists (App Router with `src/`) |
| 2. `package.json` root | ✅ at repo root (`D:\projects\cveti rajkova\site\package.json`) |
| 3. App Router | ✅ `src/app/layout.tsx` + `page.tsx`; no `pages/` router |
| 4. Vercel Root Directory | ✅ should be `.` / empty (project root = GitHub root) |
| 5. Git sync | ✅ `main` matches `origin/main`; latest commits pushed (`27338c8`, `698cd83`) |
| 6. Build / framework | ✅ `npm run build` succeeds; Framework Next.js; scripts `build`/`start` correct; no `vercel.json` override |
| 7. Routes from build | ✅ `/`, `/_not-found`, `/admin`, `/admin/login` |

### Why the preview URL returns 404

HTTP response from deployment hostnames:

```
HTTP/1.1 404 Not Found
X-Vercel-Error: NOT_FOUND
```

Body: `The page could not be found` / `NOT_FOUND` — this is **Vercel edge** saying **no deployment is mapped to that hostname**, not the Next.js app failing to find a page.

Evidence:
- Local/production build generates `/` successfully.
- GitHub deployment statuses point at URLs like `https://tsvetiraykova-fu8rb9ms2-tsveti.vercel.app` with state success, but those hosts currently also return platform `NOT_FOUND`.
- Common production aliases (`tsvetiraykova-tsveti.vercel.app`, `tsveti-raykova.vercel.app`, etc.) also 404.
- Project was **renamed** (`tsveti-site` → `tsveti.raykova`) and Domains were edited manually earlier — classic cause of broken/orphaned `*.vercel.app` hostnames and stale preview links.
- Two projects previously existed (`tsveti.raykova` + `tsveti-site`), which can leave old preview URLs pointing at deleted/orphaned deployments.

**Conclusion:** Code/routes are fine. The broken piece is **Vercel Domains / deployment URL assignment** (or opening an **obsolete preview URL** after rename).

### Exactly what to fix (Vercel setting — minimal)

1. Open project **`tsveti.raykova`** (team **Tsveti**).
2. **Settings → Domains**
   - Ensure there is a valid production domain assigned to this project (re-add the default `*.vercel.app` domain if missing after rename).
   - Do **not** leave Domains empty.
3. **Deployments** → latest **Ready** deploy → click **Visit** (use the URL Vercel shows now — discard old preview bookmarks like `…-1zzilmvz1-…`).
4. If a yellow warning remains on the project: open it — often Domains / Protection related.
5. Optional cleanup: delete duplicate project **`tsveti-site`** if it still exists.
6. **Root Directory:** leave blank / `.` — do **not** set a subdirectory.
7. **Deployment Protection:** if Visit works only when logged into Vercel, disable protection for Production (and Preview if public).

### Minimal change recommended

- **No Next.js code change.**
- **No Root Directory change.**
- Fix **Domains** on `tsveti.raykova` + open **Visit** from the latest Ready deployment.
- After Domains work: set `NEXT_PUBLIC_SITE_URL` to that production domain; add Supabase env vars if missing; Redeploy once.

### Working local URLs (after fix, same paths on Vercel)

- `/` — homepage
- `/admin/login` — admin login placeholder
- `/admin` — admin dashboard (auth gate when Supabase env present)

### Checks run

- `npm run build` — **passed** (routes listed above)
- `curl -I` on latest deployment URL — **404** with `X-Vercel-Error: NOT_FOUND`
- GitHub deployments API — reports success, but hostnames no longer resolve to a live deployment mapping

### Not done this step

- No refactor
- No Root Directory / framework config change in repo
- Domains fix must be done in Vercel dashboard (no local CLI link to client Vercel account)

---

## 2026-08-05 — Vercel deploy triggered successfully

**Status:** Empty commit `698cd83` triggered Vercel production deploy for `tsveti.raykova`. Git connection confirmed OK.

### Completed
- Confirmed Git Settings: connected to `tsvetiraykovaweb/tsveti-site`
- Pushed empty commit to trigger deploy
- GitHub status from vercel[bot]: **Deployment has completed** (success)
- Dashboard: https://vercel.com/tsveti/tsveti.raykova/EU2qLuxww3AAsUdo6xiAYZEBEiuH

### Note
- Earlier push `de5501b` did not create a visible deploy immediately; empty trigger commit resolved it.
- Yellow warning on project sidebar still unexplained — check Domains / Deployment Protection / env.

### Pending
- Confirm env vars on Vercel
- Production public URL + disable Deployment Protection if needed
- Supabase Auth URLs

---

## 2026-08-05 — Supabase project linked; push deploy via GitHub

**Status:** Supabase project `jnvbsiydahnkfpkdhkps` configured locally; `.env.local` present (not committed); push to trigger Vercel.

### Completed
- Set `supabase/config.toml` `project_id` to `jnvbsiydahnkfpkdhkps`
- User filled `.env.local` with URL + anon + service_role keys
- Push to `tsvetiraykovaweb/tsveti-site` to trigger Vercel auto-deploy

### Not committed (by design)
- `.env.local` — secrets stay local only
- Accidental nested folder `cveti-raykova/` (has own `.git`) — left untracked

### Pending (user / Vercel dashboard)
- Confirm env vars on Vercel project `tsveti.raykova` match `.env.local`
- Set `NEXT_PUBLIC_SITE_URL` to production domain from Vercel Domains
- Supabase Auth redirect URLs
- Local Vercel CLI still on vemidi — deploy via GitHub, not `vercel --prod` from this machine

### Checks
- `gh auth` → tsvetiraykovaweb
- `.env.local` keys present (values not logged)

---

## 2026-08-05 — GitHub complete; Supabase/Vercel accounts only (not configured)

**Status:** `tsvetiraykovaweb/tsveti-site` live on GitHub. Supabase + Vercel: registered but no project/env/deploy yet.

### Confirmed ready
- GitHub: https://github.com/tsvetiraykovaweb/tsveti-site (`main`, full codebase)

### Not done yet
- Supabase: no project, no `.env.local`
- Vercel: no client project, CLI still on vemidi account locally

### Next (user)
1. Create Supabase project → `.env.local`
2. Vercel: client login → import repo → env vars → deploy
3. Supabase Auth URLs with Vercel production URL

---

## 2026-08-05 — GitHub push verified; Vercel/Supabase still pending locally

**Status:** Code on `tsvetiraykovaweb/tsveti-site` ✅; local Supabase env and Vercel client link ❌

### Verified
- `gh auth` → **tsvetiraykovaweb**
- Remote `origin` → `tsvetiraykovaweb/tsveti-site`
- GitHub repo not empty; `main` pushed
- Doc updates committed and pushed

### Not ready yet (local check)
- No `.env.local` — Supabase keys not configured locally
- No `.vercel` — project not linked locally
- `vercel whoami` → still **vemidicrafts-3485** / team **ve-mi-di** (vemidi, not client)

### Next for user
1. Supabase: `.env.local` from `.env.example`
2. Vercel: login with **client** account → import `tsvetiraykovaweb/tsveti-site` in dashboard
3. Or locally: `vercel logout` → `vercel login` (client) → `vercel link`

### Checks
- `gh repo view tsvetiraykovaweb/tsveti-site` — OK, has files
- `git push` — OK after tsvetiraykovaweb auth
- Vercel project for tsveti-site on ve-mi-di — not found

---

## 2026-08-05 — Link to tsvetiraykovaweb/tsveti-site (push pending)

**Status:** `origin` → `tsvetiraykovaweb/tsveti-site`; push blocked — local `gh` still authenticated as `vemidi-dev`.

### Completed
- Confirmed empty repo https://github.com/tsvetiraykovaweb/tsveti-site
- Added `git remote origin` → `tsvetiraykovaweb/tsveti-site`
- Updated `docs/DEPLOYMENT.md` and `README.md` with client GitHub account

### Blocker
- `git push` → 403: Permission denied to `vemidi-dev`
- User must `gh auth login` as **tsvetiraykovaweb**, then `git push -u origin main`

### Checks
- `gh repo view tsvetiraykovaweb/tsveti-site` — OK (empty repo)
- `git push` — failed (wrong GitHub account)

### Next
1. `gh auth login` as tsvetiraykovaweb
2. `git push -u origin main`
3. Vercel import from `tsvetiraykovaweb/tsveti-site`

---

## 2026-08-05 — Disconnect from vemidi accounts (client-only setup)

**Status:** Local project detached from vemidi GitHub/Vercel; ready for new client accounts.

**Latest update:** 2026-08-05 (UTC+3)

### Summary of completed work
- Removed `git remote origin` (was `vemidi-dev/cvetelina-raynova`).
- Deleted local `.vercel` link folder.
- Removed Vercel project `cvetelina-raynova` from `ve-mi-di` team via CLI.
- Updated `docs/DEPLOYMENT.md`, `README.md`, `.env.example` — generic client-account instructions, no vemidi URLs.
- Added cleanup checklist for leftover vemidi resources.

### Files created or modified
- `docs/DEPLOYMENT.md` — rewritten for new GitHub/Vercel/Supabase accounts
- `README.md` — deploy steps updated
- `.env.example` — removed hardcoded old Vercel URL
- `DEVELOPMENT_LOG.md` — this entry

### Important decisions
| Decision | Reason |
| -------- | ------ |
| Separate client accounts for GitHub, Vercel, Supabase | Client project; no tie to vemidi personal/business profiles |
| Local repo kept; only remotes/links removed | Code stays; re-push under new GitHub when ready |
| Vercel production site on vemidi removed | Old URL no longer valid |

### Environment / setup notes
- **No `git remote`** configured — add when new GitHub repo exists.
- **No `.vercel`** — run `vercel link` after logging into new Vercel account.
- **GitHub repo on vemidi-dev** may still exist — delete manually (see below).

### Known issues / blockers
- **Manual:** Delete GitHub repo `vemidi-dev/cvetelina-raynova` if it still exists:
  https://github.com/vemidi-dev/cvetelina-raynova/settings → Delete repository
  (CLI delete failed — needs `delete_repo` scope / manual action)
- New GitHub, Vercel, Supabase accounts not created yet (user action).

### Checks run
- `git remote -v` — empty (no remotes)
- `Test-Path .vercel` — False
- `vercel remove cvetelina-raynova` — success on ve-mi-di
- `gh repo delete` — failed (403 / scope); manual delete required

### Next recommended steps
1. User deletes vemidi-dev GitHub repo (if present).
2. Create new GitHub org/user + repo for client.
3. Create new Vercel team + import; `vercel link` locally.
4. Create new Supabase project; fill `.env.local`.
5. Push and deploy under new accounts.

### Pending tasks
- [ ] Delete `vemidi-dev/cvetelina-raynova` on GitHub (manual)
- [ ] New GitHub repo + remote + push
- [ ] New Vercel project + env vars
- [ ] New Supabase project + Auth URLs
- [ ] Phase 1 migrations (unchanged)

### Assumptions
- Local git history on `main` is retained for convenience.
- Client will use entirely new credentials; no shared vemidi infra.

---

## 2026-08-05 — GitHub, Vercel, Supabase deployment wiring

**Status:** Phase 0 complete; repo on GitHub, live on Vercel; Supabase env vars still need user keys.

**Latest update:** 2026-08-05 (morning, UTC+3)

### Summary of completed work
- Created private GitHub repo and pushed `main` branch.
- Linked Vercel project `ve-mi-di/cvetelina-raynova` to GitHub (auto-connect on `vercel link`).
- First production deploy succeeded.
- Added `docs/DEPLOYMENT.md` (BG) with full wiring steps.
- Added `supabase/config.toml` for future CLI link/migrations.
- Added `src/lib/env.ts` for public env helper.
- Added `scripts/sync-vercel-env.ps1` to push `.env.local` vars to Vercel.
- Renamed default branch from `master` to `main`.

### Files created or modified
- `docs/DEPLOYMENT.md` (new)
- `supabase/config.toml` (new)
- `src/lib/env.ts` (new)
- `scripts/sync-vercel-env.ps1` (new)
- `package.json` — `supabase:link`, `supabase:login` scripts
- `README.md` — deploy section updated
- `.env.example` — production URL note
- `.gitignore` — duplicate `.vercel` entry removed

### Important decisions
| Decision | Reason |
| -------- | ------ |
| GitHub repo `vemidi-dev/cvetelina-raynova` (private) | Personal/pro site with future admin CMS |
| Vercel team `ve-mi-di` | Existing Vercel account scope |
| No env vars on Vercel yet | Supabase keys not available in session; user must add via Dashboard or sync script |
| `vercel link` auto-connected GitHub | Vercel CLI connected repo on link — no manual dashboard import needed |

### Environment / setup notes
- **GitHub:** https://github.com/vemidi-dev/cvetelina-raynova
- **Vercel production:** https://cvetelina-raynova.vercel.app
- **Vercel dashboard:** https://vercel.com/ve-mi-di/cvetelina-raynova
- **Supabase CLI:** not logged in locally (`supabase login` required)
- User must:
  1. Copy `.env.example` → `.env.local` and add Supabase keys from Dashboard → Settings → API
  2. Set Supabase Auth redirect URLs (see `docs/DEPLOYMENT.md`)
  3. Run `.\scripts\sync-vercel-env.ps1` then `vercel --prod` OR add vars in Vercel dashboard
  4. For migrations later: `npx supabase login` + `npx supabase link --project-ref <ref>`

### Known issues / blockers
- Vercel has **no environment variables** yet — admin auth will not work until Supabase keys are set.
- Supabase redirect URLs must be configured manually in Supabase dashboard.
- Next.js middleware deprecation warning unchanged.

### Checks run
- `vercel --prod` — **passed** (production deploy READY)
- Local `npm run build` — not re-run this session
- `vercel env ls` — confirmed empty (expected until user adds keys)

### Next recommended steps
1. User adds Supabase keys to `.env.local`.
2. User configures Supabase Auth URLs for localhost + Vercel domain.
3. Run `.\scripts\sync-vercel-env.ps1` and redeploy.
4. Phase 1: SQL migrations from `docs/DATABASE_SCHEMA.md`.

### Pending tasks
- [ ] Supabase `.env.local` + Vercel env vars (user action)
- [ ] Supabase Auth redirect URL configuration (user action)
- [ ] `supabase login` + `supabase link` (optional, for migrations)
- [ ] Phase 1 migrations, public site, CMS (unchanged from Phase 0)

### Assumptions
- GitHub account `vemidi-dev` and Vercel team `ve-mi-di` are the correct accounts for this project.
- Private GitHub repo is acceptable (can be made public later).

---

## 2026-08-04 — Development log introduced

**Status:** Phase 0 foundation complete; log file now required as ongoing handoff memory.

### Completed
- Created `DEVELOPMENT_LOG.md` in project root.
- Documented current project state from the initial scaffold (see entry below).

### Files created
- `DEVELOPMENT_LOG.md`

### Decisions
- Newest-first log entries for faster handoff scanning.
- Update this file after every meaningful implementation step.

### Checks
- Build/tests: not re-run for this documentation-only change.

### Next recommended steps
1. Create Supabase project and fill `.env.local` from `.env.example`.
2. Push repo to GitHub; connect Vercel.
3. Begin Phase 1: migrations from `docs/DATABASE_SCHEMA.md`.

### Pending
- Full public site, CMS admin, real auth, SQL migrations, seed content.

---

## 2026-08-04 — Phase 0: Initial project setup

**Status:** Clean foundation scaffolded and verified. No full site/CMS yet.

**Latest update:** 2026-08-04 (evening, UTC+3)

### Summary of completed work
- Confirmed target folder was empty, then scaffolded Next.js App Router + TypeScript + Tailwind CSS v4.
- Installed `@supabase/supabase-js` and `@supabase/ssr`.
- Added brand config with official name **Цветелина Райкова** and configurable `displayName`.
- Applied brand design tokens and fonts (Cormorant Garamond headings, Manrope body).
- Prepared SSR-compatible Supabase clients (browser / server / middleware refresh / server-only service role).
- Added placeholder routes: `/`, `/admin`, `/admin/login`.
- Protected admin shell via route group `admin/(protected)` so login is not redirected into itself.
- Added `.env.example`, README, implementation plan, draft DB schema (docs only — no final SQL).
- Prepared `supabase/migrations/` for future migrations.
- Ran production build successfully; started local dev server.

### Files created or modified
**Scaffold / config**
- `package.json` (name: `cvetelina-raynova`)
- `package-lock.json`
- `next.config.ts` (Supabase Storage image remotePatterns)
- `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`
- `.gitignore` (allows `.env.example`; ignores secret env files)
- `.env.example`
- `README.md`

**App**
- `src/app/layout.tsx` — BG locale, fonts, metadata from brand
- `src/app/globals.css` — centralized brand tokens via CSS vars + `@theme inline`
- `src/app/page.tsx` — home placeholder
- `src/app/admin/login/page.tsx` — login placeholder
- `src/app/admin/(protected)/layout.tsx` — auth gate when env present
- `src/app/admin/(protected)/page.tsx` — admin dashboard placeholder
- `src/middleware.ts` — session refresh via Supabase helper
- `src/components/.gitkeep`

**Lib / types**
- `src/lib/brand.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/admin.ts` (service role — server only)
- `src/types/database.ts` (placeholder; generate from CLI later)

**Docs / Supabase prep**
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DATABASE_SCHEMA.md` (draft model only)
- `supabase/.gitkeep`
- `supabase/migrations/.gitkeep`

### Important decisions
| Decision | Reason |
| -------- | ------ |
| Official name fixed; `displayName` configurable | Site may use „Цвети“ in informal UI without changing legal/SEO default |
| Brand tokens as CSS custom props + Tailwind `@theme inline` | Avoid circular vars; single source for color/font utilities |
| Admin auth in `admin/(protected)` route group | Keeps `/admin/login` outside redirect loop |
| Service role only in `admin.ts`, never `NEXT_PUBLIC_*` | Prevent key exposure in the browser |
| Schema in markdown first, not SQL migrations yet | Approve content model before locking migrations |
| Stack: Next.js 16 + React 19 + Tailwind 4 + Supabase + Vercel/GitHub | Per project requirements |
| Direction: „Спокойна естествена експертност“ | Brand guidance for future UI |

### Environment / setup notes
- Copy `.env.example` → `.env.local` and set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)
- Without Supabase env vars, admin protection is skipped so local browsing of `/admin` works during setup.
- Local URL used at setup: **http://localhost:3000**
- Deploy path: GitHub repo → Vercel import → same env vars in Vercel dashboard.

### Known issues / blockers
- Next.js 16 build warning: `middleware` file convention deprecated in favor of `proxy`. Supabase SSR still uses middleware pattern; left as-is for now — revisit when migrating to Next.js “proxy” convention.
- No real Supabase project / `.env.local` yet — auth and CMS cannot be tested end-to-end.
- No GitHub remote / Vercel project documented as connected yet.
- Placeholder Database types are empty until migrations exist.
- Full site UI and CMS not started (intentional).

### Checks run
- `npm run build` — **passed** (Next.js 16.3.0 / Turbopack).
- `npm run dev` — **started successfully** at http://localhost:3000.
- Automated tests — **not added / not run** (none in project yet).

### Next recommended steps
1. Create Supabase project; add keys to `.env.local`.
2. Create GitHub repository; push; connect Vercel.
3. Phase 1: turn `docs/DATABASE_SCHEMA.md` into first SQL migration(s); enable RLS sketch; generate types.
4. Phase 2: public marketing layout and content-driven pages.
5. Phase 3: real admin login + CMS CRUD.

### Pending tasks
- [ ] Supabase project + env configuration
- [ ] GitHub remote + Vercel deployment wiring
- [ ] SQL migrations + RLS + Storage buckets
- [ ] Generate `src/types/database.ts` from schema
- [ ] Public site pages (home, services, about, FAQ, contact, testimonials)
- [ ] Admin auth UI + role checks
- [ ] CMS editors for text, services, FAQ, testimonials, SEO, CTAs, contact, images
- [ ] Seed Bulgarian placeholder content
- [ ] Address Next.js middleware → proxy deprecation when appropriate

### Assumptions
- Primary locale is Bulgarian (`bg`).
- Single-admin (or few admins) CMS is sufficient at launch; no multi-tenant.
- Content will live in Supabase (not a separate headless CMS).
- Display name may later switch to „Цвети“ via `brand.displayName` and/or `site_settings`.
- No commit/push was required beyond what `create-next-app` initialized locally.
