"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useI18n } from "./i18n-provider";

/** Hotspots on the Morrow still (percent of width/height) matched to the crops made by build-media. */
const POINTS = [
  { key: "skin", x: 38, y: 7, crop: "/media/breakdown/morrow-skin.jpg" },
  { key: "fabric", x: 31, y: 36, crop: "/media/breakdown/morrow-fabric.jpg" },
  { key: "light", x: 13, y: 74, crop: "/media/breakdown/morrow-light.jpg" },
  { key: "type", x: 75, y: 26, crop: "/media/breakdown/morrow-type.jpg" },
] as const;
type Key = (typeof POINTS)[number]["key"];

/**
 * Honest replacement for a before/after slider: no authentic source/edited pair exists, so the
 * viewer inspects real details of the finished concept instead. Tabs follow the WAI-ARIA pattern
 * (arrow keys, Home/End); hotspots on the image are pointer/touch shortcuts to the same tabs.
 */
export function EditingBreakdown({ still, alt }: { still: { src: string; width: number; height: number }; alt: string }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<Key>("skin");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const t = dict.home.breakdown.points;
  const current = POINTS.find((p) => p.key === active)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = -1;
    if (e.key in map) next = (i + map[e.key] + POINTS.length) % POINTS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = POINTS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(POINTS[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="relative lg:col-span-7">
        <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift ring-1 ring-line">
          <Image src={still.src} width={still.width} height={still.height} alt={alt} sizes="(min-width: 1024px) 56vw, 100vw" quality={80} className="h-auto w-full" />
          {POINTS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setActive(p.key)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={`absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-extrabold shadow-lift ring-2 transition-[transform,background-color] duration-200 hover:scale-110 ${
                active === p.key ? "scale-110 bg-coral text-graphite ring-pearl" : "bg-pearl/90 text-graphite ring-pearl/60"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div role="tablist" aria-label={dict.home.breakdown.listLabel} aria-orientation="vertical" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          {POINTS.map((p, i) => {
            const selected = active === p.key;
            return (
              <button
                key={p.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${base}-tab-${p.key}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(p.key)}
                onKeyDown={(e) => onKey(e, i)}
                className={`flex min-h-12 items-center gap-3 rounded-full px-4 py-2 text-left text-sm font-bold transition-colors duration-200 ${
                  selected ? "bg-graphite text-pearl" : "bg-pearl text-ink ring-1 ring-line hover:ring-graphite/40"
                }`}
              >
                <span aria-hidden="true" className={`grid size-7 shrink-0 place-items-center rounded-full text-xs ${selected ? "bg-coral text-graphite" : "bg-stone"}`}>
                  {i + 1}
                </span>
                {t[p.key].tag}
              </button>
            );
          })}
        </div>

        <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr] lg:grid-cols-1 xl:grid-cols-[minmax(0,13rem)_1fr]"
            >
              <div className="relative aspect-square w-full max-w-56 overflow-hidden rounded-full shadow-lift ring-4 ring-pearl">
                <Image src={current.crop} fill alt="" sizes="(min-width: 640px) 14rem, 60vw" quality={80} className="object-cover" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium leading-tight">{t[active].title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink">{t[active].body}</p>
              </div>
            </m.div>
          </AnimatePresence>
        </div>
        <p className="mt-6 border-l-2 border-coral pl-4 text-sm leading-relaxed text-muted">{dict.home.breakdown.honesty}</p>
      </div>
    </div>
  );
}
