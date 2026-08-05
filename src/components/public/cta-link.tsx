import Link from "next/link";
import { isExternalHref } from "@/lib/cms/public-paths";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90";
  const styles =
    variant === "primary"
      ? "bg-primary text-sage"
      : "border border-border bg-transparent text-primary";
  const classes = `${base} ${styles} ${className}`;

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
