import { registerCredentialsSchema } from './register-credentials-schema';

export const resetPasswordSchema = registerCredentialsSchema
  .pick({
    password1: true,
    password2: true,
    token: true,
  })
  .refine(creds => creds.password1 === creds.password2);
