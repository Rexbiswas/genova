import { Medication, DoseLog } from '../types/medication';

const STORAGE_KEY = 'genova_medications_list';
const LOGS_STORAGE_KEY = 'genova_dose_logs';

const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin',
    genericName: 'Lipitor',
    dosage: '20 mg',
    form: 'tablet',
    condition: 'Lipid & Cardiovascular Protection',
    prescribedBy: 'Dr. Aline Carvalho',
    clinicName: 'Genova Heart & Vascular Institute',
    frequency: 'once_daily',
    frequencyLabel: 'Once daily at bedtime',
    instructions: 'Take 1 tablet by mouth every night with water. Avoid grapefruit and grapefruit juice.',
    startDate: '2026-08-10',
    status: 'active',
    refillsRemaining: 2,
    totalRefills: 4,
    nextRefillDate: '2026-11-15',
    daysRemaining: 24,
    pillColor: '#0786C5',
    adherencePercentage: 96,
    warnings: [
      'Avoid drinking large quantities of grapefruit juice.',
      'Report any unexpected muscle aches or tenderness immediately.'
    ],
    schedules: [
      {
        timeOfDay: 'bedtime',
        timeString: '09:30 PM',
        dosage: '1 Tablet (20mg)',
        takenToday: false,
      },
    ],
  },
  {
    id: 'med-2',
    name: 'Metformin HCl',
    genericName: 'Glucophage',
    dosage: '500 mg',
    form: 'tablet',
    condition: 'Blood Glucose & Metabolic Regulation',
    prescribedBy: 'Dr. Nicolas Sousa',
    clinicName: 'Genova Digestive & Metabolic Care',
    frequency: 'twice_daily',
    frequencyLabel: 'Twice daily with meals',
    instructions: 'Take 1 tablet with morning breakfast and 1 tablet with dinner to minimize GI discomfort.',
    startDate: '2026-06-01',
    status: 'active',
    refillsRemaining: 3,
    totalRefills: 5,
    nextRefillDate: '2026-12-01',
    daysRemaining: 42,
    pillColor: '#09B7D5',
    adherencePercentage: 91,
    warnings: [
      'Take with food to reduce stomach upset.',
      'Maintain adequate hydration throughout the day.'
    ],
    schedules: [
      {
        timeOfDay: 'morning',
        timeString: '08:30 AM',
        dosage: '1 Tablet (500mg)',
        takenToday: true,
        takenAt: '2026-10-23T08:35:00.000Z',
      },
      {
        timeOfDay: 'evening',
        timeString: '07:30 PM',
        dosage: '1 Tablet (500mg)',
        takenToday: false,
      },
    ],
  },
  {
    id: 'med-3',
    name: 'Lisinopril',
    genericName: 'Prinivil / Zestril',
    dosage: '10 mg',
    form: 'tablet',
    condition: 'Blood Pressure Management',
    prescribedBy: 'Dr. Aline Carvalho',
    clinicName: 'Genova Heart & Vascular Institute',
    frequency: 'once_daily',
    frequencyLabel: 'Once daily in the morning',
    instructions: 'Take 1 tablet every morning with or without food. Monitor blood pressure weekly.',
    startDate: '2026-09-01',
    status: 'active',
    refillsRemaining: 1, // Alert refill low
    totalRefills: 3,
    nextRefillDate: '2026-10-30',
    daysRemaining: 7,
    pillColor: '#EF4444',
    adherencePercentage: 88,
    warnings: [
      'May cause mild dizziness when standing up quickly.',
      'Refill needed in less than 7 days.'
    ],
    schedules: [
      {
        timeOfDay: 'morning',
        timeString: '08:00 AM',
        dosage: '1 Tablet (10mg)',
        takenToday: true,
        takenAt: '2026-10-23T08:05:00.000Z',
      },
    ],
  },
  {
    id: 'med-4',
    name: 'Vitamin D3 (Cholecalciferol)',
    genericName: 'Vitamin D3',
    dosage: '2,000 IU',
    form: 'capsule',
    condition: 'Bone Density & Immune Support',
    prescribedBy: 'Dr. Aline Carvalho',
    clinicName: 'Genova Wellness Center',
    frequency: 'once_daily',
    frequencyLabel: 'Once daily with healthy fat meal',
    instructions: 'Take 1 softgel capsule daily with breakfast or lunch for optimal absorption.',
    startDate: '2026-07-15',
    status: 'active',
    refillsRemaining: 4,
    totalRefills: 6,
    nextRefillDate: '2027-01-10',
    daysRemaining: 68,
    pillColor: '#F59E0B',
    adherencePercentage: 100,
    warnings: ['Take with meal containing dietary fats.'],
    schedules: [
      {
        timeOfDay: 'morning',
        timeString: '08:30 AM',
        dosage: '1 Softgel (2,000 IU)',
        takenToday: true,
        takenAt: '2026-10-23T08:36:00.000Z',
      },
    ],
  },
  {
    id: 'med-5',
    name: 'Amoxicillin Trihydrate',
    genericName: 'Amoxil',
    dosage: '500 mg',
    form: 'capsule',
    condition: 'Dental Extraction Prophylaxis',
    prescribedBy: 'Dr. Sofia Ramos',
    clinicName: 'Genova Dental & Maxillofacial',
    frequency: 'three_times_daily',
    frequencyLabel: 'Completed 10-day regimen',
    instructions: 'Take 1 capsule every 8 hours until full 10-day prescription finished.',
    startDate: '2026-09-02',
    endDate: '2026-09-12',
    status: 'completed',
    refillsRemaining: 0,
    totalRefills: 0,
    pillColor: '#6B7280',
    adherencePercentage: 100,
    schedules: [
      {
        timeOfDay: 'morning',
        timeString: '08:00 AM',
        dosage: '1 Capsule (500mg)',
      },
      {
        timeOfDay: 'afternoon',
        timeString: '02:00 PM',
        dosage: '1 Capsule (500mg)',
      },
      {
        timeOfDay: 'bedtime',
        timeString: '10:00 PM',
        dosage: '1 Capsule (500mg)',
      },
    ],
  },
];

