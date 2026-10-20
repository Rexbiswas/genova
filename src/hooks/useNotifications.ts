import { useApp } from '../contexts/AppContext';

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  return {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
}
