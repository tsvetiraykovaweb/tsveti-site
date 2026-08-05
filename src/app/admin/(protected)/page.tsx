import Link from "next/link";

const cmsSections = [
  {
    href: "/admin/site-settings",
    title: "Настройки на сайта",
    status: "Готов",
    note: "Име, контакт, CTA, SEO",
  },
  {
    href: "/admin/services",
    title: "Услуги",
    status: "Готов",
    note: "4 seed услуги — редакция по id",
  },
  {
    href: "/admin/faqs",
    title: "Въпроси (FAQ)",
    status: "Готов",
    note: "Списък / нов / редакция",
  },
  {
    href: "/admin/testimonials",
    title: "Отзиви",
    status: "Готов",
    note: "Шаблони — не публикувай измислени",
  },
  {
    href: "/admin/consultation-requests",
    title: "Заявки за консултация",
    status: "Готов",
    note: "Частни заявки от публичната форма",
  },
  {
    href: "/admin/media",
    title: "Медия библиотека",
    status: "Готов",
    note: "Качване + WebP варианти в site-assets",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-heading text-3xl text-primary">Табло</h1>
      <p className="mt-2 text-text-muted">
        CMS за сайта на <strong className="font-medium text-text">Цветелина Райкова</strong>{" "}
        (показвано име: Цвети).
      </p>

      <h2 className="mt-10 font-heading text-xl text-primary">Статус на CMS</h2>
      <ul className="mt-4 divide-y divide-border border border-border bg-bg">
        {cmsSections.map((item) => (
          <li
            key={item.href}
            className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link
                href={item.href}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-text-muted">{item.note}</p>
            </div>
            <span className="shrink-0 text-sm text-accent">{item.status}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded border border-border bg-bg-secondary px-4 py-4 text-sm text-text-muted">
        <p className="font-medium text-text">Преди Vercel deploy</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Env vars: URL, anon, site URL (+ service role само сървърно)</li>
          <li>
            SQL patch за името:{" "}
            <code>supabase/seed/002_fix_raykova.sql</code>
          </li>
          <li>Провери Настройки → официално име = Цветелина Райкова</li>
          <li>Framework Preset = Next.js, Root Directory = ./</li>
        </ul>
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Публичният сайт чете CMS съдържанието. Заявките за консултация са
        видими само за админи.
      </p>
    </section>
  );
}
