import React from 'react';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarDays, ShieldCheck } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">CONSULTATION SCHEDULE</span>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>Appointment Calendar</span>
            <CalendarDays className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-xs text-ink-muted">View and manage your upcoming teleconsultations and clinic visits</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Real-time Calendar Sync</span>
        </div>
      </div>

      <CalendarGrid />
    </div>
  );
};

export default CalendarPage;
