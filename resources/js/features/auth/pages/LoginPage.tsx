import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../api/authApi';
import { queryClient } from '@/app/queryClient';
import { LoginForm } from '../components/LoginForm';
import { LoginFormData } from '@/features/auth/schemas/loginSchema';
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout';
import { currentUserQueryKey } from '@/features/auth/hooks/useCurrentUser';
import { familyTreeQueryKeys } from '@/features/family-trees/hooks/familyTreeQueryKeys';

export function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      queryClient.removeQueries({ queryKey: familyTreeQueryKeys.all });
      navigate('/home', { replace: true });
    },
  });

  function handleSubmit(data: LoginFormData) {
    loginMutation.mutate({
      ...data,
      remember: false,
    });
  }

  return (
    <AuthPageLayout>
      <LoginForm
        onSubmit={handleSubmit}
        isPending={loginMutation.isPending}
        serverError={loginMutation.error?.message}
      />
    </AuthPageLayout>
  );
}
