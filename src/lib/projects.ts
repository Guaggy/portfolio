// Project queries used by pages and the RSS feed. All visibility rules live here.
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig } from '../site.config';

export type Project = CollectionEntry<'projects'>;

// Published projects, newest first. Drafts are included only in `npm run dev` when showDraftsInDev is on.
export async function visibleProjects(): Promise<Project[]> {
  const showDrafts = import.meta.env.DEV && siteConfig.showDraftsInDev;
  const all = await getCollection('projects', (p) => showDrafts || p.data.status === 'published');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Pinned projects in the order listed in site.config.ts (max 6). Missing or hidden slugs are skipped.
export async function pinnedProjects(): Promise<Project[]> {
  const all = await visibleProjects();
  return siteConfig.pinnedProjects
    .slice(0, 6)
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));
}

// Newest projects for the "Recent" row, capped by recentCount in site.config.ts.
export async function recentProjects(): Promise<Project[]> {
  return (await visibleProjects()).slice(0, siteConfig.recentCount);
}
