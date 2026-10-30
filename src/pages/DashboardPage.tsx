import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { ConsultationShortcuts } from '../components/dashboard/ConsultationShortcuts';
import { NearbyDoctors } from '../components/dashboard/NearbyDoctors';
import { UpcomingSchedule } from '../components/dashboard/UpcomingSchedule';
import { RecommendedDoctors } from '../components/dashboard/RecommendedDoctors';
import { useApp } from '../contexts/AppContext';

export const DashboardPage: React.FC = () => {
  const { profile, openSearchOverlay } = useApp();

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Mobile Greeting (Screen 1) */}
      <div className="md:hidden space-y-1">
        <span className="text-xs font-semibold text-ink-muted">Good Morning,</span>
        <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-1.5">
          <span>{profile?.name.split(' ')[0] || 'Stevan'}</span>
          <span>👋</span>
        </h1>
        <p className="text-xs text-ink-muted font-medium">Your health, our priority</p>
      </div>

      {/* Mobile Search Bar (Screen 1) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => openSearchOverlay()}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-control bg-white border border-border shadow-xs text-left cursor-pointer active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-ink-muted">
            <Search className="w-4 h-4 text-ink-muted shrink-0" />
            <span className="text-xs font-medium text-ink-muted/80">Search doctor, specialty...</span>
          </div>
          <div className="p-1 rounded-md text-ink-muted">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Mobile Consultation Shortcuts (Screen 1) */}
      <div className="md:hidden">
        <ConsultationShortcuts />
      </div>

      {/* Grid: Nearby Doctors & Upcoming Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <NearbyDoctors />
        </div>
        <div className="xl:col-span-1">
          <UpcomingSchedule />
        </div>
      </div>

      {/* Recommended Doctors Directory (Preserved on desktop/large screens) */}
      <div className="hidden md:block">
        <RecommendedDoctors />
      </div>
    </div>
  );
};

export default DashboardPage;

