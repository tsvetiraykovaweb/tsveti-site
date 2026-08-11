export type BlogStatus = "draft" | "published";

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_path: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
};

export type BlogPostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_path: string;
  status: BlogStatus;
  published_at: string;
  seo_title: string;
  seo_description: string;
};

export const EMPTY_BLOG_POST_VALUES: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image_path: "",
  status: "draft",
  published_at: "",
  seo_title: "",
  seo_description: "",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeBlogSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidBlogSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function formatBlogDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
