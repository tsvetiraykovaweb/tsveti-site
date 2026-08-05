-- Initial editable CMS content (Bulgarian placeholders)
-- Safe to re-run: uses ON CONFLICT upserts where possible.
-- Apply AFTER 20260805150000_initial_cms_schema.sql
--
-- How to apply:
--   Supabase Dashboard → SQL Editor → paste this file → Run
--
-- Official name: Цветелина Райнова
-- Display name: Цвети
-- No invented qualifications, certificates, prices, medical claims, or real testimonials.

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------

INSERT INTO public.site_settings (key, value, label) VALUES
  ('official_name', to_jsonb('Цветелина Райнова'::text), 'Официално име'),
  ('display_name', to_jsonb('Цвети'::text), 'Име за показване'),
  ('phone', to_jsonb(''::text), 'Телефон'),
  ('email', to_jsonb(''::text), 'Имейл'),
  ('primary_cta_label', to_jsonb('Запиши консултация'::text), 'Основен CTA текст'),
  ('primary_cta_url', to_jsonb('/#consultation'::text), 'Основен CTA линк'),
  ('social_links', '{"instagram":"","facebook":""}'::jsonb, 'Социални мрежи'),
  ('seo_title', to_jsonb('Цветелина Райнова'::text), 'SEO заглавие (по подразбиране)'),
  ('seo_description', to_jsonb('Спокойна естествена експертност. Съдържанието ще бъде допълнено.'::text), 'SEO описание (по подразбиране)')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

INSERT INTO public.pages (slug, title, status, seo_title, seo_description, sort_order, published_at)
VALUES
  (
    'home',
    'Начало',
    'published',
    'Цветелина Райнова',
    'Спокойна естествена експертност. Начална страница — съдържанието се редактира от админ панела.',
    0,
    now()
  ),
  (
    'services',
    'Услуги',
    'published',
    'Услуги · Цветелина Райнова',
    'Преглед на услугите. Описанията са начални шаблони и могат да се редактират.',
    1,
    now()
  ),
  (
    'about',
    'За мен',
    'draft',
    'За мен · Цветелина Райнова',
    'Кратък текст за Цвети — попълва се по-късно.',
    2,
    NULL
  ),
  (
    'faq',
    'Често задавани въпроси',
    'draft',
    'Въпроси · Цветелина Райнова',
    'Начални въпроси и отговори — шаблони.',
    3,
    NULL
  ),
  (
    'contact',
    'Контакт',
    'draft',
    'Контакт · Цветелина Райнова',
    'Как да се свържете. Данните се управляват от настройките на сайта.',
    4,
    NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.pages.published_at, EXCLUDED.published_at),
  updated_at = now();

-- ---------------------------------------------------------------------------
-- homepage page_sections
-- ---------------------------------------------------------------------------

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT p.id, v.key, v.section_type, v.content::jsonb, v.sort_order, v.is_published
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'hero_headline',
      'text',
      '{"text":"Цвети"}',
      0,
      true
    ),
    (
      'hero_supporting',
      'text',
      '{"text":"Спокойна естествена експертност. Това е начален текст — редактира се от админ панела."}',
      1,
      true
    ),
    (
      'intro',
      'richtext',
      '{"html":"<p>Добре дошли. Тук ще има кратко представяне на подхода и услугите на Цветелина Райнова. Текстът е шаблон и ще бъде заменен с финално съдържание.</p>"}',
      2,
      true
    ),
    (
      'cta_banner',
      'cta',
      '{"label":"Запиши консултация","href":"/#consultation","note":"Линкът и етикетът могат да се синхронизират с site_settings."}',
      3,
      true
    )
) AS v(key, section_type, content, sort_order, is_published)
WHERE p.slug = 'home'
ON CONFLICT (page_id, key) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- services (four named offerings — placeholders only)
-- ---------------------------------------------------------------------------

