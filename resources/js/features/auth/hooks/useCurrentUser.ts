import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/authApi';

export const currentUserQueryKey = ['auth', 'user'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    retry: false,
  });
}
