import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { GenovaLogo } from '../components/brand/GenovaLogo';
import { useAuth } from '../contexts/AuthContext';
import { triggerGoogleSignIn } from '../services/googleAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user.profileCompleted === false) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await triggerGoogleSignIn(
        async (credential) => {
          try {
            const { isNewUser, user } = await loginWithGoogle(credential);
            if (isNewUser || user.profileCompleted === false) {
              navigate('/complete-profile');
            } else {
              navigate('/dashboard');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Google authentication failed.');
          } finally {
            setGoogleLoading(false);
          }
        },
        (err) => {
          setErrorMessage(err.message || 'Google sign-in was cancelled.');
          setGoogleLoading(false);
        }
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#f4f9fd] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden selection:bg-sky-500/20">
      {/* Background Decorative Curves matching reference UI */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-Right Soft Decorative Wave */}
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

        {/* Bottom-Left Soft Decorative Wave */}
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

      {/* Top Left Circular Back Button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 sm:top-8 sm:left-8 w-10 h-10 rounded-full bg-white border border-[#e2eef8] shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all z-10 cursor-pointer active:scale-95"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-[28px] border border-[#e2eef8] shadow-[0_12px_45px_-12px_rgba(2,132,199,0.08)] p-7 sm:p-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <GenovaLogo size="md" showTagline={true} />

          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 mt-6 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-xs sm:text-[13px] mt-2 max-w-[310px] leading-relaxed">
            Sign in to access your appointments, consultations, and health records.
          </p>
        </div>

        {/* Server Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email Address */}
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="loginEmail"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="loginPassword"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="loginPassword"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:border-[#0284c7] focus:ring-[#0284c7]/10 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-gradient-to-r from-[#009ee2] via-[#0284c7] to-[#1e6fe8] hover:from-[#0092d0] hover:to-[#1762d4] text-white font-semibold text-sm sm:text-[15px] py-3 sm:py-3.5 px-6 rounded-xl shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-400 font-normal">
            or continue with
          </span>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer disabled:opacity-60"
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

        {/* Create Account Link */}
        <div className="text-center mt-5 text-xs sm:text-[13px] text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#0284c7] font-semibold hover:underline cursor-pointer"
          >
            Create Account
          </Link>
        </div>

        {/* Security Reassurance Footer */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-normal">
          <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
          <span>Your information is protected</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
