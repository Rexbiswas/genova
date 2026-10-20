export type NotificationType = 'appointment' | 'system' | 'telehealth' | 'billing' | 'promotions';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
