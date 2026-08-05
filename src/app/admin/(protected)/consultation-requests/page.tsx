import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_CONSULTATION_STATUSES,
  CONSULTATION_STATUS_LABELS,
  CONTACT_METHOD_ADMIN_LABELS,
  formatConsultationDate,
  isConsultationStatus,
  previewMessage,
  type ConsultationRequestListItem,
} from "@/lib/consultations/admin";
import type { ConsultationStatus } from "@/types/database";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminConsultationRequestsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status?.trim() || "";
  const q = params.q?.trim() || "";

  const supabase = await createClient();
  let query = supabase
    .from("consultation_requests")
    .select(
      "id, created_at, name, phone, email, service_interest, preferred_contact_method, status, message",
    )
    .order("created_at", { ascending: false });

  if (statusFilter && isConsultationStatus(statusFilter)) {
    query = query.eq("status", statusFilter);
  }

  if (q) {
    // PostgREST or() filter — ilike on contact fields only (no message search).
    const escaped = q.replace(/[%_,]/g, "");
    if (escaped) {
      query = query.or(
        `name.ilike.%${escaped}%,phone.ilike.%${escaped}%,email.ilike.%${escaped}%`,
      );
    }
  }

  const { data, error } = await query;
  const requests = (data ?? []) as ConsultationRequestListItem[];

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">Заявки за консултация</h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        Частни заявки от публичната форма. Не споделяйте съдържанието извън
        админ панела. Сортирани по най-нови.
      </p>

      <form
        method="get"
        className="mt-6 flex flex-col gap-3 border border-border bg-bg px-4 py-4 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="min-w-[12rem] flex-1">
          <label
            htmlFor="q"
            className="mb-1 block text-sm text-text-muted"
          >
            Търсене (име / телефон / имейл)
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            className="w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
            placeholder="напр. Иванова"
          />
        </div>
        <div className="min-w-[10rem]">
          <label
            htmlFor="status"
            className="mb-1 block text-sm text-text-muted"
          >
            Статус
          </label>
          <select
            id="status"
            name="status"
            defaultValue={statusFilter}
            className="w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
          >
            <option value="">Всички</option>
            {ADMIN_CONSULTATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {CONSULTATION_STATUS_LABELS[value as ConsultationStatus]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90"
        >
          Филтрирай
        </button>
        {statusFilter || q ? (
          <Link
            href="/admin/consultation-requests"
            className="px-3 py-2 text-sm text-text-muted underline-offset-4 hover:underline"
          >
            Изчисти
          </Link>
        ) : null}
      </form>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && requests.length === 0 ? (
        <div className="mt-8 space-y-3 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          <p>
            {statusFilter || q
              ? "Няма заявки за този филтър."
              : "Няма постъпили заявки."}
          </p>
          {!statusFilter && !q ? (
            <p>
              Изпратете тестова заявка от{" "}
              <code>/bezplatna-konsultatsia</code>, за да се появи тук.
            </p>
          ) : null}
        </div>
      ) : null}

      {requests.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{request.name}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {formatConsultationDate(request.created_at)}
                  {" · "}
                  {CONSULTATION_STATUS_LABELS[request.status]}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  {request.phone}
                  {request.email ? ` · ${request.email}` : null}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {request.service_interest ?? "—"}
                  {" · "}
                  {
                    CONTACT_METHOD_ADMIN_LABELS[
                      request.preferred_contact_method
                    ]
                  }
                </p>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {previewMessage(request.message)}
                </p>
              </div>
              <Link
                href={`/admin/consultation-requests/${request.id}`}
                className="shrink-0 text-sm text-accent underline-offset-4 hover:underline"
              >
                Отвори
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
