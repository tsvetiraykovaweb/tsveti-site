"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TestimonialFormValues } from "@/lib/cms/testimonials";
import {
  createTestimonial,
  unpublishTestimonial,
  updateTestimonial,
} from "./actions";

type Props = {
  mode: "create" | "edit";
  id?: string;
  initialValues: TestimonialFormValues;
};

type Status = "idle" | "loading" | "success" | "error";

export function TestimonialForm({ mode, id, initialValues }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;

  function update<K extends keyof TestimonialFormValues>(
    key: K,
    value: TestimonialFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createTestimonial(values)
          : await updateTestimonial(id!, values);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(
        mode === "create" ? "Отзивът е създаден." : "Промените са запазени.",
      );

      if (mode === "create") {
        router.replace(`/admin/testimonials/${result.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    });
  }

  function onUnpublish() {
    if (!id) return;
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const result = await unpublishTestimonial(id);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setValues((prev) => ({ ...prev, is_published: false }));
      setStatus("success");
      setMessage("Отзивът е отпубликуван (не е изтрит).");
      router.refresh();
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label htmlFor="quote" className={labelClass}>
          Цитат *
        </label>
        <textarea
          id="quote"
          required
          rows={5}
          disabled={busy}
          value={values.quote}
          onChange={(e) => update("quote", e.target.value)}
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-text-muted">
          Не публикувай измислени отзиви. Seed текстовете са шаблони.
        </p>
      </div>

      <div>
        <label htmlFor="author_name" className={labelClass}>
          Име / автор *
        </label>
        <input
          id="author_name"
          required
          disabled={busy}
          value={values.author_name}
          onChange={(e) => update("author_name", e.target.value)}
          className={fieldClass}
          placeholder="Клиент (шаблон)"
        />
      </div>

      <div>
        <label htmlFor="author_role" className={labelClass}>
          Роля / етикет
        </label>
        <input
          id="author_role"
          disabled={busy}
          value={values.author_role}
          onChange={(e) => update("author_role", e.target.value)}
          className={fieldClass}
          placeholder="по избор"
        />
      </div>

      <div>
        <label htmlFor="avatar_path" className={labelClass}>
          Път към аватар (Storage)
        </label>
        <input
          id="avatar_path"
          disabled={busy}
          value={values.avatar_path}
          onChange={(e) => update("avatar_path", e.target.value)}
          className={fieldClass}
          placeholder="site-assets/…"
        />
        <p className="mt-1 text-xs text-text-muted">
          Само път към файл — качване на медия предстои.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sort_order" className={labelClass}>
            Ред (sort_order) *
          </label>
          <input
            id="sort_order"
            type="number"
            required
            disabled={busy}
            value={values.sort_order}
            onChange={(e) =>
              update("sort_order", Number.parseInt(e.target.value, 10) || 0)
            }
            className={fieldClass}
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              disabled={busy}
              checked={values.is_published}
              onChange={(e) => update("is_published", e.target.checked)}
            />
            Публикуван
          </label>
        </div>
      </div>

      {message ? (
        <p
          role="status"
          className={
            status === "error"
              ? "rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              : "rounded border border-border bg-sage px-3 py-2 text-sm text-primary"
          }
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary px-5 py-2.5 text-sm font-medium text-sage transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy
            ? "Запазване…"
            : mode === "create"
              ? "Създай"
              : "Запази"}
        </button>

        {mode === "edit" && values.is_published ? (
          <button
            type="button"
            disabled={busy}
            onClick={onUnpublish}
            className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline disabled:opacity-60"
          >
            Отпубликувай
          </button>
        ) : null}
      </div>
    </form>
  );
}
