import Link from "next/link";
import {
  getLaunchReadiness,
  type ReadinessTone,
} from "@/lib/admin/readiness";

function toneLabel(tone: ReadinessTone): string {
  switch (tone) {
    case "ok":
      return "OK";
    case "warn":
      return "Внимание";
    case "missing":
      return "Липсва";
    case "info":
      return "Инфо";
  }
}

function toneClass(tone: ReadinessTone): string {
  switch (tone) {
    case "ok":
      return "text-accent";
    case "warn":
      return "text-amber-800";
    case "missing":
      return "text-red-800";
    case "info":
      return "text-text-muted";
  }
}

export default async function AdminReadinessPage() {
  const readiness = await getLaunchReadiness();

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
      </div>

      <h1 className="font-heading text-3xl text-primary">
        Готовност за launch
      </h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        Практическа проверка преди публикуване на сайта на{" "}
        <strong className="font-medium text-text">Цветелина Райкова</strong>.
        Secret стойности (API ключове) не се показват — само configured /
        missing.
      </p>

      <p className="mt-4 text-sm text-text-muted">
        {readiness.summary.ok} OK · {readiness.summary.warn} внимание ·{" "}
        {readiness.summary.missing} липсва
      </p>

      {readiness.warnings.length > 0 ? (
        <div className="mt-6 space-y-2 border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
          {readiness.warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      ) : null}

      <h2 className="mt-10 font-heading text-xl text-primary">Проверки</h2>
      <ul className="mt-4 divide-y divide-border border border-border bg-bg">
        {readiness.checks.map((check) => (
          <li
            key={check.id}
            className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-primary">{check.label}</p>
              <p className="mt-1 text-sm text-text-muted">{check.detail}</p>
              {check.href ? (
                <p className="mt-2 text-sm">
                  <Link
                    href={check.href}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    Отвори
                  </Link>
                </p>
              ) : null}
            </div>
            <span
              className={`shrink-0 text-sm font-medium ${toneClass(check.tone)}`}
            >
              {toneLabel(check.tone)}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-heading text-xl text-primary">
        Бързи връзки към съдържание
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {readiness.quickLinks.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="block border border-border bg-bg px-4 py-3 text-sm text-primary underline-offset-4 hover:underline"
            >
              {link.label}
              {link.note ? (
                <span className="mt-1 block text-xs text-text-muted">
                  {link.note}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-text-muted">
        Пълен списък:{" "}
        <code className="text-text">docs/launch-checklist.md</code> в
        хранилището.
      </p>
    </section>
  );
}
