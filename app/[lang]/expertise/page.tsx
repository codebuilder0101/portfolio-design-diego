import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { expertiseIcons, IconCircle } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, container, Eyebrow, SectionHeading } from "@/components/ui";
import { expertiseGroups, tools, type ToolGroup } from "@/data/expertise";
import { getProject } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { toView } from "@/lib/view";

export async function generateMetadata({ params }: PageProps<"/[lang]/expertise">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDictionary(lang).meta.expertise;
  return pageMetadata(lang, "/expertise", m.title, m.description);
}

const TONES = ["sage", "coral", "pearl", "cobalt", "sage"] as const;

export default async function ExpertisePage({ params }: PageProps<"/[lang]/expertise">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const ex = dict.expertise;

  return (
    <>
      <div className={`${container} pt-10 sm:pt-16`}>
        <SectionHeading as="h1" eyebrow={ex.eyebrow} title={ex.title} intro={ex.intro} />
      </div>

      <div className={`${container} mt-14 space-y-6 sm:mt-20`}>
        {expertiseGroups.map((g, i) => {
          const group = ex.groups[g.key];
          const examples = g.examples.map((s) => toView(getProject(s)!, lang));
          const flip = i % 2 === 1;
          return (
            <Reveal as="section" key={g.key} className="overflow-hidden rounded-[2rem] bg-pearl/80 shadow-soft ring-1 ring-line">
              <div className={`grid lg:grid-cols-12 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
                  <div className="flex items-center gap-5">
                    <IconCircle icon={expertiseIcons[g.key]} tone={TONES[i]} />
                    <div>
                      <p className="font-display text-muted">0{i + 1}</p>
                      <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-tight">{group.title}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-lg text-ink">{group.intro}</p>
                  <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 border-b border-line pb-3 text-lg font-semibold text-graphite">
                        <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-coral" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-stone/60 p-6 sm:p-10 lg:col-span-5">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{ex.examples}</p>
                  <ul className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1">
                    {examples.map((p) => (
                      <li key={p.slug}>
                        <Link href={p.href} className="group flex flex-col gap-2 rounded-[1.25rem] lg:flex-row lg:items-center lg:gap-4 lg:p-2 lg:hover:bg-pearl">
                          <span className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-[1rem] bg-stone lg:size-20">
                            <Image src={p.still.src} fill alt="" sizes="(min-width: 1024px) 80px, 30vw" quality={70} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-bold leading-tight group-hover:underline">{p.name}</span>
                            <span className="block text-sm text-muted">{p.title}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <section aria-labelledby="tools-title" className={`${container} py-20 sm:py-28`}>
        <Eyebrow>{ex.eyebrow}</Eyebrow>
        <h2 id="tools-title" className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] font-medium">
          {ex.tools.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink">{ex.tools.intro}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(ex.tools.groups) as ToolGroup[]).map((group) => (
            <div key={group} className="rounded-[1.5rem] border-2 border-graphite/12 p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-sage-deep">{ex.tools.groups[group]}</h3>
              <ul className="mt-5 space-y-4">
                {tools
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <li key={t.name} className="flex items-center gap-4">
                      <span aria-hidden="true" className="font-display grid size-12 shrink-0 place-items-center rounded-full bg-graphite text-lg text-pearl">
                        {t.abbr}
                      </span>
                      <span>
                        <span className="block text-lg font-bold">{t.name}</span>
                        {t.proficiency && <span className="block text-sm text-muted">{t.proficiency}</span>}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href={`/${lang}/work`}>{dict.common.exploreWork}</ButtonLink>
          <ButtonLink href={`/${lang}/process`} variant="secondary">
            {dict.common.seeProcess}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
