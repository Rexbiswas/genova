import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarCheck,
  Stethoscope,
  Clock,
  User,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { gsap } from '../../animations/gsap';

export const MobileSidebar: React.FC = () => {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    openProModal,
    showToast,
  } = useApp();

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen && drawerRef.current && backdropRef.current) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        drawerRef.current,
        { x: -300 },
        { x: 0, duration: 0.35, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/calendar', label: 'Calendar', icon: CalendarCheck, badge: '3', badgeColor: 'bg-cyan text-white' },
    { to: '/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/appointments', label: 'Appointments', icon: Clock },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: '5', badgeColor: 'bg-red-500 text-white' },
    { to: '/help', label: 'Help Center', icon: HelpCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleClose = () => {
    if (drawerRef.current && backdropRef.current) {
      gsap.to(drawerRef.current, { x: -300, duration: 0.25, ease: 'power2.in' });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => setMobileMenuOpen(false),
      });
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden"
      onClick={e => {
        if (e.target === backdropRef.current) handleClose();
      }}
    >
      <div
        ref={drawerRef}
        className="w-[280px] h-full bg-white flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
        data-lenis-prevent
      >
        {/* Brand & Close (Screen 10) */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white shadow-xs font-black">
              ✚
            </div>
            <div>
              <span className="text-base font-black text-ink tracking-tight block leading-tight">Genova</span>
              <span className="text-[8px] font-black text-primary tracking-widest uppercase block leading-none">HEALTHCARE OS</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu links (Screen 10) */}
        <div className="flex-1 px-3 py-3 flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink hover:text-primary hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      item.badgeColor || 'bg-primary text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <button
            onClick={() => {
              handleClose();
              showToast('Signed out of demo session', 'info');
            }}
            className="mt-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-ink-muted hover:text-error hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Pro Card (Screen 10) */}
        <div className="p-4 mt-auto border-t border-border-light">
          <div className="rounded-2xl bg-[#092846] p-4 text-white shadow-lg space-y-2">
            <h4 className="text-sm font-black text-white">Genova Pro</h4>
            <p className="text-xs text-slate-300 leading-snug">
              Get unlimited consultations & AI health insights.
            </p>
            <button
              onClick={() => {
                handleClose();
                openProModal();
              }}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-primary to-cyan hover:opacity-95 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Upgrade Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;

