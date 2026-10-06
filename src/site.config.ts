/**
 * MAIN SITE CONFIG
 * Written by the admin page (npm run dev, then open /admin). Hand edits are fine too.
 * Toggles: true = show, false = hide.
 */

export type Theme = 'dark' | 'light';
export type SiteStatus = 'live' | 'maintenance';

export const siteConfig = {
  // ---- Site status ----------------------------------------------------------
  siteStatus: "live" as SiteStatus, // live = normal site; maintenance = placeholder page on every address
  searchConsoleVerification: "WWbkeG8gm7ap-wvdMXfU9cLDsgHnGVb2YjGSeMepMKE", // Google Search Console verification code (empty = not set)

  // ---- Identity -------------------------------------------------------------
  name: "Even Mælum",                    // header, footer, page titles
  siteUrl: "https://evenmaelum.dev",              // canonical URL, RSS and sitemap (keep in sync with astro.config.mjs)
  description: "Robotics, automation and computer vision projects by Even Mælum.",      // default meta description
  location: "Norway",            // shown on About
  availability: "Available 5 Dec 2026 – 31 Mar 2027",    // one line under the hero, see features.showAvailability
  defaultTheme: "dark" as Theme, // first visit; visitors can switch

  // ---- Contact --------------------------------------------------------------
  email: "even.maelum@gmail.com",
  phone: "",                  // only shown when features.showPhone is true
  github: "https://github.com/Guaggy",
  linkedin: "",            // empty = hidden

  // ---- Feature toggles ------------------------------------------------------
  features: {
    showHeroArm: true,         // animated robot arm in the hero
    showPinnedRow: true,       // "Pinned" scrollable row on the home page
    showRecentRow: true,       // "Recent" scrollable row on the home page
    showAvailability: true,    // availability line under the hero
    showCv: true,              // CV download buttons (English + Norwegian) on About
    showPicture: true,         // portrait on About
    showPhone: false,          // phone number in the contact block
    showAcademic: true,        // grade average and relevant courses on About
    showProjectTimeline: true, // project timeline graph on About
    showThemeToggle: true,     // dark / light switch in the header
  },

  // ---- Projects -------------------------------------------------------------
  pinnedProjects: ["esp32-dashboard","oled-keychain"], // project folder names, in display order (max 6)
  recentCount: 10,                  // max cards in the "Recent" row
  showDraftsInDev: true,                 // drafts visible in `npm run dev`, never in production

  // ---- Files ----------------------------------------------------------------
  cv: {
    english: "/files/cv-en.pdf",         // replaced by the admin Files tab, keeps the same name
    norwegian: "/files/cv-no.pdf",
  },

  // ---- Hero arm -------------------------------------------------------------
  arm: {
    linkWidth: 8,             // thickness of the arm links in px
    idleMotion: true,         // arm moves on its own when nobody points at it
  },

  // ---- Home page text -------------------------------------------------------
  hero: {
    eyebrow: "MSc Mechanical & Energy Engineering · Robotics & Automation",
    headline: "I build machines that sense, move and decide.",
    intro: "Robot arms, mobile platforms and embedded electronics: from CAD and wiring to the control code and the measurements that prove it.",
  },

  // ---- About page text ------------------------------------------------------
  portraitAlt: "Portrait of Even Mælum",
  about: {
    bio: "MSc student in Mechanical and Energy Engineering at NTNU, focused on robotics and automation. I like building real systems that connect software to hardware, from robot arms and embedded boards to the measurements that show they work. Currently on exchange at UWA in Perth.",
    // Academic facts shown on About.
    academic: {
      grade: "4.70 out of 5 (A = 5)",
      courses: ["Mechatronics","Control Engineering","Product Development","Machine Design","Finite Element Method (FEM)","Information Technology (Python)","Production Technology"],
    },
  },
};
