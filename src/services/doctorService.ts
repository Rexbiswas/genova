import { Doctor, DoctorAvailability } from '../types/doctor';
import { initialDoctors } from '../data/demoData';
import { apiFetch, IS_DEMO_MODE } from './apiClient';

const STORAGE_KEY = 'medinova_doctors';

function getStoredDoctors(): Doctor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDoctors));
      return initialDoctors;
    }
    return JSON.parse(raw);
  } catch {
    return initialDoctors;
  }
}

export const doctorService = {
  async getDoctors(): Promise<Doctor[]> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Doctor[]>('/doctors');
      } catch (err) {
        console.warn('Backend /doctors unavailable, falling back to local data', err);
      }
    }
    return getStoredDoctors();
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Doctor>(`/doctors/${doctorId}`);
      } catch (err) {
        console.warn(`Backend /doctors/${doctorId} unavailable, falling back`, err);
      }
    }
    const docs = getStoredDoctors();
    return docs.find(d => d.id === doctorId) || null;
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    if (!IS_DEMO_MODE) {
      try {
        const res = await apiFetch<DoctorAvailability>(`/doctors/${doctorId}/availability?date=${date}`);
        return res.slots;
      } catch (err) {
        console.warn('Backend availability unavailable, falling back', err);
      }
    }
    const doc = await this.getDoctorById(doctorId);
    if (!doc) return [];
    const dayAvail = doc.availability.find(a => a.date === date);
    return dayAvail ? dayAvail.slots : ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
  },
};
