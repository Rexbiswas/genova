import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bot, FolderHeart, Users, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navTabs = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/ai-assistant', label: 'AI Assist', icon: Bot },
    { to: '/records', label: 'Records', icon: FolderHeart },
    { to: '/doctors', label: 'Doctors', icon: Users },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(9,40,70,0.06)] px-4 py-2"
      style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-ink-muted hover:text-ink font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-xl transition-all ${
                      isActive ? 'bg-primary-light/60 scale-105' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
