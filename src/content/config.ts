import { defineCollection, z} from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string().max(80).min(0),
      description: z.string().max(220).min(0),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      tags: z.array(z.string()),
      category: z.string().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
