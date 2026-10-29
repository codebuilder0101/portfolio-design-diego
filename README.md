# Diego Ferreira dos Santos — portfolio

Portfolio site for Diego Ferreira dos Santos, a senior photo, image and video editor and AI visual creator with 10 years of experience. The only outbound link is the Workana freelancer profile; there are no contact details or social links. It is built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion and Lucide icons. The site is available in Brazilian Portuguese, Spanish and English.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

For a production build:

```bash
npm run build
npm start          # http://localhost:3000
```

Checks:

```bash
npm run lint
npm run typecheck
```

Assets. Run these only after changing the source images:

```bash
npm run media      # rebuilds public/media from creative-portfolio/ and portfolio-projects-11-30/ (--force to overwrite)
npm run og         # re-renders the Open Graph images (needs a local Chrome; set CHROME_PATH if it isn't found)
```

## Deployment domain

No production URL is set yet. When you have one, set it before building:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

With this set, the build emits canonical URLs, `hreflang` alternates, absolute Open Graph URLs and `sitemap.xml`.

## Where to edit things

| What | File |
| --- | --- |
| Projects: categories, card focus, suggested stack, `status`, `toolsUsed` | `data/projects.ts` |
| Project copy per language | `data/copy/en.ts`, `es.ts`, `pt-BR.ts` |
| All interface text, metadata and accessibility labels | `lib/i18n/dictionaries/*.ts` (`en.ts` defines the shape) |
| Expertise groups and working tools (optional `proficiency`) | `data/expertise.ts` |
| Home selection and motion showcase | `featuredSlugs` and `motionShowcaseSlugs` in `data/projects.ts` |
| Colours, fonts, shadows | `app/globals.css` (`@theme`) and `app/[lang]/layout.tsx` |
| Name, photos, Workana URL | `lib/site.ts` (photos live in `public/avatar/`); also `meta.siteName` in each dictionary and `scripts/build-og.mjs` |

Each project is marked `status: "concept"`. Change a project to `"commissioned"` only for verified client work. Add tools to `toolsUsed` only when their use is confirmed. While that list is empty, the case study shows the brief's tools under "Suggested Production Stack".

## Language selection

URLs are prefixed with the locale (`/pt-BR`, `/es`, `/en`). The default language is Portuguese (Brazil). A request without a prefix is redirected by `proxy.ts`:

1. To the saved choice from the PT | ES | EN toggle (`fm_locale` cookie, also mirrored to `localStorage`), if there is one.
2. Otherwise to `/pt-BR`.

Switching language keeps the current page, the active filter and the scroll position.

## Content honesty

Every project is a self-initiated concept with AI-generated art-direction imagery. The site never presents them as client work. The GIF-derived previews are labelled as camera moves over a still, not films. Asset sources and the remaining asset needs are listed in [ASSET-CREDITS.md](ASSET-CREDITS.md).
