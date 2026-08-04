export const familyTreeTranslations = {
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
