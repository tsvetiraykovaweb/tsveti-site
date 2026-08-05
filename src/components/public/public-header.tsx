import Link from "next/link";
import { PublicContainer } from "./public-container";
import { CtaLink } from "./cta-link";

type Props = {
  displayName: string;
  officialName: string;
  ctaLabel: string;
  ctaHref: string;
};

export function PublicHeader({
  displayName,
  officialName,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <header className="border-b border-border/80 bg-bg/90 backdrop-blur-sm">
      <PublicContainer className="flex items-center justify-between gap-4 py-4">
        <div>
          <Link href="/" className="font-heading text-2xl text-primary">
            {displayName}
          </Link>
          <p className="text-xs text-text-muted">{officialName}</p>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-text-muted sm:flex">
          <Link href="/#services" className="hover:text-primary">
            Услуги
          </Link>
          <Link href="/#about" className="hover:text-primary">
            За мен
          </Link>
          <Link href="/#faq" className="hover:text-primary">
            Въпроси
          </Link>
          <Link href="/#testimonials" className="hover:text-primary">
            Отзиви
          </Link>
        </nav>
        <CtaLink href={ctaHref} className="hidden md:inline-flex">
          {ctaLabel}
        </CtaLink>
      </PublicContainer>
    </header>
  );
}
