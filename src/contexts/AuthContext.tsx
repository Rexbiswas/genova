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
  loginWithGoogle: (credential: string) => Promise<{ isNewUser?: boolean; user: UserProfile }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  skipToDemo: () => void;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'live' | 'demo'>(() => {
    return (localStorage.getItem('genova_app_mode') as 'live' | 'demo') || 'live';
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedToken = localStorage.getItem('genova_token');
    const demoActive = localStorage.getItem('genova_demo_active') === 'true';
    if (demoActive && !savedToken) {
      return initialUserProfile;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Restore session from backend on mount
  useEffect(() => {
    async function restoreSession() {
      const demoActive = localStorage.getItem('genova_demo_active') === 'true';
      const token = localStorage.getItem('genova_token');

      if (demoActive && !token) {
        setUser(initialUserProfile);
        setIsLoading(false);
        return;
      }

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiFetch<{ success: boolean; user: UserProfile }>('/auth/me');
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.info('[Auth] No active backend session found for stored token');
        localStorage.removeItem('genova_token');
        setUser(null);
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
      localStorage.setItem('genova_demo_active', 'true');
      setUser(initialUserProfile);
    } else {
      localStorage.removeItem('genova_demo_active');
      const token = localStorage.getItem('genova_token');
      if (!token) setUser(null);
    }
  };

  const skipToDemo = () => {
    localStorage.setItem('genova_demo_active', 'true');
    saveAppMode('demo');
    setModeState('demo');
    setUser(initialUserProfile);
  };

  const login = async (email: string, password?: string) => {
    if (mode === 'demo') {
      const demoUser = { ...initialUserProfile, email, profileCompleted: true };
      localStorage.setItem('genova_demo_active', 'true');
      setUser(demoUser);
      return;
    }

    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
      localStorage.removeItem('genova_demo_active');
    }
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password?: string) => {
    if (mode === 'demo') {
      const demoUser = { ...initialUserProfile, name, email, profileCompleted: false };
      localStorage.setItem('genova_demo_active', 'true');
      setUser(demoUser);
      return;
    }

    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
      localStorage.removeItem('genova_demo_active');
    }
    setUser(res.user);
    setAuthModalOpen(false);
  };

  const loginWithGoogle = async (credential: string): Promise<{ isNewUser?: boolean; user: UserProfile }> => {
    if (mode === 'demo') {
      const googleDemoUser: UserProfile = {
        ...initialUserProfile,
        id: `usr-g-${Date.now()}`,
        name: 'Alex Rivera',
        email: 'alex.rivera@gmail.com',
        authProvider: 'google',
        profileCompleted: false, // Prompt profile completion for fresh experience
      };
      localStorage.setItem('genova_demo_active', 'true');
      setUser(googleDemoUser);
      return { isNewUser: true, user: googleDemoUser };
    }

    const res = await apiFetch<{
      success: boolean;
      token: string;
      isNewUser: boolean;
      user: UserProfile;
    }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
      localStorage.removeItem('genova_demo_active');
    }
    setUser(res.user);
    return { isNewUser: res.isNewUser, user: res.user };
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    if (mode === 'demo' || !localStorage.getItem('genova_token')) {
      const updated: UserProfile = {
        ...(user || initialUserProfile),
        ...data,
        profileCompleted: true,
      };
      setUser(updated);
      return updated;
    }

    const res = await apiFetch<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    setUser(res);
    return res;
  };

  const logout = async () => {
    if (mode === 'live' && localStorage.getItem('genova_token')) {
      try {
        await apiFetch('/auth/logout', { method: 'POST' });
      } catch {
        // Continue clearing local state
      }
    }
    localStorage.removeItem('genova_token');
    localStorage.removeItem('genova_demo_active');
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
        loginWithGoogle,
        updateProfile,
        skipToDemo,
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
