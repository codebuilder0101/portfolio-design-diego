import {
  Aperture,
  BookOpen,
  Box,
  Clapperboard,
  Compass,
  Film,
  Layers,
  type LucideIcon,
  MessagesSquare,
  Orbit,
  Package,
  PackageCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export const capabilityIcons: Record<string, LucideIcon> = {
  photo: Aperture,
  ai: Sparkles,
  video: Clapperboard,
  motion: Orbit,
  aiVideo: Film,
  product: Package,
  brand: BookOpen,
  threeD: Box,
};

export const expertiseIcons: Record<string, LucideIcon> = {
  photo: Aperture,
  video: Clapperboard,
  motion: Box,
  ai: WandSparkles,
  brand: Layers,
};

export const processIcons: Record<string, LucideIcon> = {
  brief: MessagesSquare,
  direction: Compass,
  production: Layers,
  refinement: WandSparkles,
  delivery: PackageCheck,
};


/** Circular icon container used across capability tiles, expertise groups and process steps. */
export function IconCircle({
  icon: Icon,
  tone = "pearl",
  size = "lg",
}: {
  icon: LucideIcon;
  tone?: "pearl" | "sage" | "cobalt" | "coral" | "graphite";
  size?: "md" | "lg";
}) {
  const tones = {
    pearl: "bg-pearl text-graphite ring-1 ring-line",
    sage: "bg-sage text-graphite",
    cobalt: "bg-cobalt text-pearl",
    coral: "bg-coral-soft text-graphite",
    graphite: "bg-graphite text-pearl",
  };
  const sizes = {
    md: "size-14 [&>svg]:size-6",
    lg: "size-14 sm:size-[4.5rem] [&>svg]:size-6 sm:[&>svg]:size-8",
  };
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full shadow-soft ${tones[tone]} ${sizes[size]}`}>
      <Icon strokeWidth={1.6} />
    </span>
  );
}
