import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';

function renderForm(props: Partial<React.ComponentProps<typeof RegisterForm>> = {}) {
  const onSubmit = vi.fn();

  render(
    <MemoryRouter>
      <RegisterForm onSubmit={onSubmit} {...props} />
    </MemoryRouter>,
  );

  return { onSubmit };
}

async function fillForm(passwordConfirmation = 'sekretne-haslo') {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Imię i nazwisko'), 'Jan Kowalski');
  await user.type(screen.getByLabelText('Adres e-mail'), 'jan@example.com');
  await user.type(screen.getByLabelText('Hasło'), 'sekretne-haslo');
  await user.type(screen.getByLabelText('Powtórz hasło'), passwordConfirmation);

  return user;
}

describe('RegisterForm', () => {
  it('nie wysyła formularza, gdy hasła są różne', async () => {
    const { onSubmit } = renderForm();
    const user = await fillForm('inne-haslo');

    await user.click(screen.getByRole('button', { name: 'Utwórz konto' }));

    expect(await screen.findByText('Hasła nie są identyczne.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('wysyła poprawne dane rejestracji', async () => {
    const { onSubmit } = renderForm();
    const user = await fillForm();

    await user.click(screen.getByRole('button', { name: 'Utwórz konto' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      password: 'sekretne-haslo',
      password_confirmation: 'sekretne-haslo',
    });
  });

  it('pokazuje błąd serwera i stan wysyłania', () => {
    renderForm({ isPending: true, serverError: 'Adres e-mail jest już zajęty.' });

    expect(screen.getByText('Adres e-mail jest już zajęty.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tworzenie konta…' })).toBeDisabled();
  });
});
