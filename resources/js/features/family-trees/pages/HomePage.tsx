import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { familyTreeTranslations } from '@/i18n/locales/pl/familyTrees';

const translations = familyTreeTranslations.home;

export function HomePage() {
  return (
    <section className="mx-auto w-full max-w-xl py-8" aria-labelledby="empty-tree-title">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-xl">
            <h1 id="empty-tree-title">{translations.title}</h1>
          </CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Link to="/onboarding" className={buttonVariants()}>
            {translations.createAction}
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
