import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import {
  PUBLIC_CONSULTATION_PATH,
  PUBLIC_CONTACT_PATH,
} from "@/lib/cms/public-paths";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export const metadata: Metadata = {
  title: "Политика за поверителност",
  description: `Чернова на политика за поверителност за сайта на ${brand.officialName}. Изисква правна проверка преди публично стартиране.`,
  robots: { index: false, follow: true },
};

export default async function PrivacyPolicyPage() {
  const chrome = await getPublicSiteChrome();
  const officialName =
    chrome.settings.official_name || brand.officialName;

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
              Политика за поверителност
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
              Този текст е предварителен шаблон за сайта на {officialName}. Не
              представлява окончателен правен съвет и трябва да бъде прегледан
              от специалист преди официално стартиране.
            </p>
          </PublicContainer>
        </section>

        <section className="py-14 md:py-16">
          <PublicContainer className="prose-none max-w-3xl space-y-10 text-base leading-relaxed text-text-muted">
            <div>
              <h2 className="font-heading text-2xl text-primary">
                Какви данни събираме
              </h2>
              <p className="mt-3">
                Чрез формата за безплатна консултация (
                <Link
                  href={PUBLIC_CONSULTATION_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  /bezplatna-konsultatsia
                </Link>
                ) може да се съберат:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>име</li>
                <li>телефон</li>
                <li>имейл (по желание)</li>
                <li>интерес към услуга</li>
                <li>предпочитан начин за връзка</li>
                <li>кратко съобщение (по желание)</li>
                <li>съгласие за обработка с цел връзка</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                Защо се събират
              </h2>
              <p className="mt-3">
                Данните се използват единствено, за да се осъществи връзка по
                заявката и да се уточни кратък опознавателен разговор. Не се
                използват за медицинска диагноза или лечение.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                Чувствителни здравни данни
              </h2>
              <p className="mt-3">
                Моля, не изпращайте през формата диагнози, лекарства,
                резултати от изследвания, подробна здравна история или други
                чувствителни медицински данни. Формата е за кратък контакт и
                интерес към насоки/подкрепа — не за спешни или клинични случаи.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                Съхранение и достъп
              </h2>
              <p className="mt-3">
                Заявките се съхраняват в защитен бекенд и са видими само за
                упълномощени администратори. Публичните страници не показват
                съдържанието на заявките.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-primary">
                Вашите права и връзка
              </h2>
              <p className="mt-3">
                За въпроси относно личните данни може да се свържете през
                страница{" "}
                <Link
                  href={PUBLIC_CONTACT_PATH}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Контакти
                </Link>
                . Точните срокове, правни основания и процедури ще бъдат
                уточнени след правна редакция.
              </p>
            </div>

            <div className="border border-border bg-bg-secondary px-5 py-5 text-sm">
              <p className="font-medium text-primary">
                Важно преди публично стартиране
              </p>
              <p className="mt-2">
                Тази страница е чернова. Нужна е правна проверка и финален
                текст, съобразен с приложимото законодателство. Дотогава не
                третирайте съдържанието като окончателна политика.
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
