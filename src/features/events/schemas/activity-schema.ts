import z from 'zod';

export const activitySchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  category: z.string().trim(),
});
