import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { ptBR } from "./pt-BR";

const dictionaries: Record<Locale, Dictionary> = { en, es, "pt-BR": ptBR };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Replaces {placeholders} in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
