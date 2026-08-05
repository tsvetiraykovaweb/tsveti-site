import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CONSULTATION_STATUS_LABELS,
  CONTACT_METHOD_ADMIN_LABELS,
  formatConsultationDate,
  previewMessage,
  type ConsultationRequestListItem,
} from "@/lib/consultations/admin";

export default async function AdminConsultationRequestsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultation_requests")
    .select(
      "id, created_at, name, phone, email, service_interest, preferred_contact_method, status, message",
    )
    .order("created_at", { ascending: false });

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
        админ панела. Изтриване и имейл известия не са включени в тази стъпка.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && requests.length === 0 ? (
        <div className="mt-8 space-y-3 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          <p>Няма постъпили заявки.</p>
          <p>
            Изпратете тестова заявка от{" "}
            <code>/bezplatna-konsultatsia</code>, за да се появи тук.
          </p>
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
