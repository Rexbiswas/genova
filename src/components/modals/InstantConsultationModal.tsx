import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, Phone, MessageSquare, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const InstantConsultationModal: React.FC = () => {
  const { instantConsultationOpen, closeInstantConsultation, openBookingModal, doctors } = useApp();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'chat' | 'in-person'>('video');

  if (!instantConsultationOpen) return null;

  const consultationOptions = [
    {
      id: 'video',
      title: 'Video Call',
      desc: 'High quality video consultation',
      icon: Video,
      color: 'text-primary bg-primary-light/60',
    },
    {
      id: 'audio',
      title: 'Audio Call',
      desc: 'Voice consultation only',
      icon: Phone,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'chat',
      title: 'Chat',
      desc: 'Fast chat with doctor',
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'in-person',
      title: 'Find Nearest Doctor',
      desc: 'In-person clinic appointment',
      icon: MapPin,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ] as const;

  const handleContinue = () => {
    closeInstantConsultation();
    // Route to booking flow with selected consultation mode
    navigate(`/appointments/new?type=${selectedType}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => {
        if (e.target === e.currentTarget) closeInstantConsultation();
      }}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-card p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
        data-lenis-prevent
      >
        {/* Header with drag indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />
        <div className="flex items-center justify-between pb-3 border-b border-border-light">
          <h3 className="text-sm font-bold text-ink-muted uppercase tracking-wider">Instant Consultation</h3>
          <button
            onClick={closeInstantConsultation}
            className="p-1 text-ink-muted hover:text-ink rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Icon / Header */}
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-primary/25">
            <UserCheck className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-extrabold text-ink">Start a Consultation</h4>
          <p className="text-xs text-ink-muted mt-1">Choose how you want to consult with top physicians</p>
        </div>

        {/* Option Cards */}
        <div className="space-y-2.5 my-3">
          {consultationOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary-light/20 ring-1 ring-primary'
                    : 'border-border hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-ink">{opt.title}</h5>
                    <p className="text-[11px] text-ink-muted mt-0.5">{opt.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-white text-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="pt-3 border-t border-border-light mt-auto">
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-control bg-primary hover:bg-primary-hover active:bg-primary-hover/90 text-white font-bold text-sm shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstantConsultationModal;
