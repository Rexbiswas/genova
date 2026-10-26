import mongoose from 'mongoose';
import { Doctor } from '../../models/Doctor.js';
import { Appointment } from '../../models/Appointment.js';
import { MedicationReminder } from '../../models/MedicationReminder.js';
import { Notification } from '../../models/Notification.js';
import { AuditEvent } from '../../models/AuditEvent.js';

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  data?: any;
  error?: string;
}

export class ToolsService {
  static async searchDoctors(input: { specialty?: string; query?: string; location?: string }): Promise<ToolExecutionResult> {
    const filter: Record<string, any> = {};

    if (input.specialty) {
      filter.specialty = new RegExp(input.specialty.trim(), 'i');
    }
    if (input.location) {
      filter.city = new RegExp(input.location.trim(), 'i');
    }
    if (input.query) {
      const q = new RegExp(input.query.trim(), 'i');
      filter.$or = [{ name: q }, { specialty: q }, { role: q }, { city: q }];
    }

    const doctors = await Doctor.find(filter).limit(5).select('slugId name specialty role city price rating availability image');

    return {
      toolName: 'searchDoctors',
      success: true,
      data: doctors.map(d => ({
        id: d.slugId,
        name: d.name,
        specialty: d.specialty,
        role: d.role,
        city: d.city,
        price: d.price,
        rating: d.rating,
        image: d.image,
      })),
    };
  }

  static async getDoctorAvailability(input: { doctorId: string; date: string }): Promise<ToolExecutionResult> {
    const doc = await Doctor.findOne({
      $or: [{ slugId: input.doctorId }, ...(input.doctorId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: input.doctorId }] : [])],
    });

    if (!doc) {
      return { toolName: 'getDoctorAvailability', success: false, error: 'Physician not found' };
    }

    const found = doc.availability.find(a => a.date === input.date);
    const slots = found ? found.slots : ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

    return {
      toolName: 'getDoctorAvailability',
      success: true,
      data: {
        doctorName: doc.name,
        doctorId: doc.slugId,
        date: input.date,
        slots,
      },
    };
  }

  static async getMyAppointments(userId: string | mongoose.Types.ObjectId): Promise<ToolExecutionResult> {
    const appointments = await Appointment.find({ userId }).sort({ date: 1, time: 1 }).limit(10);

    return {
      toolName: 'getMyAppointments',
      success: true,
      data: appointments.map(a => ({
        id: a._id.toString(),
        doctorName: a.doctorName,
        doctorSpecialty: a.doctorSpecialty,
        date: a.date,
        time: a.time,
        consultationType: a.consultationType,
        status: a.status,
      })),
    };
  }

  static async prepareAppointment(
    input: {
      doctorId: string;
      date: string;
      time: string;
      consultationType?: 'in-person' | 'video' | 'audio';
      notes?: string;
    },
    userId: string | mongoose.Types.ObjectId
  ): Promise<ToolExecutionResult> {
    const doc = await Doctor.findOne({
      $or: [{ slugId: input.doctorId }, ...(input.doctorId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: input.doctorId }] : [])],
    });

    if (!doc) {
      return { toolName: 'prepareAppointment', success: false, error: 'Physician not found' };
    }

    return {
      toolName: 'prepareAppointment',
      success: true,
      requiresConfirmation: true,
      confirmationMessage: `Please confirm booking with ${doc.name} (${doc.specialty}) on ${input.date} at ${input.time} (${input.consultationType || 'in-person'}). Consultation fee: ₹${doc.price}.`,
      data: {
        doctorId: doc.slugId,
        doctorDbId: doc._id.toString(),
        doctorName: doc.name,
        doctorSpecialty: doc.specialty,
        doctorImage: doc.image,
        doctorAddress: doc.address,
        date: input.date,
        time: input.time,
        consultationType: input.consultationType || 'in-person',
        price: doc.price,
        notes: input.notes || '',
      },
    };
  }

  static async confirmAppointment(
    bookingData: {
      doctorId: string;
      date: string;
      time: string;
      consultationType: 'in-person' | 'video' | 'audio';
      notes?: string;
    },
    userId: string | mongoose.Types.ObjectId
  ): Promise<ToolExecutionResult> {
    const doc = await Doctor.findOne({
      $or: [{ slugId: bookingData.doctorId }, ...(bookingData.doctorId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: bookingData.doctorId }] : [])],
    });

    if (!doc) {
      return { toolName: 'confirmAppointment', success: false, error: 'Physician not found' };
    }

    const newApt = await Appointment.create({
      userId,
      doctorId: doc._id,
      doctorSlugId: doc.slugId,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorImage: doc.image,
      doctorAddress: doc.address,
      date: bookingData.date,
      time: bookingData.time,
      durationMinutes: 30,
      consultationType: bookingData.consultationType || 'in-person',
      status: 'confirmed',
      price: doc.price,
      notes: bookingData.notes || 'Booked via Genova AI Assistant',
      meetingLink: bookingData.consultationType === 'video' ? `https://meet.genova.health/room/apt-${Date.now()}` : undefined,
    });

    await Notification.create({
      userId,
      title: 'Appointment Confirmed via AI Assistant',
      message: `Your appointment with ${doc.name} on ${bookingData.date} at ${bookingData.time} is scheduled.`,
      type: 'appointment',
      actionUrl: '/appointments',
    });

    await AuditEvent.create({
      userId,
      action: 'ai_tool_executed',
      resourceType: 'Appointment',
      resourceId: newApt._id.toString(),
      details: { tool: 'confirmAppointment', doctor: doc.slugId, date: bookingData.date, time: bookingData.time },
      status: 'success',
    });

    return {
      toolName: 'confirmAppointment',
      success: true,
      data: {
        appointmentId: newApt._id.toString(),
        doctorName: doc.name,
        date: bookingData.date,
        time: bookingData.time,
        status: 'confirmed',
        message: `Successfully booked appointment with ${doc.name} on ${bookingData.date} at ${bookingData.time}.`,
      },
    };
  }

  static async createReminder(
    input: {
      medicationName: string;
      dosage: string;
      frequency?: string;
      timeOfDay?: string[];
      startDate?: string;
      notes?: string;
    },
    userId: string | mongoose.Types.ObjectId
  ): Promise<ToolExecutionResult> {
    const reminder = await MedicationReminder.create({
      userId,
      medicationName: input.medicationName,
      dosage: input.dosage,
      frequency: input.frequency || 'Once daily',
      timeOfDay: input.timeOfDay || ['08:00 AM'],
      startDate: input.startDate || new Date().toISOString().split('T')[0],
      notes: input.notes,
      isActive: true,
    });

    await Notification.create({
      userId,
      title: 'Medication Reminder Created',
      message: `Reminder set for ${input.medicationName} (${input.dosage}).`,
      type: 'reminder',
    });

    return {
      toolName: 'createReminder',
      success: true,
      data: {
        reminderId: reminder._id.toString(),
        medicationName: reminder.medicationName,
        dosage: reminder.dosage,
        schedule: reminder.frequency,
      },
    };
  }
}
