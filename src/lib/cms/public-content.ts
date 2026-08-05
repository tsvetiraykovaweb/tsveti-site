import { createClient } from "@/lib/supabase/server";
import { brand } from "@/lib/brand";
import { getPublicEnv } from "@/lib/env";
import { buildImageRef, type PublicImageRef } from "@/lib/cms/media";
import {
  buildPublicNavItems,
  type PublicNavItem,
} from "@/lib/cms/public-nav";
import {
  PUBLIC_CONSULTATION_PATH,
  normalizePublicCtaHref,
} from "@/lib/cms/public-paths";
import {
  SITE_SETTING_KEYS,
  jsonValueToString,
  rowsToFormValues,
  type SiteSettingsFormValues,
  type SocialLinks,
} from "@/lib/cms/site-settings";

export {
  PUBLIC_USLUGI_BASE,
  PUBLIC_CONSULTATION_PATH,
  publicServicePath,
  isExternalHref,
  normalizePublicCtaHref,
} from "@/lib/cms/public-paths";

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  image_path: string | null;
};

export type PublicServiceDetail = PublicService & {
  body: string | null;
  seo_title: string | null;
  seo_description: string | null;
  /** Resolved hero image slot (src null until admin uploads) */
  heroImage: PublicImageRef;
};

export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type PublicTestimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  sort_order: number;
};

export type HomeSectionContent = {
  heroHeadline: string;
  heroSupporting: string;
  introHtml: string;
  /** Reserved slots — filled when CMS/media provides paths */
  heroImage: PublicImageRef;
  aboutImage: PublicImageRef;
};

export type PublicHomeContent = {
  settings: SiteSettingsFormValues;
  social: SocialLinks;
  services: PublicService[];
  faqs: PublicFaq[];
  testimonials: PublicTestimonial[];
  home: HomeSectionContent;
  navItems: PublicNavItem[];
  ctaLabel: string;
  ctaHref: string;
  usedFallbacks: boolean;
};

const DEFAULT_CTA_LABEL = "Запази безплатна консултация";
const DEFAULT_CTA_HREF = PUBLIC_CONSULTATION_PATH;

export function resolveSiteCta(label: string, href: string) {
  const ctaLabel =
    label.trim() && label.trim() !== "Запиши консултация"
      ? label.trim()
      : DEFAULT_CTA_LABEL;
  const ctaHref = normalizePublicCtaHref(href);
  return { ctaLabel, ctaHref };
}

export function resolveServiceCta(
  cta_label: string | null,
  cta_href: string | null,
  slug?: string,
) {
  let href = normalizePublicCtaHref(cta_href);
  if (slug && href === PUBLIC_CONSULTATION_PATH) {
    href = `${PUBLIC_CONSULTATION_PATH}?usluga=${encodeURIComponent(slug)}`;
  }
  return {
    label: cta_label?.trim() || DEFAULT_CTA_LABEL,
    href,
  };
}

export type PublicSiteChrome = {
  settings: SiteSettingsFormValues;
  social: SocialLinks;
  ctaLabel: string;
  ctaHref: string;
  navItems: PublicNavItem[];
};

export async function getPublicSiteChrome(): Promise<PublicSiteChrome> {
  const { isSupabaseConfigured } = getPublicEnv();
  const fallbacks = defaultSettings();

  if (!isSupabaseConfigured) {
    const { ctaLabel, ctaHref } = resolveSiteCta(
      fallbacks.primary_cta_label,
      fallbacks.primary_cta_url,
    );
    return {
      settings: fallbacks,
      social: { instagram: "", facebook: "" },
      ctaLabel,
      ctaHref,
      navItems: buildPublicNavItems([]),
    };
  }

  const supabase = await createClient();
  const [settingsRes, servicesRes] = await Promise.all([
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [...SITE_SETTING_KEYS]),
    supabase
      .from("services")
      .select("slug, title, sort_order")
      .eq("status", "published")
      .order("sort_order", { ascending: true }),
  ]);

  const settings =
    !settingsRes.error && settingsRes.data && settingsRes.data.length > 0
      ? { ...fallbacks, ...rowsToFormValues(settingsRes.data) }
      : fallbacks;

  const { ctaLabel, ctaHref } = resolveSiteCta(
    settings.primary_cta_label,
    settings.primary_cta_url,
  );

  const navServices =
    !servicesRes.error && servicesRes.data ? servicesRes.data : [];

  return {
    settings,
    social: {
      instagram: settings.social_instagram,
      facebook: settings.social_facebook,
    },
    ctaLabel,
    ctaHref,
    navItems: buildPublicNavItems(navServices),
  };
}

