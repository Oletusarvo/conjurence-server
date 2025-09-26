import z from 'zod';

const attendanceStatusSchema = z.enum([
  'pending',
  'joined',
  'accepted',
  'canceled',
  'left',
  'kicked',
  'host',
  'rejected',
  'interested',
]);

export const attendanceSchema = z.object({
  username: z.string(),
  status: attendanceStatusSchema,
  event_instance_id: z.uuid(),
  requested_at: z.date().optional(),
});

export type TAttendance = z.infer<typeof attendanceSchema>;
export type TAttendanceStatus = z.infer<typeof attendanceStatusSchema>;
