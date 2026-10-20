import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Video, Building2 } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { format, parseISO } from 'date-fns';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../contexts/AppContext';

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    upcomingAppointments,
    pastAppointments,
    cancelledAppointments,
  } = useAppointments();

  const { openBookingModal } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const displayedAppointments = {
    upcoming: upcomingAppointments,
    past: pastAppointments,
    cancelled: cancelledAppointments,
  }[activeTab];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header (Screen 6) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">My Appointments</h1>
        </div>
      </div>

      {/* Segmented Filter Tabs (Screen 6) */}
      <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-center text-xs font-bold">
        {(['upcoming', 'past', 'cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-lg capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-primary shadow-xs font-black'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {displayedAppointments.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} appointments`}
          description={
            activeTab === 'upcoming'
              ? 'You have no scheduled consultations. Book an appointment with a verified doctor.'
              : 'No appointments in this category.'
          }
          actionLabel="Book Appointment"
          onAction={() => openBookingModal()}
        />
      ) : (
        <div className="space-y-3 pt-1">
          {displayedAppointments.map(apt => {
            let dayName = 'Fri';
            let dayNum = '14';
            let monthName = 'Jun';

            try {
              const d = parseISO(apt.date);
              dayName = format(d, 'EEE');
              dayNum = format(d, 'd');
              monthName = format(d, 'MMM');
            } catch {
              // Defaults
            }

            return (
              <div
                key={apt.id}
                onClick={() => navigate(`/appointments/${apt.id}`)}
                className="bg-white rounded-2xl border border-border p-3.5 shadow-xs hover:border-primary/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Left Date Block (Screen 6) */}
                  <div className="w-14 h-16 rounded-xl bg-slate-50 border border-border-light flex flex-col items-center justify-center shrink-0 leading-tight">
                    <span className="text-[10px] font-bold text-ink-muted uppercase">{dayName}</span>
                    <span className="text-lg font-black text-ink leading-none my-0.5">{dayNum}</span>
                    <span className="text-[10px] font-bold text-ink-muted uppercase">{monthName}</span>
                  </div>

                  {/* Doctor Info */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink group-hover:text-primary transition-colors truncate">
                      {apt.doctorName}
                    </h3>
                    <span className="text-[11px] text-ink-muted truncate block">
                      {apt.doctorSpecialty}
                    </span>
                    <span className="text-[11px] font-semibold text-ink-muted/90 block mt-0.5">
                      {apt.time} - {apt.time.startsWith('10') ? '10:30 AM' : '03:00 PM'}
                    </span>
                    <span className="text-[11px] text-primary flex items-center gap-1 mt-1 font-medium">
                      {apt.consultationType === 'video' ? (
                        <Video className="w-3.5 h-3.5" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {apt.consultationType === 'video' ? 'Video Consultation' : 'In-Clinic'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="text-ink-muted group-hover:text-ink transition-colors shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Calendar Fixed/Bottom Action Button (Screen 6) */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/calendar')}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Calendar</span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentsPage;

