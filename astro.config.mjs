// Astro build settings. Site URL must match siteUrl in src/site.config.ts.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import devAdmin from './admin/integration.mjs'; // /admin editor: dev server only, never in the build

export default defineConfig({
  site: 'https://evenmaelum.dev',
  output: 'static',
  integrations: [sitemap(), devAdmin()],
});
