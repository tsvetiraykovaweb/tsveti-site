"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  PAGE_STATUS_LABELS,
  type PageFormValues,
} from "@/lib/cms/pages";
import type { ContentStatus } from "@/types/database";
import { updatePage } from "./actions";

type Props = {
  id: string;
  initialValues: PageFormValues;
};

export function PageEditForm({ id, initialValues }: Props) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof PageFormValues>(
    key: K,
    value: PageFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updatePage(id, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Страницата е запазена.");
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4">
      <div>
        <label htmlFor="title" className={labelClass}>
          Заглавие *
        </label>
        <input
          id="title"
          required
          disabled={isPending}
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug *
        </label>
        <input
          id="slug"
          required
          disabled={isPending}
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className={labelClass}>
            Статус *
          </label>
          <select
            id="status"
            disabled={isPending}
            value={values.status}
            onChange={(e) => update("status", e.target.value as ContentStatus)}
            className={fieldClass}
          >
            {(Object.keys(PAGE_STATUS_LABELS) as ContentStatus[]).map((key) => (
              <option key={key} value={key}>
                {PAGE_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort_order" className={labelClass}>
            Ред *
          </label>
          <input
            id="sort_order"
            type="number"
            required
            disabled={isPending}
            value={values.sort_order}
            onChange={(e) =>
              update("sort_order", Number.parseInt(e.target.value, 10) || 0)
            }
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="seo_title" className={labelClass}>
          SEO заглавие
        </label>
        <input
          id="seo_title"
          disabled={isPending}
          value={values.seo_title}
          onChange={(e) => update("seo_title", e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="seo_description" className={labelClass}>
          SEO описание
        </label>
        <textarea
          id="seo_description"
          rows={3}
          disabled={isPending}
          value={values.seo_description}
          onChange={(e) => update("seo_description", e.target.value)}
          className={fieldClass}
        />
      </div>
      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-primary" role="status">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary px-5 py-2.5 text-sm font-medium text-sage hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Запазване…" : "Запази страницата"}
      </button>
    </form>
  );
}
