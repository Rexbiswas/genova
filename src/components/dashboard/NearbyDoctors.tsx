import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw, ArrowRight } from 'lucide-react';
import { DoctorCard } from './DoctorCard';
import { useDoctors } from '../../hooks/useDoctors';
import { EmptyState } from '../ui/EmptyState';

export const NearbyDoctors: React.FC = () => {
  const {
    filteredDoctors,
    selectedSpecialty,
    setSelectedSpecialty,
    clearFilters,
  } = useDoctors();

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Gastroenterology',
    'Pediatrics',
    'Surgery',
  ] as const;

  return (
    <section className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">CLINICAL DISCOVERY</span>
          <h2 className="text-xl font-extrabold text-ink tracking-tight">Nearby Doctors</h2>
          <p className="text-xs text-ink-muted">Licensed healthcare practitioners in your local area</p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline shrink-0"
        >
          <span>View All Doctors ({filteredDoctors.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-ink-muted mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Specialty:</span>
        </div>

        {specialties.map(spec => {
          const isSelected = selectedSpecialty.toLowerCase() === spec.toLowerCase() || (selectedSpecialty === 'all' && spec === 'All Specialties');
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec === 'All Specialties' ? 'all' : spec)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'bg-white border border-border text-ink-muted hover:border-slate-300 hover:text-ink'
              }`}
            >
              {spec}
            </button>
          );
        })}

        {selectedSpecialty !== 'all' && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink px-2 py-1 rounded cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          title="No doctors match this filter"
          description="Try selecting 'All Specialties' or resetting your active search filters."
          actionLabel="Clear Filter"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredDoctors.slice(0, 3).map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </section>
  );
};
