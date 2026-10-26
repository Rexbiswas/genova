import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, CalendarCheck, IndianRupee, CalendarPlus, Star } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { useApp } from '../../contexts/AppContext';

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';

export const RecommendedDoctors: React.FC = () => {
  const { recommendedDoctors } = useDoctors();
  const navigate = useNavigate();
  const { openBookingModal } = useApp();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">TOP RATED</span>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-ink tracking-tight">Recommended Doctors</h2>
            <Sparkles className="w-4 h-4 text-primary fill-primary" />
          </div>
          <p className="text-xs text-ink-muted">Highest patient satisfaction and clinical excellence ratings</p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
        >
          <span>View Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendedDoctors.slice(0, 3).map(doctor => (
          <div
            key={doctor.id}
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            className="group bg-white rounded-card border border-border p-5 shadow-card hover:shadow-hover hover:border-primary/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 bg-slate-100 group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] ring-2 ring-white shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                    className="text-base font-bold text-ink hover:text-primary transition-colors cursor-pointer truncate"
                    title={doctor.name}
                  >
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-ink-muted truncate mt-0.5">
                    {doctor.role} · {doctor.experienceYears} yrs
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doctor.specialty}
                    </span>
                    <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-800">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                      <span>{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata 2-col box */}
              <div className="grid grid-cols-2 border-t border-border-light pt-3 mt-2 text-xs">
                <div className="flex items-center gap-2 pr-2">
                  <CalendarCheck className="w-4 h-4 text-primary shrink-0" />
                  <div className="leading-tight min-w-0">
                    <b className="text-ink text-[11px] block truncate">Tue, Thu, Sat</b>
                    <small className="text-ink-muted text-[10px] block truncate">10:00 AM - 02:00 PM</small>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-3 border-l border-border-light">
                  <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                  <div className="leading-tight min-w-0">
                    <b className="text-ink text-[11px] block truncate">₹{doctor.price}</b>
                    <small className="text-ink-muted text-[10px] block truncate">Starting fee</small>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openBookingModal(doctor);
              }}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-primary to-primary-hover hover:to-cyan text-white text-xs font-bold rounded-control shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 stroke-[2.2]" />
              <span>Book Appointment</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
