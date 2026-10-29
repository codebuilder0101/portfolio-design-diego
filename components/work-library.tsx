"use client";

import { AnimatePresence, m } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories, type Category } from "@/data/projects";
import { fill } from "@/lib/i18n/dictionaries";
import type { ProjectView } from "@/lib/view";
import { useI18n } from "./i18n-provider";
import { ProjectCard, type CardVariant } from "./project-card";

type Filter = "all" | Category;
const FILTERS: Filter[] = ["all", ...categories];
/** Fashion and mobile work gets tall portrait cards. */
const PORTRAIT = new Set(["morrow", "thread", "nova", "paws-and-play"]);

function layoutFor(p: ProjectView, index: number): { variant: CardVariant; className: string; sizes: string } {
  if (PORTRAIT.has(p.slug)) return { variant: "portrait", className: "lg:row-span-2", sizes: "(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" };
  if (index % 7 === 0) return { variant: "wide", className: "sm:col-span-2", sizes: "(min-width: 1024px) 64vw, 100vw" };
  return { variant: "editorial", className: "", sizes: "(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" };
}

/** Reads a filter shared via ?category= (also kept across language switches). */
export function WorkLibraryFromParams({ items }: { items: ProjectView[] }) {
  const q = useSearchParams().get("category");
  const initial = q && (FILTERS as string[]).includes(q) ? (q as Filter) : "all";
  return <WorkLibrary items={items} initial={initial} />;
}

export function WorkLibrary({ items, initial = "all" }: { items: ProjectView[]; initial?: Filter }) {
  const { dict } = useI18n();
  const [filter, setFilter] = useState<Filter>(initial);

  const choose = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", f);
    window.history.replaceState(window.history.state, "", url);
  };

  const visible = filter === "all" ? items : items.filter((p) => p.categories.includes(filter));
  const count = (f: Filter) => (f === "all" ? items.length : items.filter((p) => p.categories.includes(f)).length);

  return (
    <div>
      <div role="group" aria-label={dict.work.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => choose(f)}
              className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-5 text-[0.95rem] font-bold transition-[background-color,color,box-shadow] duration-200 ${
                active ? "bg-graphite text-pearl shadow-soft" : "bg-pearl/80 text-ink ring-1 ring-line hover:ring-graphite/40"
              }`}
            >
              {dict.categories[f]}
              <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-pearl/20" : "bg-stone"}`}>{count(f)}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-6 text-sm font-semibold text-muted">
        {visible.length === 1 ? dict.work.showingOne : fill(dict.work.showing, { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-graphite/25 p-10 text-center">
          <h2 className="font-display text-2xl font-medium">{dict.work.empty.title}</h2>
          <p className="mt-2 text-ink">{dict.work.empty.body}</p>
          <button type="button" onClick={() => choose("all")} className="mt-6 min-h-12 rounded-full bg-graphite px-6 font-bold text-pearl hover:bg-cobalt">
            {dict.work.empty.reset}
          </button>
        </div>
      ) : (
        <m.ul layout className="mt-8 grid grid-flow-dense gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => {
              const l = layoutFor(p, i);
              return (
                <m.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                  className={l.className}
                >
                  <ProjectCard project={p} variant={l.variant} sizes={l.sizes} headingLevel="h2" priority={i < 2} summaryFromSm />
                </m.li>
              );
            })}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}
