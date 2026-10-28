import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../../contexts/AppContext';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[9999] flex flex-col items-center md:items-end gap-1.5 pointer-events-none w-max max-w-[90vw]">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-900/95 backdrop-blur-md text-white rounded-full md:rounded-2xl shadow-lg border border-white/10 text-xs md:text-sm font-medium animate-in fade-in zoom-in-95 duration-200 select-none max-w-[85vw] sm:max-w-md"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400 shrink-0" />}
          <span className="truncate leading-tight">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
