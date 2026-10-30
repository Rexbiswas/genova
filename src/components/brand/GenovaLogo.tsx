import React from 'react';

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
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-lg font-bold',
    md: 'text-[22px] font-bold',
    lg: 'text-2xl font-bold',
  };

  const taglineSizes = {
    sm: 'text-[9.5px]',
    md: 'text-[10.5px]',
    lg: 'text-xs',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Healthcare Heart-Pulse Cross Squircle matching Genova reference */}
      <div
        className={`${iconSizes[size]} shrink-0 bg-[#009ee2] shadow-sm flex items-center justify-center text-white`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-white"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Medical cross outline with cardiogram heartbeat pulse through center */}
          <path d="M12 3.5v4.5m0 8v4.5" />
          <path d="M3.5 12h3.5l1.5-2.5 2.5 5 2.5-4 1.5 1.5h5.5" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <span className={`tracking-tight text-slate-900 leading-none ${textSizes[size]}`}>
          Genova
        </span>
        {showTagline && (
          <span className={`text-slate-400 font-medium tracking-tight mt-1 leading-none ${taglineSizes[size]}`}>
            Better Care. Smarter Connections.
          </span>
        )}
      </div>
    </div>
  );
};
