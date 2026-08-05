import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FaqFormValues } from "@/lib/cms/faqs";
import { FaqForm } from "../faq-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminFaqEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, category, sort_order, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const initialValues: FaqFormValues = {
    question: data.question,
    answer: data.answer,
    category: data.category ?? "",
    sort_order: data.sort_order,
    is_published: data.is_published,
  };

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/faqs"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към FAQ
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Редакция на въпрос</h1>
      <p className="mt-2 line-clamp-2 text-text-muted">{data.question}</p>
      <FaqForm mode="edit" id={data.id} initialValues={initialValues} />
    </section>
  );
}
