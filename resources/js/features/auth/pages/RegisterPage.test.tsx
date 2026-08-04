import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from '@/app/queryClient';
import { register } from '../api/authApi';
import { RegisterPage } from './RegisterPage';

vi.mock('../api/authApi', () => ({
  register: vi.fn(),
}));

vi.mock('../components/RegisterForm', () => ({
  RegisterForm: ({
    onSubmit,
    serverError,
  }: {
    onSubmit: (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => void;
    serverError?: string;
  }) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            name: 'Jan Kowalski',
            email: 'jan@example.com',
            password: 'haslo123',
            password_confirmation: 'haslo123',
          })
        }
      >
        Wyślij rejestrację
      </button>
      {serverError && <p>{serverError}</p>}
    </div>
  ),
}));

function renderPage() {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<p>Panel użytkownika</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('rejestruje użytkownika, zapisuje go w cache i przechodzi do panelu', async () => {
    const user = {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      onboarding_skipped_at: null,
    };
    vi.mocked(register).mockResolvedValue({ user });
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Wyślij rejestrację' }));

    expect(await screen.findByText('Panel użytkownika')).toBeInTheDocument();
    expect(vi.mocked(register).mock.calls[0][0]).toEqual({
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      password: 'haslo123',
      password_confirmation: 'haslo123',
    });
    expect(queryClient.getQueryData(['auth', 'user'])).toEqual(user);
  });

  it('przekazuje komunikat błędu do formularza', async () => {
    vi.mocked(register).mockRejectedValue(new Error('Konto z tym adresem e-mail już istnieje.'));
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: 'Wyślij rejestrację' }));

    await waitFor(() => {
      expect(screen.getByText('Konto z tym adresem e-mail już istnieje.')).toBeInTheDocument();
    });
  });
});
