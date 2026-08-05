import type { ContentStatus, SectionType } from "@/types/database";
import { isValidSlug, normalizeSlug } from "@/lib/cms/services";

export type PageListItem = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
};

export type PageFormValues = {
  title: string;
  slug: string;
  status: ContentStatus;
  seo_title: string;
  seo_description: string;
  sort_order: number;
};

export type SectionFormValues = {
  key: string;
  section_type: SectionType;
  heading: string;
  eyebrow: string;
  body: string;
  image_path: string;
  image_alt: string;
  cta_label: string;
  cta_href: string;
  sort_order: number;
  is_published: boolean;
};

export type PageSectionListItem = {
  id: string;
  key: string;
  section_type: SectionType;
  sort_order: number;
  is_published: boolean;
  content: unknown;
};

export const PAGE_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Чернова",
  published: "Публикувана",
  archived: "Архив",
};

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  text: "Текст",
  richtext: "Текст (HTML)",
  image: "Изображение",
  cta: "CTA",
  list: "Списък",
  custom: "Друго",
};

export const EMPTY_PAGE_VALUES: PageFormValues = {
  title: "",
  slug: "",
  status: "draft",
  seo_title: "",
  seo_description: "",
  sort_order: 0,
};

export const EMPTY_SECTION_VALUES: SectionFormValues = {
  key: "",
  section_type: "text",
  heading: "",
  eyebrow: "",
  body: "",
  image_path: "",
  image_alt: "",
  cta_label: "",
  cta_href: "",
  sort_order: 0,
  is_published: false,
};

const SECTION_KEY_PATTERN = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;

export function isValidSectionKey(key: string): boolean {
  return SECTION_KEY_PATTERN.test(key);
}

export function normalizeSectionKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/[_-]+/g, "_")
    .replace(/^[_-]|[_-]$/g, "");
}

export type SectionContentFields = {
  heading: string;
  eyebrow: string;
  text: string;
  html: string;
  body: string;
  image_path: string;
  image_alt: string;
  cta_label: string;
  cta_href: string;
};

export function parseSectionContent(content: unknown): SectionContentFields {
  const obj =
    content && typeof content === "object" && !Array.isArray(content)
      ? (content as Record<string, unknown>)
      : {};

  const str = (v: unknown) =>
    typeof v === "string" ? v : v == null ? "" : String(v);

  return {
    heading: str(obj.heading),
    eyebrow: str(obj.eyebrow),
    text: str(obj.text),
    html: str(obj.html),
    body: str(obj.body),
    image_path: str(obj.image_path ?? obj.path ?? obj.src),
    image_alt: str(obj.image_alt ?? obj.alt),
    cta_label: str(obj.cta_label ?? obj.label),
    cta_href: str(obj.cta_href ?? obj.href),
  };
}

/** Prefer plain text fields; fall back to html for richtext sections. */
export function sectionPlainBody(fields: SectionContentFields): string {
  return (
    fields.body.trim() ||
    fields.text.trim() ||
    fields.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  );
}

export function sectionFormFromRow(
  key: string,
  section_type: SectionType,
  content: unknown,
  sort_order: number,
  is_published: boolean,
): SectionFormValues {
  const parsed = parseSectionContent(content);
  return {
    key,
    section_type,
    heading: parsed.heading,
    eyebrow: parsed.eyebrow,
    body: parsed.body || parsed.text || parsed.html,
    image_path: parsed.image_path,
    image_alt: parsed.image_alt,
    cta_label: parsed.cta_label,
    cta_href: parsed.cta_href,
    sort_order,
    is_published,
  };
}

export function buildSectionContentJson(
  values: SectionFormValues,
): Record<string, string> {
  const content: Record<string, string> = {};
  if (values.heading.trim()) content.heading = values.heading.trim();
  if (values.eyebrow.trim()) content.eyebrow = values.eyebrow.trim();
  if (values.body.trim()) {
    if (values.section_type === "richtext") {
      content.html = values.body.trim();
    } else {
      content.text = values.body.trim();
      content.body = values.body.trim();
    }
  }
  if (values.image_path.trim()) content.image_path = values.image_path.trim();
  if (values.image_alt.trim()) content.image_alt = values.image_alt.trim();
  if (values.cta_label.trim()) content.cta_label = values.cta_label.trim();
  if (values.cta_href.trim()) content.cta_href = values.cta_href.trim();
  return content;
}

export function validatePageForm(values: PageFormValues): string | null {
  if (!values.title.trim()) return "Заглавието е задължително.";
  const slug = normalizeSlug(values.slug);
  if (!slug) return "Slug е задължителен.";
  if (!isValidSlug(slug)) {
    return "Slug трябва да е URL-safe (малки латински букви, цифри и тирета).";
  }
  if (!Number.isFinite(values.sort_order)) {
    return "Редът (sort_order) трябва да е число.";
  }
  return null;
}

export function validateSectionForm(values: SectionFormValues): string | null {
  const key = normalizeSectionKey(values.key);
  if (!key) return "Ключът на секцията е задължителен.";
  if (!isValidSectionKey(key)) {
    return "Ключът трябва да е малки латински букви, цифри, _ или -.";
  }
  if (!Number.isFinite(values.sort_order)) {
    return "Редът (sort_order) трябва да е число.";
  }
  return null;
}

export { normalizeSlug, isValidSlug };
