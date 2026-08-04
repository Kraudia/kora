import { useNavigate } from 'react-router';
import { ApiError } from '@/shared/api/apiClient';
import { CreateFamilyTreeForm } from '../components/CreateFamilyTreeForm';
import { useCreateFamilyTree } from '../hooks/useCreateFamilyTree';
import { useSkipOnboarding } from '../hooks/useSkipOnboarding';
import { CreateFamilyTreeFormData } from '../schemas/createFamilyTreeSchema';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';

const translations = familyTreeTranslations.onboarding;

export function OnboardingPage() {
  const navigate = useNavigate();
  const createFamilyTreeMutation = useCreateFamilyTree();
  const skipOnboardingMutation = useSkipOnboarding();

  const createApiError =
    createFamilyTreeMutation.error instanceof ApiError ? createFamilyTreeMutation.error : null;
  const serverNameError = createApiError?.errors?.name?.[0];
  const createError = createFamilyTreeMutation.error
    ? serverNameError
      ? undefined
      : createFamilyTreeMutation.error.message || translations.errors.create
    : undefined;
  const skipError = skipOnboardingMutation.error
    ? skipOnboardingMutation.error.message || translations.errors.skip
    : undefined;

  function handleCreate(data: CreateFamilyTreeFormData) {
    createFamilyTreeMutation.mutate(data, {
      onSuccess: (familyTree) => {
        navigate(`/trees/${familyTree.slug}`, { replace: true });
      },
    });
  }

  function handleSkip() {
    skipOnboardingMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/home', { replace: true });
      },
    });
  }

  return (
    <div className="mx-auto w-full max-w-lg py-8">
      <CreateFamilyTreeForm
        onSubmit={handleCreate}
        onSkip={handleSkip}
        isCreating={createFamilyTreeMutation.isPending}
        isSkipping={skipOnboardingMutation.isPending}
        serverNameError={serverNameError}
        createError={createError}
        skipError={skipError}
      />
    </div>
  );
}
