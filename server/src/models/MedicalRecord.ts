import mongoose, { Document, Schema } from 'mongoose';

export type RecordStatus = 'uploaded' | 'processing' | 'completed' | 'failed';
export type RecordCategory = 'lab_report' | 'prescription' | 'imaging' | 'discharge_summary' | 'vaccination' | 'other';

export interface ILabMetric {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: 'normal' | 'high' | 'low' | 'abnormal' | 'critical' | 'indeterminate';
  notes?: string;
}

export interface IMedicalRecord extends Document {
  userId: mongoose.Types.ObjectId;
  familyMemberId?: mongoose.Types.ObjectId;
  title: string;
  category: RecordCategory;
  recordDate: string;
  facilityName?: string;
  doctorName?: string;
  status: RecordStatus;
  
  // Storage & file info (private)
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;

  // Extracted Information
  extractedText?: string;
  metrics: ILabMetric[];
  
  // AI Plain-Language Explanations
  aiSummary?: string;
  aiKeyFindings?: string[];
  aiQuestionsForDoctor?: string[];
  aiFollowUpRecommendations?: string[];
  ambiguousValues?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const LabMetricSchema = new Schema<ILabMetric>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String },
    referenceRange: { type: String },
    interpretation: {
      type: String,
      enum: ['normal', 'high', 'low', 'abnormal', 'critical', 'indeterminate'],
      default: 'normal',
    },
    notes: { type: String },
  },
  { _id: false }
);

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    familyMemberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember' },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['lab_report', 'prescription', 'imaging', 'discharge_summary', 'vaccination', 'other'],
      default: 'lab_report',
      index: true,
    },
    recordDate: { type: String, required: true },
    facilityName: { type: String },
    doctorName: { type: String },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
      index: true,
    },
    fileName: { type: String, required: true },
    originalFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    storagePath: { type: String, required: true },
    extractedText: { type: String },
    metrics: [LabMetricSchema],
    aiSummary: { type: String },
    aiKeyFindings: [{ type: String }],
    aiQuestionsForDoctor: [{ type: String }],
    aiFollowUpRecommendations: [{ type: String }],
    ambiguousValues: [{ type: String }],
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
