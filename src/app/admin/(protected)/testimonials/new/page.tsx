import Link from "next/link";
import { EMPTY_TESTIMONIAL_VALUES } from "@/lib/cms/testimonials";
import { TestimonialForm } from "../testimonial-form";

export default function AdminTestimonialNewPage() {
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
      <h1 className="font-heading text-3xl text-primary">Нов отзив</h1>
      <p className="mt-2 text-text-muted">
        Добавяй само реално одобрени отзиви. За тестове ползвай ясно означен
        шаблон.
      </p>
      <TestimonialForm mode="create" initialValues={EMPTY_TESTIMONIAL_VALUES} />
    </section>
  );
}
