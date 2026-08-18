import { createBrowserRouter } from 'react-router-dom';
import { NotFoundPage } from '@/app/NotFoundPage';
import { BusinessProfilePage } from '@/features/business-profile/pages/BusinessProfilePage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { FinalResultsPage } from '@/features/final-results/pages/FinalResultsPage';
import { ManualInputsPage } from '@/features/manual-inputs/pages/ManualInputsPage';
import { ServiceTaxonomyPage } from '@/features/service-taxonomy/pages/ServiceTaxonomyPage';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthGate } from '@/features/auth/components/AuthGate';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <AuthGate />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'final-results', element: <FinalResultsPage /> },
          { path: 'manual-inputs', element: <ManualInputsPage /> },
          { path: 'business-profile', element: <BusinessProfilePage /> },
          { path: 'service-taxonomy', element: <ServiceTaxonomyPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
