import type { Metadata } from "next";
import { getPublicHomeContent } from "@/lib/cms/public-content";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { ServiceCard } from "@/components/public/service-card";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { TestimonialPreview } from "@/components/public/testimonial-preview";

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
    ctaLabel,
    ctaHref,
  } = content;

  return (
    <>
      <PublicHeader
        displayName={settings.display_name || settings.official_name}
        officialName={settings.official_name}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="flex flex-col items-start py-20 md:py-28">
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
              <CtaLink href="#services" variant="secondary">
                Виж услугите
              </CtaLink>
            </div>
          </PublicContainer>
        </section>

        {/* Services */}
        <section id="services" className="py-20">
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              Услуги
            </h2>
            <p className="mt-3 max-w-2xl text-text-muted">
              Кратък преглед на направленията на работа. Подробните страници ще
              бъдат добавени в следващ етап.
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

        {/* About preview */}
        <section id="about" className="border-y border-border bg-bg-secondary py-20">
          <PublicContainer>
            <h2 className="font-heading text-3xl text-primary md:text-4xl">
              За мен
            </h2>
            <div
              className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-text-muted [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: home.introHtml }}
            />
          </PublicContainer>
        </section>

        {/* FAQ */}
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

        {/* Testimonials */}
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

        {/* Final CTA */}
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
