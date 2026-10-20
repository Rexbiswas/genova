export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  tier: 'Standard' | 'Pro';
  bloodGroup?: string;
  dob?: string;
  emergencyContact?: string;
  preferredLanguage: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorEnabled: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  priority: 'normal' | 'urgent' | 'critical';
  message: string;
  createdAt: string;
  status: 'open' | 'in-progress' | 'resolved';
}
