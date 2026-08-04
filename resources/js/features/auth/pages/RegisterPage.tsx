import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register, RegisterData } from '../api/authApi';
import { queryClient } from '@/app/queryClient';
import { RegisterForm } from '../components/RegisterForm';
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout';

export function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['auth', 'user'], user);
      navigate('/onboarding');
    },
  });

  function handleSubmit(data: RegisterData) {
    registerMutation.mutate(data);
  }

  return (
    <AuthPageLayout>
      <RegisterForm
        onSubmit={handleSubmit}
        isPending={registerMutation.isPending}
        serverError={registerMutation.error?.message}
      />
    </AuthPageLayout>
  );
}
