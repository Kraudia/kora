import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register, RegisterData } from '../api/authApi';
import { queryClient } from '@/app/queryClient';
import { RegisterForm } from '@/components/RegisterForm';

export function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['auth', 'user'], user);
      navigate('/dashboard');
    },
  });

  function handleSubmit(data: RegisterData) {
    registerMutation.mutate(data);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          onSubmit={handleSubmit}
          isPending={registerMutation.isPending}
          serverError={registerMutation.error?.message}
        />
      </div>
    </div>
  );
}
