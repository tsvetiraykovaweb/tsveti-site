import Link from "next/link";
import { EMPTY_BLOG_POST_VALUES } from "@/lib/cms/blog-shared";
import { BlogForm } from "../blog-form";

export default function AdminBlogNewPage() {
  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin/blog"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Към блога
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Нова статия</h1>
      <p className="mt-2 text-text-muted">
        Създай чернова или публикувана статия с markdown съдържание.
      </p>
      <BlogForm mode="create" initialValues={EMPTY_BLOG_POST_VALUES} />
    </section>
  );
}
