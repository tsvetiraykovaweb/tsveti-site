import Link from "next/link";
import { EMPTY_FAQ_VALUES } from "@/lib/cms/faqs";
import { FaqForm } from "../faq-form";

export default function AdminFaqNewPage() {
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
      <h1 className="font-heading text-3xl text-primary">Нов въпрос</h1>
      <p className="mt-2 text-text-muted">
        Добави шаблонен или реален въпрос. Отговорите остават редактируеми.
      </p>
      <FaqForm mode="create" initialValues={EMPTY_FAQ_VALUES} />
    </section>
  );
}
