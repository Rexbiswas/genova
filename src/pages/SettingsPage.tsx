import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Crown, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { profile, openProModal, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    showToast('Account preferences updated');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider block">PREFERENCES</span>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-2">
          <span>Account Settings</span>
          <Settings className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-xs text-ink-muted">Configure notifications, security, and telemedicine preferences</p>
      </div>

      {/* Plan & Tier Card */}
      <div className="bg-gradient-to-r from-navy via-navy to-[#0b3862] text-white rounded-card p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-cyan/30 text-cyan flex items-center justify-center">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Genova {profile?.tier || 'Standard'}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan/20 text-cyan">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {profile?.tier === 'Pro'
                ? 'Unlimited 24/7 priority teleconsultations and automated AI lab diagnostics active.'
                : 'Standard patient tier. Upgrade for unlimited priority teleconsults and AI triage.'}
            </p>
          </div>
        </div>

        {profile?.tier !== 'Pro' && (
          <Button
            variant="primary"
            size="md"
            onClick={openProModal}
            className="bg-gradient-to-r from-primary to-cyan shadow-md shrink-0"
            icon={<Crown className="w-4 h-4" />}
          >
            Upgrade to Pro
          </Button>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-card border border-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Notification Settings
        </h3>

        <div className="space-y-3 divide-y divide-border-light text-xs">
          <div className="pt-3 flex items-center justify-between">
            <div>
              <strong className="text-ink block">Email Appointment Confirmations</strong>
              <span className="text-ink-muted">Receive calendar invitations and doctor instructions via email.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <strong className="text-ink block">SMS Text Reminders</strong>
              <span className="text-ink-muted">Receive SMS alert 1 hour before scheduled consultation starts.</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <strong className="text-ink block">Two-Factor Authentication (2FA)</strong>
              <span className="text-ink-muted">Protect health records with biometric or authenticator app confirmation.</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={e => setTwoFactor(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
