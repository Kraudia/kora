import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { FamilyTree } from '../types/familyTree';
import { useFamilyTrees } from '../hooks/useFamilyTrees';
import { FamilyTreeContextRoute } from './FamilyTreeContextRoute';

vi.mock('@/features/auth/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('../hooks/useFamilyTrees', () => ({
  useFamilyTrees: vi.fn(),
}));

const familyTree: FamilyTree = {
  id: 1,
  name: 'Rodzina Kowalskich',
  slug: 'rodzina-kowalskich',
  role: 'owner',
  created_at: '2026-08-07T08:00:00.000000Z',
  updated_at: '2026-08-07T08:00:00.000000Z',
};

function mockContext({
  onboardingSkippedAt = null,
  familyTrees = [],
  isPending = false,
  treesError = null,
}: {
  onboardingSkippedAt?: string | null;
  familyTrees?: FamilyTree[];
  isPending?: boolean;
  treesError?: Error | null;
} = {}) {
  vi.mocked(useCurrentUser).mockReturnValue({
    data: {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      onboarding_skipped_at: onboardingSkippedAt,
    },
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useCurrentUser>);
  vi.mocked(useFamilyTrees).mockReturnValue({
    data: isPending ? undefined : familyTrees,
    isPending,
    error: treesError,
  } as unknown as ReturnType<typeof useFamilyTrees>);
}

function renderContext() {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route
          path="/home"
          element={
            <FamilyTreeContextRoute>
              <p>Empty family tree state</p>
            </FamilyTreeContextRoute>
          }
        />
        <Route path="/onboarding" element={<p>Onboarding</p>} />
        <Route path="/trees/:treeSlug" element={<p>Selected family tree</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('FamilyTreeContextRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('waits for the family tree list before choosing a destination', () => {
    mockContext({ isPending: true });

    renderContext();

    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie aplikacji…');
    expect(screen.queryByText('Onboarding')).not.toBeInTheDocument();
  });

  it('selects the first available family tree', async () => {
    mockContext({ familyTrees: [familyTree] });

    renderContext();

    expect(await screen.findByText('Selected family tree')).toBeInTheDocument();
  });

  it('redirects a user without family trees to onboarding', async () => {
    mockContext();

    renderContext();

    expect(await screen.findByText('Onboarding')).toBeInTheDocument();
  });

  it('renders the empty state after onboarding was skipped without a redirect loop', async () => {
    mockContext({ onboardingSkippedAt: '2026-08-07T08:00:00.000000Z' });

    renderContext();

    expect(await screen.findByText('Empty family tree state')).toBeInTheDocument();
  });

  it('does not show the empty state before onboarding is skipped', async () => {
    mockContext();

    renderContext();

    expect(await screen.findByText('Onboarding')).toBeInTheDocument();
  });

  it('shows a list error without flashing a destination screen', () => {
    mockContext({ treesError: new Error('Network error') });

    renderContext();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie udało się pobrać drzew genealogicznych.',
    );
    expect(screen.queryByText('Onboarding')).not.toBeInTheDocument();
  });
});
