import z from 'zod';

export const loginCredentialsSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim(),
});
