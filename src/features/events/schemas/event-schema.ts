import z from 'zod';

const positionSchema = z.object({
  coordinates: z.array(z.number()).length(2, 'position:invalid_length'),
  accuracy: z.number(),
  timestamp: z.number(),
});

const spotsSchema = z.number().min(1);

export const createEventSchema = z.object({
  spots_available: z
    .string()
    .transform(val => Number(val))
    .pipe(spotsSchema)
    .or(spotsSchema)
    .optional(),

  position: positionSchema.or(
    z
      .string()
      .transform(val => JSON.parse(val))
      .pipe(positionSchema)
  ),

  size: z.string(),
  is_mobile: z
    .string()
    .transform(val => val === 'on')
    .pipe(z.boolean().default(false))
    .optional(),

  activity_id: z.uuid(),
});

export const updateEventSchema = createEventSchema
  .omit({
    position: true,
    size: true,
    category: true,
    is_mobile: true,
  })
  .partial()
  .extend({
    ended_at: z.date(),
    id: z.uuid(),
  });

export type TEvent = z.infer<typeof createEventSchema> & {
  id: string;
  author_id: string;
  host: string;
  interested_count: number;
  attendance_count: number;
  auto_join_threshold: number;
  auto_leave_threshold: number;
  position: { coordinates: number[] };
  created_at: string;
  ended_at: string;
};
