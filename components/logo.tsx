import { person } from "@/lib/site";

/** Identity mark: a frame, a play shape and a moving playhead. Same geometry as /public/icon.svg. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect x="11" y="15" width="42" height="34" rx="8" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M23 24.5v15l12-7.5z" fill="var(--color-cobalt)" />
      <rect className="mark-playhead" x="40.5" y="8" width="5" height="48" rx="2.5" fill="var(--color-coral)" />
    </svg>
  );
}

/** Name wordmark on two lines so it stays compact in the header. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col font-sans leading-[1.1] ${className}`}>
      <span className="font-extrabold uppercase tracking-[0.12em]">{person.firstLine}</span>
      <span className="text-[0.82em] font-semibold uppercase tracking-[0.2em] text-muted">
        {person.secondLine}
        <span aria-hidden="true" className="ml-[0.4em] inline-block size-[0.45em] rounded-full bg-coral align-middle" />
      </span>
    </span>
  );
}
