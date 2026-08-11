import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EMPTY_BLOG_POST_VALUES, type BlogCategory } from "@/lib/cms/blog-shared";
import { BlogForm } from "../blog-form";

export default async function AdminBlogNewPage() {
  const supabase = await createClient();
  const [catRes, mediaRes] = await Promise.all([
    supabase
      .from("blog_categories")
      .select("id, name, slug, description, sort_order")
      .order("sort_order")
      .order("name"),
    supabase
      .from("media_assets")
      .select("id, path, alt_text")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const categories = (catRes.data ?? []) as BlogCategory[];
  const mediaOptions = (mediaRes.data ?? []).map((row) => ({
    path: row.path as string,
    label: `${(row.alt_text as string | null) || "Без alt"} · ${row.path}`,
  }));

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
      <h1 className="font-heading text-3xl text-primary">Нова статия</h1>
      <p className="mt-2 text-text-muted">
        Създай чернова или публикувана статия с markdown съдържание.
      </p>
      <BlogForm
        mode="create"
        initialValues={EMPTY_BLOG_POST_VALUES}
        categories={categories}
        mediaOptions={mediaOptions}
      />
    </section>
  );
}
