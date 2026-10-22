import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { BottomNavigation } from './BottomNavigation';
import { PageTransition } from './PageTransition';
import { ToastContainer } from '../ui/Toast';
import { BookingModal } from '../appointments/BookingModal';
import { InstantConsultationModal } from '../modals/InstantConsultationModal';
import { MobileSearchOverlay } from '../modals/MobileSearchOverlay';
import { Modal } from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../animations/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Crown, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const AppLayout: React.FC = () => {
  const {
    sidebarCollapsed,
    toasts,
    proModalOpen,
    closeProModal,
    upgradeToPro,
  } = useApp();

  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll & Sync with GSAP
  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Off-canvas Drawer */}
      <MobileSidebar />

      {/* Main Page Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
        }`}
      >
        <Header />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto flex flex-col">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Screen 1) */}
      <BottomNavigation />

      {/* Modals & Overlays */}
      <BookingModal />
      <InstantConsultationModal />
      <MobileSearchOverlay />

      {/* Genova Pro Subscription Modal */}
      <Modal isOpen={proModalOpen} onClose={closeProModal} title="Genova Pro Health Plan">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/30">
            <Zap className="w-7 h-7 fill-white" />
          </div>
          <h4 className="text-xl font-extrabold text-ink">Upgrade to Genova AI+</h4>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mt-2 leading-relaxed">
            Get 24/7 priority access to world-class doctors, automated AI lab report triage, zero consultation wait times, and direct multi-specialist care coordination.
          </p>

          <div className="bg-slate-50 border border-border-light rounded-card p-4 my-6 text-left space-y-2.5">
            {[
              '24/7 Priority Doctor Teleconsultations',
              'Automated AI Lab Triage & Health Diagnostics',
              'Zero Wait-Time Video Consultation Rooms',
              'Personalized Preventive Health Roadmap',
              'Comprehensive Multi-Specialist Care Coverage',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={upgradeToPro}
              className="w-full bg-gradient-to-r from-primary to-cyan shadow-lg shadow-cyan/20"
              icon={<Crown className="w-4 h-4" />}
            >
              Activate Pro Trial (Free 30 Days)
            </Button>
            <span className="text-[11px] text-ink-muted">No commitment. Cancel anytime with a single click.</span>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} />
    </div>
  );
};
