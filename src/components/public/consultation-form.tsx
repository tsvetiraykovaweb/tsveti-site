"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { submitConsultationRequest } from "@/lib/consultations/submit";
import {
  CONTACT_METHOD_OPTIONS,
  SERVICE_INTEREST_OPTIONS,
  type ContactMethodFormValue,
} from "@/lib/consultations/options";
import { PUBLIC_PRIVACY_PATH } from "@/lib/cms/public-paths";

type Props = {
  initialServiceInterest?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full border border-border bg-bg px-3 py-2.5 text-text outline-none focus:border-primary disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm text-text-muted";
const errorClass = "mt-1 text-sm text-accent";

export function ConsultationForm({ initialServiceInterest = "" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceInterest, setServiceInterest] = useState(
    initialServiceInterest,
  );
  const [preferredContact, setPreferredContact] =
    useState<ContactMethodFormValue | "">("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const busy = status === "loading" || isPending;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      if (!preferredContact) {
        setStatus("error");
        setFieldErrors({
          preferred_contact_method:
            "Моля, изберете предпочитан начин за връзка.",
        });
        setFormError("Моля, проверете полетата във формата.");
        return;
      }

      const result = await submitConsultationRequest({
        name,
        phone,
        email,
        service_interest: serviceInterest,
        preferred_contact_method: preferredContact,
        message,
        consent,
      });

      if (!result.ok) {
        setStatus("error");
        setFormError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setServiceInterest("");
      setPreferredContact("");
      setMessage("");
      setConsent(false);
    });
  }

  if (status === "success") {
    return (
      <div
        className="border border-border bg-bg-secondary px-6 py-8"
        role="status"
      >
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          Благодаря ти! Заявката беше изпратена успешно. Ще се свържа с теб
          възможно най-скоро.
        </p>
        <button
          type="button"
          className="mt-6 text-sm text-accent underline-offset-4 hover:underline"
          onClick={() => setStatus("idle")}
        >
          Изпрати нова заявка
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-sm leading-relaxed text-text-muted">
        Това е кратък опознавателен разговор. Ще обсъдим коя посока е подходяща
        за вас — без натиск и без медицински обещания. Моля, не споделяйте
        чувствителни здравни данни (диагнози, лекарства, изследвания или
        подробна здравна история) в тази форма.
      </p>

      <div>
        <label htmlFor="name" className={labelClass}>
          Име *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={busy}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
        {fieldErrors.name ? (
          <p className={errorClass}>{fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Телефон *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          disabled={busy}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />
        {fieldErrors.phone ? (
          <p className={errorClass}>{fieldErrors.phone}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Имейл (по желание)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={busy}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        {fieldErrors.email ? (
          <p className={errorClass}>{fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="service_interest" className={labelClass}>
          Към коя услуга имате интерес? *
        </label>
        <select
          id="service_interest"
          name="service_interest"
          required
          disabled={busy}
          value={serviceInterest}
          onChange={(e) => setServiceInterest(e.target.value)}
          className={fieldClass}
        >
          <option value="">Изберете…</option>
          {SERVICE_INTEREST_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.service_interest ? (
          <p className={errorClass}>{fieldErrors.service_interest}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="preferred_contact_method" className={labelClass}>
          Предпочитан начин за връзка *
        </label>
        <select
          id="preferred_contact_method"
          name="preferred_contact_method"
          required
          disabled={busy}
          value={preferredContact}
          onChange={(e) =>
            setPreferredContact(e.target.value as ContactMethodFormValue | "")
          }
          className={fieldClass}
        >
          <option value="">Изберете…</option>
          {CONTACT_METHOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.preferred_contact_method ? (
          <p className={errorClass}>{fieldErrors.preferred_contact_method}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Кратко съобщение (по желание)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          disabled={busy}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={fieldClass}
          placeholder="Споделете накратко какво ви води към разговора — без чувствителни медицински детайли."
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-text-muted">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            disabled={busy}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>
            Съгласявам се данните ми да бъдат използвани само за връзка по
            тази заявка. Вижте{" "}
            <Link
              href={PUBLIC_PRIVACY_PATH}
              className="text-accent underline-offset-4 hover:underline"
            >
              политиката за поверителност
            </Link>
            . *
          </span>
        </label>
        {fieldErrors.consent ? (
          <p className={errorClass}>{fieldErrors.consent}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="border border-border bg-bg-secondary px-4 py-3 text-sm text-accent" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-medium text-sage transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Изпращане…" : "Изпрати заявката"}
      </button>
    </form>
  );
}
