# Seed content

Initial editable CMS data for **Цветелина Райкова** / display name **Цвети**.

## Corrections

If older seed data used **Райнова**, apply `002_fix_raykova.sql` after `001_initial_content.sql`.

CTA URLs: `003_consultation_cta_urls.sql`  
Page Content CMS (About/Contact/Privacy): `004_page_content_cms.sql`  
Media caption column: `supabase/migrations/20260805180000_media_assets_caption.sql`  
Home image slots: `005_home_image_sections.sql`

## Files

- `001_initial_content.sql` — base CMS seed
- `002_fix_raykova.sql` — name correction
- `003_consultation_cta_urls.sql` — CTA path patch
- `004_page_content_cms.sql` — `za-cveti` / `kontakti` / `politika-za-poveritelnost` pages + sections
- `005_home_image_sections.sql` — `home` sections `hero_image` / `about_image`

## Prerequisites

1. Migration `supabase/migrations/20260805150000_initial_cms_schema.sql` already applied.
2. At least one admin in `admin_profiles` (for later editing in the app).

## Apply (manual)

1. Open [Supabase SQL Editor](https://supabase.com/dashboard).
2. Paste and **Run** each needed file in order.
3. Confirm pages:

```sql
SELECT slug, title, status FROM public.pages ORDER BY sort_order;
SELECT p.slug, s.key, s.is_published
FROM public.page_sections s
JOIN public.pages p ON p.id = s.page_id
WHERE p.slug IN ('za-cveti', 'kontakti', 'politika-za-poveritelnost', 'home')
ORDER BY p.slug, s.sort_order;
```

## What is seeded

| Area | Notes |
| ---- | ----- |
| `site_settings` | official/display name, phone, email, CTA, social_links, SEO defaults |
| `pages` | home, services; plus `za-cveti`, `kontakti`, `politika-za-poveritelnost` (via 004) |
| `page_sections` | homepage hero/intro/CTA; About/Contact/Privacy starters (004) |
| `services` | Биорезонанс, От тревога към спокойствие, Хранителна програма, Избери себе си |
| `faqs` | 3 unpublished placeholders |
| `testimonials` | 2 unpublished placeholders (not real quotes) |

## Rules

- No invented qualifications, certificates, prices, medical claims, or real testimonials.
- Re-running upserts settings/pages/services/sections; FAQ/testimonials skip if the same question/quote already exists.
