import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { container, SectionHeading } from "@/components/ui";
import { WorkLibrary, WorkLibraryFromParams } from "@/components/work-library";
import { Suspense } from "react";
import { projects } from "@/data/projects";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { toView } from "@/lib/view";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDictionary(lang).meta.work;
  return pageMetadata(lang, "/work", m.title, m.description);
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const items = projects.map((p) => toView(p, lang));

  return (
    <div className={`${container} pb-24 pt-10 sm:pt-16`}>
      <SectionHeading as="h1" eyebrow={dict.work.eyebrow} title={dict.work.title} intro={dict.work.intro} />
      <div className="mt-12">
        {/* The fallback is the full, server-rendered library; the URL filter applies on the client */}
        <Suspense fallback={<WorkLibrary items={items} />}>
          <WorkLibraryFromParams items={items} />
        </Suspense>
      </div>
    </div>
  );
}
