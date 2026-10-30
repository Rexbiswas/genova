import React from 'react';
import { HeartPulse } from 'lucide-react';

interface GenovaLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GenovaLogo: React.FC<GenovaLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-[10px] p-1.5',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl p-1.5 sm:p-2',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-2.5',
  };

  const textSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Healthcare Heart-ECG Squircle */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0 bg-gradient-to-br from-[#00ADEF] via-[#0098DA] to-[#0082C5] shadow-md shadow-sky-500/25 transition-transform hover:scale-105`}
        aria-hidden="true"
      >
        <HeartPulse className="w-full h-full text-white stroke-[2.6]" />
      </div>

      <div className="flex flex-col">
        <span className={`tracking-tight text-[#14233B] leading-none ${textSizes[size]}`}>
          Genova
        </span>
        {showTagline && (
          <span className={`text-[#718198] font-medium tracking-tight mt-0.5 leading-tight ${taglineSizes[size]}`}>
            Better Care. Smarter Connections.
          </span>
        )}
      </div>
    </div>
  );
};
