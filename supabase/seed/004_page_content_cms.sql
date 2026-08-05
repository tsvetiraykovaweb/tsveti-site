-- Page Content CMS: public pages + starter sections for About / Contact / Privacy.
-- Safe to re-run (upserts by slug / page_id+key).
-- Does not invent qualifications or legal claims — placeholders only.

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------

INSERT INTO public.pages (slug, title, status, seo_title, seo_description, sort_order, published_at)
VALUES
  (
    'za-cveti',
    'За Цвети',
    'published',
    'За Цвети · Цветелина Райкова',
    'Запознайте се с Цветелина Райкова — спокоен, индивидуален подход и насоки за подкрепа.',
    10,
    now()
  ),
  (
    'kontakti',
    'Контакти',
    'published',
    'Контакти · Цветелина Райкова',
    'Свържете се с Цветелина Райкова за кратък опознавателен разговор и насоки.',
    11,
    now()
  ),
  (
    'politika-za-poveritelnost',
    'Политика за поверителност',
    'published',
    'Политика за поверителност · Цветелина Райкова',
    'Чернова на политика за поверителност. Изисква правна проверка преди публично стартиране.',
    12,
    now()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  sort_order = EXCLUDED.sort_order,
  published_at = COALESCE(public.pages.published_at, EXCLUDED.published_at),
  updated_at = now();

-- Also publish existing about/contact drafts if present (optional aliases in admin list).
UPDATE public.pages
SET status = 'published',
    published_at = COALESCE(published_at, now()),
    updated_at = now()
WHERE slug IN ('about', 'contact') AND status = 'draft';

-- ---------------------------------------------------------------------------
-- za-cveti sections
-- ---------------------------------------------------------------------------

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT p.id, v.key, v.section_type, v.content::jsonb, v.sort_order, true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'intro',
      'text',
      '{"heading":"За Цвети","eyebrow":"Спокойна естествена експертност","text":"Индивидуален подход и ясни насоки за подкрепа в ежедневието. Тук ще намерите кратък преглед на начина на работа.","image_alt":"Портрет — визуалът се добавя от медия библиотеката"}',
      0
    ),
    (
      'story',
      'text',
      '{"heading":"Лична история","text":"Личната история ще бъде допълнена тук — кратък, човешки текст без медицински твърдения и без измислени биографични детайли.","image_alt":"Визуал към историята"}',
      1
    ),
    (
      'approach',
      'list',
      '{"heading":"Подходът на работа","text":"Спокоен опознавателен разговор — заедно се уточнява коя посока може да е подходяща.\nИндивидуален подход с насоки, които могат да подпомогнат по-добро усещане за баланс.\nПодкрепа според вашето темпо — без натиск и без обещания за конкретни резултати."}',
      2
    ),
    (
      'values',
      'list',
      '{"heading":"Ценности","text":"Уважение към личните граници и темпото на всеки човек.\nЯсна и спокойна комуникация.\nЧестност — без преувеличени обещания.\nПодкрепа чрез практически насоки, когато това е уместно."}',
      3
    ),
    (
      'qualifications',
      'list',
      '{"heading":"Образование и квалификации","text":"","eyebrow":"Шаблон — попълнете само потвърдени данни. Празният списък не се показва публично."}',
      4
    ),
    (
      'cta',
      'cta',
      '{"heading":"Готови ли сте за разговор?","text":"Запазете безплатна консултация — кратък опознавателен разговор, в който ще обсъдим коя посока е подходяща.","cta_label":"Запази безплатна консултация","cta_href":"/bezplatna-konsultatsia"}',
      5
    )
) AS v(key, section_type, content, sort_order)
WHERE p.slug = 'za-cveti'
ON CONFLICT (page_id, key) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- kontakti sections
-- ---------------------------------------------------------------------------

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT p.id, v.key, v.section_type, v.content::jsonb, v.sort_order, true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'intro',
      'text',
      '{"heading":"Контакти","text":"Свържете се за уточняване на следваща стъпка. За предпочитане е да запазите безплатна консултация през формата."}',
      0
    ),
    (
      'cta',
      'cta',
      '{"heading":"Безплатна консултация","text":"Оставете кратки данни през формата. Това е опознавателен разговор — ще обсъдим коя посока е подходяща, с индивидуален подход и спокойни насоки.","cta_label":"Запази безплатна консултация","cta_href":"/bezplatna-konsultatsia"}',
      1
    ),
    (
      'disclaimer',
      'text',
      '{"heading":"Важна бележка","text":"Формата и контактните канали не са предназначени за спешни или животозастрашаващи ситуации. При спешна медицинска нужда се обърнете към спешна помощ или квалифициран здравен специалист."}',
      2
    )
) AS v(key, section_type, content, sort_order)
WHERE p.slug = 'kontakti'
ON CONFLICT (page_id, key) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- politika-za-poveritelnost sections (draft legal placeholders)
-- ---------------------------------------------------------------------------

INSERT INTO public.page_sections (page_id, key, section_type, content, sort_order, is_published)
SELECT p.id, v.key, v.section_type, v.content::jsonb, v.sort_order, true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'intro',
      'text',
      '{"heading":"Политика за поверителност","eyebrow":"Чернова · правна проверка е нужна","text":"Този текст е предварителен шаблон. Не представлява окончателен правен съвет и трябва да бъде прегледан от специалист преди официално стартиране."}',
      0
    ),
    (
      'data_collected',
      'list',
      '{"heading":"Какви данни събираме","text":"име\nтелефон\nимейл (по желание)\nинтерес към услуга\nпредпочитан начин за връзка\nкратко съобщение (по желание)\nсъгласие за обработка с цел връзка"}',
      1
    ),
    (
      'purpose',
      'text',
      '{"heading":"Защо се събират","text":"Данните се използват единствено, за да се осъществи връзка по заявката и да се уточни кратък опознавателен разговор. Не се използват за медицинска диагноза или лечение."}',
      2
    ),
    (
      'sensitive',
      'text',
      '{"heading":"Чувствителни здравни данни","text":"Моля, не изпращайте през формата диагнози, лекарства, резултати от изследвания, подробна здравна история или други чувствителни медицински данни."}',
      3
    ),
    (
      'storage',
      'text',
      '{"heading":"Съхранение и достъп","text":"Заявките се съхраняват в защитен бекенд и са видими само за упълномощени администратори. Публичните страници не показват съдържанието на заявките."}',
      4
    ),
    (
      'rights',
      'text',
      '{"heading":"Вашите права и връзка","text":"За въпроси относно личните данни може да се свържете през страница Контакти. Точните срокове, правни основания и процедури ще бъдат уточнени след правна редакция."}',
      5
    ),
    (
      'legal_note',
      'text',
      '{"heading":"Важно преди публично стартиране","text":"Тази страница е чернова. Нужна е правна проверка и финален текст, съобразен с приложимото законодателство."}',
      6
    )
) AS v(key, section_type, content, sort_order)
WHERE p.slug = 'politika-za-poveritelnost'
ON CONFLICT (page_id, key) DO UPDATE SET
  section_type = EXCLUDED.section_type,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();
