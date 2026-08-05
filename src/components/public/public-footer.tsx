import Link from "next/link";
import { PublicContainer } from "./public-container";
import {
  PUBLIC_ABOUT_PATH,
  PUBLIC_CONSULTATION_PATH,
  PUBLIC_CONTACT_PATH,
  PUBLIC_PRIVACY_PATH,
} from "@/lib/cms/public-paths";

type Props = {
  officialName: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
};

export function PublicFooter({
  officialName,
  phone,
  email,
  instagram,
  facebook,
}: Props) {
  return (
    <footer className="mt-auto border-t border-border bg-bg-secondary">
      <PublicContainer className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-heading text-xl text-primary">{officialName}</p>
          <p className="mt-1 text-sm text-text-muted">
            Спокойна естествена експертност
          </p>
          <p className="mt-4 text-sm">
            <Link
              href={PUBLIC_CONSULTATION_PATH}
              className="text-accent underline-offset-4 hover:underline"
            >
              Запази безплатна консултация
            </Link>
          </p>
        </div>

        <nav
          className="flex flex-col gap-2 text-sm text-text-muted"
          aria-label="Връзки в долния колонтитул"
        >
          <Link href={PUBLIC_ABOUT_PATH} className="hover:text-primary">
            За Цвети
          </Link>
          <Link href={PUBLIC_CONTACT_PATH} className="hover:text-primary">
            Контакти
          </Link>
          <Link href={PUBLIC_PRIVACY_PATH} className="hover:text-primary">
            Политика за поверителност
          </Link>
        </nav>

        <div className="space-y-1 text-sm text-text-muted">
          {phone ? <p>{phone}</p> : null}
          {email ? (
            <p>
              <a href={`mailto:${email}`} className="hover:text-primary">
                {email}
              </a>
            </p>
          ) : null}
          <div className="flex gap-4 pt-1">
            {instagram ? (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Instagram
              </a>
            ) : null}
            {facebook ? (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </PublicContainer>
    </footer>
  );
}
