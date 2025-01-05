import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string(),
  }),
});

const planning = defineCollection({
  loader: glob({ base: "./src/content/planning", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog, planning };
