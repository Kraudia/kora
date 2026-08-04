import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from '@/app/AppLayout';
import { AuthenticatedRoute } from '@/features/auth/components/AuthenticatedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { FamilyTreePage } from '@/features/family-trees/pages/FamilyTreePage';
import { HomePage } from '@/features/family-trees/pages/HomePage';
import { OnboardingPage } from '@/features/family-trees/pages/OnboardingPage';
import { FamilyTreeContextRoute } from '@/features/family-trees/components/FamilyTreeContextRoute';

function LandingPage() {
  return <h1>Kora</h1>;
}

export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },
  {
    element: <AuthenticatedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/home',
            element: (
              <FamilyTreeContextRoute>
                <HomePage />
              </FamilyTreeContextRoute>
            ),
          },
          {
            path: '/trees/:treeSlug',
            element: <FamilyTreePage />,
          },
          {
            path: '/onboarding',
            element: <OnboardingPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
];

export const router = createBrowserRouter(appRoutes);
