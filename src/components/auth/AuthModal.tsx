import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Activity, ShieldCheck, Mail, Lock, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, login, register, mode, setMode } = useAuth();
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

  const handleQuickDemo = () => {
    setMode('demo');
    closeAuthModal();
    showToast('Switched to Genova Demo Mode', 'info');
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

        {/* Mode Switcher Banner */}
        <div className="p-3 bg-slate-50 border border-border-light rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-ink">Active Mode: <strong className="uppercase">{mode}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setMode(mode === 'live' ? 'demo' : 'live')}
            className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
          >
            Switch to {mode === 'live' ? 'Demo Mode' : 'Live Mode'}
          </button>
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

        {/* Toggle Login / Register */}
        <div className="text-center pt-2">
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

        <div className="text-center pt-1 border-t border-border-light">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] text-ink-muted hover:text-ink font-semibold"
          >
            Or continue in Guest Demo Mode
          </button>
        </div>
      </div>
    </Modal>
  );
};