INSERT INTO public.services (
  slug, title, summary, body, cta_label, cta_href, sort_order, status,
  seo_title, seo_description, published_at
) VALUES
  (
    'biorezonans',
    'Биорезонанс',
    'Начално описание на услугата Биорезонанс. Подробностите ще бъдат добавени от админ панела.',
    'Пълният текст на услугата е шаблон. Не включва медицински твърдения, цени или сертификати — попълва се ръчно.',
    'Запитване',
    '/#consultation',
    0,
    'published',
    'Биорезонанс · Цветелина Райнова',
    'Информация за услугата Биорезонанс — съдържанието е редактируемо.',
    now()
  ),
  (
    'ot-trevoga-kam-spokoystvie',
    'От тревога към спокойствие',
    'Начално описание на програмата „От тревога към спокойствие“. Детайлите се редактират по-късно.',
    'Шаблонно съдържание. Без обещания за резултати и без медицински твърдения.',
    'Запитване',
    '/#consultation',
    1,
    'published',
    'От тревога към спокойствие · Цветелина Райнова',
    'Информация за програмата — редактируемо съдържание.',
    now()
  ),
  (
    'hranitelna-programa',
    'Хранителна програма',
    'Начално описание на хранителната програма. Конкретните насоки се добавят от админ панела.',
    'Шаблонно съдържание. Без менюта, цени или медицински съвети — попълва се ръчно.',
    'Запитване',
    '/#consultation',
    2,
    'published',
    'Хранителна програма · Цветелина Райнова',
    'Информация за хранителната програма — редактируемо съдържание.',
    now()
  ),
  (
    'izberi-sebe-si',
    'Избери себе си',
    'Начално описание на „Избери себе си“. Текстът е шаблон и може да се промени по всяко време.',
    'Шаблонно съдържание без външни линкове и без измислени квалификации.',
    'Запитване',
    '/#consultation',
    3,
    'published',
    'Избери себе си · Цветелина Райнова',
    'Информация за услугата — редактируемо съдържание.',
    now()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  body = EXCLUDED.body,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href,
  sort_order = EXCLUDED.sort_order,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  published_at = COALESCE(public.services.published_at, EXCLUDED.published_at),
  updated_at = now();

-- ---------------------------------------------------------------------------
-- faqs (unpublished placeholders)
-- ---------------------------------------------------------------------------

-- Clear only seed-marked placeholder FAQs on re-run is hard without a flag.
-- Insert if table has fewer than 3 rows with these exact questions (idempotent-ish).
INSERT INTO public.faqs (question, answer, category, sort_order, is_published)
SELECT * FROM (
  VALUES
    (
      'Как да запиша консултация?',
      'Свържете се чрез формата за запитване или посочените контакти в настройките на сайта. Този отговор е шаблон.',
      'Общи',
      0,
      false
    ),
    (
      'Как протича първата среща?',
      'Описанието на процеса ще бъде добавено тук. Текстът е начален шаблон за редакция.',
      'Общи',
      1,
      false
    ),
    (
      'Онлайн или на място?',
      'Информацията за формата на срещите ще бъде уточнена. Шаблонен отговор.',
      'Общи',
      2,
      false
    )
) AS v(question, answer, category, sort_order, is_published)
WHERE NOT EXISTS (
  SELECT 1 FROM public.faqs f WHERE f.question = v.question
);

-- ---------------------------------------------------------------------------
-- testimonials (unpublished placeholders — not real quotes)
-- ---------------------------------------------------------------------------

INSERT INTO public.testimonials (author_name, author_role, quote, sort_order, is_published)
SELECT * FROM (
  VALUES
    (
      'Клиент (шаблон)',
      NULL,
      'Това е примерен текст за отзив. Ще бъде заменен с реално одобрено съдържание.',
      0,
      false
    ),
    (
      'Клиент (шаблон)',
      NULL,
      'Втори примерен отзив — не е истински цитат. Редактира се от админ панела.',
      1,
      false
    )
) AS v(author_name, author_role, quote, sort_order, is_published)
WHERE NOT EXISTS (
  SELECT 1 FROM public.testimonials t WHERE t.quote = v.quote
);
