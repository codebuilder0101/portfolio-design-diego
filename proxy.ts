import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE } from "@/lib/i18n/config";

/**
 * Sends locale-less URLs to a localized route:
 * 1. a saved explicit choice (cookie set by the PT | ES | EN toggle)
 * 2. otherwise Portuguese (Brazil), the site's default language
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = saved && hasLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  // Skip Next internals and any file with an extension (media, icons, robots.txt…)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
