"use client";

import { ArrowUpRight } from "lucide-react";
import { workanaUrl } from "@/lib/site";
import { useI18n } from "./i18n-provider";

const styles = {
  button: "min-h-13 gap-3 rounded-full bg-cobalt px-6 py-3 text-base font-bold text-pearl shadow-soft hover:bg-cobalt-deep",
  compact: "min-h-11 gap-2 rounded-full bg-cobalt px-4 text-sm font-bold text-pearl shadow-soft hover:bg-cobalt-deep",
  text: "min-h-11 gap-1.5 font-bold text-cobalt underline decoration-2 underline-offset-4 hover:text-cobalt-deep",
};

/** External link to the Workana freelancer profile (the only outbound profile link on the site). */
export function WorkanaLink({
  variant = "button",
  label,
  className = "",
}: {
  variant?: keyof typeof styles;
  label?: string;
  className?: string;
}) {
  const { dict } = useI18n();
  return (
    <a
      href={workanaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center transition-colors duration-200 ${styles[variant]} ${className}`}
    >
      {label ?? dict.common.workana}
      <span className="sr-only"> {dict.common.newTab}</span>
      <ArrowUpRight aria-hidden="true" className="size-[1.1em] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
