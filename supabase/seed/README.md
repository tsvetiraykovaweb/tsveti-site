# Seed content

Initial editable CMS data for **Цветелина Райнова** / display name **Цвети**.

## File

`supabase/seed/001_initial_content.sql`

## Prerequisites

1. Migration `supabase/migrations/20260805150000_initial_cms_schema.sql` already applied.
2. At least one admin in `admin_profiles` (for later editing in the app).

## Apply (manual)

1. Open [Supabase SQL Editor](https://supabase.com/dashboard).
2. Paste the full contents of `001_initial_content.sql`.
3. **Run**.
4. Confirm:

```sql
SELECT key, value FROM public.site_settings ORDER BY key;
SELECT slug, title, status FROM public.pages ORDER BY sort_order;
SELECT slug, title, status FROM public.services ORDER BY sort_order;
SELECT question, is_published FROM public.faqs ORDER BY sort_order;
SELECT author_name, is_published FROM public.testimonials ORDER BY sort_order;
```

## What is seeded

| Area | Notes |
| ---- | ----- |
| `site_settings` | official/display name, phone, email, CTA, social_links, SEO defaults |
| `pages` | home (published), services (published), about/faq/contact (draft) |
| `page_sections` | homepage hero / intro / CTA placeholders |
| `services` | Биорезонанс, От тревога към спокойствие, Хранителна програма, Избери себе си |
| `faqs` | 3 unpublished placeholders |
| `testimonials` | 2 unpublished placeholders (not real quotes) |

## Rules

- No invented qualifications, certificates, prices, medical claims, or real testimonials.
- Re-running upserts settings/pages/services/sections; FAQ/testimonials skip if the same question/quote already exists.