async function resolveMediaMeta(
  path: string | null | undefined,
): Promise<{ alt: string | null; width: number | null; height: number | null }> {
  if (!path?.trim() || /^https?:\/\//i.test(path)) {
    return { alt: null, width: null, height: null };
  }

  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) {
    return { alt: null, width: null, height: null };
  }

  const supabase = await createClient();
  const cleaned = path.replace(/^\/+/, "").replace(/^site-assets\//, "");
  const { data } = await supabase
    .from("media_assets")
    .select("alt_text, width, height")
    .eq("path", cleaned)
    .maybeSingle();

  return {
    alt: data?.alt_text ?? null,
    width: data?.width ?? null,
    height: data?.height ?? null,
  };
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<PublicServiceDetail | null> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, title, summary, body, image_path, cta_label, cta_href, sort_order, seo_title, seo_description, status",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const meta = await resolveMediaMeta(data.image_path);

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    body: data.body,
    image_path: data.image_path,
    cta_label: data.cta_label,
    cta_href: data.cta_href,
    sort_order: data.sort_order,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    heroImage: buildImageRef({
      path: data.image_path,
      alt: meta.alt || `Визуал към услугата ${data.title}`,
      width: meta.width,
      height: meta.height,
    }),
  };
}

export async function getPublishedServices(): Promise<PublicService[]> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, title, summary, cta_label, cta_href, sort_order, image_path",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as PublicService[];
}

function defaultSettings(): SiteSettingsFormValues {
  return {
    official_name: brand.officialName,
    display_name: brand.displayName,
    phone: "",
    email: "",
    primary_cta_label: DEFAULT_CTA_LABEL,
    primary_cta_url: DEFAULT_CTA_HREF,
    social_instagram: "",
    social_facebook: "",
    seo_title: brand.officialName,
    seo_description: brand.direction,
  };
}

function defaultHomeSections(): HomeSectionContent {
  return {
    heroHeadline: brand.displayName,
    heroSupporting: brand.direction,
    introHtml:
      "<p>Добре дошли. Тук ще намерите спокоен преглед на услугите и начина на работа. Подробното съдържание се управлява от админ панела.</p>",
    heroImage: buildImageRef({
      alt: `Начална визуализация — ${brand.officialName}`,
    }),
    aboutImage: buildImageRef({
      alt: `За ${brand.displayName} — визуал`,
    }),
  };
}

function sectionText(content: unknown, key = "text"): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  return jsonValueToString(obj[key] ?? obj.html ?? "");
}

function sectionImagePath(content: unknown): string | null {
  if (!content || typeof content !== "object") return null;
  const obj = content as Record<string, unknown>;
  const path = obj.image_path ?? obj.path ?? obj.src;
  return typeof path === "string" && path.trim() ? path.trim() : null;
}

/**
 * Loads published homepage content from Supabase.
 * Falls back to brand defaults when env/DB content is missing.
 */
