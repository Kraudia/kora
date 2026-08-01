import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Input } from '@/components/ui/input';

import { authTranslations } from '@/i18n/locales/pl/auth';
import { LoginFormData, loginSchema } from '@/features/auth/schemas/loginSchema';
import { useForm } from 'react-hook-form';

const translations = authTranslations.login;

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void;
  isPending?: boolean;
  serverError?: string;
};

export function LoginForm({ onSubmit, isPending = false, serverError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{translations.title}</CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{translations.fields.email.label}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={translations.fields.email.placeholder}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && (
                <FieldDescription className="text-destructive">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">{translations.fields.password.label}</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {translations.forgotPassword}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              {errors.password && (
                <FieldDescription className="text-destructive">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              {serverError && (
                <FieldDescription role="alert" className="text-destructive">
                  {serverError}
                </FieldDescription>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? translations.actions.submitting : translations.actions.submit}
              </Button>
              <FieldDescription className="text-center">
                {translations.signUp.question}{' '}
                <Link to="/register">{translations.signUp.link}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
