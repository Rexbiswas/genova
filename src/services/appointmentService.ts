import { Appointment, BookingRequest } from '../types/appointment';
import { initialAppointments } from '../data/demoData';
import { doctorService } from './doctorService';
import { apiFetch, getAppMode } from './apiClient';

const STORAGE_KEY = 'genova_demo_appointments';

function getStoredDemoAppointments(): Appointment[] {
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

function saveStoredDemoAppointments(appointments: Appointment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save demo appointments', err);
  }
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    if (getAppMode() === 'demo') {
      return getStoredDemoAppointments();
    }
    try {
      return await apiFetch<Appointment[]>('/appointments');
    } catch (err) {
      console.warn('[AppointmentService] Backend unauthenticated or unavailable, using local records:', err);
      return getStoredDemoAppointments();
    }
  },

  async getAppointmentById(id: string): Promise<Appointment | null> {
    if (getAppMode() === 'demo') {
      const all = getStoredDemoAppointments();
      return all.find(a => a.id === id) || null;
    }
    return apiFetch<Appointment>(`/appointments/${id}`);
  },

  async createAppointment(req: BookingRequest): Promise<Appointment> {
    if (getAppMode() === 'demo') {
      const doctor = await doctorService.getDoctorById(req.doctorId);
      if (!doctor) throw new Error('Selected physician does not exist');

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
        meetingLink: req.consultationType === 'video' ? `https://meet.genova.health/room/${Date.now()}` : undefined,
        createdAt: new Date().toISOString(),
      };

      const current = getStoredDemoAppointments();
      const updated = [newApt, ...current];
      saveStoredDemoAppointments(updated);
      return newApt;
    }

    // In live mode, call real backend API and do NOT fake confirmation if backend fails
    return apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async cancelAppointment(id: string): Promise<boolean> {
    if (getAppMode() === 'demo') {
      const current = getStoredDemoAppointments();
      const updated = current.map(a => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
      saveStoredDemoAppointments(updated);
      return true;
    }

    await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
    return true;
  },

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment> {
    if (getAppMode() === 'demo') {
      const current = getStoredDemoAppointments();
      let updatedApt: Appointment | null = null;
      const updated = current.map(a => {
        if (a.id === id) {
          updatedApt = { ...a, date: newDate, time: newTime, status: 'confirmed' as const };
          return updatedApt;
        }
        return a;
      });

      if (!updatedApt) throw new Error('Appointment not found');
      saveStoredDemoAppointments(updated);
      return updatedApt;
    }

    return apiFetch<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
  },
};
