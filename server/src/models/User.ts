import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'patient' | 'doctor' | 'clinic_staff' | 'admin';
export type UserTier = 'Standard' | 'Pro';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone: string;
  location: string;
  avatar: string;
  role: UserRole;
  tier: UserTier;
  bloodGroup?: string;
  dob?: string;
  emergencyContact?: string;
  preferredLanguage: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorEnabled: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    location: { type: String, default: 'Braga, Portugal' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    },
    role: { type: String, enum: ['patient', 'doctor', 'clinic_staff', 'admin'], default: 'patient', index: true },
    tier: { type: String, enum: ['Standard', 'Pro'], default: 'Standard' },
    bloodGroup: { type: String, default: 'O+' },
    dob: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'en' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
