"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { person } from "@/lib/site";
import { WorkanaLink } from "./workana-link";
import { fill } from "@/lib/i18n/dictionaries";
import { useI18n } from "./i18n-provider";
import { LanguageSwitcher } from "./language-switcher";
import { LogoMark, Wordmark } from "./logo";

const LINKS = [
  ["home", ""],
  ["about", "/about"],
  ["work", "/work"],
  ["expertise", "/expertise"],
  ["process", "/process"],
] as const;

export function SiteFooter() {
  const { locale, dict } = useI18n();
  return (
    <footer className="fabric border-t border-line bg-stone/60">
      <div className="mx-auto grid max-w-[110rem] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:px-10 lg:py-20">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-pearl text-graphite ring-1 ring-line">
              <LogoMark className="size-8" />
            </span>
            <Wordmark className="text-base" />
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink">{dict.footer.statement}</p>
          {/* Photo + text on one row, button on its own row, so the text never gets squeezed */}
          <div className="mt-6 rounded-[1.5rem] bg-pearl/80 p-5 ring-1 ring-line">
            <div className="flex items-center gap-4">
              <Image
                src={person.headshot.src}
                width={person.headshot.width}
                height={person.headshot.height}
                alt=""
                sizes="56px"
                quality={80}
                className="size-14 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold leading-snug text-graphite">{dict.about.workanaTitle}</p>
                <p className="mt-0.5 text-sm leading-snug text-muted">{dict.about.workanaBody}</p>
              </div>
            </div>
            <WorkanaLink variant="compact" className="mt-4 w-full" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{dict.footer.note}</p>
        </div>

        <nav aria-label={dict.footer.nav}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-2">
            {LINKS.map(([key, path]) => (
              <li key={key}>
                <Link
                  href={`/${locale}${path}`}
                  className="flex min-h-11 items-center text-[1.0625rem] font-bold text-ink underline-offset-4 hover:text-graphite hover:underline"
                >
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
          <LanguageSwitcher />
          <a
            href="#main"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-line transition-colors hover:bg-pearl"
          >
            <ArrowUp aria-hidden="true" className="size-4" />
            {dict.footer.top}
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[110rem] px-4 py-6 text-sm text-muted sm:px-6 lg:px-10">
          {fill(dict.footer.rights, { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
