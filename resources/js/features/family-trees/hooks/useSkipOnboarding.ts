import { useMutation, useQueryClient } from '@tanstack/react-query';
import { currentUserQueryKey } from '@/features/auth/hooks/useCurrentUser';
import { skipOnboarding } from '../api/familyTreeApi';

export function useSkipOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipOnboarding,
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
}
