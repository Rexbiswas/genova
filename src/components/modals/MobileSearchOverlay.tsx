import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, Clock, Stethoscope, ChevronRight, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const MobileSearchOverlay: React.FC = () => {
  const { searchOverlayOpen, closeSearchOverlay, recentSearches, addRecentSearch, clearRecentSearches, doctors } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOverlayOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOverlayOpen]);

  if (!searchOverlayOpen) return null;

  const specialties = [
    'Cardiologist',
    'Cardiac Surgeon',
    'Pediatric Cardiologist',
    'Cardio Rehab Specialist',
    'Pediatrician',
    'Gastroenterologist',
    'Dermatologist',
    'Orthopedic',
    'General Physician',
  ];

  const filteredSpecialties = query.trim()
    ? specialties.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : specialties.slice(0, 4);

  const matchedDoctors = query.trim()
    ? doctors.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (term: string, isDocId?: string) => {
    addRecentSearch(term);
    closeSearchOverlay();
    if (isDocId) {
      navigate(`/doctors/${isDocId}`);
    } else {
      navigate(`/doctors?q=${encodeURIComponent(term)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSelect(query.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col md:hidden"
      data-lenis-prevent
    >
      {/* Search Header Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 border-b border-border flex items-center gap-2.5 bg-slate-50/80 shrink-0"
      >
        <button
          type="button"
          onClick={closeSearchOverlay}
          className="p-1.5 text-ink-muted hover:text-ink rounded-lg cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search doctors, specialty..."
            className="w-full text-xs font-medium text-ink bg-transparent outline-none placeholder:text-ink-muted/70"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-0.5 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!query.trim()}
          className="text-xs font-bold text-primary hover:text-primary-hover disabled:text-ink-muted/50 px-2 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Doctor Matches if any */}
        {matchedDoctors.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">Physicians</span>
            <div className="space-y-2">
              {matchedDoctors.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => handleSelect(doc.name, doc.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border-light hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-ink">{doc.name}</h5>
                      <span className="text-[10px] text-ink-muted">{doc.specialty}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialty Suggestions */}
        <div>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
            Specialty Suggestions
          </span>
          <div className="space-y-1">
            {filteredSpecialties.map(spec => (
              <div
                key={spec}
                onClick={() => handleSelect(spec)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-ink">{spec}</h5>
                    <span className="text-[10px] text-ink-muted">Specialty</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Recent Searches</span>
              <button
                onClick={clearRecentSearches}
                className="text-[11px] font-semibold text-ink-muted hover:text-error flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-xs text-ink">
                    <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    <span>{item}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
