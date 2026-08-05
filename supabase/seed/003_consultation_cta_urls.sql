-- Optional: point site CTA and service CTAs at the consultation form.
-- Safe to re-run. Does not change custom https:// landing URLs.

UPDATE public.site_settings
SET
  value = to_jsonb('/bezplatna-konsultatsia'::text),
  updated_at = now()
WHERE key = 'primary_cta_url'
  AND value #>> '{}' IN ('/#consultation', '#consultation', '/consultation');

UPDATE public.services
SET
  cta_href = '/bezplatna-konsultatsia',
  updated_at = now()
WHERE cta_href IN ('/#consultation', '#consultation', '/consultation');
