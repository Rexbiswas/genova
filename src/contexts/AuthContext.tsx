import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { apiFetch } from '../services/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  loginWithGoogle: (credential: string) => Promise<{ isNewUser?: boolean; user: UserProfile }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Restore session from backend on mount using stored token or active HttpOnly cookie
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = localStorage.getItem('genova_token');

      // Attempt to verify session with backend
      try {
        const res = await apiFetch<{ success: boolean; user: UserProfile }>('/auth/me');
        if (isMounted && res.user) {
          setUser(res.user);
        }
      } catch {
        // If /auth/me fails or returns 401, clear any stale stored token
        if (token) {
          localStorage.removeItem('genova_token');
        }
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
    }
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const register = async (name: string, email: string, password: string): Promise<UserProfile> => {
    const res = await apiFetch<{ success: boolean; token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    });

    if (res.token) {
      localStorage.setItem('genova_token', res.token);
    }
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const loginWithGoogle = async (credential: string): Promise<{ isNewUser?: boolean; user: UserProfile }> => {
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
    }
    setUser(res.user);
    setAuthModalOpen(false);
    return { isNewUser: res.isNewUser, user: res.user };
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const res = await apiFetch<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      setUser(res);
      return res;
    } catch (err: any) {
      if (err.statusCode === 401) {
        localStorage.removeItem('genova_token');
        setUser(null);
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Continue clearing local state even if backend is offline
    } finally {
      localStorage.removeItem('genova_token');
      localStorage.removeItem('genova_demo_active');
      localStorage.removeItem('genova_demo_profile');
      setUser(null);
    }
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        updateProfile,
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
