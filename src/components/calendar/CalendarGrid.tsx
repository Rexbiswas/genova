import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Video, Plus, Building2, ChevronDown } from 'lucide-react';
import { getMonthDays } from '../../utils/dates';
import { useAppointments } from '../../hooks/useAppointments';
import { useApp } from '../../contexts/AppContext';

export const CalendarGrid: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 5, 14)); // Defaults around demo month or current
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 5, 14));
  const { appointments } = useAppointments();
  const { openBookingModal } = useApp();

  const days = getMonthDays(currentMonth);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);
  };

  // Find appointments on selected date
  const selectedDateAppointments = appointments.filter(a => {
    try {
      return isSameDay(parseISO(a.date), selectedDate) && a.status !== 'cancelled';
    } catch {
      return false;
    }
  });

  return (
    <div className="space-y-5">
      {/* Mobile Screen 5 Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">Calendar</h1>
        </div>

        <button
          onClick={goToToday}
          className="px-3.5 py-1 text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 rounded-full transition-colors cursor-pointer border border-primary/20"
        >
          Today
        </button>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 shadow-sm space-y-4">
        {/* Month Selector Header */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={prevMonth}
            className="p-1 text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-ink">
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          </div>

          <button
            onClick={nextMonth}
            className="p-1 text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 text-center font-bold text-xs text-ink-muted uppercase tracking-wider py-1">
          {weekdays.map(w => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {days.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            // Check if day has appointments
            const hasAppointments = appointments.some(a => {
              try {
                return isSameDay(parseISO(a.date), day) && a.status !== 'cancelled';
              } catch {
                return false;
              }
            });

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className="flex flex-col items-center justify-center cursor-pointer group py-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : !isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-ink group-hover:bg-slate-100'
                  }`}
                >
                  {format(day, 'd')}
                </div>

                {/* Dot for appointment dates */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {hasAppointments && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List for Selected Date (Screen 5) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-extrabold text-ink">
          Appointments · {format(selectedDate, 'd MMMM yyyy')}
        </h3>

        {selectedDateAppointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-5 text-center text-xs text-ink-muted space-y-2">
            <p>No appointments scheduled for this date.</p>
            <button
              onClick={() => openBookingModal()}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Book an appointment for {format(selectedDate, 'MMM d')}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDateAppointments.map(apt => (
              <div
                key={apt.id}
                onClick={() => navigate(`/appointments/${apt.id}`)}
                className="bg-white rounded-xl border border-border p-3.5 shadow-xs hover:border-primary/40 transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Time Badge (Screen 5) */}
                  <div className="px-2.5 py-1.5 rounded-lg bg-cyan/15 text-primary text-xs font-bold whitespace-nowrap">
                    {apt.time}
                  </div>

                  {/* Doctor Avatar */}
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                  />

                  {/* Doctor Info */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-ink truncate">{apt.doctorName}</h4>
                    <span className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                      {apt.consultationType === 'video' ? (
                        <Video className="w-3 h-3 text-primary" />
                      ) : (
                        <Building2 className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>
                        {apt.consultationType === 'video' ? 'Video Consultation' : 'In-Clinic Appointment'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Appointment Fixed/Bottom Action Button (Screen 5) */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/appointments/new')}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
};

