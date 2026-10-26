import mongoose, { Document, Schema } from 'mongoose';

export type ConsentScope = 'all_records' | 'specific_records' | 'demographics_only';

export interface IConsentGrant extends Document {
  patientId: mongoose.Types.ObjectId;
  grantedToType: 'doctor' | 'clinic';
  grantedToId: mongoose.Types.ObjectId;
  scope: ConsentScope;
  recordIds?: mongoose.Types.ObjectId[];
  expiresAt?: Date;
  status: 'active' | 'revoked' | 'expired';
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConsentGrantSchema = new Schema<IConsentGrant>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    grantedToType: { type: String, enum: ['doctor', 'clinic'], required: true },
    grantedToId: { type: Schema.Types.ObjectId, required: true, index: true },
    scope: { type: String, enum: ['all_records', 'specific_records', 'demographics_only'], default: 'all_records' },
    recordIds: [{ type: Schema.Types.ObjectId, ref: 'MedicalRecord' }],
    expiresAt: { type: Date },
    status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active', index: true },
    revokedAt: { type: Date },
  },
  { timestamps: true }
);

export const ConsentGrant = mongoose.model<IConsentGrant>('ConsentGrant', ConsentGrantSchema);
