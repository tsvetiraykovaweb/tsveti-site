import Link from "next/link";

/**
 * Shown when a user is authenticated but not listed in admin_profiles.
 * Outside (protected) so it does not loop with the admin gate.
 */
export default function AdminUnauthorizedPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <h1 className="font-heading text-3xl text-primary">Нямате достъп</h1>
      <p className="mt-3 max-w-md text-center text-text-muted">
        Влезли сте в акаунт, който не е администратор. Само потребители в{" "}
        <code className="text-sm">admin_profiles</code> могат да управляват
        сайта.
      </p>
      <Link
        href="/admin/login"
        className="mt-8 text-accent underline-offset-4 hover:underline"
      >
        Към вход
      </Link>
    </main>
  );
}
