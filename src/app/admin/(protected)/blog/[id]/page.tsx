import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BlogPostFormValues, BlogCategory } from "@/lib/cms/blog-shared";
import { BlogForm } from "../blog-form";

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data, error }, mediaRes, catRes] = await Promise.all([
    supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, featured_image_path, status, published_at, seo_title, seo_description, category_id, author_name, reading_time_minutes, is_featured, is_popular",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("media_assets")
      .select("id, path, alt_text")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("blog_categories")
      .select("id, name, slug, description, sort_order")
      .order("sort_order")
      .order("name"),
  ]);

  if (error || !data) notFound();

  const initialValues: BlogPostFormValues = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? "",
    content: data.content,
    featured_image_path: data.featured_image_path ?? "",
    status: data.status as BlogPostFormValues["status"],
    published_at: toLocalDateTime(data.published_at),
    seo_title: data.seo_title ?? "",
    seo_description: data.seo_description ?? "",
    category_id: data.category_id ?? "",
    author_name: data.author_name ?? "",
    reading_time_minutes: data.reading_time_minutes != null ? String(data.reading_time_minutes) : "",
    is_featured: data.is_featured ?? false,
    is_popular: data.is_popular ?? false,
  };

  const mediaOptions = (mediaRes.data ?? []).map((row) => ({
    path: row.path as string,
    label: `${(row.alt_text as string | null) || "Без alt"} · ${row.path}`,
  }));

  const categories = (catRes.data ?? []) as BlogCategory[];

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/blog"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към блога
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Редакция на статия</h1>
      <p className="mt-2 line-clamp-2 text-text-muted">{data.title}</p>
      <BlogForm
        mode="edit"
        id={data.id}
        initialValues={initialValues}
        mediaOptions={mediaOptions}
        categories={categories}
      />
    </section>
  );
}
