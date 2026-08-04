import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { FamilyTreePage } from '@/features/family-trees/pages/FamilyTreePage';
import { HomePage } from '@/features/family-trees/pages/HomePage';
import { OnboardingPage } from '@/features/family-trees/pages/OnboardingPage';

function LandingPage() {
  return <h1>Kora</h1>;
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
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
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);
