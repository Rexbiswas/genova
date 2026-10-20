import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Video, Clock, MapPin, XCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { formatRelativeDate } from '../../utils/dates';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';

export const UpcomingSchedule: React.FC = () => {
  const { upcomingAppointments, cancelAppointment } = useAppointments();
  const { openBookingModal, showToast } = useApp();

  return (
    <section className="bg-white rounded-card border border-border p-5 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">YOUR AGENDA</span>
          <h2 className="text-lg font-extrabold text-ink tracking-tight">Upcoming Schedule</h2>
        </div>
        <Link
          to="/appointments"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>All ({upcomingAppointments.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {upcomingAppointments.length === 0 ? (
        <div className="text-center py-8">
          <CalendarCheck className="w-10 h-10 text-ink-muted/50 mx-auto mb-2" />
          <p className="text-xs font-bold text-ink mb-1">No upcoming appointments</p>
          <p className="text-xs text-ink-muted max-w-xs mx-auto mb-4">
            You currently have no scheduled teleconsultations or clinic visits.
          </p>
          <Button variant="secondary" size="sm" onClick={() => openBookingModal()}>
            Book New Appointment
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingAppointments.slice(0, 3).map(apt => (
            <div
              key={apt.id}
              className="p-3.5 rounded-xl border border-border-light hover:border-slate-300 transition-all bg-slate-50/60 hover:bg-slate-50 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-ink truncate">{apt.doctorName}</h4>
                    <span className="text-[11px] font-semibold text-primary block truncate">{apt.doctorSpecialty}</span>
                    <span className="text-[10px] text-ink-muted flex items-center gap-1 mt-0.5 truncate">
                      <Clock className="w-3 h-3 text-ink-muted shrink-0" />
                      <span>{formatRelativeDate(apt.date)} at {apt.time}</span>
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-light text-primary'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Consultation Mode Bar & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border-light/80 text-xs">
                <div className="flex items-center gap-1.5 text-ink-muted min-w-0">
                  {apt.consultationType === 'video' ? (
                    <span className="inline-flex items-center gap-1 text-cyan font-bold text-[11px] truncate">
                      <Video className="w-3.5 h-3.5 shrink-0" /> Video Call
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-ink-muted text-[11px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> In-Clinic Visit
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.consultationType === 'video' && (
                    <button
                      onClick={() => showToast(`Entering encrypted video room for ${apt.doctorName}...`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-gradient-to-r from-primary to-cyan px-2.5 py-1 rounded-md shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <span>Join Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="text-ink-muted hover:text-error p-1 rounded transition-colors cursor-pointer"
                    title="Cancel Appointment"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
