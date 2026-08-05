import { logoutAdmin } from "@/lib/auth/actions";

export function AdminLogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button
        type="submit"
        className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
      >
        Изход
      </button>
    </form>
  );
}
