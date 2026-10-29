import { Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { capabilityIcons, IconCircle } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ButtonLink, container, Eyebrow } from "@/components/ui";
import { getMedia } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { person } from "@/lib/site";
import { WorkanaLink } from "@/components/workana-link";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDictionary(lang).meta.about;
  return pageMetadata(lang, "/about", m.title, m.description);
}

/** Portrait in an arched frame, layered with a project detail and the experience badge. */
function PortraitComposition({ alt, years, yearsLabel }: { alt: string; years: string; yearsLabel: string }) {
  const prism = getMedia("prism");
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
      <div aria-hidden="true" className="fabric absolute inset-[4%_2%_0_12%] rounded-t-[999px] bg-sage" />
      <div aria-hidden="true" className="absolute left-[2%] top-[8%] aspect-square w-[18%] rounded-full bg-coral/85 shadow-lift" />
      <div className="absolute bottom-[4%] left-[16%] right-[8%] top-[10%] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-stone shadow-deep ring-[6px] ring-pearl">
        <Image
          src={person.portrait.src}
          fill
          alt={alt}
          priority
          sizes="(min-width: 1024px) 34vw, 80vw"
          quality={80}
          className="object-cover"
          style={{ objectPosition: "68% 35%" }}
        />
      </div>
      <div className="absolute bottom-[14%] right-0 aspect-square w-[26%] overflow-hidden rounded-full bg-stone shadow-deep ring-[5px] ring-pearl">
        <Image src={prism.details[0].src} fill alt="" sizes="(min-width: 1024px) 12vw, 26vw" quality={70} className="object-cover" />
      </div>
      <p className="glass absolute bottom-[8%] left-0 max-w-[52%] rounded-[1.5rem] px-5 py-4 shadow-lift ring-1 ring-pearl/60">
        <span className="font-display block text-[clamp(2.6rem,5vw,3.8rem)] leading-none text-cobalt">{years}</span>
        <span className="mt-1 block text-sm font-bold leading-snug text-graphite">{yearsLabel}</span>
      </p>
    </div>
  );
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const a = dict.about;

  return (
    <>
      <section className={`${container} grid items-center gap-12 pt-10 sm:pt-16 lg:grid-cols-12 lg:gap-16`} aria-labelledby="about-title">
        <div className="lg:col-span-6">
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <h1 id="about-title" className="font-display rise mt-5 text-[clamp(2.4rem,5vw,4.4rem)] font-medium leading-[1.02]">
            {a.title}
          </h1>
          <p className="rise mt-6 text-xl leading-relaxed text-ink" style={{ "--d": "120ms" } as React.CSSProperties}>
            {a.intro}
          </p>
          <p className="rise mt-5 text-lg leading-relaxed text-ink" style={{ "--d": "200ms" } as React.CSSProperties}>
            {a.positioning}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--d": "280ms" } as React.CSSProperties}>
            <WorkanaLink />
            <ButtonLink href={`/${lang}/work`} variant="secondary">
              {dict.common.exploreWork}
            </ButtonLink>
          </div>
        </div>
        <div className="fade-scale lg:col-span-6">
          <PortraitComposition alt={a.portraitAlt} years="10" yearsLabel={a.experienceLabel} />
        </div>
      </section>

      <section aria-labelledby="values-title" className={`${container} mt-24 sm:mt-32`}>
        <h2 id="values-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium">
          {a.values.title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {a.values.items.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.06} className="rounded-[1.5rem] border-2 border-graphite/12 p-6 sm:p-7">
              <span aria-hidden="true" className="font-display text-4xl text-coral">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{v.title}</h3>
              <p className="mt-2 leading-relaxed text-ink">{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="spec-title" className="fabric mt-24 border-y border-line bg-stone/60 py-20 sm:mt-32 sm:py-24">
        <div className={container}>
          <h2 id="spec-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium">
            {a.specialisms}
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(dict.home.capabilities.items).map(([key, item], i) => (
              <li key={key} className="flex items-center gap-4 rounded-full bg-pearl/90 py-2 pl-2 pr-5 ring-1 ring-line">
                <IconCircle icon={capabilityIcons[key]} tone={(["sage", "coral", "pearl", "sage"] as const)[i % 4]} size="md" />
                <span className="font-bold leading-snug">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={`${container} grid gap-6 py-24 sm:py-32 lg:grid-cols-2`}>
        {[a.ai, a.feedback].map((block, i) => (
          <Reveal as="section" key={block.title} delay={i * 0.08} className={`rounded-[2rem] p-7 sm:p-10 ${i === 0 ? "bg-graphite text-pearl" : "bg-sage/70 ring-1 ring-line"}`}>
            <h2 className="font-display text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-tight">{block.title}</h2>
            <p className={`mt-4 text-lg leading-relaxed ${i === 0 ? "text-pearl/85" : "text-ink"}`}>{block.body}</p>
            <ul className="mt-6 space-y-3">
              {block.points.map((p) => (
                <li key={p} className="flex gap-3 text-lg">
                  <span aria-hidden="true" className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${i === 0 ? "bg-coral text-graphite" : "bg-graphite text-pearl"}`}>
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <ButtonLink href={`/${lang}/work`}>{dict.common.exploreWork}</ButtonLink>
          <ButtonLink href={`/${lang}/expertise`} variant="secondary">
            {dict.common.discoverExpertise}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
