export type ProjectCopy = {
  /** Discipline subtitle shown after the project name, e.g. "Travel Film". */
  title: string;
  area: string;
  summary: string;
  audience: string;
  objective: string;
  direction: string;
  /** Proposed full production scope. */
  deliverables: string[];
  approach: string;
  alt: string;
};

export type ProjectCopyMap = Record<string, ProjectCopy>;
