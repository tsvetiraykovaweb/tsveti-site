"use client";

import { FormEvent, useState, useTransition } from "react";
import { uploadMediaAsset } from "./actions";

export function MediaUploadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const busy = status === "loading" || isPending;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const result = await uploadMediaAsset(formData);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("success");
      setMessage(
        result.path
          ? `Качено успешно. Основен път: ${result.path}`
          : "Качено успешно.",
      );
      form.reset();
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 border border-border bg-bg px-4 py-5"
    >
      <h2 className="font-heading text-xl text-primary">Качване на изображение</h2>
      <p className="text-sm text-text-muted">
        JPG / PNG / WebP, до 8 MB. Сървърът създава WebP варианти 480 / 768 /
        1200 / 1600 — оригиналният файл не се публикува.
      </p>

      <div>
        <label htmlFor="file" className={labelClass}>
          Файл *
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={busy}
          className="block w-full text-sm text-text-muted"
        />
      </div>

      <div>
        <label htmlFor="alt_text" className={labelClass}>
          Alt текст *
        </label>
        <input
          id="alt_text"
          name="alt_text"
          type="text"
          required
          disabled={busy}
          className={fieldClass}
          placeholder="Кратко описание на изображението"
        />
      </div>

      <div>
        <label htmlFor="caption" className={labelClass}>
          Надпис (по желание)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          disabled={busy}
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
        className="bg-primary px-5 py-2.5 text-sm font-medium text-sage hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Обработка и качване…" : "Качи"}
      </button>
    </form>
  );
}
