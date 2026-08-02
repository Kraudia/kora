import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from '@/app/queryClient';
import { logout } from '@/features/auth/api/authApi';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AppNavbar } from './AppNavbar';

vi.mock('@/features/auth/api/authApi', () => ({
  logout: vi.fn(),
}));

vi.mock('@/features/auth/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

function renderNavbar() {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <AppNavbar />
                <p>Panel użytkownika</p>
              </>
            }
          />
          <Route path="/login" element={<p>Strona logowania</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AppNavbar', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('wyświetla imię i nazwisko zalogowanego użytkownika oraz wylogowuje go', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
      isPending: false,
    } as ReturnType<typeof useCurrentUser>);
    vi.mocked(logout).mockResolvedValue();
    queryClient.setQueryData(['auth', 'user'], { id: 1, name: 'Jan Kowalski' });
    renderNavbar();

    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Wyloguj się' }));

    expect(await screen.findByText('Strona logowania')).toBeInTheDocument();
    expect(logout).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(['auth', 'user'])).toBeUndefined();
  });

  it('wyświetla linki logowania i rejestracji dla gościa', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useCurrentUser>);
    renderNavbar();

    expect(screen.getByRole('link', { name: 'Zaloguj się' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Utwórz konto' })).toHaveAttribute('href', '/register');
    expect(screen.queryByRole('button', { name: 'Wyloguj się' })).not.toBeInTheDocument();
  });

  it('pokazuje komunikat, gdy wylogowanie się nie powiedzie', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
      isPending: false,
    } as ReturnType<typeof useCurrentUser>);
    vi.mocked(logout).mockRejectedValue(new Error('Błąd sieci'));
    renderNavbar();

    await userEvent.click(screen.getByRole('button', { name: 'Wyloguj się' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Nie udało się wylogować. Spróbuj ponownie.',
      );
    });
  });
});
