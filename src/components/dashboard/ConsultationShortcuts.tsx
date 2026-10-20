import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Phone, MessageSquare, Building2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const ConsultationShortcuts: React.FC = () => {
  const navigate = useNavigate();
  const { openInstantConsultation } = useApp();

  const shortcuts = [
    {
      id: 'video',
      label: 'Video',
      icon: Video,
      color: 'bg-blue-50 text-primary border-blue-100/80',
      iconColor: 'text-primary',
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: Phone,
      color: 'bg-amber-50 text-amber-600 border-amber-100/80',
      iconColor: 'text-amber-600',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600 border-purple-100/80',
      iconColor: 'text-purple-600',
    },
    {
      id: 'in-person',
      label: 'In-Clinic',
      icon: Building2,
      color: 'bg-cyan-50 text-cyan border-cyan-100/80',
      iconColor: 'text-cyan',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-1">
      {shortcuts.map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => navigate(`/appointments/new?type=${item.id}`)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-border shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer group"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-2 transition-transform group-hover:scale-105 ${item.color}`}
            >
              <Icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ConsultationShortcuts;
