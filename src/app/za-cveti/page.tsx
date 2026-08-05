import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { buildImageRef } from "@/lib/cms/media";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import {
  PUBLIC_CONSULTATION_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

export const metadata: Metadata = {
  title: "За Цвети",
  description: `Запознайте се с ${brand.officialName} (${brand.displayName}) — спокоен, индивидуален подход и насоки за подкрепа.`,
};

export default async function AboutPage() {
  const chrome = await getPublicSiteChrome();
  const displayName =
    chrome.settings.display_name || brand.displayName;
  const officialName =
    chrome.settings.official_name || brand.officialName;

  const portrait = buildImageRef({
    alt: `Портрет на ${officialName}`,
  });
  const storyImage = buildImageRef({
    alt: `Визуал към историята на ${displayName}`,
  });

  return (
    <>
      <PublicHeader
        displayName={displayName}
        officialName={officialName}
        ctaHref={chrome.ctaHref}
        navItems={chrome.navItems}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm text-text-muted">
                <Link href="/" className="hover:text-primary">
                  Начало
                </Link>
                <span className="mx-2">/</span>
                <span className="text-primary">За Цвети</span>
              </p>
              <h1 className="mt-6 font-heading text-4xl font-medium text-primary md:text-5xl">
                За {displayName}
              </h1>
              <p className="mt-2 font-heading text-2xl text-primary/80">
                {officialName}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                Спокойна естествена експертност — индивидуален подход и ясни
                насоки за подкрепа в ежедневието. Тук ще намерите кратък
                преглед на начина на работа на {displayName}.
              </p>
            </div>
            <CmsImageSlot image={portrait} priority />
          </PublicContainer>
        </section>

        <section className="py-16 md:py-20">
          <PublicContainer className="grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-heading text-2xl text-primary md:text-3xl">
                Лична история
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted">
                [Добавете лична история] — кратък, човешки текст за пътя на{" "}
                {displayName}, без медицински твърдения и без измислени
                биографични детайли.
              </p>
            </div>
            <CmsImageSlot image={storyImage} />
          </PublicContainer>
        </section>

        <section className="border-y border-border bg-bg-secondary py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              Подходът на работа
            </h2>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-muted">
              <li>
                Спокоен опознавателен разговор — заедно се уточнява коя посока
                може да е подходяща.
              </li>
              <li>
                Индивидуален подход с насоки, които могат да подпомогнат по-добро
                усещане за баланс.
              </li>
              <li>
                Подкрепа според вашето темпо — без натиск и без обещания за
                конкретни резултати.
              </li>
            </ul>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              Ценности
            </h2>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-muted">
              <li>Уважение към личните граници и темпото на всеки човек.</li>
              <li>Ясна и спокойна комуникация.</li>
              <li>Честност — без преувеличени обещания.</li>
              <li>Подкрепа чрез практически насоки, когато това е уместно.</li>
            </ul>
          </PublicContainer>
        </section>

        <section className="border-t border-border bg-bg-secondary py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              Образование и квалификации
            </h2>
            <p className="mt-4 text-sm text-text-muted">
              Полетата по-долу са шаблони. Попълнете ги от админ панела /
              съдържанието, когато имате потвърдени данни. Не измисляйте
              титли или сертификати.
            </p>
            <ul className="mt-6 space-y-2 text-base text-text-muted">
              <li>[Добавете образование]</li>
              <li>[Добавете квалификация]</li>
              <li>[Добавете сертификат]</li>
              <li>[Добавете професионално наименование]</li>
            </ul>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-primary md:text-3xl">
                Готови ли сте за разговор?
              </h2>
              <p className="mt-3 max-w-xl text-text-muted">
                Запазете безплатна консултация — кратък опознавателен разговор,
                в който ще обсъдим коя посока е подходяща.
              </p>
            </div>
            <CtaLink href={PUBLIC_CONSULTATION_PATH}>
              Запази безплатна консултация
            </CtaLink>
          </PublicContainer>
        </section>
      </main>

      <PublicFooter
        officialName={officialName}
        phone={chrome.settings.phone}
        email={chrome.settings.email}
        instagram={chrome.social.instagram}
        facebook={chrome.social.facebook}
      />
    </>
  );
}
