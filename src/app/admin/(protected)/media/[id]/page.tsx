import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolvePublicStorageUrl } from "@/lib/cms/media";
import { MediaMetaForm } from "./meta-form";
import { CopyPathButton } from "../copy-path-button";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMediaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "id, path, alt_text, caption, width, height, size_bytes, mime_type, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const src = resolvePublicStorageUrl(data.path);

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/media"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към медия
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Медия файл</h1>
      <p className="mt-2 break-all font-mono text-sm text-text-muted">
        {data.path}
      </p>

      {src ? (
        <div className="relative mt-6 aspect-[16/10] max-w-2xl overflow-hidden border border-border bg-bg-secondary">
          <Image
            src={src}
            alt={data.alt_text || "Медия"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      ) : null}

      <div className="mt-4">
        <CopyPathButton path={data.path} />
      </div>

      <MediaMetaForm
        id={data.id}
        initialAlt={data.alt_text ?? ""}
        initialCaption={(data as { caption?: string | null }).caption ?? ""}
      />
    </section>
  );
}
