import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { buildImageRef, type PublicImageRef } from "@/lib/cms/media";
import { brand } from "@/lib/brand";

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

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  featuredImage: PublicImageRef;
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

function toPublicBlogPost(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_path: string | null;
  published_at: string | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
}): PublicBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    published_at: row.published_at,
    created_at: row.created_at,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    featuredImage: buildImageRef({
      path: row.featured_image_path,
      alt: `Илюстрация към ${row.title || brand.officialName}`,
    }),
  };
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, featured_image_path, published_at, created_at, seo_title, seo_description",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => toPublicBlogPost(row));
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, featured_image_path, published_at, created_at, seo_title, seo_description",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return toPublicBlogPost(data);
}
