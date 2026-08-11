import Link from "next/link";
import { publicServicePath } from "@/lib/cms/public-paths";
import { buildImageRef } from "@/lib/cms/media";
import type { PublicService } from "@/lib/cms/public-content";
import { CmsImageSlot } from "@/components/public/cms-image-slot";

type Props = {
  service: PublicService;
};

export function ServiceCard({ service }: Props) {
  const href = publicServicePath(service.slug);
  const image = buildImageRef({
    path: service.image_path,
    alt: `Визуал към услугата ${service.title}`,
  });

  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-primary/10 bg-bg/85 p-5 shadow-[0_18px_50px_rgba(47,71,55,0.07)] transition duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_24px_70px_rgba(47,71,55,0.11)]">
      <div className="mb-5">
        {image.src ? (
          <CmsImageSlot
            image={image}
            aspectClassName="aspect-[4/3]"
            className="rounded-[1.25rem]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-sage text-primary">
            <span className="font-heading text-3xl leading-none">✦</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="font-heading text-2xl leading-tight text-primary">
          <Link href={href} className="hover:opacity-80">
            {service.title}
          </Link>
        </h3>
        {service.summary ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            {service.summary}
          </p>
        ) : (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            Описанието ще бъде допълнено от админ панела.
          </p>
        )}
        <p className="mt-6 text-sm font-semibold">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-primary transition-colors group-hover:text-accent"
          >
            Научи повече <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
