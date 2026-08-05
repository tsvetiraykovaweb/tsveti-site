import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { brand } from "@/lib/brand";
import { getSiteOrigin } from "@/lib/cms/public-paths";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: brand.officialName,
    template: `%s · ${brand.officialName}`,
  },
  description: brand.direction,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={brand.locale}
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
