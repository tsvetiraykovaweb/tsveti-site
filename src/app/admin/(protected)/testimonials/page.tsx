import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { TestimonialListItem } from "@/lib/cms/testimonials";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_role, sort_order, is_published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const items = (data ?? []) as TestimonialListItem[];

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
          href="/admin/testimonials/new"
          className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
        >
          Нов отзив
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">Отзиви</h1>
      <p className="mt-2 text-text-muted">
        Seed записите са шаблони („Клиент (шаблон)“) и са непубликувани. Не
        публикувай измислени цитати.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && items.length === 0 ? (
        <div className="mt-8 space-y-3 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          <p>Няма отзиви в базата.</p>
          <p>
            Създай нов или провери seed:{" "}
            <code>supabase/seed/001_initial_content.sql</code>
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{item.author_name}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {item.author_role ? `${item.author_role} · ` : null}
                  {item.is_published ? "Публикуван" : "Чернова"}
                  {" · "}
                  ред {item.sort_order}
                </p>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  „{item.quote}“
                </p>
              </div>
              <Link
                href={`/admin/testimonials/${item.id}`}
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
