import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Skeleton } from '../components/ui/Skeleton';

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

const PageFallback: React.FC = () => (
  <div className="space-y-6 py-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-48 rounded-card" />
      <Skeleton className="h-48 rounded-card" />
      <Skeleton className="h-48 rounded-card" />
    </div>
    <Skeleton className="h-72 rounded-card" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
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
