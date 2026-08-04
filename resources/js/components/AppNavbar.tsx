import { useMutation } from '@tanstack/react-query';
import { LogOut, Trees } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { queryClient } from '@/app/queryClient';
import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/api/authApi';
import { currentUserQueryKey, useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { familyTreeQueryKeys } from '@/features/family-trees/hooks/familyTreeQueryKeys';
import { authTranslations } from '@/i18n/locales/pl/auth';

const translations = authTranslations.navbar;

export function AppNavbar() {
  const navigate = useNavigate();
  const { data: user, isPending: isUserPending } = useCurrentUser();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
      queryClient.removeQueries({ queryKey: familyTreeQueryKeys.all });
      navigate('/login', { replace: true });
    },
  });

  return (
    <header className="border-b bg-background">
      <nav
        aria-label={translations.ariaLabel}
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trees className="size-5" aria-hidden="true" />
          </span>
          Kora
        </Link>

        {!isUserPending && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium">{user.name}</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut aria-hidden="true" />
                  {logoutMutation.isPending
                    ? translations.actions.loggingOut
                    : translations.actions.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:underline">
                  {translations.actions.login}
                </Link>
                <Link
                  to="/register"
                  className="rounded-4xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  {translations.actions.register}
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {logoutMutation.error && (
        <p role="alert" className="px-4 pb-3 text-center text-sm text-destructive">
          {translations.logoutError}
        </p>
      )}
    </header>
  );
}
