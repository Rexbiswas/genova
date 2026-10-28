import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bot, FolderPlus, Stethoscope, LayoutGrid } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const BottomNavigation: React.FC = () => {
  const { setMobileMenuOpen, mobileMenuOpen } = useApp();

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 pb-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
        mobileMenuOpen
          ? 'translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
      aria-label="Mobile Navigation"
      aria-hidden={mobileMenuOpen}
    >
      <div className="relative max-w-md mx-auto">
        {/* Main Clean Glassmorphic Capsule Bar */}
        <div
          className="relative bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_-8px_32px_rgba(9,40,70,0.08),0_4px_20px_rgba(0,0,0,0.04)] rounded-[28px] sm:rounded-[32px] px-2 pt-1.5 pb-2 flex items-center justify-between"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
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
            className="flex-1 flex flex-col items-center justify-center relative -top-4 group cursor-pointer select-none"
            aria-label="Open menu"
          >
            <div
              className={`w-[58px] h-[58px] rounded-full bg-gradient-to-tr from-[#007af5] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white shadow-[0_8px_24px_rgba(0,160,255,0.42)] group-hover:scale-105 group-active:scale-95 transition-all duration-300 ${
                mobileMenuOpen ? 'ring-4 ring-primary/25 scale-105 shadow-[0_10px_28px_rgba(0,160,255,0.55)]' : ''
              }`}
            >
              <LayoutGrid className="w-6 h-6 stroke-[2.3] text-white" />
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
