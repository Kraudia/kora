import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register, RegisterData } from '../api/authApi';
import { queryClient } from '@/app/queryClient';
import { RegisterForm } from '../components/RegisterForm';
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout';
import { currentUserQueryKey } from '@/features/auth/hooks/useCurrentUser';
import { familyTreeQueryKeys } from '@/features/family-trees/hooks/familyTreeQueryKeys';

export function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      queryClient.removeQueries({ queryKey: familyTreeQueryKeys.all });
      navigate('/home', { replace: true });
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
