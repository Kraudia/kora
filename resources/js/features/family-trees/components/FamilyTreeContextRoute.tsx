import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';
import { ApiError } from '@/shared/api/apiClient';
import { useFamilyTrees } from '../hooks/useFamilyTrees';

const translations = familyTreeTranslations.routing;

type FamilyTreeContextRouteProps = {
  children: ReactNode;
};

export function FamilyTreeContextRoute({ children }: FamilyTreeContextRouteProps) {
  const { data: user, isPending: isUserPending, error: userError } = useCurrentUser();
  const { data: familyTrees, isPending: areTreesPending, error: treesError } = useFamilyTrees();

  if (isUserPending || areTreesPending) {
    return <p role="status">{translations.loading}</p>;
  }

  if (userError instanceof ApiError && userError.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (treesError instanceof ApiError && treesError.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (userError || !user) {
    return <p role="alert">{translations.userError}</p>;
  }

  if (treesError || !familyTrees) {
    return <p role="alert">{translations.treesError}</p>;
  }

  const firstFamilyTree = familyTrees[0];

  if (firstFamilyTree) {
    return <Navigate to={`/trees/${firstFamilyTree.slug}`} replace />;
  }

  if (user.onboarding_skipped_at === null) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
