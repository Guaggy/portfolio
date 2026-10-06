/**
 * MAIN SITE CONFIG
 * Change text, links, toggles and project order here. Pages read everything from this file.
 * Toggles: true = show, false = hide.
 * After editing: `npm run dev` to preview, then commit and push to publish.
 */

export type Theme = 'dark' | 'light';

export const siteConfig = {
  // ---- Identity -------------------------------------------------------------
  name: 'Even Mælum',                                   // header, footer, page titles
  siteUrl: 'https://evenmaelum.dev',                    // canonical URL, RSS and sitemap (keep in sync with astro.config.mjs)
  description: 'Robotics, automation and computer vision projects by Even Mælum.', // default meta description
  location: 'Norway',                                   // shown on About
  availability: 'Available 5 Dec 2026 – 31 Mar 2027',   // one line under the hero, see features.showAvailability
  defaultTheme: 'dark' as Theme,                        // first visit; visitors can switch

  // ---- Contact --------------------------------------------------------------
  email: 'even.maelum@gmail.com',
  phone: '',                                  // only shown when features.showPhone is true
  github: 'https://github.com/Guaggy',
  linkedin: '',                                         // empty = hidden

  // ---- Feature toggles ------------------------------------------------------
  features: {
    showHeroArm: true,        // animated robot arm in the hero
    showPinnedRow: true,      // "Pinned" scrollable row on the home page
    showRecentRow: true,      // "Recent" scrollable row on the home page
    showAvailability: true,   // availability line under the hero
    showCv: true,             // CV download buttons (English + Norwegian)
    showPicture: true,        // portrait on About (placeholder until replaced)
    showPhone: false,         // phone number in the contact block
    showThemeToggle: true,    // dark / light switch in the header
  },

  // ---- Projects -------------------------------------------------------------
  pinnedProjects: ['esp32-dashboard', 'oled-keychain'], // project folder names, in display order (max 6)
  recentCount: 10,                                      // max cards in the "Recent" row
  showDraftsInDev: true,                                // drafts visible in `npm run dev`, never in production

  // ---- Files ----------------------------------------------------------------
  cv: {
    english: '/files/cv-en.pdf',                        // replace the file in public/files/, keep the name
    norwegian: '/files/cv-no.pdf',
  },

  // ---- Hero arm -------------------------------------------------------------
  arm: {
    linkWidth: 8,             // thickness of the arm links in px
    idleMotion: true,         // arm moves on its own when nobody points at it
  },

  // ---- Home page text -------------------------------------------------------
  hero: {
    eyebrow: 'MSc Mechanical & Energy Engineering · Robotics & Automation',
    headline: 'I build machines that sense, move and decide.',
    intro: 'Robot arms, mobile platforms and embedded electronics: from CAD and wiring to the control code and the measurements that prove it.',
  },

  // ---- About page text ------------------------------------------------------
  portraitAlt: 'Portrait of Even Mælum',
  about: {
    bio: [
      'MSc student in Mechanical and Energy Engineering at NTNU, with a main profile in robotics and automation. I build real systems that connect software to hardware: a robot arm that picks and stacks by camera, a semi-autonomous wheelchair with obstacle detection, and a pressure-sensing mat for care.',
      'I am on exchange at the University of Western Australia in Perth in 2026 and have been nominated for Kyushu University in Japan in spring 2027. I am interested in robotics, computer vision, machine learning and AI-assisted development.',
    ],
    timeline: [
      { period: '2023 – 2028', text: 'NTNU, Trondheim · MSc Mechanical and Energy Engineering (expected)' },
      { period: 'Autumn 2026', text: 'University of Western Australia, Perth · exchange in robotics and data science' },
      { period: 'Spring 2027', text: 'Kyushu University, Japan · exchange (nominated)' },
    ],
    skills: [
      'Programming: Python, C++, MATLAB (basic), Git',
      'Electronics: ESP32, Arduino, Raspberry Pi, sensors, PCB design, soldering',
      'Robotics and vision: UR5, OpenCV, kinematics, control engineering, machine learning',
      'Mechanical: Fusion 360, Abaqus (FEM), 3D printing, laser cutting, CNC milling (basic)',
    ],
  },
};
