import { z } from 'zod';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';

const translations = familyTreeTranslations.onboarding.validation;

export const createFamilyTreeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      error: translations.nameRequired,
    })
    .min(2, {
      error: translations.nameTooShort,
    })
    .max(100, {
      error: translations.nameTooLong,
    }),
});

export type CreateFamilyTreeFormData = z.infer<typeof createFamilyTreeSchema>;
