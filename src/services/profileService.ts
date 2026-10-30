import { UserProfile } from '../types/user';
import { apiFetch } from './apiClient';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return await apiFetch<UserProfile>('/users/me');
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return await apiFetch<UserProfile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async upgradeToPro(): Promise<UserProfile> {
    await apiFetch('/users/me/upgrade-pro', { method: 'POST' });
    return this.getProfile();
  },
};
