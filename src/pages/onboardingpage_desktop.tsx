import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Calendar,
  FileText,
  Bot,
  ChevronRight,
  ShieldCheck,
  Users,
  Heart,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';
import { GenovaLogo } from '../components/brand/GenovaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { triggerGoogleSignIn } from '../services/googleAuth';

export const OnboardingPageDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { showToast } = useApp();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await triggerGoogleSignIn(
        async (credential) => {
          try {
            const { isNewUser, user } = await loginWithGoogle(credential);
            showToast(
              isNewUser ? 'Welcome to Genova! Complete your profile.' : 'Signed in with Google',
              'success'
            );
            if (user.profileCompleted === false) {
              navigate('/complete-profile');
            } else {
              navigate('/dashboard');
            }
          } catch (err: any) {
            showToast(err.message || 'Google authentication failed', 'error');
          } finally {
            setGoogleLoading(false);
          }
        },
        (err) => {
          showToast(err.message || 'Google sign-in was cancelled', 'info');
          setGoogleLoading(false);
        }
      );
    } catch (err: any) {
      showToast(err.message || 'Google sign-in failed', 'error');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#F5FAFF] via-[#FFFFFF] to-[#EFF7FF] text-[#14233B] flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900 overflow-hidden relative">
      {/* Decorative ambient background curves */}
      <div
        className="absolute top-0 right-0 w-[55vw] h-[85vh] bg-gradient-to-bl from-[#E0F2FE]/70 via-[#BAE6FD]/30 to-transparent rounded-bl-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-3 lg:py-4 flex items-center justify-between shrink-0">
        <GenovaLogo size="md" />
        <button
          type="button"
          onClick={handleLogin}
          className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-[#0798D0] hover:text-[#0284C7] transition-colors cursor-pointer group"
          aria-label="Sign in"
        >
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* Main Content: Two Columns */}
      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex-1 flex items-center py-1 lg:py-2 min-h-0">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center w-full">
          {/* Left Column: Headline, Description & Stacked CTAs */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] lg:text-[11px] font-extrabold tracking-widest text-[#00A3E0] uppercase mb-1.5 block">
              Welcome to Genova
            </span>

            <h1 className="text-3xl lg:text-4xl xl:text-[46px] font-black tracking-tight text-[#14233B] leading-[1.12]">
              Your Health,{' '}
              <span className="bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] bg-clip-text text-transparent block">
                Always Within Reach
              </span>
            </h1>

            <p className="text-xs lg:text-sm xl:text-base text-[#718198] leading-relaxed mt-2.5 lg:mt-3 mb-4 lg:mb-6 max-w-md">
              Consult doctors, manage appointments, access your records, and get AI-powered health
              support — all in one place.
            </p>

            {/* Call To Action Buttons */}
            <div className="space-y-2 lg:space-y-2.5 max-w-sm">
              {/* Primary Action: Get Started */}
              <button
                type="button"
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] hover:from-[#0092C9] hover:to-[#007AB8] text-white font-bold text-xs lg:text-sm xl:text-base py-2.5 lg:py-3 px-6 rounded-full shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Google Sign-In */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-slate-50 text-[#1E293B] font-semibold text-xs lg:text-sm py-2.5 lg:py-3 px-6 rounded-full border border-[#DCE8F4] shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              {/* Secondary Action: I already have an account */}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-transparent hover:bg-sky-50/60 text-[#0798D0] font-semibold text-xs lg:text-sm py-2.5 lg:py-3 px-6 rounded-full border border-[#BCE1F5] transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Right Column: Hero Doctor Composition with 4 Floating Feature Pills */}
          <div className="col-span-12 lg:col-span-7 relative flex items-center justify-center py-2 lg:py-4">
            {/* Center Doctor Image with organic backdrop */}
            <div className="relative w-[270px] h-[330px] lg:w-[300px] lg:h-[370px] xl:w-[350px] xl:h-[420px] shrink-0 flex items-center justify-center">
              {/* Circular light blue backdrop glow */}
              <div
                className="absolute inset-0 m-auto w-[260px] h-[260px] lg:w-[290px] lg:h-[290px] xl:w-[340px] xl:h-[340px] rounded-full bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD]/40 to-transparent blur-md -z-10"
                aria-hidden="true"
              />

              {/* Doctor Portrait */}
              <div className="w-full h-full rounded-[28px] lg:rounded-[32px] xl:rounded-[36px] overflow-hidden bg-gradient-to-b from-[#EBF5FC] to-[#D9EDFB] shadow-2xl shadow-sky-900/10 border-4 border-white">
                <img
                  src="/images/onboarding_doctor_desktop.jpg"
                  alt="Genova Medical Doctor"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>

              {/* FLOATING PILL 1: Video Consultations (Top Left) */}
              <div className="absolute top-1 -left-8 lg:-left-12 xl:-left-16 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 xl:px-4 xl:py-2.5 shadow-xl shadow-slate-200/80 border border-sky-100 flex items-center gap-2.5 lg:gap-3 w-[190px] lg:w-[205px] xl:w-[220px] transition-transform hover:-translate-y-1">
                <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-xl bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
                  <Video className="w-4 h-4 xl:w-5 xl:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] xl:text-xs font-bold text-[#14233B]">Video Consultations</div>
                  <div className="text-[9px] xl:text-[10px] text-[#718198] truncate">
                    Talk to doctors online anytime
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 shrink-0" />
              </div>

              {/* FLOATING PILL 2: Book Appointments (Bottom Left) */}
              <div className="absolute bottom-6 -left-8 lg:-left-12 xl:-left-16 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 xl:px-4 xl:py-2.5 shadow-xl shadow-slate-200/80 border border-purple-100 flex items-center gap-2.5 lg:gap-3 w-[195px] lg:w-[210px] xl:w-[225px] transition-transform hover:-translate-y-1">
                <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                  <Calendar className="w-4 h-4 xl:w-5 xl:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] xl:text-xs font-bold text-[#14233B]">Book Appointments</div>
                  <div className="text-[9px] xl:text-[10px] text-[#718198] truncate">
                    Find and schedule with trusted doctors
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 shrink-0" />
              </div>

              {/* FLOATING PILL 3: Access Medical Records (Top Right) */}
              <div className="absolute top-4 -right-8 lg:-right-12 xl:-right-16 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 xl:px-4 xl:py-2.5 shadow-xl shadow-slate-200/80 border border-emerald-100 flex items-center gap-2.5 lg:gap-3 w-[195px] lg:w-[210px] xl:w-[225px] transition-transform hover:-translate-y-1">
                <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#16A34A] shrink-0">
                  <FileText className="w-4 h-4 xl:w-5 xl:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] xl:text-xs font-bold text-[#14233B]">Access Medical Records</div>
                  <div className="text-[9px] xl:text-[10px] text-[#718198] truncate">
                    View and manage your health records
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 shrink-0" />
              </div>

              {/* FLOATING PILL 4: AI Health Assistant (Bottom Right) */}
              <div className="absolute bottom-16 -right-8 lg:-right-12 xl:-right-16 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 xl:px-4 xl:py-2.5 shadow-xl shadow-slate-200/80 border border-orange-100 flex items-center gap-2.5 lg:gap-3 w-[205px] lg:w-[220px] xl:w-[235px] transition-transform hover:-translate-y-1">
                <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#EA580C] shrink-0">
                  <Bot className="w-4 h-4 xl:w-5 xl:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] xl:text-xs font-bold text-[#14233B]">AI Health Assistant</div>
                  <div className="text-[9px] xl:text-[10px] text-[#718198] truncate">
                    Get instant health guidance
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-400 shrink-0" />
              </div>

              {/* FLOATING PILL 5: Better Care Everyday badge */}
              <div className="absolute -bottom-2 right-2 lg:right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 xl:px-3.5 xl:py-2 shadow-lg shadow-sky-900/10 border border-sky-100 flex items-center gap-2">
                <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-sky-100 flex items-center justify-center text-[#0284C7]">
                  <HeartPulse className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </div>
                <div>
                  <div className="text-[10px] xl:text-[11px] font-bold text-[#14233B]">Better Care</div>
                  <div className="text-[8px] xl:text-[9px] text-[#718198]">Everyday</div>
                </div>
                <div className="flex items-end gap-0.5 h-3.5 ml-1">
                  <div className="w-1 h-1.5 bg-sky-300 rounded-full" />
                  <div className="w-1 h-2.5 bg-sky-400 rounded-full" />
                  <div className="w-1 h-3.5 bg-[#00A3E0] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Trust Indicators Capsule */}
      <footer className="w-full max-w-5xl mx-auto px-6 pb-3 lg:pb-4 pt-1 shrink-0">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#DCE8F4] shadow-sm py-2 lg:py-2.5 px-6 lg:px-8 flex items-center justify-around">
          {/* Trust Item 1 */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] lg:text-xs font-bold text-[#14233B] block leading-tight">
                Secure & Private
              </span>
              <span className="text-[9px] lg:text-[10px] text-[#718198] block leading-tight">
                Your data is protected
              </span>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Trust Item 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] lg:text-xs font-bold text-[#14233B] block leading-tight">
                Trusted Doctors
              </span>
              <span className="text-[9px] lg:text-[10px] text-[#718198] block leading-tight">
                Verified healthcare professionals
              </span>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Trust Item 3 */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-[#E11D48] shrink-0">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] lg:text-xs font-bold text-[#14233B] block leading-tight">
                Better Care
              </span>
              <span className="text-[9px] lg:text-[10px] text-[#718198] block leading-tight">
                For a healthier tomorrow
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingPageDesktop;
