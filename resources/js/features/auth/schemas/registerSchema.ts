import { z } from 'zod';
import { authTranslations } from '@/i18n/locales/pl/auth';

const translations = authTranslations.register.validation;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, {
        error: translations.nameRequired,
      })
      .max(255, {
        error: translations.nameTooLong,
      }),

    email: z.email({
      error: translations.emailInvalid,
    }),

    password: z
      .string()
      .min(1, {
        error: translations.passwordRequired,
      })
      .min(8, {
        error: translations.passwordTooShort,
      }),

    password_confirmation: z.string().min(1, {
      error: translations.passwordConfirmationRequired,
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: translations.passwordsDoNotMatch,
    path: ['password_confirmation'],
  });

export type RegisterData = z.infer<typeof registerSchema>;
