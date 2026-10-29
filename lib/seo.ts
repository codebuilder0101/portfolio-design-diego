import type { Metadata } from "next";
import { defaultLocale, localeLabels, locales, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

/**
 * Real deployment origin, e.g. https://example.com. Canonical and hreflang URLs are emitted only
 * when this is set — no production URL is invented.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || null;

/** Builds localized page metadata. `path` is the route without the locale, e.g. "/work". */
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  { absoluteTitle = false, image }: { absoluteTitle?: boolean; image?: { url: string; alt: string; width: number; height: number } } = {},
): Metadata {
  const dict = getDictionary(locale);
  const ogImage = image ?? {
    url: `/og/og-${locale}.png`,
    width: 1200,
    height: 630,
    alt: `${dict.meta.siteName} — ${dict.meta.role}`,
  };
  const fullTitle = absoluteTitle ? title : `${title} · ${dict.meta.siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(siteUrl && {
      alternates: {
        canonical: `/${locale}${path}`,
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
          "x-default": `/${defaultLocale}${path}`,
        },
      },
    }),
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: fullTitle,
      description,
      locale: localeLabels[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeLabels[l].og),
      images: [ogImage],
      ...(siteUrl && { url: `/${locale}${path}` }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}
