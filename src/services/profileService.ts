import { UserProfile } from '../types/user';
import { initialUserProfile } from '../data/demoData';
import { apiFetch, IS_DEMO_MODE } from './apiClient';

const STORAGE_KEY = 'genova_profile';
const LEGACY_STORAGE_KEY = 'genova_profile';

function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUserProfile));
      return initialUserProfile;
    }
    const parsed: UserProfile = JSON.parse(raw);
    if (parsed.email && parsed.email.includes('@medinova.')) {
      parsed.email = parsed.email.replace('@medinova.', '@genova.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
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
