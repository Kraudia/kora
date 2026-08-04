import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/apiClient';
import { FamilyTree } from '../types/familyTree';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { FamilyTreePage } from './FamilyTreePage';

vi.mock('../hooks/useFamilyTree', () => ({
  useFamilyTree: vi.fn(),
}));

const familyTree: FamilyTree = {
  id: 1,
  name: 'Rodzina Kowalskich',
  slug: 'rodzina-kowalskich',
  role: 'owner',
  created_at: '2026-08-07T08:00:00.000000Z',
  updated_at: '2026-08-07T08:00:00.000000Z',
};

function mockQueryResult({
  data,
  isPending = false,
  error = null,
}: {
  data?: FamilyTree;
  isPending?: boolean;
  error?: Error | null;
}) {
  vi.mocked(useFamilyTree).mockReturnValue({
    data,
    isPending,
    error,
  } as ReturnType<typeof useFamilyTree>);
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/trees/rodzina-kowalskich']}>
      <Routes>
        <Route path="/trees/:treeSlug" element={<FamilyTreePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('FamilyTreePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads a family tree by slug and shows the loading state', () => {
    mockQueryResult({ isPending: true });

    renderPage();

    expect(useFamilyTree).toHaveBeenCalledWith('rodzina-kowalskich');
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie drzewa…');
  });

  it('shows the family tree name, role, and placeholder', () => {
    mockQueryResult({ data: familyTree });

    renderPage();

    expect(screen.getByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(screen.getByText('właściciel')).toBeInTheDocument();
    expect(screen.getByText('Tutaj pojawi się Twoje drzewo genealogiczne.')).toBeInTheDocument();
  });

  it('shows an access denied message for a 403 response', () => {
    mockQueryResult({ error: new ApiError('Forbidden', 403) });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie masz dostępu do tego drzewa genealogicznego.',
    );
  });

  it('shows a missing family tree message for a 404 response', () => {
    mockQueryResult({ error: new ApiError('Not found', 404) });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie znaleziono tego drzewa genealogicznego.',
    );
  });
});
