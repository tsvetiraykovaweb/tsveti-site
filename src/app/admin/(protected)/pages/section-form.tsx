"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  SECTION_TYPE_LABELS,
  type SectionFormValues,
} from "@/lib/cms/pages";
import type { SectionType } from "@/types/database";
import { createPageSection, updatePageSection } from "./actions";

type Props = {
  pageId: string;
  sectionId?: string;
  initialValues: SectionFormValues;
  mediaOptions?: { path: string; label: string }[];
};

export function SectionEditForm({
  pageId,
  sectionId,
  initialValues,
  mediaOptions = [],
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof SectionFormValues>(
    key: K,
    value: SectionFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = sectionId
        ? await updatePageSection(pageId, sectionId, values)
        : await createPageSection(pageId, values);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Секцията е запазена.");
      if (!sectionId) {
        router.push(`/admin/pages/${pageId}/sections/${result.id}`);
        router.refresh();
      }
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4">
      <div>
        <label htmlFor="key" className={labelClass}>
          Ключ (section key) *
        </label>
        <input
          id="key"
          required
          disabled={isPending || Boolean(sectionId)}
          value={values.key}
          onChange={(e) => update("key", e.target.value)}
          className={fieldClass}
          placeholder="intro"
        />
        {sectionId ? (
          <p className="mt-1 text-xs text-text-muted">
            Ключът не се сменя след създаване (за стабилност на публичните
            страници).
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="section_type" className={labelClass}>
            Тип
          </label>
          <select
            id="section_type"
            disabled={isPending}
            value={values.section_type}
            onChange={(e) =>
              update("section_type", e.target.value as SectionType)
            }
            className={fieldClass}
          >
            {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map((key) => (
              <option key={key} value={key}>
                {SECTION_TYPE_LABELS[key]}
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
        <label htmlFor="eyebrow" className={labelClass}>
          Eyebrow
        </label>
        <input
          id="eyebrow"
          disabled={isPending}
          value={values.eyebrow}
          onChange={(e) => update("eyebrow", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="heading" className={labelClass}>
          Заглавие (heading)
        </label>
        <input
          id="heading"
          disabled={isPending}
          value={values.heading}
          onChange={(e) => update("heading", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Съдържание (body / text)
        </label>
        <textarea
          id="body"
          rows={8}
          disabled={isPending}
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          className={fieldClass}
          placeholder="Обикновен текст. За списъци — по един ред на елемент."
        />
      </div>

      <div>
        <label htmlFor="image_path" className={labelClass}>
          Изображение (storage path)
        </label>
        {mediaOptions.length > 0 ? (
          <select
            disabled={isPending}
            value={
              mediaOptions.some((m) => m.path === values.image_path)
                ? values.image_path
                : ""
            }
            onChange={(e) => update("image_path", e.target.value)}
            className={`${fieldClass} mb-2`}
          >
            <option value="">— избор от медия —</option>
            {mediaOptions.map((option) => (
              <option key={option.path} value={option.path}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
        <input
          id="image_path"
          disabled={isPending}
          value={values.image_path}
          onChange={(e) => update("image_path", e.target.value)}
          className={fieldClass}
          placeholder="media/…/w1200.webp"
        />
      </div>

      <div>
        <label htmlFor="image_alt" className={labelClass}>
          Alt текст за изображение
        </label>
        <input
          id="image_alt"
          disabled={isPending}
          value={values.image_alt}
          onChange={(e) => update("image_alt", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta_label" className={labelClass}>
            CTA етикет
          </label>
          <input
            id="cta_label"
            disabled={isPending}
            value={values.cta_label}
            onChange={(e) => update("cta_label", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="cta_href" className={labelClass}>
            CTA линк
          </label>
          <input
            id="cta_href"
            disabled={isPending}
            value={values.cta_href}
            onChange={(e) => update("cta_href", e.target.value)}
            className={fieldClass}
            placeholder="/bezplatna-konsultatsia"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          disabled={isPending}
          checked={values.is_published}
          onChange={(e) => update("is_published", e.target.checked)}
        />
        Публикувана секция
      </label>

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
        {isPending ? "Запазване…" : "Запази секцията"}
      </button>
    </form>
  );
}
