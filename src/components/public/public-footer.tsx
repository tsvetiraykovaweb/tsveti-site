import { PublicContainer } from "./public-container";

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
      <PublicContainer className="flex flex-col gap-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-heading text-xl text-primary">{officialName}</p>
          <p className="mt-1 text-sm text-text-muted">
            Спокойна естествена експертност
          </p>
        </div>
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
