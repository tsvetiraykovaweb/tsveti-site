"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostFormValues, BlogCategory } from "@/lib/cms/blog-shared";
import { normalizeBlogSlug } from "@/lib/cms/blog-shared";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { createBlogPost, updateBlogPost } from "./actions";

type Props = {
  mode: "create" | "edit";
  id?: string;
  initialValues: BlogPostFormValues;
  mediaOptions?: { path: string; label: string }[];
  categories?: BlogCategory[];
};

type Status = "idle" | "loading" | "success" | "error";

export function BlogForm({
  mode,
  id,
  initialValues,
  mediaOptions = [],
  categories = [],
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;
  const fieldClass =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
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
    <form onSubmit={onSubmit} className="mt-8 space-y-8">
      {/* Main content card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">Съдържание</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="title" className={labelClass}>Заглавие *</label>
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
            <label htmlFor="slug" className={labelClass}>Slug *</label>
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
            <label htmlFor="excerpt" className={labelClass}>Кратък откъс</label>
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
            <label className={labelClass}>Съдържание (Markdown) *</label>
            <MarkdownEditor
              id="content"
              value={values.content}
              onChange={(v) => update("content", v)}
              disabled={busy}
              rows={18}
              mediaOptions={mediaOptions}
            />
          </div>
        </div>
      </div>

      {/* Settings card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">Настройки</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category_id" className={labelClass}>Категория</label>
            <select
              id="category_id"
              disabled={busy}
              value={values.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              className={fieldClass}
            >
              <option value="">Без категория</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author_name" className={labelClass}>Автор</label>
            <input
              id="author_name"
              disabled={busy}
              value={values.author_name}
              onChange={(e) => update("author_name", e.target.value)}
              className={fieldClass}
              placeholder="Цветелина Райкова"
            />
          </div>

          <div>
            <label htmlFor="reading_time_minutes" className={labelClass}>Време за четене (мин.)</label>
            <input
              id="reading_time_minutes"
              type="number"
              min={0}
              disabled={busy}
              value={values.reading_time_minutes}
              onChange={(e) => update("reading_time_minutes", e.target.value)}
              className={fieldClass}
              placeholder="5"
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Статус *</label>
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
            <label htmlFor="published_at" className={labelClass}>Дата на публикуване</label>
            <input
              id="published_at"
              type="datetime-local"
              disabled={busy}
              value={values.published_at}
              onChange={(e) => update("published_at", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={values.is_featured}
                onChange={(e) => update("is_featured", e.target.checked)}
                disabled={busy}
                className="h-4 w-4 accent-primary"
              />
              Препоръчана
            </label>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={values.is_popular}
                onChange={(e) => update("is_popular", e.target.checked)}
                disabled={busy}
                className="h-4 w-4 accent-primary"
              />
              Популярна
            </label>
          </div>
        </div>
      </div>

      {/* Image card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">Основно изображение</h2>
        <div className="mt-5 space-y-3">
          {mediaOptions.length > 0 ? (
            <select
              disabled={busy}
              value={
                mediaOptions.some((m) => m.path === values.featured_image_path)
                  ? values.featured_image_path
                  : ""
              }
              onChange={(e) => update("featured_image_path", e.target.value)}
              className={fieldClass}
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
            disabled={busy}
            value={values.featured_image_path}
            onChange={(e) => update("featured_image_path", e.target.value)}
            className={fieldClass}
            placeholder="media/2026/08/.../w1200.webp"
          />
        </div>
      </div>

      {/* SEO card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">SEO</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="seo_title" className={labelClass}>SEO заглавие</label>
            <input
              id="seo_title"
              disabled={busy}
              value={values.seo_title}
              onChange={(e) => update("seo_title", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="seo_description" className={labelClass}>SEO описание</label>
            <textarea
              id="seo_description"
              rows={3}
              disabled={busy}
              value={values.seo_description}
              onChange={(e) => update("seo_description", e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Status message + submit */}
      {message ? (
        <p
          role="status"
          className={
            status === "error"
              ? "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              : "rounded-lg border border-border bg-sage px-4 py-3 text-sm text-primary"
          }
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-sage transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Запазване…" : mode === "create" ? "Създай статия" : "Запази промените"}
      </button>
    </form>
  );
}
