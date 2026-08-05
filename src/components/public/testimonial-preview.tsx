import type { PublicTestimonial } from "@/lib/cms/public-content";

type Props = {
  testimonials: PublicTestimonial[];
};

export function TestimonialPreview({ testimonials }: Props) {
  if (testimonials.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Отзиви ще бъдат показани тук след като бъдат одобрени и публикувани.
        Шаблоните от CMS не се показват публично.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {testimonials.map((item) => (
        <li
          key={item.id}
          className="border border-border bg-bg px-5 py-6 text-sm leading-relaxed text-text-muted"
        >
          <p className="text-text">„{item.quote}“</p>
          <p className="mt-4 font-medium text-primary">{item.author_name}</p>
          {item.author_role ? (
            <p className="text-xs text-text-muted">{item.author_role}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
