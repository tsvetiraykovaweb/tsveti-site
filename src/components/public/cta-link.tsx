import Link from "next/link";

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

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
