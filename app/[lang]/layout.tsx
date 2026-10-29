import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { hasLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteUrl } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    ...(siteUrl && { metadataBase: new URL(siteUrl) }),
    applicationName: dict.meta.siteName,
    title: { default: dict.meta.home.title, template: `%s · ${dict.meta.siteName}` },
    description: dict.meta.home.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        <I18nProvider locale={lang} dict={dict}>
          <a
            href="#main"
            className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-graphite px-5 py-3 font-semibold text-pearl"
          >
            {dict.nav.skip}
          </a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
