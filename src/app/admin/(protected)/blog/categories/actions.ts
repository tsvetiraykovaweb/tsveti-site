"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import { isValidBlogSlug } from "@/lib/cms/blog";

export type SaveCategoryResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createBlogCategory(values: {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}): Promise<SaveCategoryResult> {
  if (!(await isAdmin())) return { ok: false, error: "Нямате админ достъп." };

  const name = values.name.trim();
  const slug = values.slug.trim();
  if (!name) return { ok: false, error: "Името е задължително." };
  if (!slug) return { ok: false, error: "Slug е задължителен." };
  if (!isValidBlogSlug(slug))
    return { ok: false, error: "Slug трябва да е с малки латински букви, цифри и тирета." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .insert({
      name,
      slug,
      description: values.description.trim() || null,
      sort_order: values.sort_order,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Този slug вече се използва." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
  return { ok: true, id: data.id };
}

export async function updateBlogCategory(
  id: string,
  values: { name: string; slug: string; description: string; sort_order: number },
): Promise<SaveCategoryResult> {
  if (!(await isAdmin())) return { ok: false, error: "Нямате админ достъп." };

  const name = values.name.trim();
  const slug = values.slug.trim();
  if (!name) return { ok: false, error: "Името е задължително." };
  if (!slug) return { ok: false, error: "Slug е задължителен." };
  if (!isValidBlogSlug(slug))
    return { ok: false, error: "Slug трябва да е с малки латински букви, цифри и тирета." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_categories")
    .update({
      name,
      slug,
      description: values.description.trim() || null,
      sort_order: values.sort_order,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Този slug вече се използва." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
  return { ok: true, id };
}

export async function deleteBlogCategory(id: string): Promise<SaveCategoryResult> {
  if (!(await isAdmin())) return { ok: false, error: "Нямате админ достъп." };

  const supabase = await createClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
  return { ok: true, id };
}
