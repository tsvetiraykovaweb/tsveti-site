import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  SERVICE_STATUS_LABELS,
  type ServiceListItem,
  type ServiceStatus,
} from "@/lib/cms/services";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, title, slug, summary, status, cta_href, sort_order")
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as ServiceListItem[];

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
      <h1 className="font-heading text-3xl text-primary">Услуги</h1>
      <p className="mt-2 text-text-muted">
        Редактирай заглавия, описания, статус и линкове. Публичните страници
        предстоят.
      </p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
        </p>
      ) : null}

      {!error && services.length === 0 ? (
        <div className="mt-8 space-y-3 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          <p>Няма услуги в базата.</p>
          <p>
            Ако още не си приложил seed съдържанието, пусни в Supabase SQL
            Editor файла{" "}
            <code className="text-text">supabase/seed/001_initial_content.sql</code>
            — там са четирите услуги (Биорезонанс, От тревога към спокойствие,
            Хранителна програма, Избери себе си).
          </p>
        </div>
      ) : null}

      {services.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border border-border bg-bg">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{service.title}</p>
                <p className="mt-1 text-sm text-text-muted">
                  <span className="font-mono text-xs">{service.slug}</span>
                  {" · "}
                  {SERVICE_STATUS_LABELS[service.status as ServiceStatus] ??
                    service.status}
                  {" · "}
                  ред {service.sort_order}
                </p>
                {service.summary ? (
                  <p className="mt-2 text-sm text-text-muted line-clamp-2">
                    {service.summary}
                  </p>
                ) : null}
                {service.cta_href ? (
                  <p className="mt-2 text-xs text-text-muted">
                    Линк:{" "}
                    <span className="break-all font-mono">{service.cta_href}</span>
                  </p>
                ) : null}
              </div>
              <Link
                href={`/admin/services/${service.id}`}
                className="shrink-0 text-sm text-accent underline-offset-4 hover:underline"
              >
                Редактирай
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
