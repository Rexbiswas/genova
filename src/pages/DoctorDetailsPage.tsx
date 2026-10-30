import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Calendar,
  Clock,
  GraduationCap,
  Languages,
  ShieldCheck,
  ChevronLeft,
  ArrowLeft,
  Video,
  Heart,
  Share2,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import { LocationPin } from '../components/ui/LocationPin';
import { useDoctors } from '../hooks/useDoctors';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';

export const DoctorDetailsPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const { openBookingModal, favorites, toggleFavorite, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'about' | 'availability' | 'reviews'>('about');

  const doctor = doctors.find(d => d.id === doctorId);
  const isFavorite = doctor ? favorites.includes(doctor.id) : false;

  if (!doctor) {
    return (
      <div className="p-8 text-center bg-white rounded-card border border-border shadow-card max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-ink mb-2">Physician Not Found</h3>
        <p className="text-xs text-ink-muted mb-4">The doctor profile you requested does not exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/doctors')}>
          Back to Doctor Directory
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${doctor.name} - Genova`,
          text: `Book an appointment with ${doctor.name}, ${doctor.specialty} on Genova Healthcare OS.`,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Doctor profile link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="pb-20 md:pb-12">
      {/* MOBILE SCREEN 3 IMPLEMENTATION */}
      <div className="md:hidden -mx-3 -mt-2.5 sm:-mx-4 sm:-mt-4 bg-white min-h-[100dvh]">
        {/* Top Image Hero Banner with Floating Controls */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30 pointer-events-none" />

          {/* Floating Actions Header */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-ink flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-ink" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(doctor.id)}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-ink flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                aria-label="Favorite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-ink-muted'
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-ink flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4 text-ink-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Identity Header */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black text-ink tracking-tight">{doctor.name}</h1>
              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>
            <p className="text-xs text-ink-muted font-medium mt-0.5">
              {doctor.specialty} <span className="mx-1 text-slate-300">|</span> {doctor.experienceYears} years experience
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-bold text-ink">{doctor.rating.toFixed(1)}</span>
              <span className="text-ink-muted">({doctor.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Segmented Tab Controls (Screen 3) */}
          <div className="flex items-center border-b border-border text-center text-xs font-bold">
            {(['about', 'availability', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 capitalize border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-primary text-primary font-extrabold'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: About */}
          {activeTab === 'about' && (
            <div className="space-y-5 pt-1">
              {/* Key Highlights List (Screen 3) */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-ink-muted shrink-0">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider">
                      Qualification
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      {doctor.education[0] || 'MBBS, MD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-ink-muted shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider">
                      Experience
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      {doctor.experienceYears}+ Years
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-ink-muted shrink-0">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider">
                      Consultation Fee
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      ₹{doctor.price} (Video / In-Clinic)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-ink-muted shrink-0">
                    <LocationPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-ink-muted block uppercase tracking-wider">
                      Clinic Location
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      {doctor.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Doctor Narrative */}
              <div className="pt-2 border-t border-border-light space-y-1.5">
                <h3 className="text-sm font-bold text-ink">About Doctor</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-normal">
                  {doctor.about}
                </p>
              </div>
            </div>
          )}

          {/* Tab Content: Availability */}
          {activeTab === 'availability' && (
            <div className="space-y-3 pt-1">
              <h3 className="text-sm font-bold text-ink">Available Consultation Days</h3>
              <div className="grid grid-cols-2 gap-2">
                {doctor.availability.map((slot, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-border bg-slate-50 text-xs">
                    <span className="font-bold text-ink block">{slot.date}</span>
                    <span className="text-ink-muted text-[11px]">{slot.slots.slice(0, 3).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 pt-1">
              <h3 className="text-sm font-bold text-ink">Verified Patient Feedback</h3>
              <div className="p-3.5 rounded-xl border border-border bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-ink">Stevan Dux</span>
                  <div className="flex text-amber-400">★★★★★</div>
                </div>
                <p className="text-xs text-ink-muted">
                  "Dr. {doctor.name.split(' ').pop()} provided an exceptional consultation. Highly thorough, empathetic, and clear with diagnostic next steps."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Book Appointment Button (Screen 3) */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border p-4 z-40">
          <button
            onClick={() => navigate(`/appointments/new?doctorId=${doctor.id}`)}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW (Preserved Rich Layout) */}
      <div className="hidden md:block space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Main Profile Header Card */}
        <div className="bg-white rounded-card border border-border p-6 shadow-card flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-card object-cover ring-2 ring-primary/20 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-xs font-bold uppercase tracking-wider">
                {doctor.specialty}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-ink">{doctor.name}</h1>
              <p className="text-xs text-ink-muted">{doctor.role}</p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1 font-bold text-ink">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} patient reviews)
                </span>
                <span className="flex items-center gap-1">
                  <LocationPin className="w-3.5 h-3.5 text-primary" />
                  {doctor.address}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Card & Booking Button */}
          <div className="w-full md:w-auto bg-slate-50 border border-border-light rounded-xl p-4 flex md:flex-col items-center justify-between gap-3 shrink-0">
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-ink">₹{doctor.price}.00</span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/appointments/new?doctorId=${doctor.id}`)}
              className="w-full md:w-auto"
              icon={<Calendar className="w-4 h-4" />}
            >
              Book Consultation
            </Button>
          </div>
        </div>

        {/* About & Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-card border border-border p-6 shadow-card space-y-3">
              <h3 className="text-base font-extrabold text-ink">About {doctor.name}</h3>
              <p className="text-xs leading-relaxed text-ink-muted">{doctor.about}</p>
            </div>

            <div className="bg-white rounded-card border border-border p-6 shadow-card space-y-4">
              <h3 className="text-base font-extrabold text-ink">Education & Clinical Certifications</h3>
              <div className="space-y-2">
                {doctor.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-ink">
                    <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-card border border-border p-6 shadow-card space-y-4">
              <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Clinical Details</h3>
              <div className="space-y-3 text-xs divide-y divide-border-light">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-ink-muted">Clinical Experience:</span>
                  <strong className="text-ink">{doctor.experienceYears} Years</strong>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-ink-muted">Consultation Mode:</span>
                  <span className="font-semibold text-ink flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-primary" /> Video & Clinic
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-ink-muted">Spoken Languages:</span>
                  <strong className="text-ink flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-primary" /> {doctor.languages.join(', ')}
                  </strong>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-ink-muted">Verification Status:</span>
                  <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Medical Board Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;

