"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicContainer } from "./public-container";
import { CtaLink } from "./cta-link";
import { ServicesSubnav } from "./services-subnav";
import {
  HEADER_CTA_LABEL,
  type NavServiceInput,
  type PublicNavItem,
} from "@/lib/cms/public-nav";

type Props = {
  displayName: string;
  officialName: string;
  ctaHref: string;
  navItems: PublicNavItem[];
  services: NavServiceInput[];
};

export function PublicHeader({
  displayName,
  officialName,
  ctaHref,
  navItems,
  services,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-bg/85 backdrop-blur-xl">
      <PublicContainer className="flex items-center justify-between gap-4 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary"
            aria-label={displayName}
          >
            <span className="font-heading text-2xl leading-none">Ц</span>
          </Link>
          <div className="min-w-0">
            <Link
              href="/"
              className="font-heading text-2xl leading-none text-primary"
            >
              {displayName}
            </Link>
            <p className="truncate text-xs text-text-muted">{officialName}</p>
          </div>
        </div>

        <nav
          className="hidden items-center gap-x-6 gap-y-1 text-sm font-medium text-text-muted xl:flex"
          aria-label="Основна навигация"
        >
          {navItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CtaLink href={ctaHref} className="hidden lg:inline-flex">
            {HEADER_CTA_LABEL}
          </CtaLink>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Затвори" : "Меню"}
          </button>
        </div>
      </PublicContainer>

      {open ? (
        <div id="mobile-nav" className="border-t border-primary/10 bg-bg xl:hidden">
          <PublicContainer className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={`m-${item.href}-${item.label}`}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-text-muted hover:bg-sage/60 hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <CtaLink href={ctaHref} className="w-full">
                {HEADER_CTA_LABEL}
              </CtaLink>
            </div>
          </PublicContainer>
        </div>
      ) : null}

      <ServicesSubnav services={services} />
    </header>
  );
}
