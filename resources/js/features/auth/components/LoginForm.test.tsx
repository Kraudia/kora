import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

function renderForm(props: Partial<React.ComponentProps<typeof LoginForm>> = {}) {
  const onSubmit = vi.fn();

  render(
    <MemoryRouter>
      <LoginForm onSubmit={onSubmit} {...props} />
    </MemoryRouter>,
  );

  return { onSubmit };
}

describe('LoginForm', () => {
  it('pokazuje błędy walidacji i nie wysyła pustego formularza', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    expect(await screen.findByText('Podaj adres e-mail.')).toBeInTheDocument();
    expect(screen.getByText('Podaj hasło.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('wysyła poprawne dane logowania', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText('Adres e-mail'), 'jan@example.com');
    await user.type(screen.getByLabelText('Hasło'), 'sekretne-haslo');
    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0]).toEqual({
      email: 'jan@example.com',
      password: 'sekretne-haslo',
    });
  });

  it('pokazuje błąd serwera i stan wysyłania', () => {
    renderForm({ isPending: true, serverError: 'Nieprawidłowe dane.' });

    expect(screen.getByRole('alert')).toHaveTextContent('Nieprawidłowe dane.');
    expect(screen.getByRole('button', { name: 'Logowanie…' })).toBeDisabled();
  });
});
