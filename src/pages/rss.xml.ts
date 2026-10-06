// RSS FEED at /rss.xml: one item per visible project.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { visibleProjects } from '../lib/projects';
import { siteConfig } from '../site.config';

export async function GET(context: APIContext) {
  const projects = await visibleProjects();
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: projects.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.summary,
      link: `/projects/${p.id}/`,
    })),
  });
}
