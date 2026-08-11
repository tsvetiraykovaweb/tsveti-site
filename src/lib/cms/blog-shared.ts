export type BlogStatus = "draft" | "published";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

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
  category_id: string | null;
  author_name: string | null;
  reading_time_minutes: number | null;
  is_featured: boolean;
  is_popular: boolean;
  category_name?: string | null;
  category_slug?: string | null;
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
  category_id: string;
  author_name: string;
  reading_time_minutes: string;
  is_featured: boolean;
  is_popular: boolean;
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
  category_id: "",
  author_name: "",
  reading_time_minutes: "",
  is_featured: false,
  is_popular: false,
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
