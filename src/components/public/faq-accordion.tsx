import type { PublicFaq } from "@/lib/cms/public-content";

type Props = {
  faqs: PublicFaq[];
};

export function FaqAccordion({ faqs }: Props) {
  if (faqs.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Често задаваните въпроси ще се появят тук, когато бъдат публикувани.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border border border-border bg-bg">
      {faqs.map((faq) => (
        <details key={faq.id} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-medium text-primary outline-none marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {faq.question}
              <span className="text-text-muted transition group-open:rotate-45">
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
