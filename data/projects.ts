import manifest from "./media-manifest.json";

/**
 * Project library. Localized copy lives in ./copy/<locale>.ts, keyed by slug.
 * Every project in the supplied materials is a self-initiated concept, so `status` is "concept".
 * Change it to "commissioned" only for verified client work.
 */
export const categories = ["photo", "video", "motion", "ai", "brand", "3d", "digital"] as const;
export type Category = (typeof categories)[number];

/** Drives which discipline-specific section a case study shows. */
export type ProjectKind = "image" | "video" | "brand" | "3d" | "ui";

export type Project = {
  slug: string;
  number: string;
  name: string;
  status: "concept" | "commissioned";
  kind: ProjectKind;
  categories: Category[];
  /** Tools named in the supplied brief as the proposed stack. Their use is not claimed. */
  suggestedStack: string[];
  /** Tools confirmed as actually used. Empty for all concept projects. */
  toolsUsed: string[];
  /** CSS object-position for tall/portrait crops of the landscape still. */
  focus?: string;
};

const p = (
  number: number,
  slug: string,
  name: string,
  kind: ProjectKind,
  cats: Category[],
  suggestedStack: string[],
  focus?: string,
): Project => ({
  slug,
  number: String(number).padStart(2, "0"),
  name,
  status: "concept",
  kind,
  categories: cats,
  suggestedStack,
  toolsUsed: [],
  focus,
});

export const projects: Project[] = [
  p(1, "luma", "Luma", "brand", ["brand", "photo", "motion"], ["Illustrator", "Photoshop", "After Effects"], "70% 30%"),
  p(2, "velo", "Velo", "image", ["photo", "video", "brand"], ["Photoshop", "Illustrator", "Premiere Pro", "After Effects"], "40% 50%"),
  p(3, "after-hours", "After Hours", "video", ["video", "motion", "ai"], ["Premiere Pro", "After Effects"], "50% 40%"),
  p(4, "atlas", "Atlas", "video", ["video", "motion", "ai"], ["Premiere Pro", "After Effects", "Audition"], "62% 50%"),
  p(5, "forma", "Forma", "video", ["motion", "3d"], ["Illustrator", "After Effects", "Premiere Pro", "Audition"], "60% 50%"),
  p(6, "aera", "Aera", "3d", ["3d", "photo", "ai", "video"], ["Blender", "Cycles", "After Effects"], "78% 50%"),
  p(7, "moonvale", "Moonvale", "3d", ["3d", "digital"], ["Photoshop", "Aseprite", "Unity", "C#"], "40% 50%"),
  p(8, "serein", "Serein", "ui", ["digital"], ["Figma", "Photoshop"], "30% 30%"),
  p(9, "gather", "Gather", "brand", ["brand", "photo"], ["InDesign", "Illustrator", "Photoshop"], "55% 50%"),
  p(10, "orbit", "Orbit", "brand", ["brand", "digital"], ["Figma", "PowerPoint", "Illustrator"], "70% 40%"),
  p(11, "solara", "Solara", "3d", ["3d", "photo", "video", "ai"], ["Blender", "Cycles", "Photoshop", "Premiere Pro"], "35% 50%"),
  p(12, "nouri", "Nouri", "brand", ["brand", "photo"], ["Illustrator", "Photoshop", "InDesign"], "50% 50%"),
  p(13, "little-atlas", "Little Atlas", "3d", ["3d", "ai"], ["Procreate", "Photoshop", "InDesign"], "45% 60%"),
  p(14, "nova", "Nova", "video", ["ai", "video", "3d"], ["Blender", "After Effects", "Premiere Pro"], "22% 40%"),
  p(15, "vanta", "Vanta", "video", ["video", "motion"], ["Premiere Pro", "After Effects", "Photoshop"], "50% 50%"),
  p(16, "morrow", "Morrow", "image", ["photo", "brand", "ai"], ["Photoshop", "Lightroom", "InDesign"], "31% 50%"),
  p(17, "fieldnote", "Fieldnote", "video", ["video", "photo", "ai"], ["DaVinci Resolve", "Premiere Pro", "Audition"], "42% 50%"),
  p(18, "kanso", "Kanso", "image", ["photo", "video", "brand", "ai"], ["Photoshop", "Illustrator", "Premiere Pro"], "70% 60%"),
  p(19, "pulse", "Pulse", "video", ["motion", "brand"], ["After Effects", "Illustrator", "Premiere Pro"], "40% 50%"),
  p(20, "prism", "Prism", "video", ["motion", "3d", "ai", "video"], ["Blender", "After Effects", "DaVinci Resolve"], "55% 50%"),
  p(21, "thread", "Thread", "ui", ["digital"], ["Figma", "Illustrator"], "50% 50%"),
  p(22, "meridian", "Meridian", "brand", ["brand", "3d"], ["Illustrator", "Figma", "InDesign"], "65% 50%"),
  p(23, "cove", "Cove", "image", ["photo", "digital"], ["Photoshop", "Illustrator", "Figma"], "72% 35%"),
  p(24, "evergreen", "Evergreen", "brand", ["brand", "photo", "digital", "ai"], ["Illustrator", "Photoshop", "Figma", "Premiere Pro"], "65% 50%"),
  p(25, "signal", "Signal", "brand", ["brand", "motion"], ["Illustrator", "InDesign", "After Effects"], "30% 50%"),
  p(26, "paws-and-play", "Paws & Play", "3d", ["3d", "motion", "ai"], ["Illustrator", "Photoshop", "After Effects", "Rive"], "35% 50%"),
  p(27, "aperture", "Aperture", "ui", ["digital", "photo"], ["Figma"], "65% 50%"),
  p(28, "bloom", "Bloom", "video", ["video", "ai"], ["Premiere Pro", "DaVinci Resolve", "Audition"], "40% 50%"),
  p(29, "contour", "Contour", "ui", ["digital", "motion"], ["Figma", "Illustrator", "After Effects"], "45% 40%"),
  p(30, "hearth", "Hearth", "3d", ["3d", "photo", "ai", "video"], ["Blender", "Cycles", "Photoshop", "DaVinci Resolve"], "50% 50%"),
];

export type ProjectMedia = {
  still: { src: string; width: number; height: number };
  video: { src: string; width: number; height: number };
  details: { src: string; size: number }[];
  palette: string[];
};

export function getMedia(slug: string): ProjectMedia {
  const m = (manifest as Record<string, (typeof manifest)["luma"]>)[slug];
  return {
    still: { src: `/media/work/${slug}/still.jpg`, width: m.width, height: m.height },
    video: { src: `/media/work/${slug}/preview.mp4`, ...m.video },
    details: m.details,
    palette: m.palette,
  };
}

export const getProject = (slug: string) => projects.find((pr) => pr.slug === slug);

/** Related work: shares the most categories, then nearest in the list. */
export function getRelated(slug: string, count = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];
  const idx = projects.indexOf(current);
  return projects
    .filter((pr) => pr.slug !== slug)
    .map((pr) => ({
      pr,
      score:
        pr.categories.filter((c) => current.categories.includes(c)).length * 10 +
        (pr.kind === current.kind ? 5 : 0) -
        Math.abs(projects.indexOf(pr) - idx) / 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ pr }) => pr);
}

/** Home-page selection: photo, image, video, motion and AI work first. */
export const featuredSlugs = ["fieldnote", "morrow", "aera", "kanso", "prism", "atlas"];
export const motionShowcaseSlugs = ["fieldnote", "prism", "atlas", "bloom"];
