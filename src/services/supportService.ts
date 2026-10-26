import { SupportTicket } from '../types/user';
import { apiFetch, IS_DEMO_MODE } from './apiClient';

const STORAGE_KEY = 'genova_support_tickets';

function getStoredTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const supportService = {
  async submitTicket(data: { subject: string; priority: 'normal' | 'urgent' | 'critical'; message: string }): Promise<SupportTicket> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<SupportTicket>('/support', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (err) {
        console.warn('Backend support submission unavailable, saving locally', err);
      }
    }

    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      subject: data.subject,
      priority: data.priority,
      message: data.message,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    const current = getStoredTickets();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newTicket, ...current]));
    return newTicket;
  },
};
