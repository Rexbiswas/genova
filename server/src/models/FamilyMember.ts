import mongoose, { Document, Schema } from 'mongoose';

export interface IFamilyMember extends Document {
  primaryUserId: mongoose.Types.ObjectId;
  name: string;
  relationship: string;
  dob?: string;
  bloodGroup?: string;
  gender?: string;
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    primaryUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true },
    dob: { type: String },
    bloodGroup: { type: String },
    gender: { type: String },
    allergies: [{ type: String }],
  },
  { timestamps: true }
);

export const FamilyMember = mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);
