-- Patch: correct official surname Райнова → Райкова in seeded CMS content.
-- Run in Supabase SQL Editor AFTER seed if the old spelling is already in the DB.
-- Safe to re-run.

-- site_settings JSON text values
UPDATE public.site_settings
SET
  value = to_jsonb(replace(value #>> '{}', 'Райнова', 'Райкова')),
  updated_at = now()
WHERE value #>> '{}' LIKE '%Райнова%';

-- pages SEO / titles
UPDATE public.pages
SET
  title = replace(title, 'Райнова', 'Райкова'),
  seo_title = replace(seo_title, 'Райнова', 'Райкова'),
  seo_description = replace(seo_description, 'Райнова', 'Райкова'),
  updated_at = now()
WHERE coalesce(title, '') LIKE '%Райнова%'
   OR coalesce(seo_title, '') LIKE '%Райнова%'
   OR coalesce(seo_description, '') LIKE '%Райнова%';

-- homepage / page section JSON content
UPDATE public.page_sections
SET
  content = replace(content::text, 'Райнова', 'Райкова')::jsonb,
  updated_at = now()
WHERE content::text LIKE '%Райнова%';

-- services SEO fields / body / summary
UPDATE public.services
SET
  title = replace(title, 'Райнова', 'Райкова'),
  summary = replace(summary, 'Райнова', 'Райкова'),
  body = replace(body, 'Райнова', 'Райкова'),
  seo_title = replace(seo_title, 'Райнова', 'Райкова'),
  seo_description = replace(seo_description, 'Райнова', 'Райкова'),
  updated_at = now()
WHERE coalesce(title, '') LIKE '%Райнова%'
   OR coalesce(summary, '') LIKE '%Райнова%'
   OR coalesce(body, '') LIKE '%Райнова%'
   OR coalesce(seo_title, '') LIKE '%Райнова%'
   OR coalesce(seo_description, '') LIKE '%Райнова%';

-- admin display name if set with old spelling
UPDATE public.admin_profiles
SET
  full_name = replace(full_name, 'Райнова', 'Райкова'),
  updated_at = now()
WHERE coalesce(full_name, '') LIKE '%Райнова%';

-- Verify
SELECT key, value FROM public.site_settings WHERE key IN ('official_name', 'display_name', 'seo_title');
