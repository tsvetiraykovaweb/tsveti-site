import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogCategory } from "@/lib/cms/blog-shared";
import { CategoryManager } from "./category-form";

export default async function AdminBlogCategoriesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order")
    .order("name");

  const categories = (data ?? []) as BlogCategory[];

  return (
    <section>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/blog"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към блога
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">Блог категории</h1>
      <p className="mt-2 text-text-muted">
        Категориите позволяват групиране и филтриране на публикуваните статии.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      <CategoryManager categories={categories} />
    </section>
  );
}
