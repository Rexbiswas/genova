import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUserProfile } from '../data/demoData';
import { UserProfile } from '../types/user';
import { apiFetch, getAppMode, setAppMode as saveAppMode } from '../services/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mode: 'live' | 'demo';
  setMode: (mode: 'live' | 'demo') => void;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'live' | 'demo'>(getAppMode());
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getAppMode() === 'demo' ? initialUserProfile : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Restore session from backend on mount
  useEffect(() => {
    async function restoreSession() {
      if (mode === 'demo') {
        setUser(initialUserProfile);
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiFetch<{ success: boolean; user: UserProfile }>('/auth/me');
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.info('[Auth] No active backend session found, using guest mode');
        // If no active session and token missing, leave user as null
        const token = localStorage.getItem('genova_token');
        if (!token) {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [mode]);

  const setMode = (newMode: 'live' | 'demo') => {
    saveAppMode(newMode);
    setModeState(newMode);
    if (newMode === 'demo') {
      setUser(initialUserProfile);
    } else {
      setUser(null);
    }
  };

  const login = async (email: string, password?: string) => {
    if (mode === 'demo') {
      setUser({ ...initialUserProfile, email });
      return;
    }

    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
    }
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password?: string) => {
    if (mode === 'demo') {
      setUser({ ...initialUserProfile, name, email });
      return;
    }

    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
    }
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    if (mode === 'live') {
      try {
        await apiFetch('/auth/logout', { method: 'POST' });
      } catch {
        // Continue clearing local state
      }
      localStorage.removeItem('genova_token');
    }
    setUser(null);
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        mode,
        setMode,
        login,
        register,
        logout,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
