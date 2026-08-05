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
      <figure className={`relative overflow-hidden ${aspectClassName} ${className}`}>
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
      className={`flex items-end border border-border bg-gradient-to-br from-bg-secondary to-sage/40 p-5 ${aspectClassName} ${className}`}
      role="img"
      aria-label={image.alt}
    >
      <p className="max-w-xs text-sm text-text-muted">
        Визуалът ще бъде добавен от админ панела.
      </p>
    </div>
  );
}
