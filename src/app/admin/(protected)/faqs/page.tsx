import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { FaqListItem } from "@/lib/cms/faqs";

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, sort_order, is_published")
    .order("category", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true });

  const faqs = (data ?? []) as FaqListItem[];

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
          href="/admin/faqs/new"
          className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
        >
          Нов въпрос
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">Въпроси (FAQ)</h1>
      <p className="mt-2 text-text-muted">
        Seed шаблони са в категория „Общи“ и са непубликувани по подразбиране.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && faqs.length === 0 ? (
        <div className="mt-8 space-y-3 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          <p>Няма FAQ записи.</p>
          <p>
            Можеш да създадеш нов въпрос или да провериш seed съдържанието в{" "}
            <code>supabase/seed/001_initial_content.sql</code>.
          </p>
        </div>
      ) : null}

      {faqs.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {faqs.map((faq) => (
            <li
              key={faq.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{faq.question}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {faq.category ?? "Без категория"}
                  {" · "}
                  {faq.is_published ? "Публикуван" : "Чернова"}
                  {" · "}
                  ред {faq.sort_order}
                </p>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {faq.answer}
                </p>
              </div>
              <Link
                href={`/admin/faqs/${faq.id}`}
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
