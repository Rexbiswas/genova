import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarCheck,
  Stethoscope,
  Clock,
  User,
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  Activity,
  Zap,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Sidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    unreadCount,
    openProModal,
    showToast,
  } = useApp();

  const [activeTooltip, setActiveTooltip] = useState<{ text: string; top: number; left: number } | null>(null);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/calendar', label: 'Calendar', icon: CalendarCheck, badge: 3 },
    { to: '/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/appointments', label: 'Appointments', icon: Clock },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/help', label: 'Help Center', icon: HelpCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, text: string) => {
    if (!sidebarCollapsed && window.innerWidth > 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      text,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-border no-scrollbar transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[2px_0_16px_rgba(15,23,42,0.04)] flex flex-col ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        } hidden md:flex`}
      >
        {/* Floating Edge Toggle Tab */}
        <button
          onClick={toggleSidebar}
          onMouseEnter={e => handleMouseEnter(e, sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')}
          onMouseLeave={handleMouseLeave}
          className="absolute -right-3.5 top-6.5 w-7 h-7 rounded-full bg-white border border-border text-ink-muted hover:text-white hover:bg-primary hover:border-primary shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer z-50 hover:scale-110 active:scale-95"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              sidebarCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Brand Header */}
        <div className={`p-4 border-b border-border-light flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white shadow-md shadow-primary/25 shrink-0">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-xl font-extrabold text-ink tracking-tight leading-none">Genova</span>
              <span className="text-[9px] font-bold tracking-widest text-primary uppercase mt-1">HEALTHCARE OS</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col gap-1.5" data-lenis-prevent>
          {!sidebarCollapsed && (
            <span className="text-[10px] font-bold text-ink-muted/80 tracking-wider px-3 mb-1 uppercase">
              Menu
            </span>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={e => handleMouseEnter(e, item.label)}
                onMouseLeave={handleMouseLeave}
                onClick={handleMouseLeave}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-3 py-2.5 rounded-control font-semibold text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/25'
                      : 'text-ink-muted hover:text-ink hover:bg-slate-50'
                  } ${sidebarCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-ink-muted group-hover:text-primary'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

                    {/* Badge */}
                    {item.badge && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all ${
                          sidebarCollapsed
                            ? 'absolute top-1.5 right-1.5 w-2.5 h-2.5 p-0 bg-primary ring-2 ring-white'
                            : isActive
                            ? 'ml-auto bg-white/20 text-white'
                            : 'ml-auto bg-primary/10 text-primary'
                        }`}
                      >
                        {!sidebarCollapsed && item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <button
            onClick={() => showToast('Signed out of demo session', 'info')}
            onMouseEnter={e => handleMouseEnter(e, 'Sign Out')}
            onMouseLeave={handleMouseLeave}
            className={`mt-4 flex items-center gap-3.5 px-3 py-2.5 rounded-control font-semibold text-sm text-ink-muted hover:text-error hover:bg-red-50 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Pro Card Upgrade Widget */}
        <div className="p-3 mt-auto">
          {sidebarCollapsed ? (
            <button
              onClick={openProModal}
              onMouseEnter={e => handleMouseEnter(e, 'Genova Pro AI')}
              onMouseLeave={handleMouseLeave}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy to-navy-dark border border-cyan/30 text-cyan flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer mx-auto group"
              title="Genova Pro"
            >
              <Zap className="w-5 h-5 animate-pulse-glow" />
            </button>
          ) : (
            <div className="rounded-card bg-gradient-to-br from-navy via-navy to-[#0b3862] border border-cyan/25 p-4 text-white relative overflow-hidden shadow-lg shadow-navy/20">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 text-[10px] font-bold tracking-wide">
                  <Zap className="w-3 h-3 fill-cyan" /> AI ASSIST
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>
              <strong className="block text-sm font-bold tracking-tight">Genova Pro</strong>
              <p className="text-[11px] text-slate-300 mt-1 mb-3 leading-relaxed">
                Unlimited 24/7 priority teleconsults & automated lab triage.
              </p>
              <button
                onClick={openProModal}
                className="w-full h-8 rounded-sm bg-gradient-to-r from-primary to-cyan text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan/20 hover:shadow-cyan/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Upgrade Plan</span>
                <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Floating Tooltip in Collapsed Mode */}
      {activeTooltip && (
        <div
          className="fixed z-[99999] pointer-events-none bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl border border-white/10 flex items-center gap-1.5 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${activeTooltip.top}px`, left: `${activeTooltip.left}px` }}
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          <span>{activeTooltip.text}</span>
        </div>
      )}
    </>
  );
};
