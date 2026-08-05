"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  ADMIN_CONSULTATION_STATUSES,
  CONSULTATION_STATUS_LABELS,
} from "@/lib/consultations/admin";
import type { ConsultationStatus } from "@/types/database";
import { updateConsultationRequestStatus } from "./actions";

type Props = {
  id: string;
  currentStatus: ConsultationStatus;
};

export function ConsultationStatusForm({ id, currentStatus }: Props) {
  const [status, setStatus] = useState<ConsultationStatus>(currentStatus);
  const [savedStatus, setSavedStatus] =
    useState<ConsultationStatus>(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateConsultationRequestStatus(id, status);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSavedStatus(status);
      setMessage("Статусът е обновен.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
      <div>
        <label
          htmlFor="status"
          className="mb-1.5 block text-sm text-text-muted"
        >
          Статус
        </label>
        <select
          id="status"
          name="status"
          disabled={isPending}
          value={status}
          onChange={(e) => setStatus(e.target.value as ConsultationStatus)}
          className="w-full border border-border bg-bg px-3 py-2.5 text-text outline-none focus:border-primary disabled:opacity-60"
        >
          {ADMIN_CONSULTATION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {CONSULTATION_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
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
        disabled={isPending || status === savedStatus}
        className="bg-primary px-4 py-2 text-sm font-medium text-sage hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Запазване…" : "Запази статуса"}
      </button>
    </form>
  );
}
