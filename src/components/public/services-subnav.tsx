import Link from "next/link";
import { PublicContainer } from "./public-container";
import {
  buildServicesSubnavItems,
  type NavServiceInput,
} from "@/lib/cms/public-nav";

type Props = {
  services: NavServiceInput[];
  /** Current service slug on detail pages; omit on `/uslugi` overview. */
  activeSlug?: string | null;
};

/**
 * Secondary services navigation under the main header.
 * Horizontal scroll on mobile; no dropdown.
 */
export function ServicesSubnav({ services, activeSlug }: Props) {
  const items = buildServicesSubnavItems(services);
  if (items.length === 0) return null;

  return (
    <div className="border-b border-border bg-bg-secondary/80">
      <PublicContainer className="py-3">
        <nav aria-label="Навигация услуги" className="min-w-0">
          <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
              const isActive = Boolean(
                activeSlug && activeSlug === item.slug,
              );
              return (
                <li key={item.slug} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                      isActive
                        ? "border-primary bg-primary text-sage font-medium"
                        : "border-border bg-bg text-text-muted hover:border-primary/30 hover:text-primary",
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
