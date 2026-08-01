import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import type { RegisterData } from '@/features/auth/api/authApi';
import { authTranslations } from '@/i18n/locales/pl/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/features/auth/schemas/registerSchema';
import { Link } from 'react-router';

const translations = authTranslations.register;

type RegisterFormProps = {
  onSubmit: (data: RegisterData) => void;
  isPending?: boolean;
  serverError?: string;
};

export function RegisterForm({ onSubmit, isPending = false, serverError }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.title}</CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{translations.fields.name.label}</FieldLabel>
              <Input
                id="name"
                placeholder={translations.fields.name.placeholder}
                {...register('name')}
              />
              {errors.name && (
                <FieldDescription className="text-destructive">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">{translations.fields.email.label}</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder={translations.fields.email.placeholder}
                {...register('email')}
              />
              {errors.email && (
                <FieldDescription className="text-destructive">
                  {errors.email.message}
                </FieldDescription>
              )}
              <FieldDescription>{translations.fields.email.description}</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">{translations.fields.password.label}</FieldLabel>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <FieldDescription className="text-destructive">
                  {errors.password.message}
                </FieldDescription>
              )}
              <FieldDescription>{translations.fields.password.description}</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                {translations.fields.passwordConfirmation.label}
              </FieldLabel>
              <Input id="confirm-password" type="password" {...register('password_confirmation')} />
              {errors.password_confirmation && (
                <FieldDescription className="text-destructive">
                  {errors.password_confirmation.message}
                </FieldDescription>
              )}
            </Field>

            <FieldGroup>
              <Field>
                {serverError && (
                  <FieldDescription className="text-destructive">{serverError}</FieldDescription>
                )}

                <Button type="submit" disabled={isPending}>
                  {isPending ? translations.actions.submitting : translations.actions.submit}
                </Button>
                <FieldDescription className="px-6 text-center">
                  {translations.signIn.question} <Link to="/login">{translations.signIn.link}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
