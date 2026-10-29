"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill } from "@/lib/i18n/dictionaries";
import { useI18n } from "./i18n-provider";

type Media = { src: string; width: number; height: number };

/**
 * Poster-first player for the animated concept previews. The video is only requested after the
 * viewer presses play, is always muted and inline, and pauses itself when scrolled out of view.
 */
export function MotionPlayer({
  name,
  still,
  video,
  alt,
  sizes,
  priority = false,
  autoStart = false,
  className = "",
  frameClassName = "aspect-[16/10]",
  showNote = true,
}: {
  name: string;
  still: Media;
  video: Media;
  alt: string;
  sizes: string;
  priority?: boolean;
  autoStart?: boolean;
  className?: string;
  frameClassName?: string;
  showNote?: boolean;
}) {
  const { dict } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(autoStart);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const wantsPlay = useRef(autoStart);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = ref.current;
        if (!v) return;
        if (!entry.isIntersecting) v.pause();
        else if (wantsPlay.current) v.play().catch(() => {});
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    if (!loaded) {
      wantsPlay.current = true;
      setLoaded(true);
      return;
    }
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      wantsPlay.current = true;
      v.play().catch(() => {});
    } else {
      wantsPlay.current = false;
      v.pause();
    }
  };

  const label = fill(playing ? dict.common.pauseNamed : dict.common.playNamed, { name });

  return (
    <figure className={className}>
      <div
        ref={wrapRef}
        className={`group/player relative overflow-hidden rounded-[1.75rem] bg-stone shadow-lift ring-1 ring-line ${frameClassName}`}
      >
        <Image
          src={still.src}
          width={still.width}
          height={still.height}
          alt={alt}
          sizes={sizes}
          priority={priority}
          quality={80}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100"}`}
        />
        {loaded && !failed && (
          <video
            ref={ref}
            src={video.src}
            width={video.width}
            height={video.height}
            muted
            playsInline
            loop
            autoPlay
            preload="none"
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-graphite/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-pearl backdrop-blur-sm">
          {dict.common.animatedPreview}
        </span>
        {!failed && (
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            aria-pressed={playing}
            className={`absolute grid place-items-center rounded-full bg-pearl/95 text-graphite shadow-deep ring-1 ring-line transition-[transform,background-color,opacity] duration-300 hover:scale-105 hover:bg-pearl ${
              playing
                ? "bottom-4 right-4 size-12 opacity-80 group-hover/player:opacity-100 focus-visible:opacity-100"
                : "left-1/2 top-1/2 size-[4.5rem] -translate-x-1/2 -translate-y-1/2 sm:size-20"
            }`}
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-5" fill="currentColor" />
            ) : (
              <Play aria-hidden="true" className="ml-1 size-7 sm:size-8" fill="currentColor" />
            )}
          </button>
        )}
      </div>
      {showNote && <figcaption className="mt-3 text-sm leading-relaxed text-muted">{dict.common.animatedPreviewNote}</figcaption>}
    </figure>
  );
}
