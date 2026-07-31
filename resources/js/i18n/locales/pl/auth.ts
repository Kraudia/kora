export const authTranslations = {
  login: {
    title: 'Witaj ponownie',
    description: 'Wprowadź swoje dane, aby zalogować się do konta.',

    fields: {
      email: {
        label: 'Adres e-mail',
        placeholder: 'jan@example.com',
      },
      password: {
        label: 'Hasło',
      },
    },

    validation: {
      emailRequired: 'Podaj adres e-mail.',
      emailInvalid: 'Podaj poprawny adres e-mail.',
      passwordRequired: 'Podaj hasło.',
    },

    actions: {
      submit: 'Zaloguj się',
      submitting: 'Logowanie…',
    },

    separator: 'lub użyj adresu e-mail',

    forgotPassword: 'Nie pamiętasz hasła?',

    signUp: {
      question: 'Nie masz jeszcze konta?',
      link: 'Utwórz konto',
    },
  },

  register: {
    title: 'Utwórz konto',
    description: 'Wprowadź swoje dane, aby utworzyć konto.',

    fields: {
      name: {
        label: 'Imię i nazwisko',
        placeholder: 'Jan Kowalski',
      },
      email: {
        label: 'Adres e-mail',
        placeholder: 'jan@example.com',
        description: 'Użyjemy tego adresu do kontaktu.',
      },
      password: {
        label: 'Hasło',
        description: 'Hasło musi mieć co najmniej 8 znaków.',
      },
      passwordConfirmation: {
        label: 'Powtórz hasło',
      },
    },

    validation: {
      nameRequired: 'Podaj imię i nazwisko.',
      nameTooLong: 'Imię i nazwisko jest za długie.',
      emailInvalid: 'Podaj poprawny adres e-mail.',
      passwordRequired: 'Podaj hasło.',
      passwordTooShort: 'Hasło musi mieć co najmniej 8 znaków.',
      passwordConfirmationRequired: 'Powtórz hasło.',
      passwordsDoNotMatch: 'Hasła nie są identyczne.',
    },

    actions: {
      submit: 'Utwórz konto',
      submitting: 'Tworzenie konta…',
    },

    signIn: {
      question: 'Masz już konto?',
      link: 'Zaloguj się',
    },

    fallbackError: 'Nie udało się utworzyć konta. Spróbuj ponownie.',
  },
} as const;
