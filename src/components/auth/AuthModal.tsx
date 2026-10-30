import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Activity, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { triggerGoogleSignIn } from '../../services/googleAuth';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, login, register, loginWithGoogle } = useAuth();
  const { showToast } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
        showToast('Account registered successfully!', 'success');
      } else {
        await login(email, password);
        showToast('Logged in successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={authModalOpen} onClose={closeAuthModal} title={isRegister ? 'Create Genova Account' : 'Sign in to Genova'}>
      <div className="space-y-4 py-1">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan text-white flex items-center justify-center mx-auto mb-2 shadow-md shadow-primary/25">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-ink">
            {isRegister ? 'Join Genova Healthcare OS' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-ink-muted mt-1">
            {isRegister
              ? 'Create a secure patient profile with digital health record storage.'
              : 'Sign in to access your appointments, consultations, and medical records.'}
          </p>
        </div>


        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-ink mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Stevan Dux"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-ink mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@genova.health"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-ink outline-none focus:border-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-cyan shadow-md shadow-primary/25 mt-2"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
          </Button>
        </form>

        <div className="flex items-center my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="px-2 text-[10px] text-ink-muted">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              await triggerGoogleSignIn(async (cred) => {
                await loginWithGoogle(cred);
                closeAuthModal();
                showToast('Signed in with Google', 'success');
              });
            } catch (err: any) {
              showToast(err.message || 'Google sign-in failed', 'error');
            }
          }}
          className="w-full py-2 px-3 rounded-xl border border-border bg-white hover:bg-slate-50 text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle Login / Register */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-ink-muted hover:text-primary transition-colors cursor-pointer"
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
