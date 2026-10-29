"use client";

import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "./i18n-provider";
import { LanguageSwitcher } from "./language-switcher";
import { LogoMark, Wordmark } from "./logo";
import { WorkanaLink } from "./workana-link";

const NAV = ["home", "about", "work", "expertise", "process"] as const;
const routeFor = (key: (typeof NAV)[number]) => (key === "home" ? "" : `/${key}`);

export function SiteHeader() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu on route change (e.g. after choosing a link)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.documentElement.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel) {
        // Keep focus inside the toggle + menu panel while the menu is open
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1280 && close(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const isActive = (key: (typeof NAV)[number]) => {
    const href = `/${locale}${routeFor(key)}`;
    return key === "home" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "glass border-b border-line shadow-[0_10px_30px_-20px_rgb(29_31_34/0.35)]"
          : "border-b border-transparent bg-ivory/0"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[110rem] items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-10">
        <Link
          href={`/${locale}`}
          aria-label={dict.nav.homeLink}
          className="group -ml-1 flex min-h-11 min-w-0 items-center gap-2.5 rounded-full pr-2 sm:gap-3"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pearl text-graphite shadow-soft ring-1 ring-line transition-transform duration-300 group-hover:-rotate-6 lg:size-14">
            <LogoMark className="size-7 sm:size-8 lg:size-9" />
          </span>
          <Wordmark className="whitespace-nowrap text-[0.9rem] text-graphite sm:text-[0.95rem] lg:text-[1.05rem]" />
        </Link>

        <nav aria-label={dict.nav.primary} className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-1 2xl:gap-2">
            {NAV.map((key) => {
              const active = isActive(key);
              return (
                <li key={key}>
                  <Link
                    href={`/${locale}${routeFor(key)}`}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex h-12 items-center rounded-full px-4 text-[1.0625rem] font-bold transition-colors duration-200 2xl:px-5 ${
                      active ? "text-graphite" : "text-ink hover:bg-stone/70 hover:text-graphite"
                    }`}
                  >
                    {dict.nav[key]}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-1.5 h-[3px] rounded-full bg-coral transition-transform duration-300 2xl:inset-x-5 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <LanguageSwitcher className="ml-auto hidden md:block xl:ml-2" />
        <div className="hidden shrink-0 sm:ml-auto sm:block md:ml-0">
          <WorkanaLink variant="compact" label="Workana" />
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          className="ml-auto grid size-12 shrink-0 place-items-center rounded-full bg-graphite text-pearl shadow-soft transition-transform duration-200 active:scale-95 sm:ml-0 xl:hidden"
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.primary}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            // The glass header (backdrop-filter) is the containing block for this fixed panel, so size it to the viewport explicitly
            className="fixed inset-x-0 top-full h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain border-t border-line bg-ivory px-4 pb-10 pt-6 sm:px-6 xl:hidden"
          >
            <nav aria-label={dict.nav.primary}>
              <ul className="flex flex-col">
                {NAV.map((key, i) => {
                  const active = isActive(key);
                  return (
                    <m.li
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                      className="border-b border-line"
                    >
                      <Link
                        href={`/${locale}${routeFor(key)}`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => close(false)}
                        className="flex min-h-16 items-center justify-between py-3 font-display text-[clamp(1.9rem,8vw,2.6rem)] font-medium"
                      >
                        {dict.nav[key]}
                        <span
                          aria-hidden="true"
                          className={`size-3 rounded-full ${active ? "bg-coral" : "bg-transparent ring-1 ring-line"}`}
                        />
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
            </nav>
            <WorkanaLink className="mt-8 w-full sm:w-auto" />
            <LanguageSwitcher className="mt-6 w-fit md:hidden" onSwitch={() => close(false)} />
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
