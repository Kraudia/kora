import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/apiClient';
import { FamilyTree } from '../types/familyTree';
import { useCreateFamilyTree } from '../hooks/useCreateFamilyTree';
import { useSkipOnboarding } from '../hooks/useSkipOnboarding';
import { OnboardingPage } from './OnboardingPage';

vi.mock('../hooks/useCreateFamilyTree', () => ({
  useCreateFamilyTree: vi.fn(),
}));

vi.mock('../hooks/useSkipOnboarding', () => ({
  useSkipOnboarding: vi.fn(),
}));

const familyTree: FamilyTree = {
  id: 1,
  name: 'Rodzina Kowalskich',
  slug: 'rodzina-kowalskich',
  role: 'owner',
  created_at: '2026-08-07T08:00:00.000000Z',
  updated_at: '2026-08-07T08:00:00.000000Z',
};

const createMutate = vi.fn();
const skipMutate = vi.fn();

function mockMutations({ createError = null }: { createError?: Error | null } = {}) {
  vi.mocked(useCreateFamilyTree).mockReturnValue({
    mutate: createMutate,
    isPending: false,
    error: createError,
  } as unknown as ReturnType<typeof useCreateFamilyTree>);
  vi.mocked(useSkipOnboarding).mockReturnValue({
    mutate: skipMutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useSkipOnboarding>);
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/onboarding']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/trees/:treeSlug" element={<p>Created family tree page</p>} />
        <Route path="/home" element={<p>Home page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutations();
  });

  it('navigates to the created family tree', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText('Nazwa drzewa'), 'Rodzina Kowalskich');
    await user.click(screen.getByRole('button', { name: 'Utwórz drzewo' }));

    await waitFor(() => {
      expect(createMutate).toHaveBeenCalledWith(
        { name: 'Rodzina Kowalskich' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
    });

    const options = createMutate.mock.calls[0][1] as {
      onSuccess: (createdFamilyTree: FamilyTree) => void;
    };

    act(() => options.onSuccess(familyTree));

    expect(await screen.findByText('Created family tree page')).toBeInTheDocument();
  });

  it('navigates to home after onboarding is skipped', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Pomiń na razie' }));

    expect(skipMutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );

    const options = skipMutate.mock.calls[0][1] as {
      onSuccess: () => void;
    };

    act(() => options.onSuccess());

    expect(await screen.findByText('Home page')).toBeInTheDocument();
  });

  it('shows a validation error returned by Laravel', async () => {
    mockMutations({
      createError: new ApiError('Dane są nieprawidłowe.', 422, {
        name: ['Nazwa drzewa jest nieprawidłowa.'],
      }),
    });
    renderPage();

    expect(await screen.findByText('Nazwa drzewa jest nieprawidłowa.')).toBeInTheDocument();
    expect(screen.queryByText('Dane są nieprawidłowe.')).not.toBeInTheDocument();
  });

  it('shows a general API error during creation', () => {
    mockMutations({
      createError: new ApiError('Serwer jest chwilowo niedostępny.', 500),
    });
    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('Serwer jest chwilowo niedostępny.');
  });
});
