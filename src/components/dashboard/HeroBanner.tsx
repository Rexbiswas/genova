import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ShieldCheck, ArrowRight, Sparkles, HeartPulse } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const { openBookingModal, openInstantConsultation } = useApp();

  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-hero text-white p-5 sm:p-6 lg:p-10 shadow-lg shadow-navy/25 border border-cyan/20">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

      {/* Mobile Layout (matching Screen 1) */}
      <div className="md:hidden relative z-10 flex items-center justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0 pr-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan/20 border border-cyan/30 text-cyan text-[10px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3 fill-cyan" />
            <span>AI-POWERED INSTANT TRIAGE</span>
          </div>

          <h2 className="text-lg font-black tracking-tight leading-snug">
            Skip The Hospital Waiting Room
          </h2>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            Consult Top Doctors In Minutes.
          </p>
        </div>

        {/* Doctor illustration with action button */}
        <div className="relative shrink-0">
          <div className="w-24 h-28 rounded-2xl overflow-hidden bg-white/10 ring-2 ring-white/20 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
              alt="Verified Doctor"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <button
            onClick={() => openInstantConsultation()}
            aria-label="Start Instant Consultation"
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover active:scale-95 text-white flex items-center justify-center shadow-lg shadow-primary/50 transition-all cursor-pointer ring-2 ring-white"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Desktop Layout (Preserved original rich dashboard hero) */}
      <div className="hidden md:flex relative z-10 max-w-2xl flex-col items-start gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/15 border border-cyan/30 text-cyan text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 fill-cyan" />
          <span>AI-POWERED INSTANT TRIAGE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
          Skip The Hospital Waiting Room. Consult Top Doctors In Minutes.
        </h2>

        <p className="text-sm lg:text-base text-slate-200 leading-relaxed max-w-xl">
          Connect with world-class specialists via HIPAA-compliant HD video, direct clinic appointments, or automated AI diagnostics. Better Care. Smarter Connections.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => openInstantConsultation()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-primary hover:bg-primary-hover text-white text-xs lg:text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Instant Consultation</span>
          </button>

          <button
            onClick={() => navigate('/doctors')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-control bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs lg:text-sm font-bold backdrop-blur-sm transition-all cursor-pointer"
          >
            <span>Find Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Trust Indicators */}
        <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Physicians</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan" />
            <span>24/7 Urgent Medical Care</span>
          </div>
        </div>
      </div>
    </div>
  );
};
