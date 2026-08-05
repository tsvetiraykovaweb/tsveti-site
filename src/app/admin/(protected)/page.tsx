export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-heading text-3xl text-primary">Табло</h1>
      <p className="mt-2 text-text-muted">
        Успешен вход. CMS редакторите ще бъдат добавени в следващите етапи.
      </p>
      <ul className="mt-6 list-inside list-disc text-sm text-text-muted">
        <li>Email/password вход — активен</li>
        <li>admin_profiles проверка — активна</li>
        <li>Изход — в горния десен ъгъл</li>
        <li>CMS CRUD — предстои</li>
      </ul>
    </section>
  );
}
