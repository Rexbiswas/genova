import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorAvailability {
  date: string;
  slots: string[];
}

export interface IDoctor extends Document {
  slugId: string;
  name: string;
  specialty: string;
  role: string;
  image: string;
  address: string;
  city: string;
  price: number;
  currency: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  about: string;
  education: string[];
  languages: string[];
  isRecommended: boolean;
  distanceKm: number;
  availability: IDoctorAvailability[];
  clinicId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    slugId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, index: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    currency: { type: String, default: '₹' },
    experienceYears: { type: Number, default: 5 },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 50 },
    about: { type: String, default: '' },
    education: [{ type: String }],
    languages: [{ type: String }],
    isRecommended: { type: Boolean, default: false, index: true },
    distanceKm: { type: Number, default: 2.5 },
    availability: [
      {
        date: { type: String, required: true },
        slots: [{ type: String }],
      },
    ],
    clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
