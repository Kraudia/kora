export const familyTreeTranslations = {
  home: {
    title: 'Nie należysz jeszcze do żadnego drzewa.',
    description: 'Możesz utworzyć własne drzewo lub poczekać na zaproszenie.',
    createAction: 'Utwórz drzewo',
  },
  onboarding: {
    title: 'Utwórz swoje drzewo rodzinne',
    description:
      'Nadaj drzewu nazwę, aby rozpocząć budowanie historii swojej rodziny. Możesz też zrobić to później.',
    fields: {
      name: {
        label: 'Nazwa drzewa',
        placeholder: 'Rodzina Kowalskich',
      },
    },
    validation: {
      nameRequired: 'Podaj nazwę drzewa.',
      nameTooShort: 'Nazwa drzewa musi mieć co najmniej 2 znaki.',
      nameTooLong: 'Nazwa drzewa może mieć maksymalnie 100 znaków.',
    },
    actions: {
      create: 'Utwórz drzewo',
      creating: 'Tworzenie drzewa…',
      skip: 'Pomiń na razie',
      skipping: 'Pomijanie…',
    },
    errors: {
      create: 'Nie udało się utworzyć drzewa. Spróbuj ponownie.',
      skip: 'Nie udało się pominąć tego kroku. Spróbuj ponownie.',
    },
  },
  page: {
    loading: 'Ładowanie drzewa…',
    roleLabel: 'Rola:',
    roles: {
      owner: 'właściciel',
      editor: 'edytor',
      viewer: 'przeglądający',
    },
    placeholder: 'Tutaj pojawi się Twoje drzewo genealogiczne.',
    errors: {
      forbidden: 'Nie masz dostępu do tego drzewa genealogicznego.',
      notFound: 'Nie znaleziono tego drzewa genealogicznego.',
      fallback: 'Nie udało się pobrać drzewa genealogicznego.',
    },
  },
} as const;
