import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import {
  getPublicSiteChrome,
  getPublishedServiceBySlug,
  resolveServiceCta,
} from "@/lib/cms/public-content";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    return { title: "Услуга" };
  }

  return {
    title: service.seo_title || `${service.title} · ${brand.officialName}`,
    description:
      service.seo_description ||
      service.summary ||
      brand.direction,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, chrome] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getPublicSiteChrome(),
  ]);

  if (!service) {
    notFound();
  }

  const serviceCta = resolveServiceCta(
    service.cta_label,
    service.cta_href,
    service.slug,
  );
  const bodyParagraphs = (service.body || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

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
              <Link href="/uslugi" className="hover:text-primary">
                Услуги
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">{service.title}</span>
            </p>

            <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="max-w-3xl font-heading text-4xl font-medium text-primary md:text-5xl">
                  {service.title}
                </h1>
                {service.summary ? (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                    {service.summary}
                  </p>
                ) : null}
                <div className="mt-8">
                  <CtaLink href={serviceCta.href}>{serviceCta.label}</CtaLink>
                </div>
              </div>
              <CmsImageSlot
                image={service.heroImage}
                priority
                aspectClassName="aspect-[4/3] md:aspect-[16/11]"
              />
            </div>
          </PublicContainer>
        </section>

        <section className="py-16 md:py-20">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              Повече за услугата
            </h2>
            {bodyParagraphs.length > 0 ? (
              <div className="mt-6 space-y-4 text-base leading-relaxed text-text-muted">
                {bodyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-text-muted">
                Подробното описание ще бъде допълнено. Услугата следва
                индивидуален подход и спокойни насоки за подкрепа.
              </p>
            )}
          </PublicContainer>
        </section>

        <section className="border-y border-border bg-bg-secondary py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              Как протича работата
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-text-muted md:text-base">
              <li>
                Спокоен разговор за вашите цели и нужди — без натиск и без
                обещания за конкретни резултати.
              </li>
              <li>
                Индивидуален подход с насоки, които могат да подпомогнат
                по-добро усещане за баланс в ежедневието.
              </li>
              <li>
                Подкрепа според вашето темпо — съдържанието и следващите
                стъпки се уточняват заедно.
              </li>
            </ul>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-primary md:text-3xl">
                Следваща стъпка
              </h2>
              <p className="mt-3 max-w-xl text-text-muted">
                Продължете към landing страницата на услугата или се свържете с
                нас за кратък разговор.
              </p>
            </div>
            <CtaLink href={serviceCta.href}>{serviceCta.label}</CtaLink>
          </PublicContainer>
        </section>

        <section className="border-t border-border bg-bg-secondary py-12">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-xl text-primary">Важна бележка</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Информацията на тази страница е с информативен характер и описва
              възможен начин на подкрепа. Тя не замества медицинска консултация,
              диагноза или лечение. При здравни въпроси се обърнете към
              квалифициран специалист.
            </p>
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
