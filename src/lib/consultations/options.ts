export const SERVICE_INTEREST_OPTIONS = [
  "Не съм сигурна",
  "Биорезонанс",
  "От тревога към спокойствие",
  "Хранителна програма",
  "Избери себе си",
] as const;

export type ServiceInterestOption = (typeof SERVICE_INTEREST_OPTIONS)[number];

/** UI contact options. `viber` maps to DB `either` (schema placeholder). */
export const CONTACT_METHOD_OPTIONS = [
  { value: "phone", label: "Телефон" },
  { value: "email", label: "Имейл" },
  { value: "viber", label: "Viber" },
] as const;

export type ContactMethodFormValue =
  (typeof CONTACT_METHOD_OPTIONS)[number]["value"];

export const CONTACT_METHOD_VALUES = CONTACT_METHOD_OPTIONS.map((o) => o.value);

/** Map slug → form service_interest label for deep links */
export const SERVICE_SLUG_TO_INTEREST: Record<string, ServiceInterestOption> = {
  biorezonans: "Биорезонанс",
  "ot-trevoga-kam-spokoystvie": "От тревога към спокойствие",
  "hranitelna-programa": "Хранителна програма",
  "izberi-sebe-si": "Избери себе си",
};
