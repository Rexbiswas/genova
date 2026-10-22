import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor } from '../types/doctor';
import { Appointment, BookingRequest } from '../types/appointment';
import { UserProfile } from '../types/user';
import { NotificationItem } from '../types/notification';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { notificationService } from '../services/notificationService';
import { profileService } from '../services/profileService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  profile: UserProfile | null;
  unreadCount: number;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  bookingDoctor: Doctor | null;
  proModalOpen: boolean;
  instantConsultationOpen: boolean;
  searchOverlayOpen: boolean;
  favorites: string[];
  recentSearches: string[];
  toasts: ToastMessage[];
  loading: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  openBookingModal: (doctor?: Doctor | null) => void;
  closeBookingModal: () => void;
  openProModal: () => void;
  closeProModal: () => void;
  openInstantConsultation: () => void;
  closeInstantConsultation: () => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  toggleFavorite: (doctorId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  bookAppointment: (req: BookingRequest) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, date: string, time: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  upgradeToPro: () => Promise<void>;
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // UI States
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('medinova_sidebar_collapsed');
    return saved ? saved === 'true' : false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [instantConsultationOpen, setInstantConsultationOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Mobile Favorites & Recent Searches
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medinova_doctor_favorites');
      return saved ? JSON.parse(saved) : ['doc-1'];
    } catch {
      return ['doc-1'];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medinova_recent_searches');
      return saved ? JSON.parse(saved) : ['Cardiologist', 'Dermatologist', 'Pediatrician'];
    } catch {
      return ['Cardiologist', 'Dermatologist', 'Pediatrician'];
    }
  });

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    localStorage.setItem('medinova_sidebar_collapsed', String(collapsed));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState(prev => {
      const next = !prev;
      localStorage.setItem('medinova_sidebar_collapsed', String(next));
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((doctorId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(doctorId);
      const next = exists ? prev.filter(id => id !== doctorId) : [...prev, doctorId];
      try {
        localStorage.setItem('medinova_doctor_favorites', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(exists ? 'Removed from favorites' : 'Added to favorites', 'info');
      return next;
    });
  }, [showToast]);

  const addRecentSearch = useCallback((query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const next = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('medinova_recent_searches', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('medinova_recent_searches');
    showToast('Recent searches cleared', 'info');
  }, [showToast]);

  // Initial Data Fetch
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [loadedDocs, loadedApts, loadedNotifs, loadedProfile] = await Promise.all([
          doctorService.getDoctors(),
          appointmentService.getAppointments(),
          notificationService.getNotifications(),
          profileService.getProfile(),
        ]);
        setDoctors(loadedDocs);
        setAppointments(loadedApts);
        setNotifications(loadedNotifs);
        setProfile(loadedProfile);
      } catch (err) {
        console.error('Failed to load initial data', err);
        showToast('Error connecting to services', 'error');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [showToast]);

  const openBookingModal = useCallback((doc?: Doctor | null) => {
    setBookingDoctor(doc || doctors[0] || null);
  }, [doctors]);

  const closeBookingModal = useCallback(() => {
    setBookingDoctor(null);
  }, []);

  const openProModal = useCallback(() => setProModalOpen(true), []);
  const closeProModal = useCallback(() => setProModalOpen(false), []);

  const openInstantConsultation = useCallback(() => setInstantConsultationOpen(true), []);
  const closeInstantConsultation = useCallback(() => setInstantConsultationOpen(false), []);

  const openSearchOverlay = useCallback(() => setSearchOverlayOpen(true), []);
  const closeSearchOverlay = useCallback(() => setSearchOverlayOpen(false), []);

  const bookAppointment = useCallback(async (req: BookingRequest) => {
    const created = await appointmentService.createAppointment(req);
    setAppointments(prev => [created, ...prev]);
    
    // Add notification
    const notif = await notificationService.addNotification(
      'Appointment Confirmed',
      `Your consultation with ${created.doctorName} is confirmed for ${created.date} at ${created.time}.`,
      'appointment'
    );
    setNotifications(prev => [notif, ...prev]);
    showToast(`Appointment booked with ${created.doctorName}`);
    return created;
  }, [showToast]);

  const cancelAppointment = useCallback(async (id: string) => {
    await appointmentService.cancelAppointment(id);
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    
    const notif = await notificationService.addNotification(
      'Appointment Cancelled',
      'An appointment was successfully cancelled.',
      'appointment'
    );
    setNotifications(prev => [notif, ...prev]);
    showToast('Appointment cancelled successfully', 'info');
  }, [showToast]);

  const rescheduleAppointment = useCallback(async (id: string, date: string, time: string) => {
    const updated = await appointmentService.rescheduleAppointment(id, date, time);
    setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
    showToast('Appointment rescheduled');
  }, [showToast]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  }, [showToast]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const updated = await profileService.updateProfile(updates);
    setProfile(updated);
    showToast('Patient profile updated successfully');
  }, [showToast]);

  const upgradeToPro = useCallback(async () => {
    const updated = await profileService.upgradeToPro();
    setProfile(updated);
    closeProModal();
    showToast('🎉 Welcome to Genova Pro! 30-day trial activated.');
  }, [closeProModal, showToast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        doctors,
        appointments,
        notifications,
        profile,
        unreadCount,
        sidebarCollapsed,
        mobileMenuOpen,
        bookingDoctor,
        proModalOpen,
        instantConsultationOpen,
        searchOverlayOpen,
        favorites,
        recentSearches,
        toasts,
        loading,
        toggleSidebar,
        setSidebarCollapsed,
        setMobileMenuOpen,
        openBookingModal,
        closeBookingModal,
        openProModal,
        closeProModal,
        openInstantConsultation,
        closeInstantConsultation,
        openSearchOverlay,
        closeSearchOverlay,
        toggleFavorite,
        addRecentSearch,
        clearRecentSearches,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateProfile,
        upgradeToPro,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
