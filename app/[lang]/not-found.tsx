"use client";

import { ButtonLink, container } from "@/components/ui";
import { useI18n } from "@/components/i18n-provider";

export default function NotFound() {
  const { locale, dict } = useI18n();
  return (
    <section className={`${container} flex min-h-[60vh] flex-col items-start justify-center py-24`}>
      <title>{`${dict.meta.notFound} · ${dict.meta.siteName}`}</title>
      <p className="font-display text-7xl text-stone-deep">404</p>
      <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,4rem)] font-medium">{dict.notFound.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-ink">{dict.notFound.body}</p>
      <ButtonLink href={`/${locale}/work`} className="mt-8">
        {dict.notFound.cta}
      </ButtonLink>
    </section>
  );
}
