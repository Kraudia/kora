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

  it('pobiera drzewo na podstawie sluga i pokazuje stan ładowania', () => {
    mockQueryResult({ isPending: true });

    renderPage();

    expect(useFamilyTree).toHaveBeenCalledWith('rodzina-kowalskich');
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie drzewa…');
  });

  it('pokazuje nazwę, rolę i placeholder drzewa', () => {
    mockQueryResult({ data: familyTree });

    renderPage();

    expect(screen.getByRole('heading', { name: 'Rodzina Kowalskich' })).toBeInTheDocument();
    expect(screen.getByText('właściciel')).toBeInTheDocument();
    expect(screen.getByText('Tutaj pojawi się Twoje drzewo genealogiczne.')).toBeInTheDocument();
  });

  it('pokazuje komunikat braku dostępu dla błędu 403', () => {
    mockQueryResult({ error: new ApiError('Forbidden', 403) });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie masz dostępu do tego drzewa genealogicznego.',
    );
  });

  it('pokazuje komunikat braku drzewa dla błędu 404', () => {
    mockQueryResult({ error: new ApiError('Not found', 404) });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie znaleziono tego drzewa genealogicznego.',
    );
  });
});
