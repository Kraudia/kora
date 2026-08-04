import { Navigate, Outlet } from 'react-router';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';
import { ApiError } from '@/shared/api/apiClient';
import { useCurrentUser } from '../hooks/useCurrentUser';

const translations = familyTreeTranslations.routing;

export function AuthenticatedRoute() {
  const { data: user, isPending, error } = useCurrentUser();

  if (isPending) {
    return <p role="status">{translations.loading}</p>;
  }

  if (error instanceof ApiError && error.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return <p role="alert">{translations.userError}</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
