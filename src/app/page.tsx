import { brand } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="mb-3 text-sm tracking-wide text-text-muted uppercase">
        {brand.direction}
      </p>
      <h1 className="font-heading text-4xl font-medium text-primary md:text-5xl">
        {brand.displayName}
      </h1>
      <p className="mt-4 max-w-md text-center text-text-muted">
        Начална страница — съдържанието ще бъде добавено в следващите етапи.
      </p>
    </main>
  );
}
