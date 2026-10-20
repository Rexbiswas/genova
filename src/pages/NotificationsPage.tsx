import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  Clock,
  UserPlus,
  XCircle,
  Heart,
  Bell,
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { EmptyState } from '../components/ui/EmptyState';
import { useApp } from '../contexts/AppContext';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotifications();
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'appointments' | 'system' | 'promotions'>('all');

  const categories = [
    { id: 'all' as const, label: 'All' },
    { id: 'appointments' as const, label: 'Appointments' },
    { id: 'system' as const, label: 'System' },
    { id: 'promotions' as const, label: 'Promotions' },
  ];

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    showToast('All notifications marked as read', 'success');
  };

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('cancel')) {
      return (
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5 stroke-[2.2]" />
        </div>
      );
    }
    if (title.toLowerCase().includes('welcome')) {
      return (
        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 fill-purple-600 stroke-none" />
        </div>
      );
    }
    if (title.toLowerCase().includes('new doctor') || type === 'system') {
      return (
        <div className="w-10 h-10 rounded-full bg-cyan/15 text-cyan flex items-center justify-center shrink-0">
          <UserPlus className="w-5 h-5" />
        </div>
      );
    }
    if (title.toLowerCase().includes('reminder')) {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Calendar className="w-5 h-5" />
      </div>
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'appointments') return n.type === 'appointment' || n.title.toLowerCase().includes('appointment') || n.title.toLowerCase().includes('reminder');
    if (selectedCategory === 'system') return n.type === 'system' || n.title.toLowerCase().includes('welcome');
    if (selectedCategory === 'promotions') return n.type === 'promotions' || n.type === 'billing';
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header with Back Navigation and Mark All Read link (Screen 8) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-ink" />
          </button>
          <h1 className="text-xl font-extrabold text-ink tracking-tight">Notifications</h1>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          Mark All Read
        </button>
      </div>

      {/* Horizontally Scrollable Category Pills (Screen 8) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white border border-border text-ink-muted hover:text-ink hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Notifications List (Screen 8) */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are completely up to date with your activity stream."
        />
      ) : (
        <div className="space-y-3 pt-1">
          {filteredNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                !n.read
                  ? 'bg-white border-border shadow-xs'
                  : 'bg-slate-50/70 border-border-light opacity-80 hover:opacity-100'
              }`}
            >
              {/* Icon */}
              {getIcon(n.type, n.title)}

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-ink leading-tight mb-0.5">
                  {n.title}
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                  {n.message}
                </p>
                <span className="text-[10px] font-semibold text-ink-muted/70 block mt-1.5">
                  {n.timestamp}
                </span>
              </div>

              {/* Unread Indicator Dot (Screen 8) */}
              {!n.read && (
                <div className="pt-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary block shadow-xs" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

