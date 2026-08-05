import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-heading text-3xl text-primary">Табло</h1>
      <p className="mt-2 text-text-muted">
        Управление на съдържанието на сайта. Започни с настройките.
      </p>

      <nav className="mt-8 flex flex-col gap-3">
        <Link
          href="/admin/site-settings"
          className="text-primary underline-offset-4 hover:underline"
        >
          Настройки на сайта
        </Link>
      </nav>

      <ul className="mt-8 list-inside list-disc text-sm text-text-muted">
        <li>Вход / изход / admin_profiles — активни</li>
        <li>Site settings редактор — активен</li>
        <li>Услуги, FAQ, отзиви, страници — предстоят</li>
      </ul>
    </section>
  );
}
