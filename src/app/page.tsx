import type { Metadata } from "next";
import Link from "next/link";
import { getPublicHomeContent } from "@/lib/cms/public-content";
import {
  PUBLIC_ABOUT_PATH,
  PUBLIC_CONTACT_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { ServiceCard } from "@/components/public/service-card";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { TestimonialPreview } from "@/components/public/testimonial-preview";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicHomeContent();
  return {
    title: content.settings.seo_title || content.settings.official_name,
    description:
      content.settings.seo_description ||
      "Спокойна естествена експертност",
  };
}

export default async function HomePage() {
  const content = await getPublicHomeContent();
  const {
    settings,
    social,
    services,
    faqs,
    testimonials,
    home,
    navItems,
    ctaLabel,
    ctaHref,
  } = content;

  return (
    <>
      <PublicHeader
        displayName={settings.display_name || settings.official_name}
        officialName={settings.official_name}
        ctaHref={ctaHref}
        navItems={navItems}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="grid gap-10 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm tracking-[0.18em] text-text-muted uppercase">
                Спокойна естествена експертност
              </p>
              <h1 className="mt-4 max-w-3xl font-heading text-4xl font-medium text-primary md:text-6xl">
                {home.heroHeadline}
              </h1>
              <p className="mt-2 font-heading text-2xl text-primary/80 md:text-3xl">
                {settings.official_name}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                {home.heroSupporting}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
                <CtaLink href="#uslugi" variant="secondary">
                  Виж услугите
                </CtaLink>
              </div>
            </div>
            <CmsImageSlot image={home.heroImage} priority />
          </PublicContainer>
        </section>

        <section id="uslugi" className="py-20">
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              Услуги
            </h2>
            <p className="mt-3 max-w-2xl text-text-muted">
              Кратък преглед на направленията на работа. Отворете услуга за
              повече насоки и детайли.
            </p>
            {services.length > 0 ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="mt-8 text-sm text-text-muted">
                Публикуваните услуги ще се появят тук.
              </p>
            )}
          </PublicContainer>
        </section>

        <section id="about" className="border-y border-border bg-bg-secondary py-20">
          <PublicContainer className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-heading text-3xl text-primary md:text-4xl">
                За Цвети
              </h2>
              <div
                className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-text-muted [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: home.introHtml }}
              />
              <p className="mt-6 text-sm">
                <Link
                  href={PUBLIC_ABOUT_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Повече за Цвети
                </Link>
              </p>
            </div>
            <CmsImageSlot image={home.aboutImage} />
          </PublicContainer>
        </section>

        <section id="faq" className="py-20">
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              Често задавани въпроси
            </h2>
            <div className="mt-8 max-w-3xl">
              <FaqAccordion faqs={faqs} />
            </div>
          </PublicContainer>
        </section>

        <section
          id="testimonials"
          className="border-y border-border bg-bg-secondary py-20"
        >
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              Отзиви
            </h2>
            <div className="mt-8">
              <TestimonialPreview testimonials={testimonials} />
            </div>
          </PublicContainer>
        </section>

        <section id="consultation" className="py-20">
          <PublicContainer className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-3xl text-primary md:text-4xl">
                Готови ли сте за следващата стъпка?
              </h2>
              <p className="mt-3 max-w-xl text-text-muted">
                Запазете безплатна консултация. Контактните данни се управляват
                от настройките на сайта.
              </p>
            </div>
            <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
          </PublicContainer>
        </section>

        <section id="contact" className="border-t border-border bg-bg-secondary py-16">
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              Контакти
            </h2>
            <p className="mt-3 max-w-xl text-text-muted">
              Свържете се за насоки и уточняване на следваща стъпка.
            </p>
            <div className="mt-6 space-y-2 text-sm text-text-muted md:text-base">
              {settings.phone ? <p>Телефон: {settings.phone}</p> : null}
              {settings.email ? (
                <p>
                  Имейл:{" "}
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {settings.email}
                  </a>
                </p>
              ) : null}
              {!settings.phone && !settings.email ? (
                <p>Контактните данни ще бъдат добавени от настройките.</p>
              ) : null}
            </div>
            <p className="mt-6 text-sm">
              <Link
                href={PUBLIC_CONTACT_PATH}
                className="text-accent underline-offset-4 hover:underline"
              >
                Към страница Контакти
              </Link>
            </p>
          </PublicContainer>
        </section>
      </main>

      <PublicFooter
        officialName={settings.official_name}
        phone={settings.phone}
        email={settings.email}
        instagram={social.instagram}
        facebook={social.facebook}
      />
    </>
  );
}
