import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCircle, processIcons } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, container, SectionHeading } from "@/components/ui";
import { getMedia, getProject } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { toView } from "@/lib/view";

export async function generateMetadata({ params }: PageProps<"/[lang]/process">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDictionary(lang).meta.process;
  return pageMetadata(lang, "/process", m.title, m.description);
}

/** Representative visual for each stage, built from real project material. */
function StageVisual({ stage, dict }: { stage: string; dict: Dictionary }) {
  const morrow = getMedia("morrow");
  const kanso = getMedia("kanso");
  const aera = getMedia("aera");
  const step = dict.processSteps.find((s) => s.key === stage)!;

  switch (stage) {
    case "brief":
      return (
        <div className="fabric rotate-[-1.5deg] rounded-[1.5rem] bg-pearl p-6 shadow-lift ring-1 ring-line sm:p-8">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-display text-xl">{step.long}</span>
            <span aria-hidden="true" className="size-3 rounded-full bg-coral" />
          </div>
          <ul className="mt-4 space-y-3">
            {step.points.map((p, i) => (
              <li key={p} className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-bold text-ink">{p}</span>
                <span aria-hidden="true" className="h-2.5 flex-1 rounded-full bg-stone" style={{ maxWidth: `${88 - i * 11}%` }} />
              </li>
            ))}
          </ul>
        </div>
      );
    case "direction":
      return (
        <div className="grid grid-cols-3 gap-3">
          {morrow.details.map((d) => (
            <div key={d.src} className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-stone shadow-soft first:rounded-t-[999px]">
              <Image src={d.src} fill alt="" sizes="(min-width: 1024px) 14vw, 30vw" quality={70} className="object-cover" />
            </div>
          ))}
          <ul aria-hidden="true" className="col-span-3 flex overflow-hidden rounded-full ring-1 ring-line">
            {morrow.palette.map((hex) => (
              <li key={hex} className="h-12 flex-1" style={{ background: hex }} />
            ))}
          </ul>
        </div>
      );
    case "production":
      return (
        <div className="relative">
          <div aria-hidden="true" className="absolute -right-3 -top-3 h-full w-full rounded-[1.75rem] border-2 border-cobalt/25" />
          <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] bg-stone shadow-deep">
            <Image src={aera.still.src} fill alt="" sizes="(min-width: 1024px) 42vw, 92vw" quality={75} className="object-cover" />
          </div>
        </div>
      );
    case "refinement":
      return (
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {["/media/breakdown/morrow-skin.jpg", "/media/breakdown/morrow-fabric.jpg", "/media/breakdown/morrow-light.jpg"].map((src, i) => (
            <div
              key={src}
              className={`relative aspect-square overflow-hidden rounded-full bg-stone shadow-lift ring-4 ring-pearl ${i === 1 ? "w-[38%]" : "w-[28%]"}`}
            >
              <Image src={src} fill alt="" sizes="(min-width: 1024px) 16vw, 36vw" quality={75} className="object-cover" />
            </div>
          ))}
        </div>
      );
    default:
      // Delivery: one approved image prepared for several formats
      return (
        <div className="flex items-end justify-center gap-3 sm:gap-4">
          {[
            ["16:9", "aspect-video w-[40%]"],
            ["1:1", "aspect-square w-[22%]"],
            ["4:5", "aspect-[4/5] w-[19%]"],
            ["9:16", "aspect-[9/16] w-[14%]"],
          ].map(([label, cls]) => (
            <figure key={label} className={cls.split(" ")[1]}>
              <div className={`relative overflow-hidden rounded-[0.9rem] bg-stone shadow-soft ring-1 ring-line ${cls.split(" ")[0]}`}>
                <Image src={kanso.still.src} fill alt="" sizes="(min-width: 1024px) 18vw, 40vw" quality={70} className="object-cover" style={{ objectPosition: "72% 55%" }} />
              </div>
              <figcaption className="mt-2 text-center text-xs font-bold text-muted">{label}</figcaption>
            </figure>
          ))}
        </div>
      );
  }
}

const EXAMPLES: Record<string, string> = {
  brief: "meridian",
  direction: "morrow",
  production: "aera",
  refinement: "morrow",
  delivery: "kanso",
};

export default async function ProcessPage({ params }: PageProps<"/[lang]/process">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const pr = dict.process;

  return (
    <>
      <div className={`${container} pt-10 sm:pt-16`}>
        <SectionHeading as="h1" eyebrow={pr.eyebrow} title={pr.title} intro={pr.intro} />

        {/* Diagram */}
        <ol aria-label={pr.diagramLabel} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:items-center xl:gap-0">
          {dict.processSteps.map((s, i) => (
            <li key={s.key} className="flex min-w-0 items-center gap-3 xl:flex-1">
              <a
                href={`#stage-${s.key}`}
                className="flex min-h-14 flex-1 items-center gap-3 rounded-full bg-pearl/90 py-2 pl-2 pr-5 font-bold shadow-soft ring-1 ring-line transition-colors hover:bg-graphite hover:text-pearl"
              >
                <span aria-hidden="true" className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-graphite text-pearl">
                  {i + 1}
                </span>
                {s.title}
              </a>
              {i < dict.processSteps.length - 1 && (
                <ArrowRight aria-hidden="true" className="hidden size-5 shrink-0 text-muted xl:mx-2 xl:block" />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className={`${container} mt-16 space-y-20 pb-10 sm:mt-24 sm:space-y-28`}>
        {dict.processSteps.map((s, i) => {
          const example = toView(getProject(EXAMPLES[s.key])!, lang);
          const flip = i % 2 === 1;
          return (
            <section key={s.key} id={`stage-${s.key}`} aria-labelledby={`stage-${s.key}-title`} className="scroll-mt-28">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <IconCircle icon={processIcons[s.key]} tone={(["sage", "coral", "cobalt", "pearl", "graphite"] as const)[i]} />
                    <span className="font-display text-[clamp(3rem,6vw,5rem)] leading-none text-stone-deep">0{i + 1}</span>
                  </div>
                  <h2 id={`stage-${s.key}-title`} className="font-display mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.05]">
                    {s.long}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink sm:text-xl">{s.body}</p>
                  <div className="mt-6 rounded-[1.25rem] border-2 border-graphite/12 p-5">
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{pr.clientValue}</h3>
                    <p className="mt-2 text-lg font-semibold text-graphite">{s.value}</p>
                  </div>
                  <h3 className="sr-only">{pr.includes}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full bg-stone px-4 py-2 text-sm font-semibold text-ink">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-muted">
                    {pr.example}{" "}
                    <Link href={example.href} className="inline-block py-2.5 font-bold text-graphite underline decoration-coral decoration-2 underline-offset-4">
                      {example.name} — {example.title}
                    </Link>
                  </p>
                </Reveal>
                <Reveal delay={0.1} className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
                  <StageVisual stage={s.key} dict={dict} />
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <div className={`${container} flex flex-wrap gap-3 pb-24 pt-10`}>
        <ButtonLink href={`/${lang}/work`}>{dict.common.exploreWork}</ButtonLink>
        <ButtonLink href={`/${lang}/expertise`} variant="secondary">
          {dict.common.discoverExpertise}
        </ButtonLink>
      </div>
    </>
  );
}
