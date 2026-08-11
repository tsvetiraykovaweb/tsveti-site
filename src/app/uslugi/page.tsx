import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import {
  getPublicSiteChrome,
  getPublishedServices,
} from "@/lib/cms/public-content";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ServiceCard } from "@/components/public/service-card";
import { CtaLink } from "@/components/public/cta-link";

export const metadata: Metadata = {
  title: "Услуги",
  description: `Преглед на услугите на ${brand.officialName}.`,
};

export default async function UslugiIndexPage() {
  const [services, chrome] = await Promise.all([
    getPublishedServices(),
    getPublicSiteChrome(),
  ]);

  return (
    <>
      <PublicHeader
        displayName={
          chrome.settings.display_name || chrome.settings.official_name
        }
        officialName={chrome.settings.official_name}
        ctaHref={chrome.ctaHref}
        navItems={chrome.navItems}
        services={chrome.services}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg py-16 md:py-20">
          <PublicContainer>
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">Услуги</span>
            </p>
            <h1 className="mt-6 font-heading text-4xl text-primary md:text-5xl">
              Услуги
            </h1>
            <p className="mt-4 max-w-2xl text-text-muted">
              Спокоен преглед на направленията на работа. Всяка услуга следва
              индивидуален подход и ясни насоки за подкрепа.
            </p>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer>
            {services.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                Публикуваните услуги ще се появят тук.
              </p>
            )}
            <div className="mt-12">
              <CtaLink href={chrome.ctaHref}>{chrome.ctaLabel}</CtaLink>
            </div>
          </PublicContainer>
        </section>
      </main>

      <PublicFooter
        officialName={chrome.settings.official_name}
        phone={chrome.settings.phone}
        email={chrome.settings.email}
        instagram={chrome.social.instagram}
        facebook={chrome.social.facebook}
      />
    </>
  );
}
