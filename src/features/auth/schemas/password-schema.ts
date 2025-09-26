import z from 'zod';

export const passwordSchema = z
  .string()
  .min(8)
  .refine(val => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(val), 'auth:invalid_format');
