export type AppointmentStatus = 'confirmed' | 'upcoming' | 'completed' | 'cancelled';

export type ConsultationType = 'in-person' | 'video' | 'audio';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorAddress: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  durationMinutes: number;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  notes?: string;
  price: number;
  meetingLink?: string;
  createdAt: string;
}

export interface BookingRequest {
  doctorId: string;
  date: string;
  time: string;
  consultationType: ConsultationType;
  notes?: string;
}
