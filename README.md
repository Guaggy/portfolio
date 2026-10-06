# Even Mælum: portfolio

Personal portfolio and blog. Live site: https://evenmaelum.dev

Built with Astro (static), Markdown project posts, and Cloudflare Workers (static assets).

## Quick start

    npm install
    npm run dev      # http://127.0.0.1:4321 (drafts visible here)
    npm run build    # production build to dist/

## Editing

- **Main settings:** `src/site.config.ts` (text, links, toggles, pinned projects, CV, arm)
- **Projects:** `src/content/projects/<slug>/index.md` with `cover.jpg` beside it
- **Portrait:** `src/assets/about/portrait.jpg` (placeholder, replace and keep the name)
- **CVs:** `public/files/cv-en.pdf` and `cv-no.pdf`

See `CLAUDE.md` for the full conventions.

## Publishing

Pushing to `main` on GitHub triggers a Cloudflare build (`npm run build`) and deploy (`npx wrangler deploy`).
