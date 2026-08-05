"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FaqFormValues } from "@/lib/cms/faqs";
import { createFaq, unpublishFaq, updateFaq } from "./actions";

type Props = {
  mode: "create" | "edit";
  id?: string;
  initialValues: FaqFormValues;
};

type Status = "idle" | "loading" | "success" | "error";

export function FaqForm({ mode, id, initialValues }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;

  function update<K extends keyof FaqFormValues>(
    key: K,
    value: FaqFormValues[K],
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
          ? await createFaq(values)
          : await updateFaq(id!, values);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(
        mode === "create" ? "Въпросът е създаден." : "Промените са запазени.",
      );

      if (mode === "create") {
        router.replace(`/admin/faqs/${result.id}`);
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
      const result = await unpublishFaq(id);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setValues((prev) => ({ ...prev, is_published: false }));
      setStatus("success");
      setMessage("Въпросът е отпубликуван (не е изтрит).");
      router.refresh();
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label htmlFor="question" className={labelClass}>
          Въпрос *
        </label>
        <input
          id="question"
          required
          disabled={busy}
          value={values.question}
          onChange={(e) => update("question", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="answer" className={labelClass}>
          Отговор *
        </label>
        <textarea
          id="answer"
          required
          rows={6}
          disabled={busy}
          value={values.answer}
          onChange={(e) => update("answer", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Категория
        </label>
        <input
          id="category"
          disabled={busy}
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className={fieldClass}
          placeholder="Общи"
        />
        <p className="mt-1 text-xs text-text-muted">
          В схемата няма връзка към страница/услуга — ползва се категория за
          групиране.
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
