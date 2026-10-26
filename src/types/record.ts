export type RecordStatus = 'uploaded' | 'processing' | 'completed' | 'failed';
export type RecordCategory = 'lab_report' | 'prescription' | 'imaging' | 'discharge_summary' | 'vaccination' | 'other';

export interface LabMetric {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: 'normal' | 'high' | 'low' | 'abnormal' | 'critical' | 'indeterminate';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: RecordCategory;
  recordDate: string;
  facilityName?: string;
  doctorName?: string;
  status: RecordStatus;
  fileSizeBytes: number;
  mimeType: string;
  metrics: LabMetric[];
  aiSummary?: string;
  aiKeyFindings?: string[];
  aiQuestionsForDoctor?: string[];
  aiFollowUpRecommendations?: string[];
  ambiguousValues?: string[];
  createdAt: string;
}
