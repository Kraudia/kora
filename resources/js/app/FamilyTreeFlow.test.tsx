import { QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from './queryClient';
import { appRoutes } from './router';
import { getCurrentUser, login, register } from '@/features/auth/api/authApi';
import {
  createFamilyTree,
  getFamilyTree,
  getFamilyTrees,
  skipOnboarding,
} from '@/features/family-trees/api/familyTreeApi';
import { FamilyTree } from '@/features/family-trees/types/familyTree';
import { ApiError } from '@/shared/api/apiClient';

vi.mock('@/features/auth/api/authApi', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
}));

vi.mock('@/features/family-trees/api/familyTreeApi', () => ({
  createFamilyTree: vi.fn(),
  getFamilyTree: vi.fn(),
  getFamilyTrees: vi.fn(),
  skipOnboarding: vi.fn(),
}));

const userWithoutTree = {
  id: 1,
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  onboarding_skipped_at: null,
};

const skippedUser = {
  ...userWithoutTree,
  onboarding_skipped_at: '2026-08-07T08:00:00.000000Z',
};

const familyTree: FamilyTree = {
  id: 1,
  name: 'Rodzina Kowalskich',
  slug: 'rodzina-kowalskich',
  role: 'owner',
  created_at: '2026-08-07T08:00:00.000000Z',
  updated_at: '2026-08-07T08:00:00.000000Z',
};

function renderApp(initialEntry: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return router;
}

async function submitRegistration() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Imię i nazwisko'), 'Jan Kowalski');
  await user.type(screen.getByLabelText('Adres e-mail'), 'jan@example.com');
  await user.type(screen.getByLabelText('Hasło'), 'sekretne-haslo');
  await user.type(screen.getByLabelText('Powtórz hasło'), 'sekretne-haslo');
  await user.click(screen.getByRole('button', { name: 'Utwórz konto' }));

  return user;
}

async function submitLogin() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Adres e-mail'), 'jan@example.com');
  await user.type(screen.getByLabelText('Hasło'), 'sekretne-haslo');
  await user.click(screen.getByRole('button', { name: 'Zaloguj się' }));

  return user;
}

async function createTree(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nazwa drzewa'), '  Rodzina Kowalskich  ');
  await user.click(screen.getByRole('button', { name: 'Utwórz drzewo' }));
}

describe('family tree application flow', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  it('moves from registration through onboarding to the created family tree', async () => {
    vi.mocked(register).mockResolvedValue({ user: userWithoutTree });
    vi.mocked(getFamilyTrees).mockResolvedValue([]);
    vi.mocked(createFamilyTree).mockResolvedValue(familyTree);
    const router = renderApp('/register');

    const user = await submitRegistration();

    expect(
      await screen.findByRole('heading', { name: 'Utwórz swoje drzewo rodzinne' }),
    ).toBeInTheDocument();

    await createTree(user);

    expect(await screen.findByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(screen.getByText('właściciel')).toBeInTheDocument();
    expect(vi.mocked(createFamilyTree).mock.calls[0][0]).toEqual({ name: 'Rodzina Kowalskich' });
    expect(router.state.location.pathname).toBe('/trees/rodzina-kowalskich');
  });

  it('allows returning to onboarding and creating a family tree after skipping', async () => {
    vi.mocked(register).mockResolvedValue({ user: userWithoutTree });
    vi.mocked(getFamilyTrees).mockResolvedValue([]);
    vi.mocked(skipOnboarding).mockResolvedValue(skippedUser);
    vi.mocked(createFamilyTree).mockResolvedValue(familyTree);
    const router = renderApp('/register');

    const user = await submitRegistration();
    await screen.findByRole('heading', { name: 'Utwórz swoje drzewo rodzinne' });
    await user.click(screen.getByRole('button', { name: 'Pomiń na razie' }));

    expect(
      await screen.findByRole('heading', { name: 'Nie należysz jeszcze do żadnego drzewa.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Utwórz drzewo' }));
    await screen.findByRole('heading', { name: 'Utwórz swoje drzewo rodzinne' });
    await createTree(user);

    expect(await screen.findByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/trees/rodzina-kowalskich');
  });

  it('selects the first family tree after the user logs in again', async () => {
    vi.mocked(login).mockResolvedValue({ user: userWithoutTree });
    vi.mocked(getFamilyTrees).mockResolvedValue([familyTree]);
    vi.mocked(getFamilyTree).mockResolvedValue(familyTree);
    const router = renderApp('/login');

    await submitLogin();

    expect(await screen.findByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/trees/rodzina-kowalskich');
  });

  it('preserves the skipped onboarding state after the user logs in again', async () => {
    vi.mocked(login).mockResolvedValue({ user: skippedUser });
    vi.mocked(getFamilyTrees).mockResolvedValue([]);
    const router = renderApp('/login');

    await submitLogin();

    expect(
      await screen.findByRole('heading', { name: 'Nie należysz jeszcze do żadnego drzewa.' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/home');
  });

  it('supports refreshing directly on a family tree page', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(userWithoutTree);
    vi.mocked(getFamilyTree).mockResolvedValue(familyTree);
    const router = renderApp('/trees/rodzina-kowalskich');

    expect(await screen.findByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(getFamilyTrees).not.toHaveBeenCalled();
    expect(router.state.location.pathname).toBe('/trees/rodzina-kowalskich');
  });

  it('shows an access error when opening another user family tree directly', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(userWithoutTree);
    vi.mocked(getFamilyTree).mockRejectedValue(new ApiError('Forbidden', 403));
    renderApp('/trees/cudze-drzewo');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nie masz dostępu do tego drzewa genealogicznego.',
    );
  });

  it('keeps the public landing page available to an unauthenticated user', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new ApiError('Unauthenticated', 401));
    const router = renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Kora' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(await screen.findByRole('link', { name: 'Zaloguj się' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('does not redirect away from onboarding while a family tree is being created', async () => {
    let resolveCreation: (tree: FamilyTree) => void = () => undefined;
    vi.mocked(getCurrentUser).mockResolvedValue(userWithoutTree);
    vi.mocked(createFamilyTree).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreation = resolve;
        }),
    );
    const router = renderApp('/onboarding');

    const user = userEvent.setup();
    await screen.findByRole('heading', { name: 'Utwórz swoje drzewo rodzinne' });
    await createTree(user);

    expect(screen.getByRole('button', { name: 'Tworzenie drzewa…' })).toBeDisabled();
    expect(router.state.location.pathname).toBe('/onboarding');

    await act(async () => resolveCreation(familyTree));

    expect(await screen.findByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
  });
});
