import { getProjectCopy } from "@/data/copy";
import { getMedia, type Project, type ProjectMedia } from "@/data/projects";
import type { Locale } from "./i18n/config";

/** Serializable, localized project data passed to cards and client components. */
export type ProjectView = Pick<Project, "slug" | "number" | "name" | "status" | "kind" | "categories" | "focus"> & {
  title: string;
  area: string;
  summary: string;
  alt: string;
  href: string;
  still: ProjectMedia["still"];
  video: ProjectMedia["video"];
};

export function toView(project: Project, locale: Locale): ProjectView {
  const copy = getProjectCopy(locale, project.slug);
  const media = getMedia(project.slug);
  return {
    slug: project.slug,
    number: project.number,
    name: project.name,
    status: project.status,
    kind: project.kind,
    categories: project.categories,
    focus: project.focus,
    title: copy.title,
    area: copy.area,
    summary: copy.summary,
    alt: copy.alt,
    href: `/${locale}/work/${project.slug}`,
    still: media.still,
    video: media.video,
  };
}
