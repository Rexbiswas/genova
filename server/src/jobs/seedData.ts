import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { User } from '../models/User.js';
import { Doctor } from '../models/Doctor.js';
import { Clinic } from '../models/Clinic.js';
import { Appointment } from '../models/Appointment.js';
import { Notification } from '../models/Notification.js';
import { MedicalRecord } from '../models/MedicalRecord.js';

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Seeding database with initial Genova healthcare data...');

  // 1. Seed or update demo user
  const hashedPassword = await bcrypt.hash('GenovaPatient2026!', 10);
  let user = await User.findOne({ email: 'stevan@genova.health' });
  if (!user) {
    user = await User.create({
      name: 'Stevan Dux',
      email: 'stevan@genova.health',
      password: hashedPassword,
      phone: '(+351) 912 345 678',
      location: 'Braga, Portugal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      role: 'patient',
      tier: 'Standard',
      bloodGroup: 'O+',
      dob: '1992-06-15',
      emergencyContact: '(+351) 919 888 777 (Maria Dux)',
      preferredLanguage: 'en',
      emailNotifications: true,
      smsNotifications: true,
      twoFactorEnabled: false,
      isVerified: true,
    });
    console.log('[Seed] Created default patient user: stevan@genova.health');
  }

  // 2. Seed default clinic
  let clinic = await Clinic.findOne({ name: 'Central Genova Medical Center' });
  if (!clinic) {
    clinic = await Clinic.create({
      name: 'Central Genova Medical Center',
      address: 'Central Medical Centre, Suite 402',
      city: 'Braga',
      phone: '+351 253 100 200',
      email: 'clinic.braga@genova.health',
      facilities: ['MRI & Imaging', 'Pathology Lab', 'Cardiac Care Unit', 'Pediatric Wing', 'Pharmacy'],
    });
    console.log('[Seed] Created default clinic: Central Genova Medical Center');
  }

  // 3. Seed Doctors
  const doctorsData = [
    {
      slugId: 'doc-1',
      name: 'Dr. Aline Carvalho',
      specialty: 'Cardiology',
      role: 'Senior Cardiologist & Arrhythmia Specialist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      address: 'Rua São Salvador 57, Braga',
      city: 'Braga',
      price: 800,
      currency: '₹',
      experienceYears: 12,
      rating: 4.9,
      reviewCount: 142,
      about: 'Dr. Aline Carvalho has over 12 years of specialized clinical experience in preventive cardiology, echocardiography, and complex hypertension management.',
      education: ['MD - Lisbon Medical Faculty', 'Fellowship in Interventional Cardiology - Johns Hopkins'],
      languages: ['English', 'Portuguese', 'Spanish'],
      isRecommended: true,
      distanceKm: 2.4,
      availability: [
        { date: '2026-10-23', slots: ['09:00 AM', '11:00 AM', '02:30 PM', '04:00 PM'] },
        { date: '2026-10-24', slots: ['10:00 AM', '01:00 PM', '03:30 PM'] },
        { date: '2026-10-25', slots: ['09:30 AM', '11:30 AM', '04:00 PM'] },
      ],
      clinicId: clinic._id,
    },
    {
      slugId: 'doc-2',
      name: 'Dr. Nicolas Sousa',
      specialty: 'Gastroenterology',
      role: 'Gastroenterology & Endoscopy Specialist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      address: 'Largo Prazeres 120, Castelo',
      city: 'Castelo',
      price: 900,
      currency: '₹',
      experienceYears: 10,
      rating: 4.8,
      reviewCount: 98,
      about: 'Dr. Nicolas Sousa focuses on modern digestive health therapies, microbiome health, and therapeutic endoscopy.',
      education: ['MD - University of Porto', 'Specialization in Gastroenterology - St. Thomas Hospital, UK'],
      languages: ['English', 'Portuguese', 'French'],
      isRecommended: false,
      distanceKm: 4.1,
      availability: [
        { date: '2026-10-23', slots: ['10:00 AM', '12:00 PM', '03:00 PM'] },
        { date: '2026-10-24', slots: ['09:00 AM', '02:00 PM', '05:00 PM'] },
        { date: '2026-10-26', slots: ['11:00 AM', '01:30 PM', '04:30 PM'] },
      ],
      clinicId: clinic._id,
    },
    {
      slugId: 'doc-3',
      name: 'Dr. Emily Cardoso',
      specialty: 'Pediatrics',
      role: 'Chief Pediatrician & Neonatology Expert',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=600&q=80',
      address: 'R Velhas 92, Viana do Castelo',
      city: 'Viana do Castelo',
      price: 500,
      currency: '₹',
      experienceYears: 8,
      rating: 5.0,
      reviewCount: 210,
      about: 'Dedicated pediatric clinician with gentle care methodologies, developmental monitoring, and child immunization programs.',
      education: ['MD - Coimbra University', 'Pediatric Fellowship - Boston Children’s Hospital'],
      languages: ['English', 'Portuguese'],
      isRecommended: true,
      distanceKm: 1.8,
      availability: [
        { date: '2026-10-23', slots: ['08:30 AM', '10:30 AM', '01:30 PM', '03:30 PM'] },
        { date: '2026-10-24', slots: ['09:00 AM', '11:00 AM', '04:00 PM'] },
      ],
      clinicId: clinic._id,
    },
    {
      slugId: 'doc-4',
      name: 'Dr. Amanda Clara',
      specialty: 'Pediatrics',
      role: 'Pediatric Specialist & Child Nutritionist',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      address: 'Central Medical Centre, Suite 402',
      city: 'Braga',
      price: 600,
      currency: '₹',
      experienceYears: 12,
      rating: 4.9,
      reviewCount: 175,
      about: 'Compassionate pediatric healthcare provider helping children from infancy through adolescence maintain optimal wellness.',
      education: ['MD - University of Lisbon', 'Child Nutrition Board Certified'],
      languages: ['English', 'Portuguese', 'German'],
      isRecommended: true,
      distanceKm: 3.2,
      availability: [
        { date: '2026-10-23', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
        { date: '2026-10-25', slots: ['09:00 AM', '11:30 AM', '03:00 PM'] },
      ],
      clinicId: clinic._id,
    },
  ];

  for (const d of doctorsData) {
    await Doctor.findOneAndUpdate({ slugId: d.slugId }, d, { upsert: true, new: true });
  }
  console.log(`[Seed] Seeded ${doctorsData.length} verified doctors.`);

  // 4. Seed initial appointments for user
  const existingApt = await Appointment.findOne({ userId: user._id });
  if (!existingApt) {
    const doc1 = await Doctor.findOne({ slugId: 'doc-1' });
    if (doc1) {
      await Appointment.create({
        userId: user._id,
        doctorId: doc1._id,
        doctorSlugId: doc1.slugId,
        doctorName: doc1.name,
        doctorSpecialty: doc1.specialty,
        doctorImage: doc1.image,
        doctorAddress: doc1.address,
        date: '2026-10-24',
        time: '10:00 AM',
        durationMinutes: 30,
        consultationType: 'in-person',
        status: 'confirmed',
        price: doc1.price,
        notes: 'Follow-up blood pressure check and ECG review',
      });
      console.log('[Seed] Created initial appointment for Stevan Dux.');
    }
  }

  // 5. Seed initial notifications for user
  const existingNotif = await Notification.findOne({ userId: user._id });
  if (!existingNotif) {
    await Notification.create([
      {
        userId: user._id,
        title: 'Appointment Reminder',
        message: 'Your cardiology consultation with Dr. Aline Carvalho is scheduled for tomorrow at 10:00 AM.',
        type: 'appointment',
        read: false,
        actionUrl: '/appointments',
      },
      {
        userId: user._id,
        title: 'Lab Results Ready',
        message: 'Your comprehensive lipid profile and CBC report has been verified by the pathology desk.',
        type: 'record',
        read: false,
        actionUrl: '/records',
      },
      {
        userId: user._id,
        title: 'Genova AI Assistant Online',
        message: 'Automated triage and medical record explanation is active in your health locker.',
        type: 'system',
        read: true,
        actionUrl: '/ai-assistant',
      },
    ]);
    console.log('[Seed] Seeded initial notifications.');
  }

  // 6. Seed sample verified lab record
  const existingRec = await MedicalRecord.findOne({ userId: user._id });
  if (!existingRec) {
    await MedicalRecord.create({
      userId: user._id,
      title: 'Comprehensive Lipid & Metabolic Panel',
      category: 'lab_report',
      recordDate: '2026-10-18',
      facilityName: 'Genova Central Pathology Labs',
      doctorName: 'Dr. Aline Carvalho',
      status: 'completed',
      fileName: 'lipid_metabolic_panel_2026.pdf',
      originalFileName: 'lipid_metabolic_panel_2026.pdf',
      mimeType: 'application/pdf',
      fileSizeBytes: 245800,
      storagePath: './uploads/sample_report.pdf',
      extractedText: 'Lipid Profile Report: Total Cholesterol: 198 mg/dL (Ref < 200). HDL Cholesterol: 54 mg/dL (Ref > 45). LDL: 118 mg/dL (Ref < 100). Triglycerides: 130 mg/dL (Ref < 150). Fasting Glucose: 92 mg/dL (Ref 70-99).',
      metrics: [
        { name: 'Total Cholesterol', value: '198', unit: 'mg/dL', referenceRange: '< 200 mg/dL', interpretation: 'normal' },
        { name: 'HDL (Good Cholesterol)', value: '54', unit: 'mg/dL', referenceRange: '> 45 mg/dL', interpretation: 'normal' },
        { name: 'LDL (Atherogenic)', value: '118', unit: 'mg/dL', referenceRange: '< 100 mg/dL', interpretation: 'high', notes: 'Borderline elevated' },
        { name: 'Triglycerides', value: '130', unit: 'mg/dL', referenceRange: '< 150 mg/dL', interpretation: 'normal' },
        { name: 'Fasting Blood Glucose', value: '92', unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', interpretation: 'normal' },
      ],
      aiSummary: 'Your lipid panel shows favorable total cholesterol and HDL protective levels. LDL is mildly elevated at 118 mg/dL (desirable < 100 mg/dL). Fasting glucose is healthy at 92 mg/dL.',
      aiKeyFindings: [
        'Total cholesterol is healthy at 198 mg/dL.',
        'Protective HDL is well-maintained at 54 mg/dL.',
        'LDL is slightly above optimal at 118 mg/dL.',
      ],
      aiQuestionsForDoctor: [
        'Would dietary adjustments alone be adequate to bring my LDL under 100 mg/dL?',
        'When should I repeat this lipid panel to monitor changes?',
      ],
      aiFollowUpRecommendations: [
        'Incorporate omega-3 rich foods and moderate soluble fiber.',
        'Continue regular cardiovascular aerobic exercise (150 mins/week).',
      ],
    });
    console.log('[Seed] Created initial verified lab report for Stevan Dux.');
  }

  console.log('[Seed] Database seeding completed successfully.');
}

if (process.argv[1]?.endsWith('seedData.ts') || process.argv[1]?.endsWith('seedData.js')) {
  connectDatabase()
    .then(() => seedDatabase())
    .then(() => disconnectDatabase())
    .catch(err => {
      console.error('[Seed] Error seeding database:', err);
      process.exit(1);
    });
}
