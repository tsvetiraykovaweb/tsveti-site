import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PAGE_STATUS_LABELS,
  SECTION_TYPE_LABELS,
  type PageFormValues,
  type PageSectionListItem,
} from "@/lib/cms/pages";
import type { ContentStatus } from "@/types/database";
import { PageEditForm } from "../page-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPageEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: page, error }, sectionsRes] = await Promise.all([
    supabase
      .from("pages")
      .select(
        "id, title, slug, status, seo_title, seo_description, sort_order",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("page_sections")
      .select("id, key, section_type, sort_order, is_published, content")
      .eq("page_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (error || !page) {
    notFound();
  }

  const initialValues: PageFormValues = {
    title: page.title,
    slug: page.slug,
    status: page.status as ContentStatus,
    seo_title: page.seo_title ?? "",
    seo_description: page.seo_description ?? "",
    sort_order: page.sort_order,
  };

  const sections = (sectionsRes.data ?? []) as PageSectionListItem[];

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/pages"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към страниците
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">{page.title}</h1>
      <p className="mt-2 text-sm text-text-muted">
        <code>{page.slug}</code> · {PAGE_STATUS_LABELS[page.status as ContentStatus]}
      </p>

      <h2 className="mt-10 font-heading text-xl text-primary">Настройки</h2>
      <PageEditForm id={page.id} initialValues={initialValues} />

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl text-primary">Секции</h2>
        <Link
          href={`/admin/pages/${page.id}/sections/new`}
          className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
        >
          Нова секция
        </Link>
      </div>

      {sections.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">
          Няма секции. Добавете ключове като <code>intro</code>,{" "}
          <code>story</code>, <code>cta</code>.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border border-border bg-bg">
          {sections.map((section) => (
            <li
              key={section.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-primary">
                  <code>{section.key}</code>
                </p>
                <p className="text-sm text-text-muted">
                  {SECTION_TYPE_LABELS[section.section_type]}
                  {" · "}
                  {section.is_published ? "Публикувана" : "Скрита"}
                  {" · "}
                  ред {section.sort_order}
                </p>
              </div>
              <Link
                href={`/admin/pages/${page.id}/sections/${section.id}`}
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                Редактирай
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
