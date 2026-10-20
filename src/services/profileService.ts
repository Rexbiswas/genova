import { UserProfile } from '../types/user';
import { initialUserProfile } from '../data/demoData';
import { apiFetch, IS_DEMO_MODE } from './apiClient';

const STORAGE_KEY = 'medinova_profile';

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
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<UserProfile>('/users/me');
      } catch (err) {
        console.warn('Backend /users/me unavailable, using local profile', err);
      }
    }
    return getStoredProfile();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<UserProfile>('/users/me', {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn('Backend update failed, saving locally', err);
      }
    }
    const current = getStoredProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async upgradeToPro(): Promise<UserProfile> {
    return this.updateProfile({ tier: 'Pro' });
  },
};
