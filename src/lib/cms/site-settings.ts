export const SITE_SETTING_KEYS = [
  "official_name",
  "display_name",
  "phone",
  "email",
  "primary_cta_label",
  "primary_cta_url",
  "social_links",
  "seo_title",
  "seo_description",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

export type SocialLinks = {
  instagram: string;
  facebook: string;
};

export type SiteSettingsFormValues = {
  official_name: string;
  display_name: string;
  phone: string;
  email: string;
  primary_cta_label: string;
  primary_cta_url: string;
  social_instagram: string;
  social_facebook: string;
  seo_title: string;
  seo_description: string;
};

export const SITE_SETTING_LABELS: Record<SiteSettingKey, string> = {
  official_name: "Официално име",
  display_name: "Име за показване",
  phone: "Телефон",
  email: "Имейл",
  primary_cta_label: "Основен CTA текст",
  primary_cta_url: "Основен CTA линк",
  social_links: "Социални мрежи",
  seo_title: "SEO заглавие",
  seo_description: "SEO описание",
};

export function jsonValueToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

export function parseSocialLinks(value: unknown): SocialLinks {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return {
      instagram: jsonValueToString(obj.instagram),
      facebook: jsonValueToString(obj.facebook),
    };
  }
  return { instagram: "", facebook: "" };
}

export function rowsToFormValues(
  rows: { key: string; value: unknown }[],
): SiteSettingsFormValues {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const social = parseSocialLinks(map.get("social_links"));

  return {
    official_name: jsonValueToString(map.get("official_name")),
    display_name: jsonValueToString(map.get("display_name")),
    phone: jsonValueToString(map.get("phone")),
    email: jsonValueToString(map.get("email")),
    primary_cta_label: jsonValueToString(map.get("primary_cta_label")),
    primary_cta_url: jsonValueToString(map.get("primary_cta_url")),
    social_instagram: social.instagram,
    social_facebook: social.facebook,
    seo_title: jsonValueToString(map.get("seo_title")),
    seo_description: jsonValueToString(map.get("seo_description")),
  };
}
