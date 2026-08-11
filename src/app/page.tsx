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

const benefits = [
  {
    title: "Индивидуален подход",
    text: "съобразен с твоите нужди",
  },
  {
    title: "Цялостна грижа",
    text: "тяло, ум и ежедневие",
  },
  {
    title: "Спокойни стъпки",
    text: "без крайни обещания",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicHomeContent();
  return {
    title: content.settings.seo_title || content.settings.official_name,
    description:
      content.settings.seo_description ||
      "Спокойна подкрепа за баланс, грижа и по-осъзнато ежедневие.",
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

      <main className="flex-1 overflow-hidden">
        <section className="relative border-b border-primary/10 bg-[radial-gradient(circle_at_18%_10%,rgba(233,238,231,0.95),transparent_30%),linear-gradient(135deg,#f8f3eb_0%,#f4eee5_48%,#eef3eb_100%)]">
          <div className="absolute -right-24 bottom-0 hidden h-72 w-[42rem] rounded-tl-[100%] bg-primary/85 lg:block" />
          <div className="absolute left-0 right-0 bottom-0 h-16 translate-y-8 rounded-[50%] bg-bg" />

          <PublicContainer className="relative grid min-h-[calc(100svh-5.4rem)] gap-10 pb-20 pt-12 md:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-24">
            <div className="relative z-10 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">
                Холистична подкрепа и грижа
              </p>
              <h1 className="mt-6 max-w-4xl font-heading text-5xl font-medium leading-[0.95] text-text md:text-7xl lg:text-8xl">
                {home.heroHeadline}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                {home.heroSupporting}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <CtaLink href={ctaHref}>
                  {ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
                </CtaLink>
                <CtaLink href="#uslugi" variant="secondary">
                  Виж услугите
                </CtaLink>
              </div>
            </div>

            <div className="relative z-10 lg:pl-4">
              <CmsImageSlot
                image={home.heroImage}
                priority
                aspectClassName="aspect-[4/5] min-h-[28rem]"
                className="rounded-[3rem] shadow-[0_34px_90px_rgba(47,71,55,0.16)]"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute -bottom-7 right-4 hidden h-36 w-36 items-center justify-center rounded-full border border-primary/15 bg-bg/95 p-4 text-center shadow-[0_20px_60px_rgba(47,71,55,0.14)] md:flex">
                <p className="text-sm font-semibold leading-relaxed text-primary">
                  Твоят баланс започва с първата стъпка
                </p>
              </div>
            </div>
          </PublicContainer>

          <PublicContainer className="relative z-10 -mt-12 pb-16">
            <div className="grid gap-4 rounded-[1.5rem] border border-primary/10 bg-bg/85 p-4 shadow-[0_22px_70px_rgba(47,71,55,0.08)] backdrop-blur sm:grid-cols-3 md:p-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 text-primary">
                    ✦
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-text">
                      {benefit.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-muted">
                      {benefit.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </PublicContainer>
        </section>

        <section id="about" className="relative bg-bg py-20 md:py-28">
          <PublicContainer className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative min-h-[28rem]">
              <CmsImageSlot
                image={home.aboutImage}
                aspectClassName="aspect-[4/5]"
                className="max-w-md rounded-[2rem]"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
              <div className="absolute bottom-0 right-0 hidden w-48 translate-y-8 md:block">
                <CmsImageSlot
                  image={home.heroImage}
                  aspectClassName="aspect-[4/5]"
                  className="rounded-[1.5rem] border-8 border-bg shadow-[0_22px_60px_rgba(47,71,55,0.14)]"
                  sizes="220px"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                Моят подход
              </p>
              <h2 className="mt-4 max-w-2xl font-heading text-4xl font-medium leading-tight text-text md:text-6xl">
                Не просто метод, а грижа с внимание към човека
              </h2>
              <div
                className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-text-muted [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: home.introHtml }}
              />
              <div className="mt-8">
                <CtaLink href={PUBLIC_ABOUT_PATH} variant="secondary">
                  Научи повече за Цвети <span aria-hidden="true" className="ml-2">→</span>
                </CtaLink>
              </div>
            </div>
          </PublicContainer>
        </section>

        <section
          id="uslugi"
          className="border-y border-primary/10 bg-gradient-to-b from-sage/70 to-bg-secondary/70 py-20 md:py-24"
        >
          <PublicContainer>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                Как мога да ти помогна
              </p>
              <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-text md:text-6xl">
                Услуги, създадени за твоето благополучие
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-text-muted">
                Кратък преглед на направленията на работа. Всяка услуга има
                отделна страница с повече насоки и детайли.
              </p>
            </div>

            {services.length > 0 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-sm text-text-muted">
                Публикуваните услуги ще се появят тук.
              </p>
            )}
          </PublicContainer>
        </section>

        {faqs.length > 0 ? (
          <section id="faq" className="bg-bg py-20">
            <PublicContainer>
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                    Въпроси
                  </p>
                  <h2 className="mt-4 font-heading text-4xl font-medium text-text md:text-5xl">
                    Често задавани въпроси
                  </h2>
                </div>
                <FaqAccordion faqs={faqs} />
              </div>
            </PublicContainer>
          </section>
        ) : null}

        {testimonials.length > 0 ? (
          <section
            id="testimonials"
            className="border-y border-primary/10 bg-bg-secondary/70 py-20"
          >
            <PublicContainer>
              <div className="mb-10 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                  Отзиви
                </p>
                <h2 className="mt-4 font-heading text-4xl font-medium text-text md:text-5xl">
                  Споделени впечатления
                </h2>
              </div>
              <TestimonialPreview testimonials={testimonials} />
            </PublicContainer>
          </section>
        ) : null}

        <section id="consultation" className="bg-bg py-16 md:py-20">
          <PublicContainer>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-primary px-7 py-8 text-sage shadow-[0_28px_80px_rgba(47,71,55,0.18)] md:px-12 md:py-10">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-sage/20" />
              <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sage/10" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-3xl font-medium md:text-5xl">
                    Готова ли си за следващата стъпка?
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage/80 md:text-base">
                    Запази консултация и направи първа спокойна крачка към
                    повече яснота, грижа и устойчивост.
                  </p>
                </div>
                <CtaLink
                  href={ctaHref}
                  variant="secondary"
                  className="border-sage/45 bg-transparent text-sage hover:bg-sage hover:text-primary"
                >
                  {ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
                </CtaLink>
              </div>
            </div>
          </PublicContainer>
        </section>

        <section id="contact" className="border-t border-primary/10 bg-bg-secondary/70 py-16">
          <PublicContainer>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                  Контакти
                </p>
                <h2 className="mt-4 font-heading text-4xl font-medium text-text md:text-5xl">
                  Свържи се с Цвети
                </h2>
                <p className="mt-3 max-w-xl text-text-muted">
                  За насоки, уточняване на следваща стъпка или въпроси преди
                  консултация.
                </p>
                <div className="mt-6 space-y-2 text-sm text-text-muted md:text-base">
                  {settings.phone ? (
                    <p>
                      Телефон:{" "}
                      <a
                        href={`tel:${settings.phone.trim()}`}
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {settings.phone}
                      </a>
                    </p>
                  ) : null}
                  {settings.email ? (
                    <p>
                      Имейл:{" "}
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {settings.email}
                      </a>
                    </p>
                  ) : null}
                  {!settings.phone && !settings.email ? (
                    <p>
                      Контактните данни ще бъдат добавени от настройките на
                      сайта.
                    </p>
                  ) : null}
                </div>
              </div>
              <Link
                href={PUBLIC_CONTACT_PATH}
                className="inline-flex items-center justify-center rounded-full border border-primary/25 px-6 py-3 text-sm font-semibold text-primary hover:bg-sage"
              >
                Към страница Контакти <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </div>
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
