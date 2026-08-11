import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { buildImageRef, type PublicImageRef } from "@/lib/cms/media";
import { brand } from "@/lib/brand";

export type {
  BlogStatus,
  BlogCategory,
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
  category_name: string | null;
  category_slug: string | null;
  author_name: string | null;
  reading_time_minutes: number | null;
  is_featured: boolean;
  is_popular: boolean;
};

const BLOG_POST_SELECT = `
  id, title, slug, excerpt, content, featured_image_path,
  published_at, created_at, seo_title, seo_description,
  author_name, reading_time_minutes, is_featured, is_popular,
  blog_categories ( name, slug )
`;

function toPublicBlogPost(row: Record<string, unknown>): PublicBlogPost {
  const cat = row.blog_categories as { name: string; slug: string } | null;
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string) ?? null,
    content: row.content as string,
    published_at: (row.published_at as string) ?? null,
    created_at: row.created_at as string,
    seo_title: (row.seo_title as string) ?? null,
    seo_description: (row.seo_description as string) ?? null,
    category_name: cat?.name ?? null,
    category_slug: cat?.slug ?? null,
    author_name: (row.author_name as string) ?? null,
    reading_time_minutes: (row.reading_time_minutes as number) ?? null,
    is_featured: (row.is_featured as boolean) ?? false,
    is_popular: (row.is_popular as boolean) ?? false,
    featuredImage: buildImageRef({
      path: (row.featured_image_path as string) ?? null,
      alt: `Илюстрация към ${(row.title as string) || brand.officialName}`,
    }),
  };
}

export async function getPublishedBlogPosts(
  categorySlug?: string,
): Promise<PublicBlogPost[]> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (cat) {
      query = query.eq("category_id", cat.id);
    } else {
      return [];
    }
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => toPublicBlogPost(row as Record<string, unknown>));
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return toPublicBlogPost(data as Record<string, unknown>);
}

export async function getBlogCategories() {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order")
    .order("name");

  if (error || !data) return [];
  return data as { id: string; name: string; slug: string; description: string | null; sort_order: number }[];
}
