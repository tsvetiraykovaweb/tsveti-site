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
