import Image from "next/image";
import type { PublicImageRef } from "@/lib/cms/media";

type Props = {
  image: PublicImageRef;
  /** Visual aspect when empty or for fill layout */
  aspectClassName?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Reserved public image slot. Renders next/image when a URL exists;
 * otherwise a calm placeholder for future admin-uploaded media.
 */
export function CmsImageSlot({
  image,
  aspectClassName = "aspect-[16/10]",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 960px",
}: Props) {
  if (image.src) {
    return (
      <figure
        className={`relative overflow-hidden rounded-[2rem] ${aspectClassName} ${className}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        {image.caption ? (
          <figcaption className="sr-only">{image.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-bg-secondary via-bg to-sage/60 p-6 shadow-[0_24px_70px_rgba(47,71,55,0.08)] ${aspectClassName} ${className}`}
      role="img"
      aria-label={image.alt}
    >
      <span className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-primary/10" />
      <span className="absolute bottom-8 right-10 h-20 w-20 rounded-full bg-primary/10" />
      <p className="relative max-w-xs text-sm leading-relaxed text-text-muted">
        Визуалът ще бъде добавен от админ панела.
      </p>
    </div>
  );
}
