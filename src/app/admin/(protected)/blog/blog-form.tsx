"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostFormValues } from "@/lib/cms/blog";
import { normalizeBlogSlug } from "@/lib/cms/blog";
import { createBlogPost, updateBlogPost } from "./actions";

type Props = {
  mode: "create" | "edit";
  id?: string;
  initialValues: BlogPostFormValues;
  mediaOptions?: { path: string; label: string }[];
};

type Status = "idle" | "loading" | "success" | "error";

export function BlogForm({
  mode,
  id,
  initialValues,
  mediaOptions = [],
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;
  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  function update<K extends keyof BlogPostFormValues>(
    key: K,
    value: BlogPostFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const normalized = { ...values, slug: normalizeBlogSlug(values.slug) };
      const result =
        mode === "create"
          ? await createBlogPost(normalized)
          : await updateBlogPost(id!, normalized);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(mode === "create" ? "Статията е създадена." : "Промените са запазени.");

      if (mode === "create") {
        router.replace(`/admin/blog/${result.id}`);
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-5">
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
          placeholder="spokoen-pogled-kam-..."
        />
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Кратък откъс
        </label>
        <textarea
          id="excerpt"
          rows={3}
          disabled={busy}
          value={values.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Съдържание (Markdown) *
        </label>
        <textarea
          id="content"
          rows={16}
          required
          disabled={busy}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className={fieldClass}
        />
        <div className="mt-2 rounded border border-border bg-bg-secondary px-3 py-3 text-xs text-text-muted">
          <p className="font-medium text-text">Пример:</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
{`## Подзаглавие
Текст с **удебелен** и *italic* акцент.

- Точка 1
- Точка 2

> Кратък цитат

[линк](https://example.com)`}
          </pre>
        </div>
      </div>

      <div>
        <label htmlFor="featured_image_path" className={labelClass}>
          Основно изображение
        </label>
        {mediaOptions.length > 0 ? (
          <select
            id="featured_image_path_pick"
            disabled={busy}
            value={
              mediaOptions.some((m) => m.path === values.featured_image_path)
                ? values.featured_image_path
                : ""
            }
            onChange={(e) => update("featured_image_path", e.target.value)}
            className={`${fieldClass} mb-2`}
          >
            <option value="">— избор от медия библиотеката —</option>
            {mediaOptions.map((option) => (
              <option key={option.path} value={option.path}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
        <input
          id="featured_image_path"
          disabled={busy}
          value={values.featured_image_path}
          onChange={(e) => update("featured_image_path", e.target.value)}
          className={fieldClass}
          placeholder="media/2026/08/.../w1200.webp"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className={labelClass}>
            Статус *
          </label>
          <select
            id="status"
            disabled={busy}
            value={values.status}
            onChange={(e) =>
              update("status", e.target.value as BlogPostFormValues["status"])
            }
            className={fieldClass}
          >
            <option value="draft">Чернова</option>
            <option value="published">Публикувана</option>
          </select>
        </div>

        <div>
          <label htmlFor="published_at" className={labelClass}>
            Дата на публикуване
          </label>
          <input
            id="published_at"
            type="datetime-local"
            disabled={busy}
            value={values.published_at}
            onChange={(e) => update("published_at", e.target.value)}
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
        {busy ? "Запазване…" : mode === "create" ? "Създай" : "Запази"}
      </button>
    </form>
  );
}
