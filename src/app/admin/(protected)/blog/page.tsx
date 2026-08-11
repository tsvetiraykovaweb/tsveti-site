import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
      "id, title, slug, excerpt, status, published_at, created_at, is_featured, is_popular, author_name, blog_categories ( name )",
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  function resolveCategoryName(
    value: { name: string } | { name: string }[] | null | undefined,
  ): string | null {
    if (!value) return null;
    if (Array.isArray(value)) return value[0]?.name ?? null;
    return value.name ?? null;
  }

  const posts = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string | null) ?? null,
    status: row.status as string,
    published_at: (row.published_at as string | null) ?? null,
    created_at: row.created_at as string,
    is_featured: Boolean(row.is_featured),
    is_popular: Boolean(row.is_popular),
    author_name: (row.author_name as string | null) ?? null,
    category_name: resolveCategoryName(
      row.blog_categories as
        | { name: string }
        | { name: string }[]
        | null
        | undefined,
    ),
  }));

  return (
    <section>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/categories"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary hover:text-primary"
          >
            Категории
          </Link>
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
          >
            Нова статия
          </Link>
        </div>
      </div>

      <h1 className="font-heading text-3xl text-primary">Блог</h1>
      <p className="mt-2 text-text-muted">
        Чернови и публикувани статии за публичния маршрут <code>/blog</code>.
      </p>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-bg px-6 py-8 text-center text-sm text-text-muted">
          Няма blog статии. Създайте първа чернова.
        </div>
      ) : null}

      {posts.length > 0 ? (
        <div className="mt-8 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-bg p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-lg text-primary">{post.title}</p>
                  {post.is_featured ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Препоръчана
                    </span>
                  ) : null}
                  {post.is_popular ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      Популярна
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-text-muted">
                  <span className="font-mono text-xs">{post.slug}</span>
                  {" · "}
                  {post.status === "published" ? "Публикувана" : "Чернова"}
                  {" · "}
                  {formatDate(post.published_at || post.created_at)}
                  {post.category_name ? (
                    <> · {post.category_name}</>
                  ) : null}
                  {post.author_name ? (
                    <> · {post.author_name}</>
                  ) : null}
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
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
