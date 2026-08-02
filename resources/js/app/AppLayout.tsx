import { Outlet } from 'react-router';
import { AppNavbar } from '@/components/AppNavbar';

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background">
      <AppNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
