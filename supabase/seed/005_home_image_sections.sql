-- Homepage image section slots for Page Content CMS.
-- Safe to re-run. Omit image_path until set via /admin/pages → home.
--
-- Apply: Supabase Dashboard → SQL Editor → paste ALL of this file → Run.
-- Requires page slug `home` (from 001_initial_content.sql).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'home') THEN
    RAISE EXCEPTION 'Page slug home is missing. Run 001_initial_content.sql first.';
  END IF;
END $$;

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT
  p.id,
  v.key,
  v.section_type,
  v.content,
  v.sort_order,
  true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'hero_image',
      'image',
      jsonb_build_object(
        'heading', 'Hero изображение',
        'image_alt', 'Начална визуализация — Цветелина Райкова'
      ),
      10
    ),
    (
      'about_image',
      'image',
      jsonb_build_object(
        'heading', 'About изображение на началната страница',
        'image_alt', 'За Цвети — визуал'
      ),
      11
    )
) AS v(key, section_type, content, sort_order)
WHERE p.slug = 'home'
ON CONFLICT (page_id, key) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  content = CASE
    WHEN coalesce(public.page_sections.content->>'image_path', '') = ''
      THEN EXCLUDED.content
    ELSE public.page_sections.content
  END,
  sort_order = EXCLUDED.sort_order,
  is_published = true,
  updated_at = now();
