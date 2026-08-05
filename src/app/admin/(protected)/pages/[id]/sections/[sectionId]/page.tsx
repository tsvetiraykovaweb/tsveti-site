import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sectionFormFromRow } from "@/lib/cms/pages";
import type { SectionType } from "@/types/database";
import { SectionEditForm } from "../../../section-form";

type PageProps = {
  params: Promise<{ id: string; sectionId: string }>;
};

export default async function AdminEditSectionPage({ params }: PageProps) {
  const { id: pageId, sectionId } = await params;
  const supabase = await createClient();
  const [{ data: page }, { data: section, error }, mediaRes] = await Promise.all([
    supabase.from("pages").select("id, title").eq("id", pageId).maybeSingle(),
    supabase
      .from("page_sections")
      .select(
        "id, key, section_type, content, sort_order, is_published, page_id",
      )
      .eq("id", sectionId)
      .eq("page_id", pageId)
      .maybeSingle(),
    supabase
      .from("media_assets")
      .select("id, path, alt_text")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (!page || error || !section) {
    notFound();
  }

  const initialValues = sectionFormFromRow(
    section.key,
    section.section_type as SectionType,
    section.content,
    section.sort_order,
    section.is_published,
  );

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
      <h1 className="font-heading text-3xl text-primary">
        Секция <code className="text-2xl">{section.key}</code>
      </h1>
      <SectionEditForm
        pageId={pageId}
        sectionId={section.id}
        initialValues={initialValues}
        mediaOptions={mediaOptions}
      />
    </section>
  );
}
