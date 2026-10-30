import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, Heart, ShieldCheck, ArrowRight, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import { GenovaLogo } from '../components/brand/GenovaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await updateProfile({
        phone: phone.trim(),
        dob,
        bloodGroup,
        emergencyContact: emergencyContact.trim(),
        preferredLanguage,
        profileCompleted: true,
      });
      showToast('Profile updated successfully! Welcome to Genova.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#f4f9fd] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-sky-500/20">
      {/* Background Decorative Curves matching reference UI */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-12 -right-16 w-[560px] h-[560px] md:w-[760px] md:h-[760px] text-[#e3f1fc] opacity-80"
          viewBox="0 0 760 760"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M760 0C540 80 430 320 280 430C130 540 40 760 0 760H760V0Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute -bottom-24 -left-24 w-[520px] h-[520px] md:w-[720px] md:h-[720px] text-[#e7f3fd] opacity-75"
          viewBox="0 0 720 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 720C190 640 280 450 420 330C560 210 650 60 720 0V720H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Centered Profile Completion Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[28px] border border-[#e2eef8] shadow-[0_12px_45px_-12px_rgba(2,132,199,0.08)] p-7 sm:p-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <GenovaLogo size="sm" showTagline={false} />
          <button
            type="button"
            onClick={handleSkipForNow}
            className="text-xs font-semibold text-slate-400 hover:text-[#0284c7] transition cursor-pointer"
          >
            Skip for now →
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-xs sm:text-[13px] mt-1.5 max-w-[320px] mx-auto leading-relaxed">
            Welcome, <strong className="text-slate-800">{user?.name || 'Patient'}</strong>! Add your contact and basic health info to personalize your healthcare experience.
          </p>
        </div>

        {/* Server Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Phone */}
          <div>
            <label htmlFor="userPhone" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="userPhone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(+1) 555-019-2834"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition shadow-2xs"
              />
            </div>
          </div>

          {/* DOB & Blood Group row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="userDob" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="userDob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-2.5 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="userBloodGroup" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Blood Group
              </label>
              <div className="relative">
                <Heart className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="userBloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 transition shadow-2xs cursor-pointer"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label htmlFor="userEmergencyContact" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Emergency Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="userEmergencyContact"
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. (+1) 555-098-7654 (Family / Spouse)"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label htmlFor="userLanguage" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Preferred Language
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="userLanguage"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-sm text-slate-800 outline-none focus:ring-2 transition shadow-2xs cursor-pointer"
              >
                <option value="en">English (US / UK)</option>
                <option value="es">Español (Spanish)</option>
                <option value="pt">Português (Portuguese)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-gradient-to-r from-[#009ee2] via-[#0284c7] to-[#1e6fe8] hover:from-[#0092d0] hover:to-[#1762d4] text-white font-semibold text-sm sm:text-[15px] py-3 sm:py-3.5 px-6 rounded-xl shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </div>
            ) : (
              <>
                <span>Save & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Reassurance Footer */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-normal">
          <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
          <span>Your information is protected</span>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
