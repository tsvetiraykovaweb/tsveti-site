import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  PAGE_STATUS_LABELS,
  type PageListItem,
} from "@/lib/cms/pages";

export default async function AdminPagesListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, slug, status, seo_title, seo_description, sort_order")
    .order("sort_order", { ascending: true })
    .order("slug", { ascending: true });

  const pages = (data ?? []) as PageListItem[];

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Страници</h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        Редакция на заглавия, SEO и секции (`page_sections`). Публичните
        маршрути четат публикувани страници/секции с безопасни fallback-и.
        За началната страница (slug <code>home</code>) ползвайте секции{" "}
        <code>hero_image</code> и <code>about_image</code> с път от медия
        библиотеката.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link
          href="/admin/readiness"
          className="text-accent underline-offset-4 hover:underline"
        >
          Готовност за launch
        </Link>
        <Link
          href="/admin/media"
          className="text-accent underline-offset-4 hover:underline"
        >
          Медия библиотека
        </Link>
        <Link
          href="/admin/services"
          className="text-accent underline-offset-4 hover:underline"
        >
          Услуги
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка: {error.message}
        </p>
      ) : null}

      {!error && pages.length === 0 ? (
        <div className="mt-8 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          Няма страници. Изпълнете seed / patch{" "}
          <code>004_page_content_cms.sql</code>.
        </div>
      ) : null}

      {pages.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {pages.map((page) => (
            <li
              key={page.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{page.title}</p>
                <p className="mt-1 text-sm text-text-muted">
                  <code>{page.slug}</code>
                  {" · "}
                  {PAGE_STATUS_LABELS[page.status]}
                  {" · "}
                  ред {page.sort_order}
                </p>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {page.seo_title || "—"}
                  {page.seo_description
                    ? ` · ${page.seo_description}`
                    : null}
                </p>
              </div>
              <Link
                href={`/admin/pages/${page.id}`}
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
