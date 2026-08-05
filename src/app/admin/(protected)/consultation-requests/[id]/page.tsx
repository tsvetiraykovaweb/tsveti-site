import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CONSULTATION_STATUS_LABELS,
  CONTACT_METHOD_ADMIN_LABELS,
  formatConsultationDate,
  type ConsultationRequestDetail,
} from "@/lib/consultations/admin";
import { ConsultationStatusForm } from "../status-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminConsultationRequestDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultation_requests")
    .select(
      "id, created_at, updated_at, name, phone, email, service_interest, preferred_contact_method, status, message, consent",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const request = data as ConsultationRequestDetail;

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/consultation-requests"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към заявките
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">{request.name}</h1>
      <p className="mt-2 text-text-muted">
        Постъпила: {formatConsultationDate(request.created_at)}
        {" · "}
        {CONSULTATION_STATUS_LABELS[request.status]}
      </p>

      <dl className="mt-8 max-w-2xl space-y-4 border border-border bg-bg px-4 py-5 text-sm">
        <div>
          <dt className="text-text-muted">Телефон</dt>
          <dd className="mt-1 text-primary">
            <a href={`tel:${request.phone}`} className="hover:underline">
              {request.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Имейл</dt>
          <dd className="mt-1 text-primary">
            {request.email ? (
              <a href={`mailto:${request.email}`} className="hover:underline">
                {request.email}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Интерес към услуга</dt>
          <dd className="mt-1 text-primary">
            {request.service_interest ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Предпочитан начин за връзка</dt>
          <dd className="mt-1 text-primary">
            {CONTACT_METHOD_ADMIN_LABELS[request.preferred_contact_method]}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Съобщение</dt>
          <dd className="mt-1 whitespace-pre-wrap text-primary">
            {request.message?.trim() || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Съгласие</dt>
          <dd className="mt-1 text-primary">
            {request.consent ? "Да" : "Не"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Последна промяна</dt>
          <dd className="mt-1 text-primary">
            {formatConsultationDate(request.updated_at)}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 font-heading text-xl text-primary">Статус</h2>
      <ConsultationStatusForm id={request.id} currentStatus={request.status} />
    </section>
  );
}
