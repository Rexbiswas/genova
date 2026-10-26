import { NotificationItem } from '../types/notification';
import { initialNotifications } from '../data/demoData';
import { apiFetch, getAppMode } from './apiClient';

const STORAGE_KEY = 'genova_demo_notifications';

function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    return JSON.parse(raw);
  } catch {
    return initialNotifications;
  }
}

function saveStoredNotifications(items: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (getAppMode() === 'demo') {
      return getStoredNotifications();
    }
    try {
      return await apiFetch<NotificationItem[]>('/notifications');
    } catch (err) {
      console.warn('[NotificationService] Backend unauthenticated or unavailable, using local notifications:', err);
      return getStoredNotifications();
    }
  },

  async markAsRead(id: string): Promise<void> {
    if (getAppMode() === 'demo') {
      const current = getStoredNotifications();
      const updated = current.map(n => (n.id === id ? { ...n, read: true } : n));
      saveStoredNotifications(updated);
      return;
    }
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  async markAllAsRead(): Promise<void> {
    if (getAppMode() === 'demo') {
      const current = getStoredNotifications();
      const updated = current.map(n => ({ ...n, read: true }));
      saveStoredNotifications(updated);
      return;
    }
    await apiFetch('/notifications/mark-all-read', { method: 'PATCH' });
  },

  async addNotification(title: string, message: string, type: NotificationItem['type'] = 'appointment'): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
    const current = getStoredNotifications();
    saveStoredNotifications([newNotif, ...current]);
    return newNotif;
  },
};
