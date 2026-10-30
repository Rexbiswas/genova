import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, Heart, ShieldCheck, ArrowRight, User, Globe } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        phone,
        dob,
        bloodGroup,
        emergencyContact,
        preferredLanguage,
        profileCompleted: true,
      });
      showToast('Profile completed! Welcome to your dashboard.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#F5FAFF] via-[#FFFFFF] to-[#F0F7FF] flex flex-col justify-between p-4 sm:p-6 text-[#14233B]">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between">
        {/* Header */}
        <header className="flex items-center justify-between pt-2 pb-4">
          <GenovaLogo size="sm" showTagline={false} />
          <button
            type="button"
            onClick={handleSkipForNow}
            className="text-xs font-semibold text-[#718198] hover:text-[#0798D0]"
          >
            Complete Later
          </button>
        </header>

        {/* Content */}
        <div className="my-auto py-2">
          {/* Avatar & Welcome banner */}
          <div className="text-center mb-5">
            <div className="relative inline-block mx-auto mb-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shadow-sky-900/10"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#14233B]">
              Complete Your Patient Profile
            </h1>
            <p className="text-xs text-[#718198] mt-1 max-w-xs mx-auto">
              Welcome, <strong className="text-[#14233B]">{user?.name || 'Patient'}</strong>! Essential health details ensure faster triage and accurate doctor prescriptions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[#14233B] mb-1">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(+1) 555-019-2834"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE8F4] bg-white text-xs sm:text-sm text-[#14233B] outline-none focus:border-[#0798D0] focus:ring-2 focus:ring-[#0798D0]/10 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* DOB & Blood Group row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#14233B] mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-[#DCE8F4] bg-white text-xs text-[#14233B] outline-none focus:border-[#0798D0] transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14233B] mb-1">Blood Group</label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl border border-[#DCE8F4] bg-white text-xs text-[#14233B] outline-none focus:border-[#0798D0] transition-all shadow-sm"
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
              <label className="block text-xs font-bold text-[#14233B] mb-1">
                Emergency Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. (+1) 555-098-7654 (Spouse / Parent)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE8F4] bg-white text-xs sm:text-sm text-[#14233B] outline-none focus:border-[#0798D0] focus:ring-2 focus:ring-[#0798D0]/10 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-bold text-[#14233B] mb-1">
                Preferred Consultation Language
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DCE8F4] bg-white text-xs sm:text-sm text-[#14233B] outline-none focus:border-[#0798D0] transition-all shadow-sm"
                >
                  <option value="en">English (US / UK)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] hover:from-[#0092C9] hover:to-[#007AB8] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-full shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? 'Saving Profile...' : 'Save & Enter Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-[#718198]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Your medical profile is confidential & encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
