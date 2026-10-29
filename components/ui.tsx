import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** Small shared presentational pieces. */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-sage-deep ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-coral" />
      {children}
    </p>
  );
}

export function ConceptBadge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-pearl/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-graphite ring-1 ring-line ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-coral" />
      {label}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-sm font-semibold text-ink">
      {children}
    </span>
  );
}

const buttonStyles = {
  primary: "bg-graphite text-pearl hover:bg-cobalt shadow-soft",
  secondary: "bg-pearl/80 text-graphite ring-1 ring-graphite/20 hover:ring-graphite hover:bg-pearl",
  cobalt: "bg-cobalt text-pearl hover:bg-cobalt-deep shadow-soft",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof buttonStyles;
  icon?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-13 items-center justify-center gap-3 rounded-full px-6 py-3 text-base font-bold transition-[background-color,box-shadow,color] duration-200 ${buttonStyles[variant]} ${className}`}
    >
      {children}
      {icon && (
        <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  className = "",
  as: H = "h2",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H id={id} className="font-display mt-4 text-[clamp(2.1rem,4.4vw,3.75rem)] font-medium leading-[1.04] text-graphite">
        {title}
      </H>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">{intro}</p>}
    </div>
  );
}

export const container = "mx-auto w-full max-w-[110rem] px-4 sm:px-6 lg:px-10";
