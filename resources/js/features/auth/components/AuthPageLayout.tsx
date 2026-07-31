import type { ReactNode } from 'react';
import { Trees } from 'lucide-react';
import { Link } from 'react-router';

type AuthPageLayoutProps = {
  children: ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trees className="size-4" aria-hidden="true" />
          </span>
          Kora
        </Link>

        {children}
      </div>
    </main>
  );
}
