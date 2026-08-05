import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import {
  PUBLIC_CONSULTATION_PATH,
  PUBLIC_PRIVACY_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";

export const metadata: Metadata = {
  title: "Контакти",
  description: `Свържете се с ${brand.officialName} за кратък опознавателен разговор и насоки.`,
};

export default async function ContactPage() {
  const chrome = await getPublicSiteChrome();
  const { settings, social, ctaHref, ctaLabel, navItems } = chrome;
  const displayName = settings.display_name || brand.displayName;
  const officialName = settings.official_name || brand.officialName;
  const hasContact = Boolean(settings.phone?.trim() || settings.email?.trim());
  const hasSocial = Boolean(social.instagram?.trim() || social.facebook?.trim());

  return (
    <>
      <PublicHeader
        displayName={displayName}
        officialName={officialName}
        ctaHref={ctaHref}
        navItems={navItems}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="py-14 md:py-20">
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">Контакти</span>
            </p>
            <h1 className="mt-6 font-heading text-4xl font-medium text-primary md:text-5xl">
              Контакти
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              Свържете се с {displayName} за уточняване на следваща стъпка.
              За предпочитане е да запазите безплатна консултация през формата.
            </p>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="grid max-w-4xl gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl text-primary">
                Данни за връзка
              </h2>
              <div className="mt-6 space-y-3 text-base text-text-muted">
                {settings.phone?.trim() ? (
                  <p>
                    Телефон:{" "}
                    <a
                      href={`tel:${settings.phone.trim()}`}
                      className="text-primary hover:underline"
                    >
                      {settings.phone.trim()}
                    </a>
                  </p>
                ) : null}
                {settings.email?.trim() ? (
                  <p>
                    Имейл:{" "}
                    <a
                      href={`mailto:${settings.email.trim()}`}
                      className="text-primary hover:underline"
                    >
                      {settings.email.trim()}
                    </a>
                  </p>
                ) : null}
                {!hasContact ? (
                  <p>
                    Телефон и имейл ще се появят тук, когато бъдат попълнени в
                    настройките на сайта.
                  </p>
                ) : null}
              </div>

              {hasSocial ? (
                <div className="mt-8">
                  <h3 className="font-heading text-xl text-primary">
                    Социални мрежи
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-text-muted">
                    {social.instagram?.trim() ? (
                      <li>
                        <a
                          href={social.instagram.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          Instagram
                        </a>
                      </li>
                    ) : null}
                    {social.facebook?.trim() ? (
                      <li>
                        <a
                          href={social.facebook.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          Facebook
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="border border-border bg-bg-secondary px-5 py-6">
              <h2 className="font-heading text-2xl text-primary">
                Безплатна консултация
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Оставете кратки данни през формата. Това е опознавателен
                разговор — ще обсъдим коя посока е подходяща, с индивидуален
                подход и спокойни насоки.
              </p>
              <div className="mt-6">
                <CtaLink href={PUBLIC_CONSULTATION_PATH}>
                  {ctaLabel || "Запази безплатна консултация"}
                </CtaLink>
              </div>
              <p className="mt-6 text-sm text-text-muted">
                <Link
                  href={PUBLIC_PRIVACY_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Политика за поверителност
                </Link>
              </p>
            </div>
          </PublicContainer>
        </section>

        <section className="border-t border-border bg-bg-secondary py-12">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-xl text-primary">Важна бележка</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Формата и контактните канали не са предназначени за спешни или
              животозастрашаващи ситуации. При спешна медицинска нужда се
              обърнете към спешна помощ или квалифициран здравен специалист.
            </p>
          </PublicContainer>
        </section>
      </main>

      <PublicFooter
        officialName={officialName}
        phone={settings.phone}
        email={settings.email}
        instagram={social.instagram}
        facebook={social.facebook}
      />
    </>
  );
}
