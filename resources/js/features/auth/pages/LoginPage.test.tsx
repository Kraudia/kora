import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from '@/app/queryClient';
import { login } from '../api/authApi';
import { LoginPage } from './LoginPage';

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
}));

vi.mock('../components/LoginForm', () => ({
  LoginForm: ({
    onSubmit,
    serverError,
  }: {
    onSubmit: (data: { email: string; password: string }) => void;
    serverError?: string;
  }) => (
    <div>
      <button onClick={() => onSubmit({ email: 'jan@example.com', password: 'haslo123' })}>
        Wyślij logowanie
      </button>
      {serverError && <p>{serverError}</p>}
    </div>
  ),
}));

function renderPage() {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<p>Panel użytkownika</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('loguje użytkownika, zapisuje go w cache i przechodzi do panelu', async () => {
    const user = {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      onboarding_skipped_at: null,
    };
    vi.mocked(login).mockResolvedValue({ user });
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Wyślij logowanie' }));

    expect(await screen.findByText('Panel użytkownika')).toBeInTheDocument();
    expect(vi.mocked(login).mock.calls[0][0]).toEqual({
      email: 'jan@example.com',
      password: 'haslo123',
      remember: false,
    });
    expect(queryClient.getQueryData(['auth', 'user'])).toEqual(user);
  });

  it('przekazuje komunikat błędu do formularza', async () => {
    vi.mocked(login).mockRejectedValue(new Error('Nieprawidłowy e-mail lub hasło.'));
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Wyślij logowanie' }));

    await waitFor(() => {
      expect(screen.getByText('Nieprawidłowy e-mail lub hasło.')).toBeInTheDocument();
    });
  });
});
