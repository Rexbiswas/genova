import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { GenovaLogo } from '../components/brand/GenovaLogo';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { triggerGoogleSignIn } from '../services/googleAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, skipToDemo } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Genova!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await triggerGoogleSignIn(
        async (credential) => {
          try {
            const { isNewUser, user } = await loginWithGoogle(credential);
            showToast(
              isNewUser ? 'Welcome! Complete your profile.' : 'Signed in successfully with Google',
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

  const handleDemoMode = () => {
    skipToDemo();
    showToast('Switched to Genova Demo Mode', 'info');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#F5FAFF] via-[#FFFFFF] to-[#F0F7FF] flex flex-col justify-between p-4 sm:p-6 text-[#14233B]">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between">
        {/* Top Header */}
        <header className="flex items-center justify-between pt-2 pb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white border border-[#DCE8F4] flex items-center justify-center text-[#718198] hover:text-[#0798D0] hover:border-[#0798D0] shadow-sm transition-all"
            aria-label="Back to onboarding"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <GenovaLogo size="sm" showTagline={false} />
          <div className="w-9" />
        </header>

        {/* Form Container */}
        <div className="my-auto py-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-[#14233B]">Welcome Back</h1>
            <p className="text-xs text-[#718198] mt-1">
              Sign in to manage appointments, consultations, and health records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#14233B] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@genova.health"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#DCE8F4] bg-white text-xs sm:text-sm text-[#14233B] outline-none focus:border-[#0798D0] focus:ring-2 focus:ring-[#0798D0]/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#14233B]">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent in live mode', 'info')}
                  className="text-[11px] text-[#0798D0] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#DCE8F4] bg-white text-xs sm:text-sm text-[#14233B] outline-none focus:border-[#0798D0] focus:ring-2 focus:ring-[#0798D0]/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#00A3E0] via-[#0088CC] to-[#0284C7] hover:from-[#0092C9] hover:to-[#007AB8] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-full shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-3 text-[11px] text-[#718198] font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-slate-50 text-[#1E293B] font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-6 rounded-full border border-[#DCE8F4] shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
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

          {/* Toggle Register */}
          <div className="text-center mt-5 text-xs text-[#718198]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0798D0] font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Demo Mode Action */}
        <div className="text-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDemoMode}
            className="text-xs font-semibold text-[#718198] hover:text-[#0798D0] transition-colors"
          >
            Or explore as Guest in Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
