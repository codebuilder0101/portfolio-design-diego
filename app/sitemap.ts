import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo";

/** Lists every localized page — only when NEXT_PUBLIC_SITE_URL provides the real domain. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const paths = ["", "/work", "/expertise", "/process", "/about", ...projects.map((p) => `/work/${p.slug}`)];
  return paths.map((path) => ({
    url: `${siteUrl}/${defaultLocale}${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
  }));
}
