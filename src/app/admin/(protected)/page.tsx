import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-heading text-3xl text-primary">Табло</h1>
      <p className="mt-2 text-text-muted">
        Управление на съдържанието на сайта.
      </p>

      <nav className="mt-8 flex flex-col gap-3">
        <Link
          href="/admin/site-settings"
          className="text-primary underline-offset-4 hover:underline"
        >
          Настройки на сайта
        </Link>
        <Link
          href="/admin/services"
          className="text-primary underline-offset-4 hover:underline"
        >
          Услуги
        </Link>
        <Link
          href="/admin/faqs"
          className="text-primary underline-offset-4 hover:underline"
        >
          Въпроси (FAQ)
        </Link>
      </nav>

      <ul className="mt-8 list-inside list-disc text-sm text-text-muted">
        <li>Вход / изход / admin_profiles — активни</li>
        <li>Site settings — активен</li>
        <li>Услуги — активен</li>
        <li>FAQ — активен</li>
        <li>Отзиви, публични страници — предстоят</li>
      </ul>
    </section>
  );
}
