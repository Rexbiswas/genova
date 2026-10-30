import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bot, FolderPlus, Stethoscope, LayoutGrid } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const BottomNavigation: React.FC = () => {
  const { setMobileMenuOpen, mobileMenuOpen } = useApp();

  return (
    <nav
      className={`mobile-bottom-nav md:hidden fixed left-0 right-0 z-40 px-2.5 sm:px-6 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
        mobileMenuOpen
          ? 'translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
      style={{
        bottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
      }}
      aria-label="Mobile Navigation"
      aria-hidden={mobileMenuOpen}
    >
      <div className="relative max-w-md mx-auto pointer-events-auto">
        {/* Main Clean Glassmorphic Capsule Bar */}
        <div className="relative bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_4px_24px_rgba(9,40,70,0.12),0_-1px_6px_rgba(9,40,70,0.03)] rounded-[26px] sm:rounded-[30px] px-1.5 py-1.5 flex items-center justify-between">
          {/* Tab 1: Home */}
          <NavLink
            to="/dashboard"
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group cursor-pointer select-none"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                    isActive ? 'bg-[#0080ff]/10 text-[#0080ff]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Home className={`w-5 h-5 stroke-[2] ${isActive ? 'fill-[#0080ff]' : ''}`} />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'font-bold text-[#0080ff]' : 'font-semibold text-slate-500'
                  }`}
                >
                  Home
                </span>
                <span
                  className={`w-3.5 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive ? 'bg-[#0080ff] shadow-xs scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                  }`}
                />
              </>
            )}
          </NavLink>

          {/* Tab 2: AI Assistant */}
          <NavLink
            to="/ai-assistant"
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group cursor-pointer select-none"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                    isActive ? 'bg-[#0080ff]/10 text-[#0080ff]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bot className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'font-bold text-[#0080ff]' : 'font-semibold text-slate-500'
                  }`}
                >
                  AI Assistant
                </span>
                <span
                  className={`w-3.5 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive ? 'bg-[#0080ff] shadow-xs scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                  }`}
                />
              </>
            )}
          </NavLink>

          {/* Tab 3: Menu (Hero Center Action Button) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center relative -top-3.5 group cursor-pointer select-none"
            aria-label="Open menu"
          >
            <div
              className={`w-[54px] h-[54px] rounded-full bg-gradient-to-tr from-[#007af5] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white shadow-[0_6px_20px_rgba(0,160,255,0.42)] group-hover:scale-105 group-active:scale-95 transition-all duration-300 ${
                mobileMenuOpen ? 'ring-4 ring-primary/25 scale-105 shadow-[0_8px_24px_rgba(0,160,255,0.55)]' : ''
              }`}
            >
              <LayoutGrid className="w-5 h-5 stroke-[2.3] text-white" />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                mobileMenuOpen ? 'font-bold text-[#0080ff]' : 'font-semibold text-slate-500'
              }`}
            >
              Menu
            </span>
            <span
              className={`w-3.5 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                mobileMenuOpen ? 'bg-[#0080ff] shadow-xs scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
              }`}
            />
          </button>

          {/* Tab 4: Doctors */}
          <NavLink
            to="/doctors"
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group cursor-pointer select-none"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                    isActive ? 'bg-[#0080ff]/10 text-[#0080ff]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'font-bold text-[#0080ff]' : 'font-semibold text-slate-500'
                  }`}
                >
                  Doctors
                </span>
                <span
                  className={`w-3.5 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive ? 'bg-[#0080ff] shadow-xs scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                  }`}
                />
              </>
            )}
          </NavLink>

          {/* Tab 5: Records */}
          <NavLink
            to="/records"
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group cursor-pointer select-none"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
                    isActive ? 'bg-[#0080ff]/10 text-[#0080ff]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FolderPlus className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'font-bold text-[#0080ff]' : 'font-semibold text-slate-500'
                  }`}
                >
                  Records
                </span>
                <span
                  className={`w-3.5 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive ? 'bg-[#0080ff] shadow-xs scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                  }`}
                />
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
