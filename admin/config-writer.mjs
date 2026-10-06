// Writes src/site.config.ts from the admin form. Keys and comments match the hand-written file.
// If you add a key to site.config.ts, add it here too, or the admin will drop it on save.
const q = (s) => JSON.stringify(String(s ?? ''));
const bool = (v) => (v ? 'true' : 'false');
const list = (a) => JSON.stringify((a ?? []).map(String));

export function renderConfig(c) {
  const f = c.features;
  return `/**
 * MAIN SITE CONFIG
 * Written by the admin page (npm run dev, then open /admin). Hand edits are fine too.
 * Toggles: true = show, false = hide.
 */

export type Theme = 'dark' | 'light';

export const siteConfig = {
  // ---- Identity -------------------------------------------------------------
  name: ${q(c.name)},                    // header, footer, page titles
  siteUrl: ${q(c.siteUrl)},              // canonical URL, RSS and sitemap (keep in sync with astro.config.mjs)
  description: ${q(c.description)},      // default meta description
  location: ${q(c.location)},            // shown on About
  availability: ${q(c.availability)},    // one line under the hero, see features.showAvailability
  defaultTheme: ${q(c.defaultTheme)} as Theme, // first visit; visitors can switch

  // ---- Contact --------------------------------------------------------------
  email: ${q(c.email)},
  phone: ${q(c.phone)},                  // only shown when features.showPhone is true
  github: ${q(c.github)},
  linkedin: ${q(c.linkedin)},            // empty = hidden

  // ---- Feature toggles ------------------------------------------------------
  features: {
    showHeroArm: ${bool(f.showHeroArm)},         // animated robot arm in the hero
    showPinnedRow: ${bool(f.showPinnedRow)},       // "Pinned" scrollable row on the home page
    showRecentRow: ${bool(f.showRecentRow)},       // "Recent" scrollable row on the home page
    showAvailability: ${bool(f.showAvailability)},    // availability line under the hero
    showCv: ${bool(f.showCv)},              // CV download buttons (English + Norwegian) on About
    showPicture: ${bool(f.showPicture)},         // portrait on About
    showPhone: ${bool(f.showPhone)},          // phone number in the contact block
    showAcademic: ${bool(f.showAcademic)},        // grade average and relevant courses on About
    showProjectTimeline: ${bool(f.showProjectTimeline)}, // project timeline graph on About
    showThemeToggle: ${bool(f.showThemeToggle)},     // dark / light switch in the header
  },

  // ---- Projects -------------------------------------------------------------
  pinnedProjects: ${list(c.pinnedProjects)}, // project folder names, in display order (max 6)
  recentCount: ${Number(c.recentCount) || 10},                  // max cards in the "Recent" row
  showDraftsInDev: ${bool(c.showDraftsInDev)},                 // drafts visible in \`npm run dev\`, never in production

  // ---- Files ----------------------------------------------------------------
  cv: {
    english: ${q(c.cv.english)},         // replaced by the admin Files tab, keeps the same name
    norwegian: ${q(c.cv.norwegian)},
  },

  // ---- Hero arm -------------------------------------------------------------
  arm: {
    linkWidth: ${Number(c.arm.linkWidth) || 8},             // thickness of the arm links in px
    idleMotion: ${bool(c.arm.idleMotion)},         // arm moves on its own when nobody points at it
  },

  // ---- Home page text -------------------------------------------------------
  hero: {
    eyebrow: ${q(c.hero.eyebrow)},
    headline: ${q(c.hero.headline)},
    intro: ${q(c.hero.intro)},
  },

  // ---- About page text ------------------------------------------------------
  portraitAlt: ${q(c.portraitAlt)},
  about: {
    bio: ${q(c.about.bio)},
    // Academic facts shown on About.
    academic: {
      grade: ${q(c.about.academic.grade)},
      courses: ${list(c.about.academic.courses)},
    },
  },
};
`;
}
