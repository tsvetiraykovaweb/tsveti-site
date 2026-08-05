-- Homepage image section slots for Page Content CMS.
-- Safe to re-run. Paths stay empty until set via /admin/pages → home sections.

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT p.id, v.key, v.section_type, v.content::jsonb, v.sort_order, true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'hero_image',
      'image',
      '{"image_path":"","image_alt":"Начална визуализация — Цветелина Райкова","heading":"Hero изображение"}',
      10
    ),
    (
      'about_image',
      'image',
      '{"image_path":"","image_alt":"За Цвети — визуал","heading":"About изображение на началната страница"}',
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
