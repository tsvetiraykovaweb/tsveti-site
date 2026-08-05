import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { resolvePublicStorageUrl } from "@/lib/cms/media";
import { MediaUploadForm } from "./upload-form";
import { CopyPathButton } from "./copy-path-button";

type MediaRow = {
  id: string;
  path: string;
  alt_text: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "id, path, alt_text, caption, width, height, size_bytes, mime_type, created_at",
    )
    .order("created_at", { ascending: false });

  const items = (data ?? []) as MediaRow[];

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

      <h1 className="font-heading text-3xl text-primary">Медия библиотека</h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        Качвайте изображения през админ панела. Публичните страници ползват
        оптимизирания WebP път (обикновено <code>…/w1200.webp</code>).
      </p>

      <div className="mt-8">
        <MediaUploadForm />
      </div>

      {error ? (
        <p className="mt-8 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Грешка при зареждане: {error.message}
          {error.message.includes("caption")
            ? " — изпълнете миграцията за caption."
            : null}
        </p>
      ) : null}

      {!error && items.length === 0 ? (
        <div className="mt-8 rounded border border-border bg-bg px-4 py-5 text-sm text-text-muted">
          Все още няма качени файлове.
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const src = resolvePublicStorageUrl(item.path);
            return (
              <li
                key={item.id}
                className="flex flex-col border border-border bg-bg"
              >
                <div className="relative aspect-[4/3] bg-bg-secondary">
                  {src ? (
                    <Image
                      src={src}
                      alt={item.alt_text || "Медия"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-text-muted">
                      Няма URL
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 px-3 py-3 text-sm">
                  <p className="font-medium text-primary line-clamp-2">
                    {item.alt_text || "Без alt"}
                  </p>
                  {item.caption ? (
                    <p className="text-text-muted line-clamp-2">{item.caption}</p>
                  ) : null}
                  <p className="break-all font-mono text-xs text-text-muted">
                    {item.path}
                  </p>
                  <p className="text-xs text-text-muted">
                    {item.width && item.height
                      ? `${item.width}×${item.height}`
                      : "—"}
                    {" · "}
                    {formatBytes(item.size_bytes)}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    <CopyPathButton path={item.path} />
                    <Link
                      href={`/admin/media/${item.id}`}
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      Редакция
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
