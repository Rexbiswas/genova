import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { LocationPin } from '../ui/LocationPin';
import { Doctor } from '../../types/doctor';
import { useApp } from '../../contexts/AppContext';

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, compact = false }) => {
  const navigate = useNavigate();
  const { openBookingModal, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(doctor.id);

  return (
    <div
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      className="group bg-white rounded-card border border-border p-3.5 sm:p-4 shadow-card hover:shadow-hover hover:border-primary/40 transition-all duration-200 flex flex-col justify-between h-full cursor-pointer hover:-translate-y-1 relative"
    >
      <div>
        {/* Top Header: Avatar + Identity + Rating + Favorite Heart */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="relative shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-border bg-slate-100 group-hover:scale-105 transition-transform shrink-0"
            />
            {doctor.isRecommended && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow-xs ring-1 ring-white"
                title="Board Certified Specialist"
              >
                <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0 flex-1">
                <h3
                  className="text-sm font-bold text-ink group-hover:text-primary transition-colors cursor-pointer truncate leading-tight"
                  title={doctor.name}
                >
                  {doctor.name}
                </h3>
                <span className="text-[11px] font-semibold text-ink-muted truncate block leading-tight mt-0.5">
                  {doctor.specialty}
                </span>
              </div>

              {/* Favorite Heart Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(doctor.id);
                }}
                className="p-1 -mr-1 -mt-1 text-slate-300 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 transition-transform active:scale-125 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'stroke-[1.75]'
                  }`}
                />
              </button>
            </div>

            {/* Star Rating & Reviews (Always Single Line, Never Wraps) */}
            <div className="flex items-center gap-2 mt-1.5 text-xs whitespace-nowrap">
              <span className="inline-flex items-center gap-1 font-bold text-ink text-xs shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                {doctor.rating.toFixed(1)}
              </span>
              <span className="text-ink-muted text-[11px] whitespace-nowrap">
                ({doctor.reviewCount})
              </span>
              {doctor.distanceKm && (
                <span className="flex items-center gap-1 text-[11px] text-ink-muted shrink-0">
                  <LocationPin className="w-3 h-3 text-primary shrink-0" />
                  <span>{doctor.distanceKm} km</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status & Details */}
        <div className="pt-2 border-t border-border-light space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            {/* Availability status badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available Today</span>
            </div>

            {!compact && (
              <span className="text-[11px] text-ink-muted truncate">
                {doctor.experienceYears} yrs exp
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Session Fee & Book Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border-light mt-3 gap-2">
        <div className="shrink-0 leading-none">
          <span className="text-[9px] font-bold text-ink-muted uppercase tracking-wider block mb-0.5 whitespace-nowrap">
            FEE
          </span>
          <span className="text-base sm:text-lg font-black text-ink leading-none">
            ₹{doctor.price}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openBookingModal(doctor);
          }}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover active:bg-primary-hover/90 rounded-control shadow-xs hover:shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
          <span className="whitespace-nowrap">Book</span>
        </button>
      </div>
    </div>
  );
};
