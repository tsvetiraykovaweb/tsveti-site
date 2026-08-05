import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";
import { brand } from "@/lib/brand";
import { buildImageRef, type PublicImageRef } from "@/lib/cms/media";
import {
  parseSectionContent,
  sectionPlainBody,
  type SectionContentFields,
} from "@/lib/cms/pages";

export type PublicCmsSection = {
  key: string;
  fields: SectionContentFields;
  plainBody: string;
  image: PublicImageRef;
};

export type PublicCmsPage = {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  sections: PublicCmsSection[];
  byKey: Record<string, PublicCmsSection>;
};

/**
 * Loads a published page + published sections by slug.
 * Returns null when missing/unpublished or Supabase is not configured.
 */
export async function getPublishedCmsPage(
  slug: string,
): Promise<PublicCmsPage | null> {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data: page, error } = await supabase
    .from("pages")
    .select("id, slug, title, seo_title, seo_description, status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !page) return null;

  const { data: rows } = await supabase
    .from("page_sections")
    .select("key, content, sort_order, is_published")
    .eq("page_id", page.id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  const sections: PublicCmsSection[] = (rows ?? []).map((row) => {
    const fields = parseSectionContent(row.content);
    const plainBody = sectionPlainBody(fields);
    return {
      key: row.key,
      fields,
      plainBody,
      image: buildImageRef({
        path: fields.image_path || null,
        alt:
          fields.image_alt ||
          fields.heading ||
          `Визуал · ${brand.officialName}`,
      }),
    };
  });

  const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    sections,
    byKey,
  };
}

export function sectionLines(section: PublicCmsSection | undefined): string[] {
  if (!section?.plainBody) return [];
  return section.plainBody
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}
