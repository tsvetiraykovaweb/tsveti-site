# Launch checklist — Цветелина Райкова

Кратък production-readiness списък. Отметнете преди публичен launch.

Жива admin проверка: **`/admin/readiness`** (статус + бързи връзки; без secret стойности).

## Infrastructure

- [ ] Supabase migrations applied (`20260805150000_initial_cms_schema.sql`, `20260805180000_media_assets_caption.sql`)
- [ ] Seeds / patches run as needed (`001`…`005`, esp. `002_fix_raykova`, `004_page_content_cms`, `005_home_image_sections`)
- [ ] At least one `admin_profiles` row for the Auth user
- [ ] Vercel project: Framework = Next.js, Root = `./`
- [ ] Production domain / `NEXT_PUBLIC_SITE_URL` set

## Environment variables (Vercel)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-only — never `NEXT_PUBLIC_`)
- [ ] `NEXT_PUBLIC_SITE_URL` (production URL)
- [ ] Optional email: `RESEND_API_KEY`, `CONSULTATION_NOTIFY_TO`, `CONSULTATION_NOTIFY_FROM`

## Admin

- [ ] `/admin/login` works
- [ ] Logout works
- [ ] Open `/admin/readiness` and clear missing/warn items (or accept intentional warnings)
- [ ] CMS: settings, services, FAQs, testimonials, pages, media, consultation requests
- [ ] Media upload creates WebP variants in `site-assets` + `media_assets` row
- [ ] Service `image_path` selectable from media library
- [ ] Home page sections `hero_image` / `about_image` editable under `/admin/pages` (slug `home`)

## Public flows

- [ ] `/` homepage (hero/about image slots + fallbacks; FAQ/отзиви секции само ако има съдържание)
- [ ] `/uslugi` and `/uslugi/[slug]` (BG URLs, not `/services`)
- [ ] `/za-cveti`, `/kontakti`, `/bezplatna-konsultatsia`, `/politika-za-poveritelnost`
- [ ] Flat nav: separate service items, no dropdown
- [ ] Consultation form validates + inserts into `consultation_requests`
- [ ] Consultation consent links to privacy policy
- [ ] Form still succeeds if Resend env is missing
- [ ] With Resend configured: notification email arrives (name/phone/email/service/contact + brief message if any; full details in admin)

## SEO / robots

- [ ] `/sitemap.xml` lists public routes only
- [ ] `/robots.txt` disallows `/admin`
- [ ] Admin pages have noindex
- [ ] Privacy draft remains noindex until legal review

## Content & safety

- [ ] Official name is **Цветелина Райкова** (not Райнова / Райново)
- [ ] No invented testimonials published
- [ ] No invented qualifications/certificates on About (empty qualifications stay hidden)
- [ ] No medical claims (`лекува`, `диагностицира`, `гарантира`, `премахва тревожността`)
- [ ] Privacy / legal copy reviewed by a professional before treating it as final
- [ ] Emergency disclaimer present on contact / consultation surfaces

## Smoke test after deploy

- [ ] Submit one real test consultation request
- [ ] Confirm it appears in `/admin/consultation-requests`
- [ ] Update status
- [ ] Upload one test image and attach to a service / home section
- [ ] Check mobile header «Меню» and primary CTA
- [ ] Re-check `/admin/readiness` on production
