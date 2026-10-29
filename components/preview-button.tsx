"use client";

import { ArrowRight, Eye, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { ProjectView } from "@/lib/view";
import { useI18n } from "./i18n-provider";
import { MotionPlayer } from "./motion-player";
import { ConceptBadge } from "./ui";

/**
 * "Preview" action on project cards: opens an accessible modal (native <dialog>) with the still and
 * the animated preview. Escape and the backdrop close it; focus returns to the trigger.
 */
export function PreviewButton({ project, className = "" }: { project: ProjectView; className?: string }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"still" | "motion">("still");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = dialogRef.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  const close = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setView("still");
          setOpen(true);
        }}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold text-graphite ring-1 ring-graphite/15 transition-colors duration-200 hover:bg-graphite hover:text-pearl ${className}`}
      >
        <Eye aria-hidden="true" className="size-4" />
        {dict.common.preview}
        <span className="sr-only">: {project.name}</span>
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          onClick={(e) => {
            if (e.target === dialogRef.current) close();
          }}
          className="m-auto max-h-[calc(100dvh-2rem)] w-[min(72rem,calc(100vw-2rem))] overflow-y-auto rounded-[2rem] bg-ivory p-0 text-graphite shadow-deep backdrop:bg-graphite/55 backdrop:backdrop-blur-[2px] open:animate-[fade-scale_0.28s_var(--ease-out-soft)]"
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <ConceptBadge label={dict.common.concept} />
                <h2 id={titleId} className="font-display mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-tight">
                  {project.name} <span className="text-muted">— {project.title}</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={dict.common.close}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-pearl ring-1 ring-line transition-colors hover:bg-graphite hover:text-pearl"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div role="group" aria-label={dict.modal.viewSwitch} className="mt-5 inline-flex rounded-full bg-stone p-1">
              {(["still", "motion"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`min-h-11 rounded-full px-5 text-sm font-bold transition-colors duration-200 ${
                    view === v ? "bg-graphite text-pearl" : "text-ink hover:bg-pearl"
                  }`}
                >
                  {dict.modal[v]}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {view === "still" ? (
                <figure>
                  <Image
                    src={project.still.src}
                    width={project.still.width}
                    height={project.still.height}
                    alt={project.alt}
                    sizes="(min-width: 1200px) 1100px, 94vw"
                    quality={80}
                    className="h-auto w-full rounded-[1.5rem] ring-1 ring-line"
                  />
                  <figcaption className="mt-3 text-sm text-muted">{dict.common.aiConcept}</figcaption>
                </figure>
              ) : (
                <MotionPlayer
                  name={project.name}
                  still={project.still}
                  video={project.video}
                  alt={project.alt}
                  sizes="(min-width: 1200px) 1100px, 94vw"
                  autoStart
                  frameClassName="aspect-[3/2]"
                />
              )}
            </div>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl text-lg leading-relaxed text-ink">{project.summary}</p>
              <Link
                href={project.href}
                className="group inline-flex min-h-12 shrink-0 items-center gap-3 self-start rounded-full bg-graphite px-6 font-bold text-pearl transition-colors hover:bg-cobalt"
              >
                {dict.common.viewCaseStudy}
                <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
