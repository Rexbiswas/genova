import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Bot,
  FolderHeart,
  Pill,
  Users,
  Bell,
  Crown,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
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
    { to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { to: '/doctors', label: 'Find Doctors', icon: Stethoscope },
    { to: '/appointments', label: 'Appointments', icon: Clock },
    { to: '/records', label: 'Health Records', icon: FolderHeart },
    { to: '/medications', label: 'Medications', icon: Pill },
    { to: '/profile?tab=family', label: 'Family Profiles', icon: Users },
    { to: '/calendar', label: 'Calendar', icon: CalendarCheck },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isItemActive = (to: string): boolean => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (to.includes('?')) {
      const [path, query] = to.split('?');
      return currentPath === path && currentSearch.includes(query);
    }

    if (to === '/records') {
      return currentPath === '/records';
    }

    if (to === '/medications') {
      return currentPath === '/medications' || currentPath.startsWith('/medications/');
    }

    if (to === '/profile') {
      return currentPath === '/profile' && !currentSearch.includes('tab=family');
    }

    if (to === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }

    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

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
        className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-100 no-scrollbar transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[2px_0_16px_rgba(15,23,42,0.02)] flex flex-col ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[250px]'
        } hidden md:flex`}
      >
        {/* Floating Edge Toggle Tab */}
        <button
          onClick={toggleSidebar}
          onMouseEnter={e => handleMouseEnter(e, sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')}
          onMouseLeave={handleMouseLeave}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-border text-ink-muted hover:text-white hover:bg-primary hover:border-primary shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer z-50 hover:scale-110 active:scale-95"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              sidebarCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Brand Header */}
        <div className={`p-5 border-b border-slate-100 flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
            <span className="text-xl font-black">✚</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-lg font-black text-ink tracking-tight leading-none">Genova</span>
              <span className="text-[9px] font-semibold text-ink-muted tracking-tight mt-1">Better Care. Smarter Connections.</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 flex flex-col gap-1" data-lenis-prevent>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isItemActive(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onMouseEnter={e => handleMouseEnter(e, item.label)}
                onMouseLeave={handleMouseLeave}
                onClick={handleMouseLeave}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-semibold text-xs tracking-tight transition-all duration-200 group ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-bold'
                    : 'text-slate-600 hover:text-ink hover:bg-slate-50'
                } ${sidebarCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${active ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}

                {/* Badge */}
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full transition-all ${
                      sidebarCollapsed
                        ? 'absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-red-500 ring-2 ring-white'
                        : active
                        ? 'ml-auto bg-white/20 text-white'
                        : 'ml-auto bg-red-500 text-white'
                    }`}
                  >
                    {!sidebarCollapsed && item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Pro Card Upgrade Widget - Matches Image 2 */}
        <div className="p-3.5 mt-auto">
          {sidebarCollapsed ? (
            <button
              onClick={openProModal}
              onMouseEnter={e => handleMouseEnter(e, 'Genova Pro')}
              onMouseLeave={handleMouseLeave}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-sky-200 text-primary flex items-center justify-center shadow-sm hover:scale-105 transition-all cursor-pointer mx-auto group"
              title="Genova Pro"
            >
              <Crown className="w-4 h-4 text-primary" />
            </button>
          ) : (
            <div className="rounded-2xl bg-gradient-to-b from-[#f0f8ff] via-[#e6f4fe] to-[#edf6ff] border border-sky-100/80 p-4 text-ink relative overflow-hidden shadow-xs">
              <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center mb-2.5">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <strong className="block text-xs font-black tracking-tight text-ink">Genova Pro</strong>
              <p className="text-[11px] text-slate-500 mt-1 mb-3 leading-snug">
                Unlock advanced AI insights, priority consultations & more.
              </p>
              <button
                onClick={openProModal}
                className="w-full h-8 rounded-xl bg-[#0b192c] hover:bg-[#12233b] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Upgrade Now</span>
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
