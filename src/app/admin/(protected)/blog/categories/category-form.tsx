"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { normalizeBlogSlug, type BlogCategory } from "@/lib/cms/blog-shared";
import {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "./actions";

type Props = {
  categories: BlogCategory[];
};

type Status = "idle" | "loading" | "success" | "error";

export function CategoryManager({ categories }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;
  const fieldClass =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder(0);
    setEditingId(null);
  }

  function startEdit(cat: BlogCategory) {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description ?? "");
    setSortOrder(cat.sort_order);
    setMessage(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const values = {
        name,
        slug: normalizeBlogSlug(slug || name),
        description,
        sort_order: sortOrder,
      };
      const result = editingId
        ? await updateBlogCategory(editingId, values)
        : await createBlogCategory(values);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }

      setStatus("success");
      setMessage(editingId ? "Категорията е обновена." : "Категорията е създадена.");
      resetForm();
      router.refresh();
    });
  }

  function onDelete(id: string) {
    if (!confirm("Изтрий категорията?")) return;
    setStatus("loading");
    startTransition(async () => {
      const result = await deleteBlogCategory(id);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("success");
      setMessage("Категорията е изтрита.");
      if (editingId === id) resetForm();
      router.refresh();
    });
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* Form card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">
          {editingId ? "Редакция на категория" : "Нова категория"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="cat-name" className={labelClass}>Име *</label>
            <input
              id="cat-name"
              required
              disabled={busy}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className={labelClass}>Slug *</label>
            <input
              id="cat-slug"
              required
              disabled={busy}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={fieldClass}
              placeholder="auto-generated ако е празно"
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className={labelClass}>Описание</label>
            <textarea
              id="cat-desc"
              rows={2}
              disabled={busy}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="cat-sort" className={labelClass}>Подредба</label>
            <input
              id="cat-sort"
              type="number"
              disabled={busy}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={fieldClass}
            />
          </div>

          {message ? (
            <p className={
              status === "error"
                ? "rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                : "rounded border border-border bg-sage px-3 py-2 text-sm text-primary"
            }>
              {message}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-sage transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Запазване…" : editingId ? "Запази" : "Добави категория"}
            </button>
            {editingId ? (
              <button
                type="button"
                disabled={busy}
                onClick={resetForm}
                className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:text-primary"
              >
                Отказ
              </button>
            ) : null}
          </div>
        </form>
      </div>

      {/* List card */}
      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="font-heading text-xl text-primary">Съществуващи категории</h2>
        {categories.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">Няма категории.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-text">{cat.name}</p>
                  <p className="text-xs text-text-muted">
                    <span className="font-mono">{cat.slug}</span>
                    {" · "}подредба: {cat.sort_order}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    Редактирай
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-sm text-red-600 underline-offset-4 hover:underline"
                  >
                    Изтрий
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
