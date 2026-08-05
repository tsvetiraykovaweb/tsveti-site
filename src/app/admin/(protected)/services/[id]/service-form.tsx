"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  SERVICE_STATUS_LABELS,
  type ServiceFormValues,
  type ServiceStatus,
} from "@/lib/cms/services";
import { saveService } from "./actions";

type Props = {
  id: string;
  initialValues: ServiceFormValues;
  mediaOptions?: { path: string; label: string }[];
};

type Status = "idle" | "loading" | "success" | "error";

export function ServiceEditForm({
  id,
  initialValues,
  mediaOptions = [],
}: Props) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;

  function update<K extends keyof ServiceFormValues>(
    key: K,
    value: ServiceFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const result = await saveService(id, values);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("success");
      setMessage("Услугата е запазена.");
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label htmlFor="title" className={labelClass}>
          Заглавие *
        </label>
        <input
          id="title"
          required
          disabled={busy}
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
          disabled={busy}
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          className={fieldClass}
          placeholder="biorezonans"
        />
        <p className="mt-1 text-xs text-text-muted">
          Малки латински букви, цифри и тирета.
        </p>
      </div>

      <div>
        <label htmlFor="summary" className={labelClass}>
          Кратко описание
        </label>
        <textarea
          id="summary"
          rows={3}
          disabled={busy}
          value={values.summary}
          onChange={(e) => update("summary", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Пълно описание
        </label>
        <textarea
          id="body"
          rows={8}
          disabled={busy}
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="image_path" className={labelClass}>
          Изображение (storage path)
        </label>
        {mediaOptions.length > 0 ? (
          <select
            id="image_path_pick"
            disabled={busy}
            value={
              mediaOptions.some((m) => m.path === values.image_path)
                ? values.image_path
                : ""
            }
            onChange={(e) => update("image_path", e.target.value)}
            className={`${fieldClass} mb-2`}
          >
            <option value="">— избор от медия библиотеката —</option>
            {mediaOptions.map((option) => (
              <option key={option.path} value={option.path}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <p className="mb-2 text-xs text-text-muted">
            Няма качени файлове още. Качете от /admin/media или въведете път
            ръчно.
          </p>
        )}
        <input
          id="image_path"
          disabled={busy}
          value={values.image_path}
          onChange={(e) => update("image_path", e.target.value)}
          className={fieldClass}
          placeholder="media/2026/08/…/w1200.webp"
        />
      </div>

      <div>
        <label htmlFor="cta_label" className={labelClass}>
          CTA етикет
        </label>
        <input
          id="cta_label"
          disabled={busy}
          value={values.cta_label}
          onChange={(e) => update("cta_label", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="cta_href" className={labelClass}>
          CTA / външен линк
        </label>
        <input
          id="cta_href"
          disabled={busy}
          value={values.cta_href}
          onChange={(e) => update("cta_href", e.target.value)}
          className={fieldClass}
          placeholder="/bezplatna-konsultatsia или https://…"
        />
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

        <div>
          <label htmlFor="status" className={labelClass}>
            Статус *
          </label>
          <select
            id="status"
            disabled={busy}
            value={values.status}
            onChange={(e) => update("status", e.target.value as ServiceStatus)}
            className={fieldClass}
          >
            {(Object.keys(SERVICE_STATUS_LABELS) as ServiceStatus[]).map(
              (key) => (
                <option key={key} value={key}>
                  {SERVICE_STATUS_LABELS[key]}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="seo_title" className={labelClass}>
          SEO заглавие
        </label>
        <input
          id="seo_title"
          disabled={busy}
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
          disabled={busy}
          value={values.seo_description}
          onChange={(e) => update("seo_description", e.target.value)}
          className={fieldClass}
        />
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

      <button
        type="submit"
        disabled={busy}
        className="bg-primary px-5 py-2.5 text-sm font-medium text-sage transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Запазване…" : "Запази"}
      </button>
    </form>
  );
}
