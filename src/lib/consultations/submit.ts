"use server";

import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";

export type ConsultationRequestInput = {
  name: string;
  phone: string;
  email?: string;
  service_interest?: string;
  preferred_contact_method: "phone" | "email" | "either";
  message?: string;
  consent: boolean;
};

export type ConsultationRequestResult =
  | { ok: true }
  | { ok: false; error: string };

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
    return { ok: false, error: "Supabase is not configured." };
  }

  if (!input.consent) {
    return { ok: false, error: "Consent is required." };
  }

  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("consultation_requests").insert({
    name,
    phone,
    email: input.email?.trim() || null,
    service_interest: input.service_interest?.trim() || null,
    preferred_contact_method: input.preferred_contact_method,
    message: input.message?.trim() || null,
    consent: true,
    status: "new",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
