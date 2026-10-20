import { gsap } from './gsap';
import { ANIMATION_CONFIG } from './animationConfig';

export function animatePageIn(container: HTMLElement | null) {
  if (!container) return;

  gsap.fromTo(
    container,
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.ease.smooth,
      clearProps: 'transform',
    }
  );
}

export function animateStaggerCards(cards: HTMLElement[]) {
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 18, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.duration.normal,
      stagger: ANIMATION_CONFIG.stagger.cards,
      ease: ANIMATION_CONFIG.ease.smooth,
      clearProps: 'transform',
    }
  );
}
