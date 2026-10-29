import { Aperture, Clapperboard, Orbit } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EditingBreakdown } from "@/components/editing-breakdown";
import { capabilityIcons, IconCircle } from "@/components/icons";
import { MotionPlayer } from "@/components/motion-player";
import { ProjectCard, type CardVariant } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, container, Eyebrow, SectionHeading } from "@/components/ui";
import { featuredSlugs, getProject, motionShowcaseSlugs, projects } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { person } from "@/lib/site";
import { toView } from "@/lib/view";
import { WorkanaLink } from "@/components/workana-link";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDictionary(lang).meta.home;
  return pageMetadata(lang, "", m.title, m.description, { absoluteTitle: true });
}

/** Varied proportions for the six featured projects, placed on a 12-column grid. */
const FEATURED_LAYOUT: { variant: CardVariant; className: string; sizes: string }[] = [
  { variant: "wide", className: "lg:col-span-7", sizes: "(min-width: 1024px) 56vw, (min-width: 768px) 48vw, 100vw" },
  { variant: "arch", className: "lg:col-span-5 lg:mt-28 lg:px-6", sizes: "(min-width: 1024px) 38vw, (min-width: 768px) 48vw, 100vw" },
  { variant: "portrait", className: "lg:col-span-4", sizes: "(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 100vw" },
  { variant: "editorial", className: "lg:col-span-8 lg:mt-16", sizes: "(min-width: 1024px) 64vw, (min-width: 768px) 48vw, 100vw" },
  { variant: "editorial", className: "lg:col-span-6", sizes: "(min-width: 768px) 48vw, 100vw" },
  { variant: "editorial", className: "lg:col-span-6 lg:mt-20", sizes: "(min-width: 768px) 48vw, 100vw" },
];

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const h = dict.home;
  const view = (slug: string) => toView(getProject(slug)!, lang);
  const heroMain = view("fieldnote");
  const heroSide = view("morrow");
  const featured = featuredSlugs.map(view);
  const [motionLead, ...motionRest] = motionShowcaseSlugs.map(view);

  return (
    <>
      {/* A. Hero — bounded to the viewport on large screens, natural flow everywhere else */}
      <section aria-labelledby="hero-title" className="relative">
        <div
          className={`${container} grid items-center gap-10 py-10 sm:py-14 lg:h-[calc(100svh-var(--header-h)-1px)] lg:max-h-[58rem] lg:min-h-[36rem] lg:grid-cols-12 lg:gap-12 lg:py-8`}
        >
          <div className="lg:col-span-5">
            <div className="lift mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={person.headshot.src}
                  width={person.headshot.width}
                  height={person.headshot.height}
                  alt=""
                  priority
                  sizes="56px"
                  quality={80}
                  className="size-14 rounded-full object-cover shadow-soft ring-4 ring-pearl"
                />
                <p className="leading-tight">
                  <span className="block font-bold text-graphite">{person.name}</span>
                  <span className="block text-sm font-semibold text-muted">{dict.common.experience}</span>
                </p>
              </div>
              <WorkanaLink variant="compact" />
            </div>
            <p className="lift text-sm font-bold uppercase tracking-[0.14em] text-sage-deep">{h.hero.eyebrow}</p>
            <h1
              id="hero-title"
              className="font-display mt-5 text-[clamp(2.7rem,min(5.4vw,9vh),5.6rem)] font-medium leading-[0.98] text-graphite"
            >
              <span className="lift block" style={{ "--d": "80ms" } as React.CSSProperties}>
                {h.hero.titleA}
              </span>
              <span className="lift block italic text-cobalt" style={{ "--d": "180ms" } as React.CSSProperties}>
                {h.hero.titleB}
              </span>
            </h1>
            <p className="lift mt-6 max-w-xl text-lg leading-relaxed text-ink sm:text-xl" style={{ "--d": "280ms" } as React.CSSProperties}>
              {h.hero.body}
            </p>
            <div className="lift mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--d": "380ms" } as React.CSSProperties}>
              <ButtonLink href={`/${lang}/work`}>{dict.common.exploreWork}</ButtonLink>
              <ButtonLink href="#highlights" variant="secondary">
                {dict.common.watchHighlights}
              </ButtonLink>
            </div>
          </div>

          <div className="relative lg:col-span-7 lg:h-full lg:max-h-[46rem]">
            <div className="relative aspect-[5/4] w-full sm:aspect-[16/12] lg:aspect-auto lg:h-full">
              {/* Dimensional outline frame behind the main image */}
              <div aria-hidden="true" className="absolute right-[-2%] top-[1%] h-[78%] w-[84%] rounded-[2.25rem] border-2 border-cobalt/25" />

              <div className="fade-scale absolute right-[3%] top-[6%] h-[76%] w-[84%] overflow-hidden rounded-[2rem] bg-stone shadow-deep ring-1 ring-line">
                <Image
                  src={heroMain.still.src}
                  fill
                  priority
                  fetchPriority="high"
                  alt={heroMain.alt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={80}
                  className="object-cover"
                  style={{ objectPosition: "45% 50%" }}
                />
                {/* Glass timeline panel: a nod to the edit, labelled honestly */}
                <div className="glass absolute bottom-3 left-[30%] right-3 rounded-[1.25rem] px-4 py-3 ring-1 ring-pearl/50 sm:bottom-5 sm:right-5 sm:px-5">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold sm:text-sm">
                    <span className="hidden truncate text-graphite xs:inline">
                      {heroMain.name} — {heroMain.title}
                    </span>
                    <span className="shrink-0 uppercase tracking-[0.1em] text-sage-deep">{dict.common.concept}</span>
                  </div>
                  <div aria-hidden="true" className="relative mt-2.5 hidden h-6 sm:block">
                    <div className="absolute inset-y-1 left-0 right-0 flex gap-1">
                      <span className="h-full flex-[3] rounded-md bg-cobalt/25" />
                      <span className="h-full flex-[2] rounded-md bg-coral/30" />
                      <span className="h-full flex-[4] rounded-md bg-sage-deep/30" />
                      <span className="h-full flex-[2] rounded-md bg-cobalt/20" />
                    </div>
                    <span className="absolute -top-0.5 bottom-[-2px] left-[4%] w-[3px] animate-[playhead_2.6s_var(--ease-out-soft)_0.6s_both] rounded-full bg-coral" />
                  </div>
                  <p aria-hidden="true" className="mt-1.5 hidden text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted sm:block">
                    {h.hero.timeline}
                  </p>
                </div>
              </div>

              <div
                className="fade-scale absolute bottom-0 left-0 aspect-[3/4] w-[32%] overflow-hidden rounded-b-[1.5rem] rounded-t-[999px] bg-stone shadow-deep ring-[6px] ring-ivory sm:ring-8"
                style={{ "--d": "200ms" } as React.CSSProperties}
              >
                <Image
                  src={heroSide.still.src}
                  fill
                  alt={heroSide.alt}
                  sizes="(min-width: 1024px) 20vw, 34vw"
                  quality={80}
                  className="object-cover"
                  style={{ objectPosition: "31% 30%" }}
                />
              </div>

              <div
                className="fade-scale glass absolute left-[2%] top-0 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 shadow-lift ring-1 ring-line sm:top-[2%]"
                style={{ "--d": "320ms" } as React.CSSProperties}
              >
                <span aria-hidden="true" className="flex -space-x-2">
                  <span className="grid size-8 place-items-center rounded-full bg-cobalt text-pearl ring-2 ring-pearl"><Aperture className="size-4" /></span>
                  <span className="grid size-8 place-items-center rounded-full bg-coral text-graphite ring-2 ring-pearl"><Clapperboard className="size-4" /></span>
                  <span className="grid size-8 place-items-center rounded-full bg-sage text-graphite ring-2 ring-pearl"><Orbit className="size-4" /></span>
                </span>
                <span className="text-sm font-bold text-graphite">{h.hero.badge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Selected work */}
      <section aria-labelledby="selected-title" className="pb-20 pt-10 sm:pb-28 sm:pt-16 lg:pt-28">
        <div className={container}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="selected-title" eyebrow={h.selected.eyebrow} title={h.selected.title} intro={h.selected.intro} />
            <ButtonLink href={`/${lang}/work`} variant="secondary" className="shrink-0 self-start md:self-end">
              {fill(dict.common.viewAll, { count: projects.length })}
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:grid-cols-12 lg:gap-x-12">
            {featured.map((p, i) => (
              <Reveal key={p.slug} className={FEATURED_LAYOUT[i].className} delay={(i % 2) * 0.08}>
                <ProjectCard project={p} variant={FEATURED_LAYOUT[i].variant} sizes={FEATURED_LAYOUT[i].sizes} uniformBelowLg />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* C. Editing breakdown (no authentic before/after pairs exist) */}
      <section aria-labelledby="breakdown-title" className="fabric border-y border-line bg-sage/50 py-20 sm:py-28">
        <div className={container}>
          <SectionHeading id="breakdown-title" eyebrow={h.breakdown.eyebrow} title={h.breakdown.title} intro={h.breakdown.intro} />
          <div className="mt-12">
            <EditingBreakdown still={heroSide.still} alt={heroSide.alt} />
          </div>
        </div>
      </section>

      {/* D. Capabilities */}
      <section aria-labelledby="capabilities-title" className="py-20 sm:py-28">
        <div className={container}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="capabilities-title" eyebrow={h.capabilities.eyebrow} title={h.capabilities.title} intro={h.capabilities.intro} />
            <ButtonLink href={`/${lang}/expertise`} variant="secondary" className="shrink-0 self-start md:self-end">
              {dict.common.discoverExpertise}
            </ButtonLink>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {Object.entries(h.capabilities.items).map(([key, item], i) => (
              <Reveal as="li" key={key} delay={(i % 4) * 0.06} className="h-full">
                <div className="flex h-full gap-5 rounded-[1.5rem] bg-pearl/80 p-6 shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift sm:flex-col sm:p-7">
                  <IconCircle icon={capabilityIcons[key]} tone={(["sage", "coral", "pearl", "sage"] as const)[i % 4]} />
                  <div>
                    <h3 className="text-xl font-bold leading-snug text-graphite">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* E. Motion & video */}
      <section id="highlights" aria-labelledby="motion-title" className="scroll-mt-24 bg-stone/70 py-20 sm:py-28">
        <div className={container}>
          <SectionHeading id="motion-title" eyebrow={h.motion.eyebrow} title={h.motion.title} intro={h.motion.intro} />
          <div className="mt-14 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <MotionPlayer
                name={motionLead.name}
                still={motionLead.still}
                video={motionLead.video}
                alt={motionLead.alt}
                sizes="(min-width: 1024px) 64vw, 100vw"
                frameClassName="aspect-[16/9]"
                showNote={false}
              />
              <p className="mt-4 text-lg font-bold">
                {motionLead.name} <span className="font-medium text-muted">— {motionLead.title}</span>
              </p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              {motionRest.slice(0, 2).map((p, i) => (
                <Reveal key={p.slug} delay={0.08 * (i + 1)}>
                  <MotionPlayer
                    name={p.name}
                    still={p.still}
                    video={p.video}
                    alt={p.alt}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    frameClassName="aspect-[16/10]"
                    showNote={false}
                  />
                  <p className="mt-3 font-bold">
                    {p.name} <span className="font-medium text-muted">— {p.title}</span>
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-10 max-w-2xl border-l-2 border-coral pl-4 text-muted">{dict.common.animatedPreviewNote}</p>
        </div>
      </section>

      {/* F. Process preview */}
      <section aria-labelledby="process-title" className="py-20 sm:py-28">
        <div className={container}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="process-title" eyebrow={h.process.eyebrow} title={h.process.title} intro={h.process.intro} />
            <ButtonLink href={`/${lang}/process`} variant="secondary" className="shrink-0 self-start md:self-end">
              {dict.common.seeProcess}
            </ButtonLink>
          </div>
          <ol className="relative mt-14 grid gap-4 md:grid-cols-5 md:gap-3">
            <span aria-hidden="true" className="absolute left-[2.25rem] top-6 hidden h-px w-[calc(100%-4.5rem)] bg-graphite/20 md:block" />
            {dict.processSteps.map((step, i) => (
              <Reveal as="li" key={step.key} delay={i * 0.07} className="relative">
                <div className="flex h-full gap-4 rounded-[1.5rem] border border-graphite/15 bg-ivory p-5 md:flex-col md:border-0 md:bg-transparent md:p-0">
                  <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-graphite font-display text-lg text-pearl ring-8 ring-ivory">
                    {i + 1}
                  </span>
                  <div className="md:pr-4">
                    <h3 className="text-lg font-bold text-graphite md:mt-2">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink">{step.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* G. Closing */}
      <section aria-labelledby="closing-title" className="pb-20 sm:pb-28">
        <div className={container}>
          <div className="fabric relative grid overflow-hidden rounded-[2.5rem] bg-sage/70 ring-1 ring-line lg:grid-cols-12">
            <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
              <Eyebrow>{h.closing.eyebrow}</Eyebrow>
              <h2 id="closing-title" className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05]">
                {h.closing.title}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink">{h.closing.body}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={`/${lang}/work`}>{dict.common.exploreWork}</ButtonLink>
                <ButtonLink href={`/${lang}/process`} variant="secondary">
                  {dict.common.seeProcess}
                </ButtonLink>
                <WorkanaLink />
              </div>
            </div>
            <div className="relative min-h-72 lg:col-span-5">
              {[view("hearth"), view("aera")].map((p, i) => (
                <div
                  key={p.slug}
                  className={`absolute overflow-hidden bg-stone shadow-deep ring-[6px] ring-pearl ${
                    i === 0
                      ? "bottom-[-12%] right-[8%] h-[95%] w-[52%] rounded-t-[999px]"
                      : "bottom-[10%] left-[8%] h-[52%] w-[40%] rounded-[1.5rem]"
                  }`}
                >
                  <Image src={p.still.src} fill alt="" sizes="(min-width: 1024px) 18vw, 45vw" quality={70} className="object-cover" style={{ objectPosition: p.focus }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
