import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import {
  getPublishedCmsPage,
  sectionLines,
} from "@/lib/cms/public-pages";
import {
  PUBLIC_CONSULTATION_PATH,
  PUBLIC_CONTACT_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedCmsPage("politika-za-poveritelnost");
  return {
    title:
      page?.seo_title || page?.title || "Политика за поверителност",
    description:
      page?.seo_description ||
      `Чернова на политика за поверителност за сайта на ${brand.officialName}. Изисква правна проверка преди публично стартиране.`,
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPolicyPage() {
  const [chrome, page] = await Promise.all([
    getPublicSiteChrome(),
    getPublishedCmsPage("politika-za-poveritelnost"),
  ]);
  const officialName =
    chrome.settings.official_name || brand.officialName;
  const by = page?.byKey ?? {};
  const intro = by.intro;
  const dataCollected = by.data_collected;
  const purpose = by.purpose;
  const sensitive = by.sensitive;
  const storage = by.storage;
  const rights = by.rights;
  const legalNote = by.legal_note;

  const dataLines = sectionLines(dataCollected);

  return (
    <>
      <PublicHeader
        displayName={
          chrome.settings.display_name || chrome.settings.official_name
        }
        officialName={officialName}
        ctaHref={chrome.ctaHref}
        navItems={chrome.navItems}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg">
          <PublicContainer className="py-14 md:py-20">
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">Политика за поверителност</span>
            </p>
            <p className="mt-6 inline-block border border-border bg-bg px-3 py-1 text-xs tracking-wide text-accent uppercase">
              Чернова · правна проверка е нужна
            </p>
            <h1 className="mt-4 font-heading text-4xl font-medium text-primary md:text-5xl">
              {intro?.fields.heading ||
                page?.title ||
                "Политика за поверителност"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
              {intro?.plainBody ||
                `Този текст е предварителен шаблон за сайта на ${officialName}. Не представлява окончателен правен съвет и трябва да бъде прегледан от специалист преди официално стартиране.`}
            </p>
            <p className="mt-4 max-w-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Това е чернова / fallback текст. Нужна е правна проверка преди
              production launch. Дотогава страницата остава с noindex.
            </p>
          </PublicContainer>
        </section>

        <section className="py-14 md:py-16">
          <PublicContainer className="max-w-3xl space-y-10 text-base leading-relaxed text-text-muted">
            <div>
              <h2 className="font-heading text-2xl text-primary">
                {dataCollected?.fields.heading || "Какви данни събираме"}
              </h2>
              <p className="mt-3">
                Чрез формата за безплатна консултация (
                <Link
                  href={PUBLIC_CONSULTATION_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  безплатна консултация
                </Link>
                ) може да се съберат:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {(dataLines.length > 0
                  ? dataLines
                  : [
                      "име",
                      "телефон",
                      "имейл (по желание)",
                      "интерес към услуга",
                      "предпочитан начин за връзка",
                      "кратко съобщение (по желание)",
                      "съгласие за обработка с цел връзка",
                    ]
                ).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                {purpose?.fields.heading || "Защо се събират"}
              </h2>
              <p className="mt-3">
                {purpose?.plainBody ||
                  "Данните се използват единствено, за да се осъществи връзка по заявката и да се уточни кратък опознавателен разговор. Не се използват за медицинска диагноза или лечение."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                {sensitive?.fields.heading || "Чувствителни здравни данни"}
              </h2>
              <p className="mt-3">
                {sensitive?.plainBody ||
                  "Моля, не изпращайте през формата диагнози, лекарства, резултати от изследвания, подробна здравна история или други чувствителни медицински данни. Формата е за кратък контакт и интерес към насоки/подкрепа — не за спешни или клинични случаи."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                {storage?.fields.heading || "Съхранение и достъп"}
              </h2>
              <p className="mt-3">
                {storage?.plainBody ||
                  "Заявките се съхраняват в защитен бекенд и са видими само за упълномощени администратори. Публичните страници не показват съдържанието на заявките."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                {rights?.fields.heading || "Вашите права и връзка"}
              </h2>
              <p className="mt-3">
                {rights?.plainBody ||
                  "За въпроси относно личните данни може да се свържете през страница Контакти. Точните срокове, правни основания и процедури ще бъдат уточнени след правна редакция."}{" "}
                <Link
                  href={PUBLIC_CONTACT_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Отвори Контакти
                </Link>
              </p>
            </div>

            <div className="border border-border bg-bg-secondary px-5 py-5 text-sm">
              <p className="font-medium text-primary">
                {legalNote?.fields.heading ||
                  "Важно преди публично стартиране"}
              </p>
              <p className="mt-2">
                {legalNote?.plainBody ||
                  "Тази страница е чернова. Нужна е правна проверка и финален текст, съобразен с приложимото законодателство. Дотогава не третирайте съдържанието като окончателна политика."}
              </p>
            </div>
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
