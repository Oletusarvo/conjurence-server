import z from 'zod';
import { passwordSchema } from './password-schema';

export const registerCredentialsSchema = z
  .object({
    email: z.email().trim(),
    username: z.string().trim(),
    password1: passwordSchema,
    password2: passwordSchema,
    subscription: z.enum(['free', 'premium']).default('free'),
    tosAccepted: z.string().transform(val => val === 'on').pipe(z.boolean())
  })
  .refine(val => val.password1 === val.password2, 'auth:password_mismatch');
