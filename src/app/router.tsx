import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Skeleton } from '../components/ui/Skeleton';

import { useAuth } from '../contexts/AuthContext';

// Lazy-loaded auth and onboarding routes
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const CompleteProfilePage = lazy(() => import('../pages/CompleteProfilePage'));

// Lazy-loaded route components for optimal bundle splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const DoctorsPage = lazy(() => import('../pages/DoctorsPage'));
const DoctorDetailsPage = lazy(() => import('../pages/DoctorDetailsPage'));
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'));
const BookAppointmentPage = lazy(() => import('../pages/BookAppointmentPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const HelpPage = lazy(() => import('../pages/HelpPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AIAssistantPage = lazy(() => import('../pages/AIAssistantPage'));
const HealthRecordsPage = lazy(() => import('../pages/HealthRecordsPage'));
const MedicationsPage = lazy(() => import('../pages/MedicationsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));

const ProtectedAppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-[#F5FAFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0798D0] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#718198]">Connecting to Genova...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.profileCompleted === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <AppLayout />;
};

const AuthRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    if (user && user.profileCompleted === false) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const CompleteProfileGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.profileCompleted === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PageFallback: React.FC = () => (
  <div className="space-y-3.5 sm:space-y-5 py-1 sm:py-3 max-w-full overflow-hidden animate-in fade-in duration-150">
    {/* Greeting / Page title skeleton */}
    <div className="space-y-1.5">
      <Skeleton className="h-6 w-36 sm:w-48 rounded-lg" />
      <Skeleton className="h-3.5 w-48 sm:w-64 max-w-full rounded-md" />
    </div>

    {/* Mobile search bar skeleton */}
    <Skeleton className="h-10 w-full rounded-xl md:hidden" />

    {/* Hero banner skeleton */}
    <Skeleton className="h-28 sm:h-36 lg:h-44 w-full rounded-2xl" />

    {/* Mobile shortcuts skeleton */}
    <div className="grid grid-cols-4 gap-2.5 md:hidden">
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
    </div>

    {/* Doctor cards section skeleton */}
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-3.5 w-20 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl hidden sm:block" />
        <Skeleton className="h-32 rounded-2xl hidden lg:block" />
      </div>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageFallback />}>
        <OnboardingPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageFallback />}>
        <AuthRouteGuard>
          <LoginPage />
        </AuthRouteGuard>
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageFallback />}>
        <AuthRouteGuard>
          <RegisterPage />
        </AuthRouteGuard>
      </Suspense>
    ),
  },
  {
    path: '/complete-profile',
    element: (
      <Suspense fallback={<PageFallback />}>
        <CompleteProfileGuard>
          <CompleteProfilePage />
        </CompleteProfileGuard>
      </Suspense>
    ),
  },
  {
    element: <ProtectedAppLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'ai-assistant',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AIAssistantPage />
          </Suspense>
        ),
      },
      {
        path: 'records',
        element: (
          <Suspense fallback={<PageFallback />}>
            <HealthRecordsPage />
          </Suspense>
        ),
      },
      {
        path: 'medications',
        element: (
          <Suspense fallback={<PageFallback />}>
            <MedicationsPage />
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<PageFallback />}>
            <CalendarPage />
          </Suspense>
        ),
      },
      {
        path: 'doctors',
        element: (
          <Suspense fallback={<PageFallback />}>
            <DoctorsPage />
          </Suspense>
        ),
      },
      {
        path: 'doctors/:doctorId',
        element: (
          <Suspense fallback={<PageFallback />}>
            <DoctorDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'appointments',
        element: (
          <Suspense fallback={<PageFallback />}>
            <AppointmentsPage />
          </Suspense>
        ),
      },
      {
        path: 'appointments/new',
        element: (
          <Suspense fallback={<PageFallback />}>
            <BookAppointmentPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotificationsPage />
          </Suspense>
        ),
      },
      {
        path: 'help',
        element: (
          <Suspense fallback={<PageFallback />}>
            <HelpPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'unauthorized',
        element: (
          <Suspense fallback={<PageFallback />}>
            <UnauthorizedPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
