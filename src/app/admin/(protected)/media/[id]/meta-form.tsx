"use client";

import { FormEvent, useState, useTransition } from "react";
import { updateMediaAssetMeta } from "../actions";

type Props = {
  id: string;
  initialAlt: string;
  initialCaption: string;
};

export function MediaMetaForm({ id, initialAlt, initialCaption }: Props) {
  const [alt, setAlt] = useState(initialAlt);
  const [caption, setCaption] = useState(initialCaption);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateMediaAssetMeta(id, {
        alt_text: alt,
        caption,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Метаданните са запазени.");
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4">
      <div>
        <label htmlFor="alt_text" className="mb-1 block text-sm text-text-muted">
          Alt текст *
        </label>
        <input
          id="alt_text"
          required
          disabled={isPending}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="caption" className="mb-1 block text-sm text-text-muted">
          Надпис
        </label>
        <input
          id="caption"
          disabled={isPending}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
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
        className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Запазване…" : "Запази метаданни"}
      </button>
    </form>
  );
}
