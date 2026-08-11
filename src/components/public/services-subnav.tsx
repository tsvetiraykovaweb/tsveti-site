"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PublicContainer } from "./public-container";
import {
  buildServicesSubnavItems,
  type NavServiceInput,
} from "@/lib/cms/public-nav";
import { PUBLIC_USLUGI_BASE } from "@/lib/cms/public-paths";

type Props = {
  services: NavServiceInput[];
};

function activeServiceSlug(pathname: string): string | null {
  const prefix = `${PUBLIC_USLUGI_BASE}/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length).split("/")[0]?.trim();
  return slug || null;
}

/**
 * Persistent secondary services nav — visible on all public pages under the main header.
 * Horizontal scroll on mobile; active pill on `/uslugi/[slug]` only.
 */
export function ServicesSubnav({ services }: Props) {
  const pathname = usePathname();
  const items = buildServicesSubnavItems(services);
  const activeSlug = activeServiceSlug(pathname);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-primary/10 bg-[#f8f3eb]/95 shadow-[0_4px_16px_-12px_rgba(45,58,42,0.35)]">
      <PublicContainer className="py-2.5 md:py-3">
        <nav aria-label="Навигация услуги" className="min-w-0 overflow-x-auto scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex min-w-max justify-start gap-2 px-0 pb-0.5 md:min-w-0 md:flex-wrap md:justify-center">
            {items.map((item) => {
              const isActive = activeSlug === item.slug;
              return (
                <li key={item.slug} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "border-primary bg-primary text-sage font-medium shadow-sm underline decoration-sage/40 decoration-2 underline-offset-4"
                        : "border-primary/15 bg-bg/90 text-text-muted shadow-sm hover:border-primary/35 hover:bg-bg hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </PublicContainer>
    </div>
  );
}
