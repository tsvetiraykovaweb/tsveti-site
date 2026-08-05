import type { ConsultationStatus, ContactMethod } from "@/types/database";

export type ConsultationRequestListItem = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  service_interest: string | null;
  preferred_contact_method: ContactMethod;
  status: ConsultationStatus;
  message: string | null;
};

export type ConsultationRequestDetail = ConsultationRequestListItem & {
  consent: boolean;
  updated_at: string;
};

/** Statuses exposed in admin UI (schema also allows spam). */
export const ADMIN_CONSULTATION_STATUSES = [
  "new",
  "contacted",
  "closed",
  "spam",
] as const satisfies readonly ConsultationStatus[];

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  new: "Нова",
  contacted: "Свързана",
  closed: "Затворена",
  spam: "Спам",
};

export const CONTACT_METHOD_ADMIN_LABELS: Record<ContactMethod, string> = {
  phone: "Телефон",
  email: "Имейл",
  either: "Viber / без значение",
};

export function formatConsultationDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function previewMessage(
  message: string | null | undefined,
  max = 80,
): string {
  const trimmed = message?.trim();
  if (!trimmed) return "—";
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function isConsultationStatus(
  value: string,
): value is ConsultationStatus {
  return (ADMIN_CONSULTATION_STATUSES as readonly string[]).includes(value);
}
