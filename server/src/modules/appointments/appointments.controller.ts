import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { Appointment } from '../../models/Appointment.js';
import { Doctor } from '../../models/Doctor.js';
import { Notification } from '../../models/Notification.js';
import { AuditEvent } from '../../models/AuditEvent.js';

export class AppointmentsController {
  static async getMyAppointments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const appointments = await Appointment.find({ userId: user._id }).sort({ date: 1, time: 1 });

      const mapped = appointments.map(a => ({
        id: a._id.toString(),
        doctorId: a.doctorSlugId,
        doctorName: a.doctorName,
        doctorSpecialty: a.doctorSpecialty,
        doctorImage: a.doctorImage,
        doctorAddress: a.doctorAddress,
        date: a.date,
        time: a.time,
        durationMinutes: a.durationMinutes,
        consultationType: a.consultationType,
        status: a.status,
        notes: a.notes,
        price: a.price,
        meetingLink: a.meetingLink,
        createdAt: a.createdAt.toISOString(),
      }));

      res.json(mapped);
    } catch (err) {
      next(err);
    }
  }

  static async getAppointmentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        res.status(404).json({ success: false, message: 'Appointment not found' });
        return;
      }

      // Check ownership (or doctor/admin role)
      if (appointment.userId.toString() !== user._id.toString() && user.role !== 'admin' && user.role !== 'doctor') {
        res.status(403).json({ success: false, message: 'Forbidden. You do not own this appointment.' });
        return;
      }

      res.json({
        id: appointment._id.toString(),
        doctorId: appointment.doctorSlugId,
        doctorName: appointment.doctorName,
        doctorSpecialty: appointment.doctorSpecialty,
        doctorImage: appointment.doctorImage,
        doctorAddress: appointment.doctorAddress,
        date: appointment.date,
        time: appointment.time,
        durationMinutes: appointment.durationMinutes,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes,
        price: appointment.price,
        meetingLink: appointment.meetingLink,
        createdAt: appointment.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async createAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { doctorId, date, time, consultationType, notes } = req.body;

      // Find doctor by slugId or _id
      const doctor = await Doctor.findOne({
        $or: [{ slugId: doctorId }, ...(doctorId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: doctorId }] : [])],
      });

      if (!doctor) {
        res.status(404).json({ success: false, message: 'Selected doctor not found' });
        return;
      }

      const meetingLink = consultationType === 'video'
        ? `https://meet.genova.health/room/apt-${Date.now()}`
        : undefined;

      const newApt = await Appointment.create({
        userId: user._id,
        doctorId: doctor._id,
        doctorSlugId: doctor.slugId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        doctorAddress: doctor.address,
        date,
        time,
        durationMinutes: 30,
        consultationType: consultationType || 'in-person',
        status: 'confirmed',
        price: doctor.price,
        notes: notes || '',
        meetingLink,
      });

      // Create notification for user
      await Notification.create({
        userId: user._id,
        title: 'Appointment Confirmed',
        message: `Your appointment with ${doctor.name} (${doctor.specialty}) on ${date} at ${time} is confirmed.`,
        type: 'appointment',
        actionUrl: '/appointments',
      });

      // Audit event
      await AuditEvent.create({
        userId: user._id,
        actorRole: user.role,
        action: 'appointment_create',
        resourceType: 'Appointment',
        resourceId: newApt._id.toString(),
        details: { doctorId: doctor.slugId, date, time },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success',
      });

      res.status(201).json({
        id: newApt._id.toString(),
        doctorId: doctor.slugId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        doctorAddress: doctor.address,
        date: newApt.date,
        time: newApt.time,
        durationMinutes: newApt.durationMinutes,
        consultationType: newApt.consultationType,
        status: newApt.status,
        notes: newApt.notes,
        price: newApt.price,
        meetingLink: newApt.meetingLink,
        createdAt: newApt.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async rescheduleAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;
      const { date, time } = req.body;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        res.status(404).json({ success: false, message: 'Appointment not found' });
        return;
      }

      if (appointment.userId.toString() !== user._id.toString() && user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden. You do not own this appointment.' });
        return;
      }

      appointment.date = date || appointment.date;
      appointment.time = time || appointment.time;
      appointment.status = 'confirmed';
      await appointment.save();

      await Notification.create({
        userId: user._id,
        title: 'Appointment Rescheduled',
        message: `Your consultation with ${appointment.doctorName} was rescheduled to ${appointment.date} at ${appointment.time}.`,
        type: 'appointment',
        actionUrl: '/appointments',
      });

      await AuditEvent.create({
        userId: user._id,
        actorRole: user.role,
        action: 'appointment_reschedule',
        resourceType: 'Appointment',
        resourceId: appointment._id.toString(),
        details: { newDate: appointment.date, newTime: appointment.time },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success',
      });

      res.json({
        id: appointment._id.toString(),
        doctorId: appointment.doctorSlugId,
        doctorName: appointment.doctorName,
        doctorSpecialty: appointment.doctorSpecialty,
        doctorImage: appointment.doctorImage,
        doctorAddress: appointment.doctorAddress,
        date: appointment.date,
        time: appointment.time,
        durationMinutes: appointment.durationMinutes,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes,
        price: appointment.price,
        meetingLink: appointment.meetingLink,
        createdAt: appointment.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancelAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        res.status(404).json({ success: false, message: 'Appointment not found' });
        return;
      }

      if (appointment.userId.toString() !== user._id.toString() && user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Forbidden. You do not own this appointment.' });
        return;
      }

      appointment.status = 'cancelled';
      await appointment.save();

      await Notification.create({
        userId: user._id,
        title: 'Appointment Cancelled',
        message: `Your appointment with ${appointment.doctorName} for ${appointment.date} has been cancelled.`,
        type: 'appointment',
        actionUrl: '/appointments',
      });

      await AuditEvent.create({
        userId: user._id,
        actorRole: user.role,
        action: 'appointment_cancel',
        resourceType: 'Appointment',
        resourceId: appointment._id.toString(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'success',
      });

      res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (err) {
      next(err);
    }
  }
}
