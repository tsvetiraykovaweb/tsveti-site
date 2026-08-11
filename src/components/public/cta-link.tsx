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
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-primary text-sage shadow-[0_16px_30px_rgba(47,71,55,0.18)] hover:bg-primary-dark"
      : "border border-primary/30 bg-bg/70 text-primary hover:border-primary hover:bg-sage/60";
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
