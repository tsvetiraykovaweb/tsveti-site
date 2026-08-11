import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { buildImageRef, type PublicImageRef } from "@/lib/cms/media";
import { brand } from "@/lib/brand";

export type {
  BlogStatus,
  BlogPostListItem,
  BlogPostFormValues,
} from "@/lib/cms/blog-shared";
export {
  EMPTY_BLOG_POST_VALUES,
  normalizeBlogSlug,
  isValidBlogSlug,
  formatBlogDate,
} from "@/lib/cms/blog-shared";

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
