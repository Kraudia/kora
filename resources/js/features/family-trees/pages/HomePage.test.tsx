import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/onboarding" element={<p>Family tree onboarding</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('shows the empty state for a user without a family tree', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Nie należysz jeszcze do żadnego drzewa.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Możesz utworzyć własne drzewo lub poczekać na zaproszenie.'),
    ).toBeInTheDocument();
  });

  it('links to onboarding', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('link', { name: 'Utwórz drzewo' }));

    expect(await screen.findByText('Family tree onboarding')).toBeInTheDocument();
  });
});
