"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicContainer } from "./public-container";
import { CtaLink } from "./cta-link";
import {
  HEADER_CTA_LABEL,
  type PublicNavItem,
} from "@/lib/cms/public-nav";

type Props = {
  displayName: string;
  officialName: string;
  ctaHref: string;
  navItems: PublicNavItem[];
};

export function PublicHeader({
  displayName,
  officialName,
  ctaHref,
  navItems,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border/80 bg-bg/90 backdrop-blur-sm">
      <PublicContainer className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <Link href="/" className="font-heading text-2xl text-primary">
            {displayName}
          </Link>
          <p className="truncate text-xs text-text-muted">{officialName}</p>
        </div>

        <nav
          className="hidden items-center gap-x-4 gap-y-1 text-sm text-text-muted xl:flex"
          aria-label="Основна навигация"
        >
          {navItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="whitespace-nowrap hover:text-primary"
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
            className="inline-flex items-center border border-border px-3 py-2 text-sm text-primary xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Затвори" : "Меню"}
          </button>
        </div>
      </PublicContainer>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-bg xl:hidden"
        >
          <PublicContainer className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={`m-${item.href}-${item.label}`}
                href={item.href}
                className="py-2 text-sm text-text-muted hover:text-primary"
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
    </header>
  );
}
