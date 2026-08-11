import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { getPublishedBlogPostBySlug } from "@/lib/cms/blog";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CtaLink } from "@/components/public/cta-link";
import { CmsImageSlot } from "@/components/public/cms-image-slot";
import { MarkdownContent } from "@/components/public/markdown-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) return { title: "Статия" };

  return {
    title: post.seo_title || post.title,
    description:
      post.seo_description ||
      post.excerpt ||
      `Статия от блога на ${brand.officialName}.`,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [chrome, post] = await Promise.all([
    getPublicSiteChrome(),
    getPublishedBlogPostBySlug(slug),
  ]);

  if (!post) notFound();

  return (
    <>
      <PublicHeader
        displayName={chrome.settings.display_name || chrome.settings.official_name}
        officialName={chrome.settings.official_name}
        ctaHref={chrome.ctaHref}
        navItems={chrome.navItems}
        services={chrome.services}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-bg-secondary to-bg py-16 md:py-20">
          <PublicContainer className="max-w-4xl">
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-primary">
                Блог
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">{post.title}</span>
            </p>
            <p className="mt-6 text-sm text-text-muted">
              {formatDate(post.published_at || post.created_at)}
            </p>
            <h1 className="mt-3 font-heading text-4xl text-primary md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
                {post.excerpt}
              </p>
            ) : null}
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer className="max-w-4xl">
            <CmsImageSlot
              image={post.featuredImage}
              className="rounded-[1.5rem]"
              aspectClassName="aspect-[16/9]"
              sizes="100vw"
            />
            <div className="mt-10 rounded-[1.5rem] border border-primary/10 bg-bg/85 p-6 shadow-[0_18px_50px_rgba(47,71,55,0.07)] md:p-8">
              <MarkdownContent content={post.content} />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/blog"
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                ← Обратно към блога
              </Link>
              <CtaLink href={chrome.ctaHref}>Запази консултация</CtaLink>
            </div>
          </PublicContainer>
        </section>
      </main>

      <PublicFooter
        officialName={chrome.settings.official_name}
        phone={chrome.settings.phone}
        email={chrome.settings.email}
        instagram={chrome.social.instagram}
        facebook={chrome.social.facebook}
      />
    </>
  );
}
