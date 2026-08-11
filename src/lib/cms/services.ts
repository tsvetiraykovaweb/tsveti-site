export type ServiceStatus = "draft" | "published" | "archived";

export type ServiceListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status: ServiceStatus;
  cta_href: string | null;
  sort_order: number;
};

export type ServiceFormValues = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  image_path: string;
  cta_label: string;
  cta_href: string;
  sort_order: number;
  status: ServiceStatus;
  seo_title: string;
  seo_description: string;
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  draft: "Чернова",
  published: "Публикувана",
  archived: "Архив",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const LEGACY_CONSULTATION_HREFS = new Set([
  "#consultation",
  "/#consultation",
  "/consultation",
]);

/** Validates service landing CTA href for admin save. Empty is allowed. */
export function validateServiceCtaHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  if (LEGACY_CONSULTATION_HREFS.has(trimmed)) {
    return null;
  }
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

export function serviceCtaHrefError(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  if (validateServiceCtaHref(trimmed) !== null) return null;
  return "Линкът трябва да започва с / (вътрешен) или с http:// / https:// (външен).";
}
