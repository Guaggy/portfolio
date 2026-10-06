# CLAUDE.md: Even Mælum portfolio

Personal portfolio and blog for Even Mælum (MSc Mechanical and Energy Engineering, NTNU, robotics and automation). Public GitHub repo (Guaggy/portfolio), built and deployed by Cloudflare (Workers with static assets, project "portfolio"), domain evenmaelum.dev. English only.

## Stack

- Astro 7 (static output), Markdown content collections, `astro:assets` images
- Plain CSS: tokens and shared classes in `src/styles/global.css`. No Tailwind unless Even asks.
- Fonts: IBM Plex Sans and Mono, self-hosted via `@fontsource`
- Sveltia CMS at `/admin` is planned for Phase 2. Not built yet.
- Node 22.12+ (installed: 24 LTS). Use `npm` unless Even asks for pnpm.

## Where things are

- `src/site.config.ts`: **main config**. Text, contact, feature toggles, pinned projects, CV, arm settings. Start here for any change.
- `src/content.config.ts`: post schema and the fixed tag list (`TAGS`).
- `src/content/projects/<slug>/index.md` + `cover.jpg`: one folder per project post.
- `src/assets/about/portrait.jpg`: portrait (placeholder until Even provides a photo). Keep the file name.
- `public/files/cv-en.pdf`, `cv-no.pdf`: CVs. Replace the file, keep the name.
- `src/lib/projects.ts`: visibility rules (drafts, pinned, recent).
- `src/components/ArmHero.astro`: hero robot arm (inverse kinematics, pointer tracking).
- `src/layouts/Base.astro`: `<head>`, SEO, theme, shell.
- `wrangler.jsonc`: Cloudflare deploy config (serves `dist/`).

## Rules

- Change behaviour through `src/site.config.ts` first. Only edit pages or components when the config cannot express it.
- Use colour tokens (`var(--bg)`, `var(--accent)` ...). No hard-coded colours in components.
- Every animation needs a `prefers-reduced-motion` fallback that shows the final static state.
- No third-party scripts, trackers, Google Fonts CDN or form backends.
- No new dependencies without asking Even first.
- Images need alt text (`coverAlt` is required in the schema, `portraitAlt` in config).
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO before any deploy.
- Mobile first: check 390px and 1440px, dark and light.

## Posts

- Frontmatter: `title` (max 80), `date`, `summary` (max 160), `tags` (from `TAGS`), `status` (`draft` | `published`), `cover`, `coverAlt`, optional `updated`, `links`.
- Pinned projects and their order: `pinnedProjects` in `src/site.config.ts` (folder names). Max 6.
- New posts start as `status: draft`. Claude sets `published` only after Even says "publish". Drafts show in `npm run dev` with a DRAFT tag and are never built for production.
- One commit per post: `Add post: <title>`. Push only after Even confirms, because a push triggers a public deploy.
- Before publishing anything from coursework, group projects or work: check rights with Even. Do not publish confidential or unpublished material.

## Workflow

- Local dev: `npm run dev` (http://127.0.0.1:4321). Build: `npm run build`. Type check: `npm run check`.
- Screenshots of the local site for layout checks (claude-in-chrome).
- Branch per post (`post/<slug>`) when Even asks for review before merge.

## Do not

- Do not publish personal data beyond what Even provides (email, phone only if `showPhone`, GitHub, LinkedIn, CV PDFs).
- Do not commit `.env` or any secret. `examples/` (local previews) is git-ignored and stays local.
