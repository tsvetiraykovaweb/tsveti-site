import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ServiceFormValues, ServiceStatus } from "@/lib/cms/services";
import { ServiceEditForm } from "./service-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminServiceEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, slug, summary, body, cta_label, cta_href, sort_order, status, seo_title, seo_description",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const initialValues: ServiceFormValues = {
    title: data.title,
    slug: data.slug,
    summary: data.summary ?? "",
    body: data.body ?? "",
    cta_label: data.cta_label ?? "",
    cta_href: data.cta_href ?? "",
    sort_order: data.sort_order,
    status: data.status as ServiceStatus,
    seo_title: data.seo_title ?? "",
    seo_description: data.seo_description ?? "",
  };

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/services"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към услугите
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Редакция на услуга</h1>
      <p className="mt-2 text-text-muted">{data.title}</p>
      <p className="mt-3 max-w-2xl text-xs text-text-muted">
        Полетата следват текущата схема: кратко описание →{" "}
        <code>summary</code>, пълно → <code>body</code>, линк →{" "}
        <code>cta_href</code>, статус → <code>status</code>. Няма отделни
        колони за subtitle/disclaimer.
      </p>
      <ServiceEditForm id={data.id} initialValues={initialValues} />
    </section>
  );
}
