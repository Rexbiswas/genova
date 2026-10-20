import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormData } from '../utils/validation';
import { useApp } from '../contexts/AppContext';
import { User, Mail, Phone, Calendar, Settings, Camera, ChevronLeft } from 'lucide-react';
import { LocationPin } from '../components/ui/LocationPin';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, showToast } = useApp();
  const [avatar, setAvatar] = useState(
    profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || 'Stevan Dux',
      email: profile?.email || 'stevan@example.com',
      phone: profile?.phone || '+91 98765 43210',
      location: profile?.location || 'Bengaluru, Karnataka',
      preferredLanguage: profile?.preferredLanguage || 'en',
      bloodGroup: profile?.bloodGroup || 'O+',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile({ ...data, avatar });
    showToast('Profile updated successfully!', 'success');
  };

  const handleEditAvatar = () => {
    const newAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ];
    const next = newAvatars[(newAvatars.indexOf(avatar) + 1) % newAvatars.length];
    setAvatar(next);
    showToast('Profile photo updated', 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-lg mx-auto">
      {/* Top Header (Screen 7) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">My Profile</h1>
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="p-1.5 text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Avatar with Camera Edit Badge (Screen 7) */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative">
          <img
            src={avatar}
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg shadow-slate-200"
          />
          <button
            type="button"
            onClick={handleEditAvatar}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary hover:bg-primary-hover active:scale-95 text-white flex items-center justify-center ring-2 ring-white shadow-md transition-all cursor-pointer"
            aria-label="Edit Profile Photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Form (Screen 7) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
            Full Name
          </label>
          <div className="flex items-center gap-3 px-3.5 py-3 bg-white border border-border rounded-xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <User className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="text"
              {...register('name')}
              className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none"
            />
          </div>
          {errors.name && <p className="text-xs text-error mt-0.5">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
            Email
          </label>
          <div className="flex items-center gap-3 px-3.5 py-3 bg-white border border-border rounded-xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Mail className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="email"
              {...register('email')}
              className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none"
            />
          </div>
          {errors.email && <p className="text-xs text-error mt-0.5">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
            Phone Number
          </label>
          <div className="flex items-center gap-3 px-3.5 py-3 bg-white border border-border rounded-xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Phone className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="tel"
              {...register('phone')}
              className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none"
            />
          </div>
          {errors.phone && <p className="text-xs text-error mt-0.5">{errors.phone.message}</p>}
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
            Location
          </label>
          <div className="flex items-center gap-3 px-3.5 py-3 bg-white border border-border rounded-xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <LocationPin className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="text"
              {...register('location')}
              className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none"
            />
          </div>
          {errors.location && <p className="text-xs text-error mt-0.5">{errors.location.message}</p>}
        </div>

        {/* Date of Birth (Screen 7) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
            Date of Birth
          </label>
          <div className="flex items-center gap-3 px-3.5 py-3 bg-white border border-border rounded-xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Calendar className="w-4 h-4 text-ink-muted shrink-0" />
            <input
              type="text"
              defaultValue="12 Jan 1998"
              className="w-full text-xs sm:text-sm font-semibold text-ink bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Save Changes Fixed/Bottom Action Button (Screen 7) */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

