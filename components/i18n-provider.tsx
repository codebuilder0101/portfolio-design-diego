"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type I18n = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18n | null>(null);

/** Animation features load after hydration, keeping them out of the critical bundle. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function I18nProvider({ locale, dict, children }: I18n & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
