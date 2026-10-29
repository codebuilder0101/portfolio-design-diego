import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionPlayer } from "@/components/motion-player";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, ConceptBadge, container, Eyebrow } from "@/components/ui";
import { getProjectCopy } from "@/data/copy";
import { getMedia, getProject, getRelated, projects } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { toView } from "@/lib/view";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  const dict = getDictionary(lang);
  const copy = getProjectCopy(lang, slug);
  const media = getMedia(slug);
  return pageMetadata(lang, `/work/${slug}`, fill(dict.meta.caseStudy, { name: project.name, title: copy.title }), copy.summary, {
    image: { url: media.still.src, width: media.still.width, height: media.still.height, alt: copy.alt },
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) notFound();

  const dict = getDictionary(lang);
  const cs = dict.caseStudy;
  const copy = getProjectCopy(lang, slug);
  const media = getMedia(slug);
  const variant = cs.variants[project.kind];
  const idx = projects.indexOf(project);
  const prev = toView(projects[(idx - 1 + projects.length) % projects.length], lang);
  const next = toView(projects[(idx + 1) % projects.length], lang);
  const related = getRelated(slug).map((p) => toView(p, lang));
  const isVideo = project.kind === "video";
  const showPalette = project.kind === "brand" || project.kind === "image" || project.kind === "3d";

  return (
    <article>
      {/* Header */}
      <header className={`${container} pt-8 sm:pt-12`}>
        <nav aria-label={cs.breadcrumb}>
          <Link
            href={`/${lang}/work`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-bold text-ink hover:text-graphite"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {cs.back}
          </Link>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <ConceptBadge label={project.status === "concept" ? dict.common.concept : dict.common.commissioned} />
              <span className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{copy.area}</span>
            </div>
            <h1 className="font-display mt-5 text-[clamp(2.8rem,7vw,6rem)] font-medium leading-[0.95]">
              {project.name}
              <span className="mt-2 block text-[0.5em] italic leading-tight text-cobalt">{copy.title}</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-xl leading-relaxed text-ink">{copy.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/${lang}/work?category=${c}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-graphite"
                  >
                    {dict.categories[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* Hero artwork or player */}
      <div className={`${container} mt-10 sm:mt-14`}>
        {isVideo ? (
          <MotionPlayer
            name={project.name}
            still={media.still}
            video={media.video}
            alt={copy.alt}
            sizes="(min-width: 1760px) 1680px, 96vw"
            priority
            frameClassName="aspect-[16/9]"
          />
        ) : (
          <figure>
            <div className="overflow-hidden rounded-[2rem] bg-stone shadow-deep ring-1 ring-line">
              <Image
                src={media.still.src}
                width={media.still.width}
                height={media.still.height}
                alt={copy.alt}
                sizes="(min-width: 1760px) 1680px, 96vw"
                priority
                fetchPriority="high"
                quality={80}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">{dict.common.aiConcept}</figcaption>
          </figure>
        )}
        <p className="mt-6 rounded-[1.25rem] bg-sage/60 px-5 py-4 leading-relaxed text-ink">{cs.conceptNote}</p>
      </div>

      {/* Audience / objective / direction */}
      <section aria-label={cs.summary} className={`${container} mt-16 sm:mt-24`}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [cs.audience, copy.audience],
            [cs.objective, copy.objective],
            [cs.direction, copy.direction],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.06} className="rounded-[1.5rem] bg-pearl/80 p-6 shadow-soft ring-1 ring-line sm:p-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-graphite">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Preview vs. proposed scope */}
      <section className={`${container} mt-16 grid gap-6 sm:mt-24 lg:grid-cols-2`} aria-labelledby="scope-title">
        <Reveal className="rounded-[1.75rem] border-2 border-graphite/15 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">{cs.demonstrates}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{cs.demonstratesBody}</p>
          <p className="mt-3 leading-relaxed text-muted">{cs.demonstratesNot}</p>
          {!isVideo && (
            <MotionPlayer
              className="mt-6"
              name={project.name}
              still={media.still}
              video={media.video}
              alt={copy.alt}
              sizes="(min-width: 1024px) 44vw, 92vw"
              frameClassName="aspect-[16/10]"
            />
          )}
        </Reveal>
        <Reveal delay={0.08} className="rounded-[1.75rem] bg-graphite p-6 text-pearl sm:p-8">
          <h2 id="scope-title" className="font-display text-2xl font-medium sm:text-3xl">{cs.scope}</h2>
          <p className="mt-4 text-pearl/75">{cs.scopeNote}</p>
          <ul className="mt-6 space-y-3">
            {copy.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-lg">
                <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-coral text-graphite">
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-pearl/15 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-pearl/80">{cs.approach}</h3>
            <p className="mt-3 text-lg leading-relaxed">{copy.approach}</p>
          </div>
          <div className="mt-8 border-t border-pearl/15 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-pearl/80">
              {project.toolsUsed.length ? cs.toolsUsed : cs.stackSuggested}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(project.toolsUsed.length ? project.toolsUsed : project.suggestedStack).map((tool) => (
                <li key={tool} className="rounded-full bg-pearl/10 px-4 py-2 text-sm font-semibold ring-1 ring-pearl/20">
                  {tool}
                </li>
              ))}
            </ul>
            {!project.toolsUsed.length && <p className="mt-4 text-sm text-pearl/70">{cs.stackNote}</p>}
          </div>
        </Reveal>
      </section>

      {/* Discipline-specific section */}
      <section aria-labelledby="variant-title" className="fabric mt-16 border-y border-line bg-stone/60 py-16 sm:mt-24 sm:py-24">
        <div className={container}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{dict.categories[project.categories[0]]}</Eyebrow>
              <h2 id="variant-title" className="font-display mt-4 text-[clamp(1.9rem,3.4vw,3rem)] font-medium leading-[1.05]">
                {variant.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">{variant.intro}</p>
              <ol className="mt-8 space-y-5">
                {variant.points.map((pt, i) => (
                  <li key={pt.title} className="flex gap-4">
                    <span aria-hidden="true" className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-pearl text-lg ring-1 ring-line">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold">{pt.title}</h3>
                      <p className="mt-1 leading-relaxed text-ink">{pt.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">
                {isVideo ? cs.variants.video.framesTitle : cs.details}
              </h3>
              <p className="mt-2 text-sm text-muted">{cs.detailsNote}</p>
              <ul className={`mt-5 grid gap-4 ${isVideo ? "sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
                {media.details.map((d, i) => (
                  <li
                    key={d.src}
                    className={!isVideo && i === 0 ? "col-span-2 row-span-2 sm:col-span-2" : ""}
                  >
                    <figure>
                      <div
                        className={`relative overflow-hidden bg-stone shadow-soft ring-1 ring-line ${
                          isVideo ? "aspect-video rounded-[1rem]" : i === 0 ? "aspect-square rounded-[1.75rem]" : "aspect-square rounded-full"
                        }`}
                      >
                        <Image
                          src={d.src}
                          fill
                          alt={fill(cs.detailAlt, { n: i + 1, name: project.name })}
                          sizes={!isVideo && i === 0 ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 20vw, 45vw"}
                          quality={80}
                          className="object-cover"
                        />
                      </div>
                      {isVideo && (
                        <figcaption className="mt-2 text-sm font-semibold text-muted">
                          {fill(cs.variants.video.frameLabel, { n: i + 1 })}
                        </figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>

              {showPalette && (
                <div className="mt-10">
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{cs.palette}</h3>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {media.palette.map((hex) => (
                      <li key={hex} className="flex items-center gap-3 rounded-full bg-pearl py-1.5 pl-1.5 pr-4 ring-1 ring-line">
                        <span aria-hidden="true" className="size-10 rounded-full ring-1 ring-graphite/10" style={{ background: hex }} />
                        <span className="font-mono text-sm font-semibold">{hex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Previous / next */}
      <nav aria-label={cs.projectNav} className={`${container} mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2`}>
        {[
          { p: prev, label: cs.prev, Icon: ArrowLeft, align: "", labelAlign: "" },
          { p: next, label: cs.next, Icon: ArrowRight, align: "sm:flex-row-reverse sm:text-right", labelAlign: "sm:flex-row-reverse" },
        ].map(({ p, label, Icon, align, labelAlign }) => (
          <Link
            key={label}
            href={p.href}
            className={`group flex items-center gap-5 rounded-[1.5rem] bg-pearl/80 p-4 ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lift ${align}`}
          >
            <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-stone sm:size-24">
              <Image src={p.still.src} fill alt="" sizes="96px" quality={70} className="object-cover" />
            </span>
            <span className="min-w-0">
              <span className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em]text-sage-deep ${labelAlign}`}>
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </span>
              <span className="font-display mt-1 block text-2xl font-medium">{p.name}</span>
              <span className="block text-muted">{p.title}</span>
            </span>
          </Link>
        ))}
      </nav>

      {/* Related */}
      <section aria-labelledby="related-title" className={`${container} pb-24 pt-16 sm:pt-24`}>
        <h2 id="related-title" className="font-display text-[clamp(1.9rem,3.4vw,3rem)] font-medium">
          {cs.related}
        </h2>
        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} variant="compact" sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" showSummary={false} />
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <ButtonLink href={`/${lang}/work`} variant="secondary">
            {fill(dict.common.viewAll, { count: projects.length })}
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
