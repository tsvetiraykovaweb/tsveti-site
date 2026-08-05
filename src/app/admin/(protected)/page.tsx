export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-heading text-3xl text-primary">Табло</h1>
      <p className="mt-2 text-text-muted">
        Тук ще се управляват текстове, услуги, FAQ, отзиви, SEO и медия.
      </p>
      <ul className="mt-6 list-inside list-disc text-sm text-text-muted">
        <li>Auth + admin_profiles проверка — активни</li>
        <li>CMS редактори — предстоят</li>
        <li>Заявки за консултация — таблица + server action готови</li>
      </ul>
    </section>
  );
}
