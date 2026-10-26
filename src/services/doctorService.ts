import { Doctor, DoctorAvailability } from '../types/doctor';
import { initialDoctors } from '../data/demoData';
import { apiFetch, getAppMode } from './apiClient';

export const doctorService = {
  async getDoctors(): Promise<Doctor[]> {
    if (getAppMode() === 'demo') {
      return initialDoctors;
    }
    try {
      return await apiFetch<Doctor[]>('/doctors');
    } catch (err) {
      console.warn('[DoctorService] API unavailable, using demo doctors:', err);
      return initialDoctors;
    }
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    if (getAppMode() === 'demo') {
      return initialDoctors.find(d => d.id === doctorId) || null;
    }
    try {
      return await apiFetch<Doctor>(`/doctors/${doctorId}`);
    } catch {
      return null;
    }
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    if (getAppMode() === 'demo') {
      const doc = initialDoctors.find(d => d.id === doctorId);
      if (!doc) return [];
      const dayAvail = doc.availability.find(a => a.date === date);
      return dayAvail ? dayAvail.slots : ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
    }

    const res = await apiFetch<DoctorAvailability>(`/doctors/${doctorId}/availability?date=${date}`);
    return res.slots;
  },
};
