import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPostListItem } from "@/lib/cms/blog";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, featured_image_path, status, published_at, created_at, seo_title, seo_description",
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as BlogPostListItem[];

  return (
    <section>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
        <Link
          href="/admin/blog/new"
          className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
        >
          Нова статия
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">Блог</h1>
      <p className="mt-2 text-text-muted">
        Чернови и публикувани статии за публичния маршрут <code>/blog</code>.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && posts.length === 0 ? (
        <div className="mt-8 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          Няма blog статии. Създайте първа чернова.
        </div>
      ) : null}

      {posts.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{post.title}</p>
                <p className="mt-1 text-sm text-text-muted">
                  <span className="font-mono text-xs">{post.slug}</span>
                  {" · "}
                  {post.status === "published" ? "Публикувана" : "Чернова"}
                  {" · "}
                  {formatDate(post.published_at || post.created_at)}
                </p>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/admin/blog/${post.id}`}
                className="shrink-0 text-sm text-accent underline-offset-4 hover:underline"
              >
                Редактирай
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
