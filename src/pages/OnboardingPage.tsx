import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { GenovaLogo } from '../components/brand/GenovaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { triggerGoogleSignIn } from '../services/googleAuth';
import { OnboardingPageDesktop } from './onboardingpage_desktop';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const { showToast } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Automated accordion / slider rotation (cycles every 4 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Manual slide selection with temporary pause on auto-rotation
  const handleManualSlide = (idx: number) => {
    setActiveSlide(idx);
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

  // If already authenticated, redirect appropriately
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.profileCompleted === false) {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

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
            const { isNewUser, user: authedUser } = await loginWithGoogle(credential);
            showToast(
              isNewUser ? 'Welcome to Genova! Complete your profile.' : 'Signed in with Google',
              'success'
            );
            if (authedUser.profileCompleted === false) {
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

  // Touch swipe support for slides (manual swipe with auto-pause)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleManualSlide((activeSlide + 1) % 3);
      } else if (diff < 0) {
        handleManualSlide((activeSlide - 1 + 3) % 3);
      }
    }
    touchStartX.current = null;
  };

  return (
    <>
      {/* Desktop View (Matches Widescreen UI Reference) */}
      <div className="hidden lg:block h-screen h-[100dvh] overflow-hidden">
        <OnboardingPageDesktop />
      </div>

      {/* Mobile View (Preserved completely for mobile devices, fully fits screen) */}
      <div className="lg:hidden h-screen h-[100dvh] max-h-screen bg-gradient-to-b from-[#F5FAFF] via-[#FFFFFF] to-[#F0F7FF] text-[#14233B] flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900 overflow-hidden">
        {/* Container with max width for phone mockup centering */}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-4 sm:px-6 py-2 min-h-0">
        {/* Top Header */}
        <header className="flex items-center justify-between pt-0.5 pb-1 shrink-0">
          <GenovaLogo size="sm" />
          <button
            type="button"
            onClick={handleLogin}
            className="text-xs font-semibold text-[#0798D0] hover:text-[#0284C7] transition-colors px-2 py-0.5 rounded-lg hover:bg-sky-50 active:scale-95"
            aria-label="Sign in"
          >
            Sign In
          </button>
        </header>

        {/* Hero Headline & Subtitle */}
        <div className="text-center mt-0.5 mb-1 shrink-0">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#14233B] leading-tight">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] bg-clip-text text-transparent block sm:inline">
              Always Within Reach
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#718198] mt-0.5 leading-snug max-w-[320px] mx-auto">
            Consult doctors, manage appointments, access your records, and get AI-powered health
            support — all in one place.
          </p>
        </div>        {/* Slide Content Area (Automated + Manual Accordion & Slides) */}
        <div
          className="relative my-auto py-1 touch-pan-y flex-1 flex items-center justify-center min-h-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* SLIDE 1: Primary Visual Reference (Doctor + 4 Floating Feature Pills, Non-overlapping) */}
          {activeSlide === 0 && (
            <div className="relative w-[300px] sm:w-[330px] h-[175px] sm:h-[190px] flex items-center justify-center mx-auto animate-in fade-in duration-300">
              {/* Soft organic circular backdrop glow */}
              <div
                className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#E0F2FE]/80 via-[#BAE6FD]/40 to-transparent blur-xl pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Doctor Center Image */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[3px] border-white shadow-xl shadow-sky-900/10 shrink-0 bg-[#E0F2FE]">
                <img
                  src="/images/onboarding_doctor.jpg"
                  alt="Genova Medical Specialist"
                  className="w-full h-full object-cover object-top scale-105"
                  loading="eager"
                />
              </div>

              {/* 4 Floating Feature Pills — Non-overlapping, compact, interactive */}
              {/* Top Left: Video Consultations */}
              <button
                type="button"
                onClick={() => handleManualSlide(1)}
                className="absolute top-1 left-0 bg-white/95 backdrop-blur-md rounded-xl px-2 py-1 shadow-md shadow-slate-200/60 border border-sky-100 flex items-center gap-1.5 w-[116px] sm:w-[126px] transition-transform active:scale-95 text-left cursor-pointer hover:border-sky-300"
              >
                <div className="w-5 h-5 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
                  <Video className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#14233B] truncate leading-tight">
                    Video
                  </div>
                  <div className="text-[7.5px] sm:text-[8.5px] font-medium text-[#718198] truncate leading-tight">
                    Consultations
                  </div>
                </div>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>

              {/* Top Right: Access Medical Records */}
              <button
                type="button"
                onClick={() => handleManualSlide(2)}
                className="absolute top-4 right-0 bg-white/95 backdrop-blur-md rounded-xl px-2 py-1 shadow-md shadow-slate-200/60 border border-emerald-100 flex items-center gap-1.5 w-[118px] sm:w-[128px] transition-transform active:scale-95 text-left cursor-pointer hover:border-emerald-300"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-[#16A34A] shrink-0">
                  <FileText className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#14233B] truncate leading-tight">
                    Access
                  </div>
                  <div className="text-[7.5px] sm:text-[8.5px] font-medium text-[#718198] truncate leading-tight">
                    Medical Records
                  </div>
                </div>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>

              {/* Bottom Left: Book Appointments */}
              <button
                type="button"
                onClick={() => handleManualSlide(1)}
                className="absolute bottom-4 left-0 bg-white/95 backdrop-blur-md rounded-xl px-2 py-1 shadow-md shadow-slate-200/60 border border-purple-100 flex items-center gap-1.5 w-[116px] sm:w-[126px] transition-transform active:scale-95 text-left cursor-pointer hover:border-purple-300"
              >
                <div className="w-5 h-5 rounded-lg bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                  <Calendar className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#14233B] truncate leading-tight">
                    Book
                  </div>
                  <div className="text-[7.5px] sm:text-[8.5px] font-medium text-[#718198] truncate leading-tight">
                    Appointments
                  </div>
                </div>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>

              {/* Bottom Right: AI Health Assistant */}
              <button
                type="button"
                onClick={() => handleManualSlide(2)}
                className="absolute bottom-1 right-0 bg-white/95 backdrop-blur-md rounded-xl px-2 py-1 shadow-md shadow-slate-200/60 border border-orange-100 flex items-center gap-1.5 w-[118px] sm:w-[128px] transition-transform active:scale-95 text-left cursor-pointer hover:border-orange-300"
              >
                <div className="w-5 h-5 rounded-lg bg-orange-100 flex items-center justify-center text-[#EA580C] shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] font-bold text-[#14233B] truncate leading-tight">
                    AI Health
                  </div>
                  <div className="text-[7.5px] sm:text-[8.5px] font-medium text-[#718198] truncate leading-tight">
                    Assistant
                  </div>
                </div>
                <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              </button>
            </div>
          )}

          {/* SLIDE 2: Connect with Verified Doctors (Automated & Manual Accordion) */}
          {activeSlide === 1 && (
            <div className="flex flex-col items-center justify-center py-1 animate-in fade-in duration-300 w-full">
              <div className="w-full space-y-1.5 max-w-[320px]">
                {/* Accordion Item 1 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 0 ? null : 0);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 0 || expandedItem === null
                      ? 'border-sky-300 shadow-sm shadow-sky-100 bg-sky-50/30'
                      : 'border-slate-100 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">Top Rated Specialists</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          Cardiologists, pediatricians, neurologists, and GPs.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 0 ? 'rotate-90 text-[#0284C7]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-sky-100/60 text-[9.5px] text-[#718198] leading-tight">
                      Over 500+ board-certified medical specialists available for consultation.
                    </div>
                  )}
                </div>

                {/* Accordion Item 2 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 1 ? null : 1);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 1
                      ? 'border-purple-300 shadow-sm shadow-purple-100 bg-purple-50/30'
                      : 'border-slate-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">Instant Scheduling</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          Book same-day in-clinic or HD video appointments.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 1 ? 'rotate-90 text-[#7C3AED]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 1 && (
                    <div className="mt-1.5 pt-1.5 border-t border-purple-100/60 text-[9.5px] text-[#718198] leading-tight">
                      Real-time doctor calendar sync with instant SMS & email confirmation.
                    </div>
                  )}
                </div>

                {/* Accordion Item 3 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 2 ? null : 2);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 2
                      ? 'border-emerald-300 shadow-sm shadow-emerald-100 bg-emerald-50/30'
                      : 'border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[#16A34A] shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">Verified Credentials</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          All doctors are hospital-affiliated and licensed.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 2 ? 'rotate-90 text-[#16A34A]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 2 && (
                    <div className="mt-1.5 pt-1.5 border-t border-emerald-100/60 text-[9.5px] text-[#718198] leading-tight">
                      Multi-tier background checks, medical council verification and ratings.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Smart Medical Records & AI Triage (Automated & Manual Accordion) */}
          {activeSlide === 2 && (
            <div className="flex flex-col items-center justify-center py-1 animate-in fade-in duration-300 w-full">
              <div className="w-full space-y-1.5 max-w-[320px]">
                {/* Accordion Item 1 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 3 ? null : 3);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 3 || expandedItem === null
                      ? 'border-orange-300 shadow-sm shadow-orange-100 bg-orange-50/30'
                      : 'border-slate-100 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#EA580C] shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">24/7 AI Health Companion</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          Instant symptom checking, lab explanations, and advice.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 3 ? 'rotate-90 text-[#EA580C]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 3 && (
                    <div className="mt-1.5 pt-1.5 border-t border-orange-100/60 text-[9.5px] text-[#718198] leading-tight">
                      Trained on clinical medical protocols for safe, instant health guidance.
                    </div>
                  )}
                </div>

                {/* Accordion Item 2 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 4 ? null : 4);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 4
                      ? 'border-sky-300 shadow-sm shadow-sky-100 bg-sky-50/30'
                      : 'border-slate-100 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">Encrypted Health Vault</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          Secure PDF lab reports, vitals, and medication plans.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 4 ? 'rotate-90 text-[#0284C7]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 4 && (
                    <div className="mt-1.5 pt-1.5 border-t border-sky-100/60 text-[9.5px] text-[#718198] leading-tight">
                      End-to-end 256-bit encryption for confidential lab results and vitals.
                    </div>
                  )}
                </div>

                {/* Accordion Item 3 */}
                <div
                  onClick={() => {
                    setExpandedItem(expandedItem === 5 ? null : 5);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 6000);
                  }}
                  className={`bg-white/95 backdrop-blur-md rounded-xl p-2.5 border transition-all cursor-pointer ${
                    expandedItem === 5
                      ? 'border-rose-300 shadow-sm shadow-rose-100 bg-rose-50/30'
                      : 'border-slate-100 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-[#E11D48] shrink-0">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#14233B]">Smart Reminders</div>
                        <div className="text-[10px] text-[#718198] truncate">
                          Automated refill alerts and appointment notifications.
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                        expandedItem === 5 ? 'rotate-90 text-[#E11D48]' : ''
                      }`}
                    />
                  </div>
                  {expandedItem === 5 && (
                    <div className="mt-1.5 pt-1.5 border-t border-rose-100/60 text-[9.5px] text-[#718198] leading-tight">
                      Custom push notifications for prescription dosage schedules.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Trust Panel, Pagination & CTAs */}
        <div className="space-y-2 mt-auto shrink-0">
          {/* Trust Indicators Panel */}
          <div className="bg-white/90 backdrop-blur-md rounded-full border border-sky-100 shadow-sm py-1.5 px-3 flex items-center justify-between">
            {/* Item 1 */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-[#0284C7]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-[#14233B]">
                Secure & Private
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-3.5 bg-slate-200" />

            {/* Item 2 */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-[#14233B]">
                Trusted Doctors
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-3.5 bg-slate-200" />

            {/* Item 3 */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[#E11D48]">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-[#14233B]">
                Better Care
              </span>
            </div>
          </div>

          {/* Pagination Indicators (Automated + Manual) */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleManualSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-5 h-1.5 bg-[#0798D0]'
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-1.5 pt-0.5">
            {/* Primary Action: Get Started */}
            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] hover:from-[#0092C9] hover:to-[#007AB8] text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Google Sign-In Button */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-slate-50 text-[#1E293B] font-semibold text-xs py-2 px-5 rounded-full border border-[#DCE8F4] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                /* Official Google multi-color G SVG icon */
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
              className="w-full bg-transparent hover:bg-sky-50/60 text-[#0798D0] font-semibold text-xs py-2 px-5 rounded-full border border-[#BCE1F5] transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
            >
              I already have an account
            </button>
          </div>

          {/* Legal / Terms of Service footer */}
          <div className="text-center pt-0.5 text-[9px] text-[#718198]">
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => navigate('/help')}
              className="text-[#0798D0] font-medium hover:underline inline"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => navigate('/help')}
              className="text-[#0798D0] font-medium hover:underline inline"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default OnboardingPage;
