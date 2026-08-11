import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

function isExternalHref(href: string | undefined) {
  return !!href && /^https?:\/\//i.test(href);
}

/**
 * Safe markdown renderer for public blog content.
 * Raw HTML is not enabled; only markdown syntax is rendered.
 */
export function MarkdownContent({ content, className = "" }: Props) {
  return (
    <div
      className={[
        "space-y-5 text-base leading-relaxed text-text-muted",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/20 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_h1]:font-heading [&_h1]:text-4xl [&_h1]:text-primary",
        "[&_h2]:font-heading [&_h2]:text-3xl [&_h2]:text-primary",
        "[&_h3]:font-heading [&_h3]:text-2xl [&_h3]:text-primary",
        "[&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal",
        "[&_p]:leading-relaxed",
        "[&_strong]:font-semibold [&_strong]:text-text",
        className,
      ].join(" ")}
    >
      <ReactMarkdown
        components={{
          a: ({ href, children }) =>
            isExternalHref(href) ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {children}
              </a>
            ) : (
              <Link
                href={href || "#"}
                className="text-accent underline-offset-4 hover:underline"
              >
                {children}
              </Link>
            ),
          ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-2">{children}</ol>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
