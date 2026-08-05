import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EMPTY_SECTION_VALUES } from "@/lib/cms/pages";
import { SectionEditForm } from "../../../section-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewSectionPage({ params }: PageProps) {
  const { id: pageId } = await params;
  const supabase = await createClient();
  const [{ data: page }, mediaRes] = await Promise.all([
    supabase.from("pages").select("id, title").eq("id", pageId).maybeSingle(),
    supabase
      .from("media_assets")
      .select("id, path, alt_text")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (!page) notFound();

  const mediaOptions = (mediaRes.data ?? []).map((row) => ({
    path: row.path as string,
    label: `${(row.alt_text as string | null) || "Без alt"} · ${row.path}`,
  }));

  return (
    <section>
      <div className="mb-2">
        <Link
          href={`/admin/pages/${pageId}`}
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към {page.title}
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Нова секция</h1>
      <SectionEditForm
        pageId={pageId}
        initialValues={EMPTY_SECTION_VALUES}
        mediaOptions={mediaOptions}
      />
    </section>
  );
}
