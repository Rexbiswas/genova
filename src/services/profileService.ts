import { UserProfile } from '../types/user';
import { initialUserProfile } from '../data/demoData';
import { apiFetch, getAppMode } from './apiClient';

const STORAGE_KEY = 'genova_demo_profile';

function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUserProfile));
      return initialUserProfile;
    }
    return JSON.parse(raw);
  } catch {
    return initialUserProfile;
  }
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    if (getAppMode() === 'demo') {
      return getStoredProfile();
    }
    try {
      return await apiFetch<UserProfile>('/users/me');
    } catch (err) {
      console.warn('[ProfileService] Backend unauthenticated or unavailable, using local profile:', err);
      return getStoredProfile();
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (getAppMode() === 'demo') {
      const current = getStoredProfile();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }

    return apiFetch<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async upgradeToPro(): Promise<UserProfile> {
    if (getAppMode() === 'demo') {
      return this.updateProfile({ tier: 'Pro' });
    }

    await apiFetch('/users/me/upgrade-pro', { method: 'POST' });
    return this.getProfile();
  },
};
