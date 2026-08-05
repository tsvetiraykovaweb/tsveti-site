export type FaqFormValues = {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
};

export type FaqListItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
};

export const EMPTY_FAQ_VALUES: FaqFormValues = {
  question: "",
  answer: "",
  category: "Общи",
  sort_order: 0,
  is_published: false,
};
