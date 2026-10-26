import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  MapPin,
  Crosshair,
  Maximize2,
  Minimize2,
  Globe,
  Bell,
  Check,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
  CalendarCheck,
  HelpCircle,
  Zap,
  LogOut,
  X,
} from 'lucide-react';
import { LocationPin } from '../ui/LocationPin';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchSubmit }) => {
  const {
    profile,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setMobileMenuOpen,
    openProModal,
    showToast,
    openSearchOverlay,
  } = useApp();

  const { logout, openAuthModal, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  // Search & Location
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('Braga, Portugal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search input ref & OS detection
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (window.innerWidth < 768) {
          openSearchOverlay();
        } else {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }
      }

      // Escape key blurs search input
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchOverlay]);

  // Popover States
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    } else {
      navigate(`/doctors?q=${encodeURIComponent(searchTerm)}`);
    }
    showToast(searchTerm ? `Searching for "${searchTerm}"` : 'Showing all specialists');
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    showToast('Detecting location coordinates...', 'info');
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationTerm('New York, NY (Detected)');
        showToast('Location updated to current area');
      },
      () => {
        setLocationTerm('Manhattan, NY');
        showToast('Set default location: Manhattan, NY');
      }
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const languages = [
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-4 lg:px-8 py-4 flex items-center justify-between gap-4 border-b border-border/60 transition-all">
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-control bg-white border border-border text-ink hover:text-primary transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Title (Screen 1) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white shadow-xs">
            <span className="text-base font-black">✚</span>
          </div>
          <div>
            <span className="text-sm font-black text-ink tracking-tight block leading-tight">Genova</span>
            <span className="text-[8px] font-black text-primary tracking-widest uppercase block leading-none">HEALTHCARE OS</span>
          </div>
        </div>

        {/* Desktop Greeting */}
        <div className="hidden md:block">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block">
            Good morning,
          </span>
          <h1 className="text-lg lg:text-xl font-extrabold text-ink tracking-tight">
            Welcome Back, {profile?.name.split(' ')[0] || 'Stevan'}
          </h1>
        </div>
      </div>

      {/* Center: Search Pill with Cmd+K / Ctrl+K */}
      <form
        onSubmit={handleSearchSubmit}
        onClick={() => searchInputRef.current?.focus()}
        className="hidden md:flex items-center bg-white border border-border/80 rounded-2xl px-3 py-1.5 shadow-xs max-w-2xl flex-1 mx-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all cursor-text"
      >
        <div className="flex items-center gap-2.5 flex-1">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search doctors, symptoms, reports, or ask Genova AI..."
            className="w-full text-xs font-medium text-ink bg-transparent outline-none placeholder:text-ink-muted/70"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setSearchTerm('');
                searchInputRef.current?.focus();
              }}
              className="text-ink-muted hover:text-ink p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 pl-2">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              searchInputRef.current?.focus();
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-ink-muted bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md shadow-2xs transition-colors cursor-pointer select-none"
            title={`Focus search (${isMac ? '⌘' : 'Ctrl'} + K)`}
            aria-label="Focus search"
          >
            <span>{isMac ? '⌘' : 'Ctrl'}</span>
            <span>K</span>
          </button>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={openSearchOverlay}
          className="md:hidden w-9 h-9 rounded-control bg-white border border-border flex items-center justify-center text-ink-muted hover:text-primary transition-colors shadow-xs cursor-pointer"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        {/* Language Selector Popover (Desktop / Tablet) */}
        <div ref={langRef} className="relative hidden sm:block">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="h-9 px-2.5 rounded-control bg-white border border-border flex items-center gap-1.5 text-xs font-semibold text-ink hover:border-primary/40 transition-colors shadow-sm cursor-pointer"
            title="Select Language"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="uppercase">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-ink-muted" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-dropdown border border-border p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-ink-muted tracking-wider uppercase">
                Select Language
              </div>
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    setCurrentLang(l.code);
                    setLangOpen(false);
                    showToast(`Language switched to ${l.label}`);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-left transition-colors cursor-pointer ${
                    currentLang === l.code ? 'bg-primary-light text-primary font-semibold' : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {currentLang === l.code && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-control bg-white border border-border flex items-center justify-center text-ink-muted hover:text-primary hover:border-primary/40 transition-colors shadow-sm cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-card shadow-dropdown border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-border-light flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-ink">Notifications</strong>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-light text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border-light" data-lenis-prevent>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-ink-muted">No notifications yet.</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-primary-light/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-xs font-semibold text-ink">{notif.title}</strong>
                        <span className="text-[10px] text-ink-muted shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-control bg-white border border-border hover:border-primary/40 transition-colors shadow-sm cursor-pointer"
          >
            <div className="relative">
              <img
                src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={profile?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-border"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-ink leading-tight">{profile?.name || 'Stevan Dux'}</span>
              <span className="text-[10px] text-ink-muted font-medium">Patient Account</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted hidden sm:block mr-1" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-dropdown border border-border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-border-light mb-1">
                <div className="font-bold text-sm text-ink">{profile?.name || 'Stevan Dux'}</div>
                <div className="text-xs text-ink-muted truncate">{profile?.email || 'stevan@genova.health'}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" /> Genova {profile?.tier || 'Standard'}
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-ink hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <UserIcon className="w-4 h-4 text-ink-muted" /> My Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/appointments');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-ink hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <CalendarCheck className="w-4 h-4 text-ink-muted" /> My Appointments
                </button>
                <button
                  onClick={() => {
                    navigate('/help');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-ink hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <HelpCircle className="w-4 h-4 text-ink-muted" /> Help & Support
                </button>
                <button
                  onClick={() => {
                    openProModal();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-primary hover:bg-primary-light/50 transition-colors cursor-pointer text-left"
                >
                  <Zap className="w-4 h-4 text-cyan" /> Genova Pro Upgrade
                </button>
                <div className="h-[1px] bg-border-light my-1" />
                {isAuthenticated ? (
                  <button
                    onClick={async () => {
                      await logout();
                      showToast('Signed out successfully', 'info');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-error hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-error" /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-primary hover:bg-primary-light/50 transition-colors cursor-pointer text-left"
                  >
                    <UserIcon className="w-4 h-4 text-primary" /> Sign In / Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
