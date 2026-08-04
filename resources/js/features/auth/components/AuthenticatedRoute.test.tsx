import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/apiClient';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AuthenticatedRoute } from './AuthenticatedRoute';

vi.mock('../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

function mockCurrentUser({
  isPending = false,
  error = null,
  hasUser = true,
}: {
  isPending?: boolean;
  error?: Error | null;
  hasUser?: boolean;
} = {}) {
  vi.mocked(useCurrentUser).mockReturnValue({
    data: hasUser
      ? {
          id: 1,
          name: 'Jan Kowalski',
          email: 'jan@example.com',
          onboarding_skipped_at: null,
        }
      : undefined,
    isPending,
    error,
  } as unknown as ReturnType<typeof useCurrentUser>);
}

function renderRoute() {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route element={<AuthenticatedRoute />}>
          <Route path="/home" element={<p>Protected application</p>} />
        </Route>
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AuthenticatedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a neutral loader while the user is loading', () => {
    mockCurrentUser({ isPending: true, hasUser: false });

    renderRoute();

    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie aplikacji…');
    expect(screen.queryByText('Protected application')).not.toBeInTheDocument();
  });

  it('redirects an unauthenticated user to login', async () => {
    mockCurrentUser({
      hasUser: false,
      error: new ApiError('Unauthenticated', 401),
    });

    renderRoute();

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('renders the application for an authenticated user', () => {
    mockCurrentUser();

    renderRoute();

    expect(screen.getByText('Protected application')).toBeInTheDocument();
  });

  it('shows an error without rendering the protected view', () => {
    mockCurrentUser({ hasUser: false, error: new Error('Network error') });

    renderRoute();

    expect(screen.getByRole('alert')).toHaveTextContent('Nie udało się pobrać danych użytkownika.');
    expect(screen.queryByText('Protected application')).not.toBeInTheDocument();
  });
});
