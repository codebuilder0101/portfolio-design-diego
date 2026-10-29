/**
 * Expertise groups and working tools. Group labels and items are translated in the dictionaries
 * (expertise.groups.<key>); this file holds what is language-neutral.
 */
export const expertiseGroups = [
  { key: "photo", examples: ["morrow", "kanso", "cove"] },
  { key: "video", examples: ["fieldnote", "after-hours", "bloom"] },
  { key: "motion", examples: ["pulse", "aera", "forma"] },
  { key: "ai", examples: ["nova", "prism", "little-atlas"] },
  { key: "brand", examples: ["nouri", "signal", "gather"] },
] as const;

export type ToolGroup = "image" | "video" | "motion" | "design";

/**
 * Working tools. `proficiency` is intentionally empty: add your own wording only when you can
 * support it (e.g. "Daily use since 2019"). Nothing is shown when it is left blank.
 */
export const tools: { name: string; abbr: string; group: ToolGroup; proficiency?: string }[] = [
  { name: "Photoshop", abbr: "Ps", group: "image" },
  { name: "Lightroom", abbr: "Lr", group: "image" },
  { name: "Premiere Pro", abbr: "Pr", group: "video" },
  { name: "DaVinci Resolve", abbr: "Dv", group: "video" },
  { name: "After Effects", abbr: "Ae", group: "motion" },
  { name: "Blender", abbr: "Bl", group: "motion" },
  { name: "Illustrator", abbr: "Ai", group: "design" },
  { name: "InDesign", abbr: "Id", group: "design" },
  { name: "Figma", abbr: "Fg", group: "design" },
];
