import { useParams } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';
import { ApiError } from '@/shared/api/apiClient';
import { useFamilyTree } from '../hooks/useFamilyTree';

const translations = familyTreeTranslations.page;

function errorMessage(error: Error | null): string {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return translations.errors.forbidden;
    }

    if (error.status === 404) {
      return translations.errors.notFound;
    }
  }

  return translations.errors.fallback;
}

export function FamilyTreePage() {
  const { treeSlug = '' } = useParams<{ treeSlug: string }>();
  const { data: familyTree, isPending, error } = useFamilyTree(treeSlug);

  if (isPending) {
    return <p role="status">{translations.loading}</p>;
  }

  if (error || !familyTree) {
    return <p role="alert">{errorMessage(error)}</p>;
  }

  return (
    <section className="space-y-6" aria-labelledby="family-tree-title">
      <header className="space-y-2">
        <h1 id="family-tree-title" className="font-heading text-3xl font-semibold tracking-tight">
          {familyTree.name}
        </h1>
        <p className="text-muted-foreground">
          {translations.roleLabel}{' '}
          <span className="font-medium text-foreground">{translations.roles[familyTree.role]}</span>
        </p>
      </header>

      <Card className="border-dashed bg-muted/30 py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground">{translations.placeholder}</p>
        </CardContent>
      </Card>
    </section>
  );
}
