import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CreateFamilyTreeForm } from './CreateFamilyTreeForm';

function renderForm(props: Partial<React.ComponentProps<typeof CreateFamilyTreeForm>> = {}) {
  const onSubmit = vi.fn();
  const onSkip = vi.fn();

  render(<CreateFamilyTreeForm onSubmit={onSubmit} onSkip={onSkip} {...props} />);

  return { onSubmit, onSkip };
}

describe('CreateFamilyTreeForm', () => {
  it('shows the onboarding heading and description', () => {
    renderForm();

    expect(
      screen.getByRole('heading', { name: 'Utwórz swoje drzewo rodzinne' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nadaj drzewu nazwę/)).toBeInTheDocument();
  });

  it.each([
    ['', 'Podaj nazwę drzewa.'],
    ['A', 'Nazwa drzewa musi mieć co najmniej 2 znaki.'],
    ['A'.repeat(101), 'Nazwa drzewa może mieć maksymalnie 100 znaków.'],
  ])('validates the family tree name: %s', async (name, message) => {
    const { onSubmit } = renderForm();
    const user = userEvent.setup();

    if (name) {
      await user.type(screen.getByLabelText('Nazwa drzewa'), name);
    }

    await user.click(screen.getByRole('button', { name: 'Utwórz drzewo' }));

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('trims the name before submission', async () => {
    const { onSubmit } = renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Nazwa drzewa'), '  Rodzina Kowalskich  ');
    await user.click(screen.getByRole('button', { name: 'Utwórz drzewo' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'Rodzina Kowalskich',
    });
  });

  it('shows an API validation error next to the field', async () => {
    renderForm({ serverNameError: 'Nazwa drzewa jest nieprawidłowa.' });

    expect(await screen.findByText('Nazwa drzewa jest nieprawidłowa.')).toBeInTheDocument();
  });

  it('disables both actions while creating a family tree', () => {
    renderForm({ isCreating: true });

    expect(screen.getByRole('button', { name: 'Tworzenie drzewa…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pomiń na razie' })).toBeDisabled();
    expect(screen.getByLabelText('Nazwa drzewa')).toBeDisabled();
  });

  it('calls the skip handler', async () => {
    const { onSkip } = renderForm();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Pomiń na razie' }));

    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('disables both actions while skipping onboarding', () => {
    renderForm({ isSkipping: true });

    expect(screen.getByRole('button', { name: 'Pomijanie…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Utwórz drzewo' })).toBeDisabled();
  });
});
