import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../api/authApi';
import { queryClient } from '@/app/queryClient';
import { LoginForm } from '@/components/LoginForm';
import { Trees } from 'lucide-react';
import { LoginFormData } from '@/features/auth/schemas/loginSchema';

export function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['auth', 'user'], user);
      navigate('/dashboard');
    },
  });

  function handleSubmit(data: LoginFormData) {
    loginMutation.mutate({
      ...data,
      remember: false,
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trees className="size-4" />
          </div>
          Kora
        </a>
        <LoginForm
          onSubmit={handleSubmit}
          isPending={loginMutation.isPending}
          serverError={loginMutation.error?.message}
        />
      </div>
    </div>
  );
}
