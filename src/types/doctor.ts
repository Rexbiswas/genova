export interface DoctorAvailability {
  date: string; // YYYY-MM-DD
  slots: string[]; // e.g. ["09:00 AM", "10:30 AM", "02:00 PM"]
}

export interface DoctorReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Doctor {
  id: string;
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
  isRecommended?: boolean;
  distanceKm?: number;
  availability: DoctorAvailability[];
}

export type Specialty =
  | 'All Specialties'
  | 'Cardiology'
  | 'Gastroenterology'
  | 'Pediatrics'
  | 'Surgery'
  | 'Dermatology'
  | 'Neurology'
  | 'General Medicine';

export type DoctorSortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'experience-desc';
