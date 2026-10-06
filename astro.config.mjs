// Astro build settings. Site URL must match siteUrl in src/site.config.ts.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://evenmaelum.dev',
  output: 'static',
  integrations: [sitemap()],
});
