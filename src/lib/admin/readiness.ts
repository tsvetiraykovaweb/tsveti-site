import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { SITE_SETTING_KEYS, rowsToFormValues } from "@/lib/cms/site-settings";
import { parseSectionContent } from "@/lib/cms/pages";

export type ReadinessTone = "ok" | "warn" | "missing" | "info";

export type ReadinessCheck = {
  id: string;
  label: string;
  tone: ReadinessTone;
  detail: string;
  href?: string;
};

export type ReadinessQuickLink = {
  label: string;
  href: string;
  note?: string;
};

export type LaunchReadiness = {
  checks: ReadinessCheck[];
  quickLinks: ReadinessQuickLink[];
  warnings: string[];
  summary: { ok: number; warn: number; missing: number };
};

function envConfigured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function sectionHasImagePath(content: unknown): boolean {
  const fields = parseSectionContent(content);
  return Boolean(fields.image_path.trim());
}

function seoOk(title: string | null | undefined, description: string | null | undefined) {
  return Boolean(title?.trim() && description?.trim());
}

/**
 * Server-only launch readiness snapshot for admin.
 * Never returns secret env values — only configured / missing.
 */
export async function getLaunchReadiness(): Promise<LaunchReadiness> {
  const { isSupabaseConfigured, siteUrl } = getPublicEnv();
  const siteUrlEnvSet = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
  const siteUrlLooksLocal =
    /localhost|127\.0\.0\.1/i.test(siteUrl) || !siteUrlEnvSet;

  const checks: ReadinessCheck[] = [];
  const warnings: string[] = [];
  const quickLinks: ReadinessQuickLink[] = [
    { label: "Настройки", href: "/admin/site-settings" },
    { label: "Услуги", href: "/admin/services" },
    { label: "Медия", href: "/admin/media" },
    { label: "FAQ", href: "/admin/faqs" },
    { label: "Отзиви (по избор)", href: "/admin/testimonials", note: "optional" },
    { label: "Страници", href: "/admin/pages" },
    { label: "Заявки", href: "/admin/consultation-requests" },
  ];

  checks.push({
    id: "site_url",
    label: "NEXT_PUBLIC_SITE_URL",
    tone: siteUrlEnvSet && !siteUrlLooksLocal ? "ok" : siteUrlEnvSet ? "warn" : "missing",
    detail: !siteUrlEnvSet
      ? "Липсва. За production задайте реалния домейн в Vercel."
      : siteUrlLooksLocal
        ? "Зададен е, но изглежда локален — сменете го преди публичен launch."
        : "Configured (стойността не се показва).",
  });

  const resendKey = envConfigured("RESEND_API_KEY");
  const resendTo = envConfigured("CONSULTATION_NOTIFY_TO");
  const resendFrom = envConfigured("CONSULTATION_NOTIFY_FROM");
  const resendReady = resendKey && resendTo;
  checks.push({
    id: "resend",
    label: "Resend email notify",
    tone: resendReady ? (resendFrom ? "ok" : "warn") : "warn",
    detail: resendReady
      ? `API key: configured · TO: configured · FROM: ${resendFrom ? "configured" : "missing (ще ползва test default)"}`
      : `API key: ${resendKey ? "configured" : "missing"} · TO: ${resendTo ? "configured" : "missing"} · FROM: ${resendFrom ? "configured" : "missing"}. Формата пак записва заявки без email.`,
  });

  const cronSecretConfigured = envConfigured("CRON_SECRET");
  checks.push({
    id: "cron_secret",
    label: "CRON_SECRET (Vercel cron)",
    tone: cronSecretConfigured ? "ok" : "warn",
    detail: cronSecretConfigured
      ? "Configured. Vercel изпраща Bearer header към /api/cron/supabase-heartbeat."
      : "Липсва — cron job-ът ще връща 401. Добавете в Vercel Production env.",
  });

  if (!isSupabaseConfigured) {
    checks.push({
      id: "supabase",
      label: "Supabase",
      tone: "missing",
      detail: "NEXT_PUBLIC_SUPABASE_URL / ANON_KEY липсват — CMS проверките са пропуснати.",
    });
    return finalize(checks, quickLinks, warnings);
  }

  const supabase = await createClient();

  const [
    settingsRes,
    servicesRes,
    faqsRes,
    testimonialsRes,
    pagesRes,
  ] = await Promise.all([
    supabase.from("site_settings").select("key, value").in("key", [...SITE_SETTING_KEYS]),
    supabase
      .from("services")
      .select("id, title, slug, status, image_path, seo_title, seo_description")
      .eq("status", "published"),
    supabase
      .from("faqs")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("pages")
      .select("id, slug, title, status, seo_title, seo_description")
      .in("slug", [
        "home",
        "za-cveti",
        "kontakti",
        "politika-za-poveritelnost",
      ]),
  ]);

  const settings = rowsToFormValues(settingsRes.data ?? []);
  const settingsMissing: string[] = [];
  if (!settings.official_name.trim()) settingsMissing.push("official_name");
  if (!settings.display_name.trim()) settingsMissing.push("display_name");
  if (!settings.phone.trim() && !settings.email.trim()) {
    settingsMissing.push("phone или email");
  }
  if (!settings.primary_cta_label.trim() || !settings.primary_cta_url.trim()) {
    settingsMissing.push("primary CTA");
  }
  if (!settings.seo_title.trim() || !settings.seo_description.trim()) {
    settingsMissing.push("SEO title/description");
  }
  if (
    settings.official_name.trim() &&
    !settings.official_name.includes("Райкова")
  ) {
    warnings.push(
      "Официалното име в настройките не съдържа „Райкова“ — проверете за грешка.",
    );
  }

  checks.push({
    id: "site_settings",
    label: "Основни site_settings",
    tone: settingsMissing.length === 0 ? "ok" : "missing",
    detail:
      settingsMissing.length === 0
        ? "Име, контакт, CTA и SEO са попълнени."
        : `Липсва: ${settingsMissing.join(", ")}.`,
    href: "/admin/site-settings",
  });

  const publishedServices = servicesRes.data ?? [];
  checks.push({
    id: "services",
    label: "Публикувани услуги",
    tone: publishedServices.length > 0 ? "ok" : "missing",
    detail:
      publishedServices.length > 0
        ? `${publishedServices.length} публикувани.`
        : "Няма публикувани услуги.",
    href: "/admin/services",
  });

  const servicesWithImage = publishedServices.filter((s) =>
    Boolean(s.image_path?.trim()),
  );
  checks.push({
    id: "service_images",
    label: "Изображение на услуга",
    tone: servicesWithImage.length > 0 ? "ok" : "warn",
    detail:
      servicesWithImage.length > 0
        ? `${servicesWithImage.length} от ${publishedServices.length} имат image_path.`
        : "Няма качено изображение към публикувана услуга (опционално, но препоръчително).",
    href: "/admin/services",
  });

  const faqCount = faqsRes.count ?? 0;
  checks.push({
    id: "faqs",
    label: "Публикувани FAQ",
    tone: faqCount > 0 ? "ok" : "warn",
    detail:
      faqCount > 0
        ? `${faqCount} публикувани.`
        : "Няма публикувани FAQ — секцията на началната страница ще е празна.",
    href: "/admin/faqs",
  });

  const testimonialCount = testimonialsRes.count ?? 0;
  checks.push({
    id: "testimonials",
    label: "Отзиви (optional)",
    tone: "info",
    detail:
      testimonialCount > 0
        ? `${testimonialCount} публикувани. Публикувайте само реални, одобрени отзиви.`
        : "Няма публикувани отзиви — това е OK; не измисляйте отзиви.",
    href: "/admin/testimonials",
  });

  const pages = pagesRes.data ?? [];
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  for (const slug of [
    "home",
    "za-cveti",
    "kontakti",
    "politika-za-poveritelnost",
  ] as const) {
    const page = bySlug.get(slug);
    if (page) {
      quickLinks.push({
        label: `Редакция: ${page.title || slug}`,
        href: `/admin/pages/${page.id}`,
        note: slug,
      });
    }
  }

  const importantSeo = (
    [
      ["home", "Начало"],
      ["za-cveti", "За Цвети"],
      ["kontakti", "Контакти"],
    ] as const
  ).map(([slug, label]) => {
    const page = bySlug.get(slug);
    if (!page) {
      return `${label}: страница липсва`;
    }
    if (page.status !== "published") {
      return `${label}: не е published`;
    }
    if (!seoOk(page.seo_title, page.seo_description)) {
      return `${label}: липсва SEO title/description`;
    }
    return null;
  });
  const seoIssues = importantSeo.filter(Boolean) as string[];
  checks.push({
    id: "page_seo",
    label: "SEO за важни страници",
    tone: seoIssues.length === 0 ? "ok" : "warn",
    detail:
      seoIssues.length === 0
        ? "home / za-cveti / kontakti имат SEO title и description."
        : seoIssues.join("; "),
    href: "/admin/pages",
  });

  const privacy = bySlug.get("politika-za-poveritelnost");
  checks.push({
    id: "privacy",
    label: "Политика за поверителност",
    tone: "warn",
    detail: privacy
      ? "Страницата съществува, но текстът трябва да мине legal review преди production launch. Остава noindex до финален правен текст."
      : "Страницата липсва — пуснете seed 004.",
    href: privacy ? `/admin/pages/${privacy.id}` : "/admin/pages",
  });
  warnings.push(
    "Privacy/legal: не третирайте текущия текст като финална политика. Нужна е правна проверка преди публичен launch.",
  );

  const home = bySlug.get("home");
  if (home) {
    const { data: sections } = await supabase
      .from("page_sections")
      .select("key, content, is_published")
      .eq("page_id", home.id)
      .in("key", ["hero_image", "about_image", "hero_supporting", "intro"]);

    const map = new Map((sections ?? []).map((s) => [s.key, s]));
    const heroPath =
      sectionHasImagePath(map.get("hero_image")?.content) ||
      sectionHasImagePath(map.get("hero_supporting")?.content);
    const aboutPath =
      sectionHasImagePath(map.get("about_image")?.content) ||
      sectionHasImagePath(map.get("intro")?.content);

    checks.push({
      id: "home_images",
      label: "Home hero / about изображения",
      tone: heroPath && aboutPath ? "ok" : "warn",
      detail: `Hero: ${heroPath ? "има path" : "липсва"} · About: ${aboutPath ? "има path" : "липсва"}. Редактирайте секции hero_image / about_image.`,
      href: `/admin/pages/${home.id}`,
    });
  } else {
    checks.push({
      id: "home_images",
      label: "Home hero / about изображения",
      tone: "missing",
      detail: "Страница home липсва — пуснете 001_initial_content.sql и 005_home_image_sections.sql.",
      href: "/admin/pages",
    });
  }

  const { data: heartbeat, error: heartbeatError } = await supabase
    .from("maintenance_heartbeats")
    .select("last_seen_at, run_count, last_status, last_error")
    .eq("id", "supabase-heartbeat")
    .maybeSingle();

  if (heartbeatError) {
    checks.push({
      id: "heartbeat",
      label: "Supabase heartbeat",
      tone: "warn",
      detail:
        "Таблицата maintenance_heartbeats липсва или не е достъпна — пуснете migration 20260810120000_maintenance_heartbeats.sql.",
    });
  } else if (heartbeat) {
    const seen = heartbeat.last_seen_at
      ? new Date(heartbeat.last_seen_at).toLocaleString("bg-BG", {
          timeZone: "Europe/Sofia",
        })
      : "—";
    checks.push({
      id: "heartbeat",
      label: "Supabase heartbeat",
      tone: heartbeat.last_status === "ok" ? "ok" : "warn",
      detail: `Последен успешен: ${seen} · run_count: ${heartbeat.run_count} · status: ${heartbeat.last_status ?? "—"}`,
    });
  } else {
    checks.push({
      id: "heartbeat",
      label: "Supabase heartbeat",
      tone: "warn",
      detail:
        "Няма запис — тествайте GET /api/cron/supabase-heartbeat с Bearer CRON_SECRET след migration.",
    });
  }

  return finalize(checks, quickLinks, warnings);
}

function finalize(
  checks: ReadinessCheck[],
  quickLinks: ReadinessQuickLink[],
  warnings: string[],
): LaunchReadiness {
  const summary = {
    ok: checks.filter((c) => c.tone === "ok").length,
    warn: checks.filter((c) => c.tone === "warn").length,
    missing: checks.filter((c) => c.tone === "missing").length,
  };
  return { checks, quickLinks, warnings, summary };
}
