import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';
import {
  CreateFamilyTreeFormData,
  createFamilyTreeSchema,
} from '../schemas/createFamilyTreeSchema';

const translations = familyTreeTranslations.onboarding;

type CreateFamilyTreeFormProps = {
  onSubmit: (data: CreateFamilyTreeFormData) => void;
  onSkip: () => void;
  isCreating?: boolean;
  isSkipping?: boolean;
  serverNameError?: string;
  createError?: string;
  skipError?: string;
};

export function CreateFamilyTreeForm({
  onSubmit,
  onSkip,
  isCreating = false,
  isSkipping = false,
  serverNameError,
  createError,
  skipError,
}: CreateFamilyTreeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateFamilyTreeFormData>({
    resolver: zodResolver(createFamilyTreeSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (serverNameError) {
      setError('name', {
        type: 'server',
        message: serverNameError,
      });
    }
  }, [serverNameError, setError]);

  const isPending = isCreating || isSkipping;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          <h1>{translations.title}</h1>
        </CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit((data) => {
            clearErrors('name');
            onSubmit(data);
          })}
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="family-tree-name">{translations.fields.name.label}</FieldLabel>
              <Input
                id="family-tree-name"
                placeholder={translations.fields.name.placeholder}
                aria-invalid={Boolean(errors.name)}
                disabled={isPending}
                {...register('name')}
              />
              {errors.name && (
                <FieldDescription role="alert" className="text-destructive">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              {createError && (
                <FieldDescription role="alert" className="text-destructive">
                  {createError}
                </FieldDescription>
              )}
              {skipError && (
                <FieldDescription role="alert" className="text-destructive">
                  {skipError}
                </FieldDescription>
              )}

              <Button type="submit" disabled={isPending}>
                {isCreating ? translations.actions.creating : translations.actions.create}
              </Button>
              <Button type="button" variant="ghost" disabled={isPending} onClick={onSkip}>
                {isSkipping ? translations.actions.skipping : translations.actions.skip}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
