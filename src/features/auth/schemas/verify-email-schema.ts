import z from 'zod';

export const verifyEmailSchema = z.object({
  email: z.email().trim(),
});
