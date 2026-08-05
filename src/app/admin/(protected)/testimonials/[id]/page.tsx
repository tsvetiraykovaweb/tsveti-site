import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TestimonialFormValues } from "@/lib/cms/testimonials";
import { TestimonialForm } from "../testimonial-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTestimonialEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "id, quote, author_name, author_role, avatar_path, sort_order, is_published",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const initialValues: TestimonialFormValues = {
    quote: data.quote,
    author_name: data.author_name,
    author_role: data.author_role ?? "",
    avatar_path: data.avatar_path ?? "",
    sort_order: data.sort_order,
    is_published: data.is_published,
  };

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/testimonials"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към отзивите
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Редакция на отзив</h1>
      <p className="mt-2 text-text-muted">{data.author_name}</p>
      <TestimonialForm
        mode="edit"
        id={data.id}
        initialValues={initialValues}
      />
    </section>
  );
}
