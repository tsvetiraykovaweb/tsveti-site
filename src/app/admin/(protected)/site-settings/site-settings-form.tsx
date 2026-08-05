"use client";

import { FormEvent, useState, useTransition } from "react";
import type { SiteSettingsFormValues } from "@/lib/cms/site-settings";
import { saveSiteSettings } from "./actions";

type Props = {
  initialValues: SiteSettingsFormValues;
};

type Status = "idle" | "loading" | "success" | "error";

export function SiteSettingsForm({ initialValues }: Props) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;

  function update<K extends keyof SiteSettingsFormValues>(
    key: K,
    value: SiteSettingsFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    startTransition(async () => {
      const result = await saveSiteSettings(values);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error);
        return;
      }
      setStatus("success");
      setMessage("Настройките са запазени.");
    });
  }

  const fieldClass =
    "w-full border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60";
  const labelClass = "mb-1 block text-sm text-text-muted";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-5">
      <div>
        <label htmlFor="official_name" className={labelClass}>
          Официално име *
        </label>
        <input
          id="official_name"
          required
          disabled={busy}
          value={values.official_name}
          onChange={(e) => update("official_name", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="display_name" className={labelClass}>
          Име за показване *
        </label>
        <input
          id="display_name"
          required
          disabled={busy}
          value={values.display_name}
          onChange={(e) => update("display_name", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Телефон
        </label>
        <input
          id="phone"
          type="tel"
          disabled={busy}
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Имейл
        </label>
        <input
          id="email"
          type="email"
          disabled={busy}
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="primary_cta_label" className={labelClass}>
          Основен CTA текст *
        </label>
        <input
          id="primary_cta_label"
          required
          disabled={busy}
          value={values.primary_cta_label}
          onChange={(e) => update("primary_cta_label", e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="primary_cta_url" className={labelClass}>
          Основен CTA линк *
        </label>
        <input
          id="primary_cta_url"
          required
          disabled={busy}
          value={values.primary_cta_url}
          onChange={(e) => update("primary_cta_url", e.target.value)}
          className={fieldClass}
          placeholder="/#consultation"
        />
      </div>

      <div>
        <label htmlFor="social_instagram" className={labelClass}>
          Instagram URL
        </label>
        <input
          id="social_instagram"
          type="url"
          disabled={busy}
          value={values.social_instagram}
          onChange={(e) => update("social_instagram", e.target.value)}
          className={fieldClass}
          placeholder="https://instagram.com/…"
        />
      </div>

      <div>
        <label htmlFor="social_facebook" className={labelClass}>
          Facebook URL
        </label>
        <input
          id="social_facebook"
          type="url"
          disabled={busy}
          value={values.social_facebook}
          onChange={(e) => update("social_facebook", e.target.value)}
          className={fieldClass}
          placeholder="https://facebook.com/…"
        />
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
