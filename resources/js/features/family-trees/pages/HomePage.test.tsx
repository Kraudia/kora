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
        <Route path="/onboarding" element={<p>Onboarding drzewa</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('pokazuje pusty stan użytkownika bez drzewa', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Nie należysz jeszcze do żadnego drzewa.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Możesz utworzyć własne drzewo lub poczekać na zaproszenie.'),
    ).toBeInTheDocument();
  });

  it('prowadzi do onboardingu', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('link', { name: 'Utwórz drzewo' }));

    expect(await screen.findByText('Onboarding drzewa')).toBeInTheDocument();
  });
});