export const medicationService = {
  getMedications(): Medication[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDICATIONS));
      return INITIAL_MEDICATIONS;
    }
    try {
      return JSON.parse(raw) as Medication[];
    } catch {
      return INITIAL_MEDICATIONS;
    }
  },

  getMedicationById(id: string): Medication | undefined {
    const all = this.getMedications();
    return all.find(m => m.id === id);
  },

  addMedication(med: Omit<Medication, 'id'>): Medication {
    const all = this.getMedications();
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`,
    };
    all.unshift(newMed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newMed;
  },

  updateMedication(id: string, updates: Partial<Medication>): Medication {
    const all = this.getMedications();
    const index = all.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Medication not found');

    const updated = { ...all[index], ...updates };
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  deleteMedication(id: string): void {
    const all = this.getMedications().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  toggleScheduleDose(medicationId: string, scheduleIndex: number, markTaken: boolean): Medication {
    const all = this.getMedications();
    const med = all.find(m => m.id === medicationId);
    if (!med || !med.schedules[scheduleIndex]) throw new Error('Schedule slot not found');

    med.schedules[scheduleIndex].takenToday = markTaken;
    med.schedules[scheduleIndex].takenAt = markTaken ? new Date().toISOString() : undefined;
    med.schedules[scheduleIndex].skippedToday = false;

    // Recalculate adherence
    const activeMeds = all.filter(m => m.status === 'active');
    let totalSlots = 0;
    let takenSlots = 0;
    activeMeds.forEach(m => {
      m.schedules.forEach(s => {
        totalSlots++;
        if (s.takenToday) takenSlots++;
      });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return med;
  },

  skipScheduleDose(medicationId: string, scheduleIndex: number): Medication {
    const all = this.getMedications();
    const med = all.find(m => m.id === medicationId);
    if (!med || !med.schedules[scheduleIndex]) throw new Error('Schedule slot not found');

    med.schedules[scheduleIndex].takenToday = false;
    med.schedules[scheduleIndex].skippedToday = true;
    med.schedules[scheduleIndex].takenAt = undefined;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return med;
  },

  requestRefill(medicationId: string): { success: boolean; message: string } {
    const all = this.getMedications();
    const med = all.find(m => m.id === medicationId);
    if (!med) throw new Error('Medication not found');

    if (med.refillsRemaining <= 0) {
      return {
        success: false,
        message: `No refills remaining for ${med.name}. A renewal request has been transmitted to ${med.prescribedBy}.`,
      };
    }

    med.refillsRemaining = Math.max(0, med.refillsRemaining - 1);
    med.daysRemaining = (med.daysRemaining || 0) + 30;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return {
      success: true,
      message: `Refill request for ${med.name} sent to Genova Pharmacy. Estimated delivery in 2 business days.`,
    };
  },

  getTodayDoses() {
    const medications = this.getMedications().filter(m => m.status === 'active');
    const items: Array<{
      medication: Medication;
      schedule: Medication['schedules'][0];
      scheduleIndex: number;
    }> = [];

    medications.forEach(med => {
      med.schedules.forEach((schedule, idx) => {
        items.push({
          medication: med,
          schedule,
          scheduleIndex: idx,
        });
      });
    });

    const timeOrder: Record<string, number> = {
      morning: 1,
      afternoon: 2,
      evening: 3,
      bedtime: 4,
    };

    items.sort((a, b) => (timeOrder[a.schedule.timeOfDay] || 5) - (timeOrder[b.schedule.timeOfDay] || 5));
    return items;
  },
};
