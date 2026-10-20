import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Mic, X } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { DoctorCard } from '../components/dashboard/DoctorCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Specialty } from '../types/doctor';
import { useApp } from '../contexts/AppContext';

export const DoctorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q');
  const { showToast } = useApp();

  const {
    filteredDoctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    clearFilters,
  } = useDoctors();

  // If URL search query provided
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam, setSearchQuery]);

  const specialties: { id: Specialty | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Cardiology', label: 'Cardiology' },
    { id: 'Dermatology', label: 'Dermatology' },
    { id: 'Gastroenterology', label: 'Gastroenterology' },
    { id: 'Pediatrics', label: 'Pediatrics' },
    { id: 'Surgery', label: 'Surgery' },
    { id: 'Neurology', label: 'Neurology' },
    { id: 'General Medicine', label: 'General Medicine' },
  ];

  const handleVoiceSearch = () => {
    showToast('Voice search is listening (Demo)', 'info');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header with back navigation (Screen 2) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">Find Doctors</h1>
        </div>

        <span className="text-xs font-bold text-ink-muted px-2.5 py-1 bg-slate-100 rounded-full border border-border">
          {filteredDoctors.length} doctors
        </span>
      </div>

      {/* Search Input Bar (Screen 2) */}
      <div className="relative flex items-center bg-white border border-border rounded-xl px-3.5 py-2.5 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <Search className="w-4 h-4 text-ink-muted shrink-0 mr-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search doctor, specialty..."
          className="w-full text-xs sm:text-sm font-medium text-ink bg-transparent outline-none placeholder:text-ink-muted/70"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-ink-muted hover:text-ink p-1 cursor-pointer mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className="text-ink-muted hover:text-primary p-1 cursor-pointer transition-colors"
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontally Scrollable Specialty Filter Chips (Screen 2) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {specialties.map(spec => {
          const isSelected = selectedSpecialty === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white border border-border text-ink-muted hover:text-ink hover:border-slate-300'
              }`}
            >
              {spec.label}
            </button>
          );
        })}
      </div>

      {/* Doctors Results List */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="We couldn't find any medical practitioners matching your criteria."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;

