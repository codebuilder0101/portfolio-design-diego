export const locales = ["pt-BR", "es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";

/** Cookie that records an explicit language choice made with the PT | ES | EN toggle. */
export const LOCALE_COOKIE = "fm_locale";

export const localeLabels: Record<Locale, { short: string; name: string; og: string }> = {
  "pt-BR": { short: "PT", name: "Português (Brasil)", og: "pt_BR" },
  es: { short: "ES", name: "Español", og: "es_ES" },
  en: { short: "EN", name: "English", og: "en_US" },
};

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Swaps the locale prefix of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] && hasLocale(parts[1])) parts[1] = next;
  else parts.splice(1, 0, next);
  return parts.join("/") || `/${next}`;
}
