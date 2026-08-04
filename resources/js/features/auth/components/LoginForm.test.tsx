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
  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    expect(await screen.findByText('Podaj adres e-mail.')).toBeInTheDocument();
    expect(screen.getByText('Podaj hasło.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid login data', async () => {
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

  it('shows a server error and the pending state', () => {
    renderForm({ isPending: true, serverError: 'Nieprawidłowe dane.' });

    expect(screen.getByRole('alert')).toHaveTextContent('Nieprawidłowe dane.');
    expect(screen.getByRole('button', { name: 'Logowanie…' })).toBeDisabled();
  });
});
