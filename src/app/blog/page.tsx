import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { getPublishedBlogPosts, getBlogCategories } from "@/lib/cms/blog";
import { getPublicSiteChrome } from "@/lib/cms/public-content";
import { PublicContainer } from "@/components/public/public-container";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

export const metadata: Metadata = {
  title: "Блог",
  description: `Статии и размисли от ${brand.officialName}.`,
};

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const activeCategory = sp.category || null;

  const [chrome, posts, categories] = await Promise.all([
    getPublicSiteChrome(),
    getPublishedBlogPosts(activeCategory ?? undefined),
    getBlogCategories(),
  ]);

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
          <PublicContainer>
            <p className="text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">
                Начало
              </Link>
              <span className="mx-2">/</span>
              <span className="text-primary">Блог</span>
            </p>
            <h1 className="mt-6 font-heading text-4xl text-primary md:text-5xl">
              Блог
            </h1>
            <p className="mt-4 max-w-2xl text-text-muted">
              Спокойни текстове, насоки и теми за по-осъзнато ежедневие.
            </p>
          </PublicContainer>
        </section>

        <section className="py-16">
          <PublicContainer>
            {/* Category filters */}
            {categories.length > 0 ? (
              <div className="mb-8 flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    !activeCategory
                      ? "border-primary bg-primary text-sage"
                      : "border-primary/20 text-text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  Всички
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}`}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      activeCategory === cat.slug
                        ? "border-primary bg-primary text-sage"
                        : "border-primary/20 text-text-muted hover:border-primary hover:text-primary"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            ) : null}

            {posts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-primary/10 bg-bg/85 p-8 text-text-muted shadow-[0_18px_50px_rgba(47,71,55,0.07)]">
                {activeCategory
                  ? "Няма публикувани статии в тази категория."
                  : "Публикуваните статии ще се появят тук, когато бъдат добавени от админ панела."}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-[1.5rem] border border-primary/10 bg-bg/85 p-5 shadow-[0_18px_50px_rgba(47,71,55,0.07)]"
                  >
                    <CmsImageSlot
                      image={post.featuredImage}
                      className="rounded-[1.25rem]"
                      aspectClassName="aspect-[16/10]"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-text-muted">
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                      {post.category_name ? (
                        <>
                          <span>·</span>
                          <Link
                            href={`/blog?category=${post.category_slug}`}
                            className="text-accent hover:underline"
                          >
                            {post.category_name}
                          </Link>
                        </>
                      ) : null}
                      {post.author_name ? (
                        <>
                          <span>·</span>
                          <span>{post.author_name}</span>
                        </>
                      ) : null}
                      {post.reading_time_minutes ? (
                        <>
                          <span>·</span>
                          <span>{post.reading_time_minutes} мин. четене</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="mt-2 font-heading text-3xl text-primary">
                      <Link href={`/blog/${post.slug}`} className="hover:opacity-80">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-text-muted">
                      {post.excerpt || "Откъсът ще бъде добавен от админ панела."}
                    </p>
                    <p className="mt-5 text-sm font-semibold">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary underline-offset-4 hover:text-accent hover:underline"
                      >
                        Прочети
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            )}
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