export async function getPublicHomeContent(): Promise<PublicHomeContent> {
  const { isSupabaseConfigured } = getPublicEnv();
  const fallbacks = defaultSettings();
  const homeFallback = defaultHomeSections();

  if (!isSupabaseConfigured) {
    return {
      settings: fallbacks,
      social: { instagram: "", facebook: "" },
      services: [],
      faqs: [],
      testimonials: [],
      home: homeFallback,
      navItems: buildPublicNavItems([]),
      ctaLabel: DEFAULT_CTA_LABEL,
      ctaHref: DEFAULT_CTA_HREF,
      usedFallbacks: true,
    };
  }

  const supabase = await createClient();
  let usedFallbacks = false;

  const [settingsRes, servicesRes, faqsRes, testimonialsRes, homePageRes] =
    await Promise.all([
      supabase.from("site_settings").select("key, value").in("key", [
        ...SITE_SETTING_KEYS,
      ]),
      supabase
        .from("services")
        .select(
          "id, slug, title, summary, cta_label, cta_href, sort_order, image_path",
        )
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("faqs")
        .select("id, question, answer, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("testimonials")
        .select("id, quote, author_name, author_role, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase.from("pages").select("id").eq("slug", "home").maybeSingle(),
    ]);

  const settings =
    !settingsRes.error && settingsRes.data && settingsRes.data.length > 0
      ? { ...fallbacks, ...rowsToFormValues(settingsRes.data) }
      : ((usedFallbacks = true), fallbacks);

  // Prefer the required public CTA wording when settings still use seed default.
  const { ctaLabel, ctaHref } = resolveSiteCta(
    settings.primary_cta_label,
    settings.primary_cta_url,
  );

  const social = {
    instagram: settings.social_instagram,
    facebook: settings.social_facebook,
  };

  const services = (!servicesRes.error && servicesRes.data
    ? servicesRes.data
    : []) as PublicService[];
  const faqs = (!faqsRes.error && faqsRes.data ? faqsRes.data : []) as PublicFaq[];
  const testimonials = (!testimonialsRes.error && testimonialsRes.data
    ? testimonialsRes.data
    : []) as PublicTestimonial[];

  let home = homeFallback;
  if (!homePageRes.error && homePageRes.data?.id) {
    const { data: sections } = await supabase
      .from("page_sections")
      .select("key, content, is_published")
      .eq("page_id", homePageRes.data.id)
      .eq("is_published", true);

    if (sections && sections.length > 0) {
      const map = new Map(sections.map((s) => [s.key, s.content]));
      const heroPath = sectionImagePath(map.get("hero_image"));
      const aboutPath = sectionImagePath(map.get("about_image"));
      const [heroMeta, aboutMeta] = await Promise.all([
        resolveMediaMeta(heroPath),
        resolveMediaMeta(aboutPath),
      ]);

      home = {
        heroHeadline:
          sectionText(map.get("hero_headline")) || homeFallback.heroHeadline,
        heroSupporting:
          sectionText(map.get("hero_supporting")) ||
          homeFallback.heroSupporting,
        introHtml:
          sectionText(map.get("intro"), "html") ||
          sectionText(map.get("intro")) ||
          homeFallback.introHtml,
        heroImage: buildImageRef({
          path: heroPath,
          alt:
            heroMeta.alt ||
            `Начална визуализация — ${settings.official_name || brand.officialName}`,
          width: heroMeta.width,
          height: heroMeta.height,
        }),
        aboutImage: buildImageRef({
          path: aboutPath,
          alt:
            aboutMeta.alt ||
            `За ${settings.display_name || brand.displayName} — визуал`,
          width: aboutMeta.width,
          height: aboutMeta.height,
        }),
      };
    } else {
      usedFallbacks = true;
    }
  } else {
    usedFallbacks = true;
  }

  if (
    settingsRes.error ||
    servicesRes.error ||
    faqsRes.error ||
    testimonialsRes.error
  ) {
    usedFallbacks = true;
  }

  return {
    settings,
    social,
    services,
    faqs,
    testimonials,
    home,
    navItems: buildPublicNavItems(services),
    ctaLabel,
    ctaHref,
    usedFallbacks,
  };
}
