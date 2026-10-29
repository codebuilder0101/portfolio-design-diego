"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectView } from "@/lib/view";
import { useI18n } from "./i18n-provider";
import { PreviewButton } from "./preview-button";
import { ConceptBadge } from "./ui";

export type CardVariant = "editorial" | "portrait" | "arch" | "wide" | "compact";

const frame: Record<CardVariant, string> = {
  editorial: "aspect-[3/2] rounded-[1.75rem]",
  portrait: "aspect-[4/5] rounded-[1.75rem]",
  arch: "aspect-[4/5] rounded-t-[999px] rounded-b-[1.75rem]",
  wide: "aspect-[16/9] rounded-[1.75rem]",
  compact: "aspect-[4/3] rounded-[1.25rem]",
};

/** Used with `uniformBelowLg`: every card shares a 4:3 frame until the asymmetric desktop grid takes over. */
const frameLg: Record<CardVariant, string> = {
  editorial: "aspect-[4/3] rounded-[1.75rem] lg:aspect-[3/2]",
  portrait: "aspect-[4/3] rounded-[1.75rem] lg:aspect-[4/5]",
  arch: "aspect-[4/3] rounded-[1.75rem] lg:aspect-[4/5] lg:rounded-t-[999px]",
  wide: "aspect-[4/3] rounded-[1.75rem] lg:aspect-[16/9]",
  compact: "aspect-[4/3] rounded-[1.25rem]",
};

export function ProjectCard({
  project,
  variant = "editorial",
  sizes,
  priority = false,
  headingLevel: H = "h3",
  showSummary = true,
  showPreview = true,
  uniformBelowLg = false,
  summaryFromSm = false,
  className = "",
}: {
  project: ProjectView;
  variant?: CardVariant;
  sizes: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  showSummary?: boolean;
  showPreview?: boolean;
  /** Same frame shape for every card below 1024px so two-column grids line up. */
  uniformBelowLg?: boolean;
  /** Hide the summary on phones to keep long lists scannable. */
  summaryFromSm?: boolean;
  className?: string;
}) {
  const { dict } = useI18n();
  const tall = variant === "portrait" || variant === "arch";

  return (
    <article className={`group/card flex flex-col ${className}`}>
      <Link
        href={project.href}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block overflow-hidden bg-stone shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-300 ease-out group-hover/card:-translate-y-1 group-hover/card:shadow-lift ${uniformBelowLg ? frameLg[variant] : frame[variant]}`}
      >
        <Image
          src={project.still.src}
          width={project.still.width}
          height={project.still.height}
          alt=""
          sizes={sizes}
          priority={priority}
          quality={80}
          style={{ objectPosition: tall ? project.focus : undefined }}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.035]"
        />
        <span className={`absolute left-4 ${variant !== "arch" ? "top-4" : uniformBelowLg ? "top-4 lg:top-auto lg:bottom-4" : "bottom-4"}`}>
          <ConceptBadge label={project.status === "concept" ? dict.common.concept : dict.common.commissioned} />
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${variant === "compact" ? "pt-4" : "pt-5"}`}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{project.area}</p>
          <span aria-hidden="true" className="font-display text-sm text-muted">
            {project.number}
          </span>
        </div>
        <H className={`font-display mt-2 font-medium leading-tight text-graphite ${variant === "compact" ? "text-xl" : "text-[clamp(1.45rem,2vw,1.9rem)]"}`}>
          <Link href={project.href} className="decoration-coral decoration-2 underline-offset-[6px] hover:underline">
            {project.name}
            <span className="text-muted"> — {project.title}</span>
          </Link>
        </H>
        {showSummary && <p className={`mt-3 max-w-xl leading-relaxed text-ink ${summaryFromSm ? "hidden sm:block" : ""}`}>{project.summary}</p>}
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          {project.categories.map((c) => (
            <li key={c} className="after:ml-3 after:text-stone-deep after:content-['/'] last:after:content-none">
              {dict.categories[c]}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Link
            href={project.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-graphite px-4 text-sm font-bold text-pearl transition-colors duration-200 hover:bg-cobalt"
          >
            {dict.common.viewCaseStudy}
            <span className="sr-only">: {project.name}</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          {showPreview && <PreviewButton project={project} />}
        </div>
      </div>
    </article>
  );
}
