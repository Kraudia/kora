import { z } from 'zod';
import { authTranslations } from '@/i18n/locales/pl/auth';

const validation = authTranslations.login.validation;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      error: validation.emailRequired,
    })
    .pipe(
      z.email({
        error: validation.emailInvalid,
      }),
    ),

  password: z.string().min(1, {
    error: validation.passwordRequired,
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
