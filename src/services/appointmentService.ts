import { Appointment, BookingRequest } from '../types/appointment';
import { initialAppointments } from '../data/demoData';
import { doctorService } from './doctorService';
import { apiFetch, IS_DEMO_MODE } from './apiClient';

const STORAGE_KEY = 'medinova_appointments';

function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAppointments));
      return initialAppointments;
    }
    return JSON.parse(raw);
  } catch {
    return initialAppointments;
  }
}

function saveStoredAppointments(appointments: Appointment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save appointments to localStorage', err);
  }
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Appointment[]>('/appointments');
      } catch (err) {
        console.warn('Backend /appointments unavailable, falling back', err);
      }
    }
    return getStoredAppointments();
  },

  async getAppointmentById(id: string): Promise<Appointment | null> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Appointment>(`/appointments/${id}`);
      } catch (err) {
        console.warn(`Backend /appointments/${id} unavailable, falling back`, err);
      }
    }
    const all = getStoredAppointments();
    return all.find(a => a.id === id) || null;
  },

  async createAppointment(req: BookingRequest): Promise<Appointment> {
    const doctor = await doctorService.getDoctorById(req.doctorId);
    if (!doctor) throw new Error('Selected physician does not exist');

    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Appointment>('/appointments', {
          method: 'POST',
          body: JSON.stringify(req),
        });
      } catch (err) {
        console.warn('Backend booking failed, creating locally', err);
      }
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      doctorAddress: doctor.address,
      date: req.date,
      time: req.time,
      durationMinutes: 30,
      consultationType: req.consultationType,
      status: 'confirmed',
      notes: req.notes,
      price: doctor.price,
      meetingLink: req.consultationType === 'video' ? `https://meet.medinova.health/room/${Date.now()}` : undefined,
      createdAt: new Date().toISOString(),
    };

    const current = getStoredAppointments();
    const updated = [newApt, ...current];
    saveStoredAppointments(updated);
    return newApt;
  },

  async cancelAppointment(id: string): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend cancel failed, updating locally', err);
      }
    }

    const current = getStoredAppointments();
    const updated = current.map(a => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
    saveStoredAppointments(updated);
    return true;
  },

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment> {
    if (!IS_DEMO_MODE) {
      try {
        return await apiFetch<Appointment>(`/appointments/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ date: newDate, time: newTime }),
        });
      } catch (err) {
        console.warn('Backend reschedule failed, updating locally', err);
      }
    }

    const current = getStoredAppointments();
    let updatedApt: Appointment | null = null;
    const updated = current.map(a => {
      if (a.id === id) {
        updatedApt = { ...a, date: newDate, time: newTime, status: 'confirmed' as const };
        return updatedApt;
      }
      return a;
    });

    if (!updatedApt) throw new Error('Appointment not found');
    saveStoredAppointments(updated);
    return updatedApt;
  },
};
