export type TestimonialFormValues = {
  quote: string;
  author_name: string;
  author_role: string;
  avatar_path: string;
  sort_order: number;
  is_published: boolean;
};

export type TestimonialListItem = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  sort_order: number;
  is_published: boolean;
};

export const EMPTY_TESTIMONIAL_VALUES: TestimonialFormValues = {
  quote: "",
  author_name: "Клиент (шаблон)",
  author_role: "",
  avatar_path: "",
  sort_order: 0,
  is_published: false,
};
