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
    alt: `Визуал · ${service.title}`,
  });

  return (
    <article className="flex h-full flex-col border border-border bg-bg">
      <CmsImageSlot
        image={image}
        aspectClassName="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="flex flex-1 flex-col px-5 py-6">
        <h3 className="font-heading text-2xl text-primary">
          <Link href={href} className="hover:opacity-80">
            {service.title}
          </Link>
        </h3>
        {service.summary ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            {service.summary}
          </p>
        ) : (
          <p className="mt-3 flex-1 text-sm text-text-muted">
            Описанието ще бъде допълнено.
          </p>
        )}
        <p className="mt-5 text-sm">
          <Link
            href={href}
            className="text-accent underline-offset-4 hover:underline"
          >
            Научи повече
          </Link>
        </p>
      </div>
    </article>
  );
}
