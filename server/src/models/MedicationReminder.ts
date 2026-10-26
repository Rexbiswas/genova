import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicationReminder extends Document {
  userId: mongoose.Types.ObjectId;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationReminderSchema = new Schema<IMedicationReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, default: 'Once daily' },
    timeOfDay: [{ type: String }],
    startDate: { type: String, required: true },
    endDate: { type: String },
    notes: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const MedicationReminder = mongoose.model<IMedicationReminder>('MedicationReminder', MedicationReminderSchema);
