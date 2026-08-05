"use server";

import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import type { ContactMethod } from "@/types/database";
import {
  CONTACT_METHOD_VALUES,
  SERVICE_INTEREST_OPTIONS,
  type ContactMethodFormValue,
} from "@/lib/consultations/options";

export type ConsultationRequestInput = {
  name: string;
  phone: string;
  email?: string;
  service_interest: string;
  preferred_contact_method: ContactMethodFormValue;
  message?: string;
  consent: boolean;
};

export type ConsultationRequestResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapContactMethod(
  value: ContactMethodFormValue,
): ContactMethod {
  // DB CHECK allows phone | email | either. Viber is a UI placeholder → either.
  if (value === "viber") return "either";
  return value;
}

/**
 * Public-safe insert for consultation requests.
 * Uses the anon SSR client + RLS (insert allowed when consent = true).
 * Never uses the service role key.
 */
export async function submitConsultationRequest(
  input: ConsultationRequestInput,
): Promise<ConsultationRequestResult> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: "Формата временно не е налична. Моля, опитайте по-късно.",
    };
  }

  const fieldErrors: Record<string, string> = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email?.trim() || "";
  const service_interest = input.service_interest.trim();
  const preferred = input.preferred_contact_method;
  const message = input.message?.trim() || "";

  if (!name) fieldErrors.name = "Моля, въведете име.";
  if (!phone) fieldErrors.phone = "Моля, въведете телефон.";
  if (!service_interest) {
    fieldErrors.service_interest = "Моля, изберете интерес към услуга.";
  } else if (
    !(SERVICE_INTEREST_OPTIONS as readonly string[]).includes(service_interest)
  ) {
    fieldErrors.service_interest = "Невалиден избор на услуга.";
  }

  if (!preferred) {
    fieldErrors.preferred_contact_method =
      "Моля, изберете предпочитан начин за връзка.";
  } else if (
    !(CONTACT_METHOD_VALUES as readonly string[]).includes(preferred)
  ) {
    fieldErrors.preferred_contact_method = "Невалиден начин за връзка.";
  }

  if (email && !EMAIL_RE.test(email)) {
    fieldErrors.email = "Моля, въведете валиден имейл или оставете полето празно.";
  }

  if (!input.consent) {
    fieldErrors.consent = "Нужно е съгласие, за да изпратите заявката.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Моля, проверете полетата във формата.",
      fieldErrors,
    };
  }

  let finalMessage = message;
  if (preferred === "viber") {
    const note = "Предпочитан канал: Viber";
    finalMessage = finalMessage ? `${note}\n${finalMessage}` : note;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("consultation_requests").insert({
    name,
    phone,
    email: email || null,
    service_interest,
    preferred_contact_method: mapContactMethod(preferred),
    message: finalMessage || null,
    consent: true,
    status: "new",
  });

  if (error) {
    return {
      ok: false,
      error: "Заявката не беше записана. Моля, опитайте отново.",
    };
  }

  // Best-effort notify — never fail the public form if email is misconfigured.
  try {
    const { notifyConsultationRequest } = await import(
      "@/lib/consultations/notify"
    );
    await notifyConsultationRequest({
      name,
      phone,
      email: email || null,
      service_interest,
      preferred_contact_method: mapContactMethod(preferred),
    });
  } catch {
    // Intentionally empty — form success must not depend on email.
  }

  return { ok: true };
}
