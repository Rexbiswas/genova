import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormData } from '../utils/validation';
import { useApp } from '../contexts/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  Camera,
  ChevronLeft,
  ShieldCheck,
  Heart,
  Activity,
  FileText,
  Check,
  AlertCircle,
  Sparkles,
  Globe,
  Lock,
  ArrowUpRight,
  Droplet,
  Bell,
  CheckCircle2,
  X,
  Stethoscope,
} from 'lucide-react';
import { LocationPin } from '../components/ui/LocationPin';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

type TabType = 'personal' | 'clinical' | 'security';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, showToast, openProModal } = useApp();
  const { upcomingAppointments } = useAppointments();

  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [avatar, setAvatar] = useState(
    profile?.avatar || AVATAR_OPTIONS[0]
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(profile?.bloodGroup || 'O+');
  const [emailNotifs, setEmailNotifs] = useState(profile?.emailNotifications ?? true);
  const [smsNotifs, setSmsNotifs] = useState(profile?.smsNotifications ?? true);
  const [twoFactor, setTwoFactor] = useState(profile?.twoFactorEnabled ?? false);
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergencyContact || '(+351) 911 889 001 (Maria Dux)');
  const [dob, setDob] = useState(profile?.dob || '1998-01-12');
  const [medicalNotes, setMedicalNotes] = useState('No known drug allergies. Seasonal pollen sensitivity.');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || 'Stevan Dux',
      email: profile?.email || 'stevan@genova.health',
      phone: profile?.phone || '(+351) 912 345 678',
      location: profile?.location || 'Braga, Portugal',
      preferredLanguage: profile?.preferredLanguage || 'en',
      bloodGroup: profile?.bloodGroup || 'O+',
      dob: profile?.dob || '1998-01-12',
      emergencyContact: profile?.emergencyContact || '(+351) 911 889 001 (Maria Dux)',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      ...data,
      avatar,
      bloodGroup: selectedBloodGroup,
      dob,
      emergencyContact,
      emailNotifications: emailNotifs,
      smsNotifications: smsNotifs,
      twoFactorEnabled: twoFactor,
    });
    showToast('Patient profile updated successfully!', 'success');
  };

  const handleSelectAvatar = (url: string) => {
    setAvatar(url);
    setShowAvatarPicker(false);
    showToast('Profile photo updated', 'info');
  };

  const handleBloodGroupSelect = (bg: string) => {
    setSelectedBloodGroup(bg);
    setValue('bloodGroup', bg, { shouldDirty: true });
  };

  const handleResetForm = () => {
    reset({
      name: profile?.name || 'Stevan Dux',
      email: profile?.email || 'stevan@genova.health',
      phone: profile?.phone || '(+351) 912 345 678',
      location: profile?.location || 'Braga, Portugal',
      preferredLanguage: profile?.preferredLanguage || 'en',
      bloodGroup: profile?.bloodGroup || 'O+',
      dob: profile?.dob || '1998-01-12',
      emergencyContact: profile?.emergencyContact || '(+351) 911 889 001 (Maria Dux)',
    });
    setSelectedBloodGroup(profile?.bloodGroup || 'O+');
    setDob(profile?.dob || '1998-01-12');
    showToast('Form reset to saved values', 'info');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 max-w-5xl mx-auto w-full min-w-0">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-border text-ink-muted hover:text-ink hover:border-primary/40 hover:bg-slate-50 flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-ink tracking-tight">Patient Profile</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] sm:text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-primary" /> Verified
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-ink-muted truncate">
              Manage personal demographics, clinical vitals & account preferences
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          <span className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-border text-[11px] sm:text-xs font-bold text-ink-muted flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Genova ID: <strong className="text-ink font-extrabold">#GNV-88291</strong>
          </span>

          <button
            onClick={() => navigate('/settings')}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 border border-border rounded-xl text-ink-muted hover:text-ink transition-colors cursor-pointer shadow-xs"
            title="Account Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Hero Cover & Identity Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-border shadow-card relative w-full min-w-0">
        {/* Cover Gradient Banner */}
        <div className="relative min-h-[110px] sm:h-44 bg-gradient-to-r from-navy via-[#0b3862] to-primary p-3 sm:p-6 flex items-start justify-between gap-2 text-white rounded-t-2xl sm:rounded-t-3xl overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-primary/20 blur-xl pointer-events-none" />

          {/* Healthcare OS Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-cyan shrink-0" />
            <span className="truncate">Genova Clinical Network</span>
          </div>

          {/* Tier Action Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openProModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan to-primary hover:brightness-110 active:scale-95 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-cyan/30 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile?.tier === 'Pro' ? 'Pro Member' : 'Upgrade to Pro'}</span>
            </button>
          </div>
        </div>

        {/* Identity Details Row (Elevated with z-20 to stack above stats grid) */}
        <div className="px-4 sm:px-8 pb-5 sm:pb-6 pt-0 relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-10 sm:-mt-16">
            {/* Avatar with Camera badge */}
            <div className="relative inline-block self-start">
              <div className="relative group">
                <img
                  src={avatar}
                  alt={profile?.name || 'Stevan Dux'}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(prev => !prev)}
                  className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-white flex items-center justify-center ring-2 ring-white shadow-md transition-all cursor-pointer group-hover:scale-105"
                  title="Change avatar"
                  aria-label="Change photo"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Avatar Picker Popover with High Z-Index, Backdrop, & Dedicated Scroller */}
              {showAvatarPicker && (
                <>
                  {/* Backdrop for click-outside dismissal */}
                  <div
                    className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[0.5px]"
                    onClick={() => setShowAvatarPicker(false)}
                    onWheel={e => e.preventDefault()}
                  />
                  <div
                    data-lenis-prevent
                    onWheel={e => e.stopPropagation()}
                    className="absolute left-0 mt-3 p-3.5 sm:p-4 bg-white rounded-2xl shadow-2xl border border-border z-50 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-light">
                      <div>
                        <span className="text-xs font-bold text-ink block">Choose Profile Photo</span>
                        <span className="text-[10px] text-ink-muted">Select an avatar or clinical portrait</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(false)}
                        className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Scrollable grid container with lenis prevention */}
                    <div
                      data-lenis-prevent
                      onWheel={e => e.stopPropagation()}
                      className="max-h-56 sm:max-h-64 overflow-y-auto pr-1 space-y-2 overscroll-contain touch-pan-y"
                    >
                      <div className="grid grid-cols-3 gap-2.5">
                        {AVATAR_OPTIONS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectAvatar(url)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer hover:scale-105 group ${
                              avatar === url ? 'border-primary ring-2 ring-primary/30 shadow-sm' : 'border-slate-100 hover:border-primary/40'
                            }`}
                          >
                            <img src={url} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                            {avatar === url && (
                              <div className="absolute inset-0 bg-primary/35 flex items-center justify-center text-white backdrop-blur-[1px]">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick action buttons on right: 2 columns on mobile */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/appointments')}
                className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-border text-xs font-bold text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">My Appointments</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-border text-xs font-bold text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">Care Support</span>
              </button>
            </div>
          </div>

          {/* User Headline & Bio */}
          <div className="mt-3 sm:mt-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <h2 className="text-lg sm:text-2xl font-black text-ink tracking-tight">
                {profile?.name || 'Stevan Dux'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Patient
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-semibold">
                Member since 2023
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-4 text-xs text-ink-muted mt-2 font-medium">
              <span className="flex items-center gap-1.5 min-w-0">
                <LocationPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{profile?.location || 'Braga, Portugal'}</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{profile?.email || 'stevan@genova.health'}</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{profile?.phone || '(+351) 912 345 678'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Vital Summary Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border-light divide-x divide-y sm:divide-y-0 divide-border-light bg-slate-50/60 w-full min-w-0">
          <div className="p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-ink-muted uppercase tracking-wider block truncate">
                Upcoming Visits
              </span>
              <div className="flex items-center gap-1">
                <strong className="text-xs sm:text-base font-extrabold text-ink truncate">
                  {upcomingAppointments.length} Active
                </strong>
                <ArrowUpRight className="w-3 h-3 text-ink-muted shrink-0 hidden sm:inline" />
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500/20" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-ink-muted uppercase tracking-wider block truncate">
                Blood Group
              </span>
              <strong className="text-xs sm:text-base font-extrabold text-ink truncate block">
                {selectedBloodGroup} (Rh+)
              </strong>
            </div>
          </div>

          <div className="p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-ink-muted uppercase tracking-wider block truncate">
                Health Records
              </span>
              <strong className="text-xs sm:text-base font-extrabold text-ink truncate block">
                12 Encrypted
              </strong>
            </div>
          </div>

          <div className="p-3 sm:p-5 flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan/15 text-cyan-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-ink-muted uppercase tracking-wider block truncate">
                Care Tier
              </span>
              <strong className="text-xs sm:text-base font-extrabold text-ink truncate block">
                Genova {profile?.tier || 'Standard'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-white border border-border rounded-2xl shadow-xs overflow-x-auto no-scrollbar scroll-smooth w-full">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'personal'
              ? 'bg-primary text-white shadow-sm shadow-primary/25'
              : 'text-ink-muted hover:text-ink hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clinical')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'clinical'
              ? 'bg-primary text-white shadow-sm shadow-primary/25'
              : 'text-ink-muted hover:text-ink hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Clinical & Emergency</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'security'
              ? 'bg-primary text-white shadow-sm shadow-primary/25'
              : 'text-ink-muted hover:text-ink hover:bg-slate-50'
          }`}
        >
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>Preferences & Security</span>
        </button>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-border shadow-card p-4 sm:p-8 w-full min-w-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-border-light pb-4">
                <h3 className="text-base font-extrabold text-ink tracking-tight">Personal Demographics</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Legal name, contact coordinates, and basic identifying records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                    <span>Full Legal Name</span>
                    <span className="text-[10px] text-primary font-semibold">Required</span>
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <User className="w-4 h-4 text-ink-muted shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Stevan Dux"
                      {...register('name')}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                    Date of Birth
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <Calendar className="w-4 h-4 text-ink-muted shrink-0" />
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <Mail className="w-4 h-4 text-ink-muted shrink-0" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-error font-medium">{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                    <span>Phone Number</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Primary Contact</span>
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <Phone className="w-4 h-4 text-ink-muted shrink-0" />
                    <input
                      type="tel"
                      placeholder="(+351) 912 345 678"
                      {...register('phone')}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-error font-medium">{errors.phone.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                    City & Region
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <LocationPin className="w-4 h-4 text-ink-muted shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Braga, Portugal"
                      {...register('location')}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.location && <p className="text-xs text-error font-medium">{errors.location.message}</p>}
                </div>

                {/* Preferred Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                    Preferred Consultation Language
                  </label>
                  <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <Globe className="w-4 h-4 text-ink-muted shrink-0" />
                    <select
                      {...register('preferredLanguage')}
                      className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none cursor-pointer"
                    >
                      <option value="en">English (US / International)</option>
                      <option value="pt">Portuguese (Portugal)</option>
                      <option value="es">Spanish (Español)</option>
                      <option value="fr">French (Français)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL & EMERGENCY */}
          {activeTab === 'clinical' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-border-light pb-4">
                <h3 className="text-base font-extrabold text-ink tracking-tight">Clinical Vitals & Emergency Protocol</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Medical profile used during triage, e-prescriptions, and hospital synchronization.
                </p>
              </div>

              {/* Blood Group Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-rose-500" />
                    Select Blood Type (ABO & Rh Factor)
                  </span>
                  <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                    Selected: {selectedBloodGroup}
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => handleBloodGroupSelect(bg)}
                      className={`h-11 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border ${
                        selectedBloodGroup === bg
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-[1.03]'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-ink border-border hover:border-slate-300'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Emergency Contact Person & Phone
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                    Critical Priority
                  </span>
                </label>
                <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                  <Phone className="w-4 h-4 text-ink-muted shrink-0" />
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Maria Dux (Spouse) - (+351) 911 889 001"
                    className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Allergies & Medical Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                  Allergies & Pre-Existing Conditions
                </label>
                <div className="p-3 bg-slate-50/70 border border-border rounded-xl focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                  <textarea
                    rows={3}
                    value={medicalNotes}
                    onChange={e => setMedicalNotes(e.target.value)}
                    placeholder="List any medication allergies, asthma, diabetes, or chronic medical conditions..."
                    className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none resize-none placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[11px] text-ink-muted">
                  This note will be automatically flagged to attending physicians before your video consultations.
                </p>
              </div>

              {/* Primary Care Provider Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-light/40 to-cyan/10 border border-primary/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80"
                    alt="Dr. Aline Carvalho"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Primary Care Physician
                    </span>
                    <strong className="text-sm font-extrabold text-ink block">Dr. Aline Carvalho</strong>
                    <span className="text-xs text-ink-muted">Senior Cardiologist • Braga Central Hospital</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/doctors/doc-1')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-primary border border-primary/30 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Consult
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-border-light pb-4">
                <h3 className="text-base font-extrabold text-ink tracking-tight">Security & Communications</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Manage patient consent, real-time alerts, and multi-factor security.
                </p>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-primary" />
                  Appointment & Triage Notifications
                </h4>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-border">
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-ink block">Email Reminders</strong>
                      <span className="text-xs text-ink-muted">
                        Receive calendar invites, doctor prescriptions, and laboratory results via email.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailNotifs(prev => !prev)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        emailNotifs ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          emailNotifs ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-border">
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-ink block">SMS Urgent Telehealth Alerts</strong>
                      <span className="text-xs text-ink-muted">
                        Instant SMS alert 10 minutes before physician joins video consultation room.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSmsNotifs(prev => !prev)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        smsNotifs ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          smsNotifs ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  Medical Privacy & Authentication
                </h4>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm font-bold text-ink">Two-Factor Authentication (2FA)</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Recommended
                      </span>
                    </div>
                    <span className="text-xs text-ink-muted">
                      Require an SMS/Authenticator code to access medical records and video consultation rooms.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactor(prev => !prev);
                      showToast(!twoFactor ? 'Two-Factor Authentication Enabled' : '2FA Disabled', 'info');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      twoFactor ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        twoFactor ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    <strong>HIPAA & GDPR Encrypted:</strong> All patient data, symptoms, prescriptions, and consult logs are secured with military-grade 256-bit AES encryption.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-white hover:bg-slate-50 active:scale-95 text-xs sm:text-sm font-bold text-ink-muted hover:text-ink transition-all cursor-pointer text-center"
            >
              Reset to Saved
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-cyan hover:brightness-105 active:scale-98 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
