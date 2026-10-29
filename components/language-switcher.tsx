"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, LOCALE_COOKIE, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";

function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    // Storage can be unavailable (private mode); the cookie still records the choice.
  }
}

/** Segmented PT | ES | EN toggle. Keeps the current page, filter and hash when switching. */
export function LanguageSwitcher({ className = "", onSwitch }: { className?: string; onSwitch?: () => void }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();

  return (
    <nav aria-label={dict.nav.language} className={className}>
      <ul className="flex items-center rounded-full border border-line bg-pearl/80 p-1 shadow-[inset_0_1px_2px_rgb(29_31_34/0.06)]">
        {locales.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <Link
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                lang={l}
                scroll={false}
                aria-current={active ? "true" : undefined}
                title={localeLabels[l].name}
                onClick={(e) => {
                  remember(l);
                  // Preserve query (e.g. an active filter) and hash across the switch
                  const extra = window.location.search + window.location.hash;
                  if (extra) {
                    e.preventDefault();
                    window.location.assign(switchLocalePath(pathname, l) + extra);
                  }
                  onSwitch?.();
                }}
                className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-bold tracking-[0.08em] transition-colors duration-200 ${
                  active ? "bg-graphite text-pearl" : "text-ink hover:bg-stone"
                }`}
              >
                <span aria-hidden="true">{localeLabels[l].short}</span>
                <span className="sr-only">{localeLabels[l].name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
