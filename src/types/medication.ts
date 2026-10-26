export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'as_needed'
  | 'weekly';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export type MedicationStatus = 'active' | 'completed' | 'paused';

export type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'topical';

export interface MedicationSchedule {
  timeOfDay: TimeOfDay;
  timeString: string;
  dosage: string;
  takenToday?: boolean;
  takenAt?: string;
  skippedToday?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: MedicationForm;
  condition: string;
  prescribedBy: string;
  clinicName?: string;
  frequency: MedicationFrequency;
  frequencyLabel: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  status: MedicationStatus;
  refillsRemaining: number;
  totalRefills: number;
  nextRefillDate?: string;
  daysRemaining?: number;
  pillColor?: string;
  schedules: MedicationSchedule[];
  warnings?: string[];
  adherencePercentage: number;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  timeOfDay: TimeOfDay;
  loggedAt: string;
  status: 'taken' | 'skipped';
}
