import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { buildImageRef } from "@/lib/cms/media";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import {
  getPublishedCmsPage,
  sectionLines,
} from "@/lib/cms/public-pages";
import {
  filterRealCmsLines,
  isCmsPlaceholderText,
} from "@/lib/cms/placeholder-copy";
import {
  PUBLIC_CONSULTATION_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedCmsPage("za-cveti");
  return {
    title: page?.seo_title || page?.title || "За Цвети",
    description:
      page?.seo_description ||
      `Запознайте се с ${brand.officialName} (${brand.displayName}) — спокоен, индивидуален подход и насоки за подкрепа.`,
  };
}

export default async function AboutPage() {
  const [chrome, page] = await Promise.all([
    getPublicSiteChrome(),
    getPublishedCmsPage("za-cveti"),
  ]);
  const displayName = chrome.settings.display_name || brand.displayName;
  const officialName = chrome.settings.official_name || brand.officialName;
  const by = page?.byKey ?? {};

  const intro = by.intro;
  const story = by.story;
  const approach = by.approach;
  const values = by.values;
  const qualifications = by.qualifications;
  const cta = by.cta;

  const portrait =
    intro?.image.src
      ? intro.image
      : buildImageRef({
          path: intro?.fields.image_path || null,
          alt:
            intro?.fields.image_alt ||
            `Портрет на ${officialName}`,
        });
  const storyImage =
    story?.image.src
      ? story.image
      : buildImageRef({
          path: story?.fields.image_path || null,
          alt:
            story?.fields.image_alt ||
            `Визуал към историята на ${displayName}`,
        });

  const approachLines = sectionLines(approach);
  const valuesLines = sectionLines(values);
  const qualLines = filterRealCmsLines(sectionLines(qualifications));
  const storyBody =
    story?.plainBody && !isCmsPlaceholderText(story.plainBody)
      ? story.plainBody
      : null;

  return (
    <>
      <PublicHeader
        displayName={displayName}
        officialName={officialName}
        ctaHref={chrome.ctaHref}
        navItems={chrome.navItems}
        services={chrome.services}
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
              {intro?.fields.eyebrow ? (
                <p className="mt-6 text-sm tracking-[0.18em] text-text-muted uppercase">
                  {intro.fields.eyebrow}
                </p>
              ) : null}
              <h1 className="mt-4 font-heading text-4xl font-medium text-primary md:text-5xl">
                {intro?.fields.heading || `За ${displayName}`}
              </h1>
              <p className="mt-2 font-heading text-2xl text-primary/80">
                {officialName}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
                {intro?.plainBody ||
                  `Спокойна естествена експертност — индивидуален подход и ясни насоки за подкрепа в ежедневието. Тук ще намерите кратък преглед на начина на работа на ${displayName}.`}
              </p>
            </div>
            <CmsImageSlot image={portrait} priority />
          </PublicContainer>
        </section>

        <section className="py-16 md:py-20">
          <PublicContainer className="grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-heading text-2xl text-primary md:text-3xl">
                {story?.fields.heading || "Лична история"}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted">
                {storyBody ||
                  `Кратък текст за пътя на ${displayName} ще бъде допълнен тук — без медицински твърдения и без измислени биографични детайли.`}
              </p>
            </div>
            <CmsImageSlot image={storyImage} />
          </PublicContainer>
        </section>

        <section className="border-y border-border bg-bg-secondary py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              {approach?.fields.heading || "Подходът на работа"}
            </h2>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-muted">
              {(approachLines.length > 0
                ? approachLines
                : [
                    "Спокоен опознавателен разговор — заедно се уточнява коя посока може да е подходяща.",
                    "Индивидуален подход с насоки, които могат да подпомогнат по-добро усещане за баланс.",
                    "Подкрепа според вашето темпо — без натиск и без обещания за конкретни резултати.",
                  ]
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              {values?.fields.heading || "Ценности"}
            </h2>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-muted">
              {(valuesLines.length > 0
                ? valuesLines
                : [
                    "Уважение към личните граници и темпото на всеки човек.",
                    "Ясна и спокойна комуникация.",
                    "Честност — без преувеличени обещания.",
                    "Подкрепа чрез практически насоки, когато това е уместно.",
                  ]
              ).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </PublicContainer>
        </section>

        {qualLines.length > 0 ? (
        <section className="border-t border-border bg-bg-secondary py-16">
          <PublicContainer className="max-w-3xl">
            <h2 className="font-heading text-2xl text-primary md:text-3xl">
              {qualifications?.fields.heading ||
                "Образование и квалификации"}
            </h2>
            {qualifications?.fields.eyebrow &&
            !isCmsPlaceholderText(qualifications.fields.eyebrow) ? (
              <p className="mt-4 text-sm text-text-muted">
                {qualifications.fields.eyebrow}
              </p>
            ) : null}
            <ul className="mt-6 space-y-2 text-base text-text-muted">
              {qualLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </PublicContainer>
        </section>
        ) : null}

        <section className="py-16">
          <PublicContainer className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-primary md:text-3xl">
                {cta?.fields.heading || "Готови ли сте за разговор?"}
              </h2>
              <p className="mt-3 max-w-xl text-text-muted">
                {cta?.plainBody ||
                  "Запазете безплатна консултация — кратък опознавателен разговор, в който ще обсъдим коя посока е подходяща."}
              </p>
            </div>
            <CtaLink
              href={
                cta?.fields.cta_href || PUBLIC_CONSULTATION_PATH
              }
            >
              {cta?.fields.cta_label || "Запази безплатна консултация"}
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
