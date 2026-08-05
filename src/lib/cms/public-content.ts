import { createClient } from "@/lib/supabase/server";
import { brand } from "@/lib/brand";
import { getPublicEnv } from "@/lib/env";
import {
  SITE_SETTING_KEYS,
  jsonValueToString,
  rowsToFormValues,
  type SiteSettingsFormValues,
  type SocialLinks,
} from "@/lib/cms/site-settings";

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
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
};

export type PublicHomeContent = {
  settings: SiteSettingsFormValues;
  social: SocialLinks;
  services: PublicService[];
  faqs: PublicFaq[];
  testimonials: PublicTestimonial[];
  home: HomeSectionContent;
  ctaLabel: string;
  ctaHref: string;
  usedFallbacks: boolean;
};

const DEFAULT_CTA_LABEL = "Запази безплатна консултация";
const DEFAULT_CTA_HREF = "/#consultation";

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
  };
}

function sectionText(content: unknown, key = "text"): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  return jsonValueToString(obj[key] ?? obj.html ?? "");
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
        .select("id, slug, title, summary, cta_label, cta_href, sort_order")
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
  const ctaLabel =
    settings.primary_cta_label.trim() &&
    settings.primary_cta_label.trim() !== "Запиши консултация"
      ? settings.primary_cta_label.trim()
      : DEFAULT_CTA_LABEL;
  const ctaHref = settings.primary_cta_url.trim() || DEFAULT_CTA_HREF;

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
    ctaLabel,
    ctaHref,
    usedFallbacks,
  };
}
