// Content schema for project posts. A post is one folder: src/content/projects/<slug>/index.md + cover image.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Fixed tag list, keeps the filter buttons clean. Add a tag here before using it.
export const TAGS = ['Robotics', 'Vision', 'Blender', 'CAD', 'Energy', 'Embedded', 'ML', 'Automation', 'Other'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      date: z.coerce.date(),                          // display date, also sets "Recent" order
      updated: z.coerce.date().optional(),
      summary: z.string().max(160),                   // card text and meta description
      tags: z.array(z.enum(TAGS)).min(1),
      status: z.enum(['draft', 'published']).default('draft'), // drafts never appear in production
      cover: image(),                                 // cover.jpg next to index.md
      coverAlt: z.string().min(5),                    // required: describes the image
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    }),
});

export const collections = { projects };
