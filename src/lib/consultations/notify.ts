import { getSiteOrigin } from "@/lib/cms/public-paths";
import { CONTACT_METHOD_ADMIN_LABELS } from "@/lib/consultations/admin";
import type { ContactMethod } from "@/types/database";

export type ConsultationNotifyPayload = {
  name: string;
  phone: string;
  email: string | null;
  service_interest: string | null;
  preferred_contact_method: ContactMethod;
};

/**
 * Best-effort email notify via Resend.
 * Never throws to the caller — missing config or send failure is swallowed
 * after logging a short message (no request body / health details).
 */
export async function notifyConsultationRequest(
  payload: ConsultationNotifyPayload,
): Promise<{ sent: boolean; skippedReason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONSULTATION_NOTIFY_TO?.trim();
  const from =
    process.env.CONSULTATION_NOTIFY_FROM?.trim() ||
    "Заявки <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return {
      sent: false,
      skippedReason: "RESEND_API_KEY or CONSULTATION_NOTIFY_TO not configured",
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const origin = getSiteOrigin();
    const contactLabel =
      CONTACT_METHOD_ADMIN_LABELS[payload.preferred_contact_method] ||
      payload.preferred_contact_method;

    const text = [
      "Нова заявка за безплатна консултация.",
      "",
      `Име: ${payload.name}`,
      `Телефон: ${payload.phone}`,
      `Имейл: ${payload.email || "—"}`,
      `Услуга: ${payload.service_interest || "—"}`,
      `Предпочитан контакт: ${contactLabel}`,
      "",
      "Съобщението от формата не се включва в този имейл.",
      `Провери детайлите в админ панела: ${origin}/admin/consultation-requests`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `Нова заявка: ${payload.name}`,
      text,
    });

    if (error) {
      console.error("[consultation-notify] send failed:", error.message);
      return { sent: false, skippedReason: error.message };
    }

    return { sent: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown notify error";
    console.error("[consultation-notify]", message);
    return { sent: false, skippedReason: message };
  }
}
