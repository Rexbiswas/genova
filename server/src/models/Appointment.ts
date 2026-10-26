import mongoose, { Document, Schema } from 'mongoose';

export type ConsultationType = 'in-person' | 'video' | 'audio';
export type AppointmentStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctorSlugId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorAddress: string;
  date: string;
  time: string;
  durationMinutes: number;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    doctorSlugId: { type: String, required: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    doctorImage: { type: String, required: true },
    doctorAddress: { type: String, required: true },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    durationMinutes: { type: Number, default: 30 },
    consultationType: {
      type: String,
      enum: ['in-person', 'video', 'audio'],
      default: 'in-person',
    },
    status: {
      type: String,
      enum: ['upcoming', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    price: { type: Number, required: true },
    notes: { type: String, default: '' },
    meetingLink: { type: String },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
