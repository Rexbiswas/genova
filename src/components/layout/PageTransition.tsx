import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animatePageIn } from '../../animations/pageAnimations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion && containerRef.current) {
      animatePageIn(containerRef.current);
    }
  }, [location.pathname, prefersReducedMotion]);

  return <div ref={containerRef} className="w-full flex-1 flex flex-col">{children}</div>;
};
