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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
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
      {/* Official Genova Heart-ECG Squircle Logo */}
      <img
        src="/images/genova_heart_logo.png"
        alt="Genova"
        className={`${iconSizes[size]} shrink-0 object-contain select-none`}
      />

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

export default GenovaLogo;
