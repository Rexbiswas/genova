import { z } from 'zod';

export const bookingFormSchema = z.object({
  doctorId: z.string().min(1, 'Please select a physician'),
  consultationType: z.enum(['in-person', 'video', 'audio']),
  date: z.string().min(1, 'Please choose an appointment date'),
  time: z.string().min(1, 'Please select an available time slot'),
  notes: z.string().max(400, 'Notes must be under 400 characters').optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Please enter your city/location'),
  preferredLanguage: z.string().default('en'),
  bloodGroup: z.string().optional(),
  dob: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const supportTicketSchema = z.object({
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  priority: z.enum(['normal', 'urgent', 'critical']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
