import { notFound } from "next/navigation";

/** Routes any unknown path inside a locale to the localized not-found page. */
export default function CatchAll() {
  notFound();
}
