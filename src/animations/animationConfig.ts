export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.25,
    normal: 0.45,
    slow: 0.7,
  },
  ease: {
    smooth: 'power2.out',
    snappy: 'power3.out',
    bounce: 'back.out(1.2)',
    inOut: 'power2.inOut',
  },
  stagger: {
    cards: 0.08,
    list: 0.05,
  },
} as const;
