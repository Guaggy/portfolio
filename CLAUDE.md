# CLAUDE.md: Even Mælum portfolio

Personal portfolio and blog for Even Mælum (MSc Mechanical and Energy Engineering, NTNU, robotics and automation). Public GitHub repo, deployed on Cloudflare Pages, domain evenmaelum.dev. English only.

## Stack (planned, not yet scaffolded)

- Astro, static output, Markdown content collections
- Plain CSS with tokens from `design/palettes.css`. No Tailwind unless Even asks.
- Sveltia CMS at `/admin` (Phase 2)
- Node LTS. Use `npm` unless Even asks for pnpm.

## Rules

- Use palette tokens (`var(--bg)`, `var(--accent)` ...). No hard-coded colours in components.
- Every animation needs a `prefers-reduced-motion` fallback that shows the final static state.
- No third-party scripts, trackers, Google Fonts CDN or form backends. Fonts are self-hosted.
- No new dependencies without asking Even first.
- Images need alt text. Build fails without it.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO before any deploy.
- Mobile first: check 390px and 1440px, dark and light.

## Posts

- One folder per post: `src/content/posts/<slug>/index.md` with images beside it.
- Frontmatter: `title`, `date`, `summary` (<=160 chars), `tags` (from the fixed list), `status` (`draft` | `published`), `cover`, `coverAlt`, optional `featured`, `video`, `links`, `updated`.
- Fixed tags: Robotics, Vision, Blender, CAD, Energy, Embedded, ML, Automation, Other.
- New posts start as `status: draft`. Claude sets `published` only after Even says "publish".
- One commit per post: `Add post: <title>`. Push only after Even confirms.
- Before publishing anything from coursework, group projects or work: check rights with Even. Do not publish confidential or unpublished material.

## Workflow

- Local dev: `npm run dev`. Build: `npm run build`.
- Screenshots of the local site for checking layout (claude-in-chrome).
- Branch per post (`post/<slug>`) when Even asks for review before merge.

## Do not

- Do not publish personal data beyond what Even provides (public email, LinkedIn, GitHub, CV PDF).
- Do not commit `.env` or any secret. Do not commit the `examples/` folder (it is local-only).
