import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import { SERVICE_SLUG_TO_INTEREST } from "@/lib/consultations/options";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { ConsultationForm } from "@/components/public/consultation-form";

type PageProps = {
  searchParams: Promise<{ usluga?: string }>;
};

export const metadata: Metadata = {
  title: "Безплатна консултация",
  description: `Запазете кратък опознавателен разговор с ${brand.officialName}. Ще обсъдим коя посока е подходяща за вас.`,
};

export default async function ConsultationPage({ searchParams }: PageProps) {
  const chrome = await getPublicSiteChrome();
  const params = await searchParams;
  const slug = params.usluga?.trim() ?? "";
  const initialServiceInterest = SERVICE_SLUG_TO_INTEREST[slug] ?? "";

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
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="py-14 md:py-20">
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">Безплатна консултация</span>
            </p>
            <h1 className="mt-6 max-w-2xl font-heading text-4xl font-medium text-primary md:text-5xl">
              Запази безплатна консултация
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              Оставете кратки данни за връзка. Това е опознавателен разговор —
              заедно ще обсъдим коя посока е подходяща, с индивидуален подход и
              спокойни насоки.
            </p>
          </PublicContainer>
        </section>

        <section className="py-14 md:py-16">
          <PublicContainer className="max-w-xl">
            <ConsultationForm
              initialServiceInterest={initialServiceInterest}
            />
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
