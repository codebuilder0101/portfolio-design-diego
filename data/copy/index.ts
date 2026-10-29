import type { Locale } from "@/lib/i18n/config";
import { en } from "./en";
import { es } from "./es";
import { ptBR } from "./pt-BR";
import type { ProjectCopy } from "./types";

const maps = { en, es, "pt-BR": ptBR } satisfies Record<Locale, Record<string, ProjectCopy>>;

export function getProjectCopy(locale: Locale, slug: string): ProjectCopy {
  return maps[locale][slug] ?? en[slug];
}

export type { ProjectCopy };
