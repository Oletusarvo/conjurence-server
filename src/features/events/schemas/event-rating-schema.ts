import z from 'zod';

export const eventRatingSchema = z.object({
  to_event_id: z.uuid(),
  from_user_id: z.uuid(),
  type: z.literal('rating'),
  metadata: z.object({
    rating: z.number().min(1).max(5),
  }),
});
