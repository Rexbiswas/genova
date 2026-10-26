import mongoose, { Document, Schema } from 'mongoose';

export interface IClinic extends Document {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  email: string;
  facilities: string[];
  locationCoords?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClinicSchema = new Schema<IClinic>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    postalCode: { type: String },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    facilities: [{ type: String }],
    locationCoords: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

export const Clinic = mongoose.model<IClinic>('Clinic', ClinicSchema);
