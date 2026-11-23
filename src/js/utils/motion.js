import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let isInitialized = false;

/**
 * Check if the user has requested reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize Lenis Smooth Scrolling and link with GSAP ScrollTrigger
 */
export function initSmoothScroll() {
  // Respect reduced motion accessibility
  if (prefersReducedMotion()) {
    return null;
  }

  // Prevent duplicate initialization
  if (lenisInstance) {
    return lenisInstance;
  }

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0, // Preserve responsive native mobile touch speed
    });

    // Synchronize Lenis scroll positions with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis RAF loop through GSAP's optimized ticker
    gsap.ticker.add((time) => {
      if (lenisInstance) {
        lenisInstance.raf(time * 1000);
      }
    });

    gsap.ticker.lagSmoothing(0);
    isInitialized = true;
  } catch (err) {
    console.warn('Lenis smooth scrolling initialization error:', err);
  }

  return lenisInstance;
}

/**
 * Cleanup function to destroy Lenis and kill ScrollTriggers if needed
 */
export function destroySmoothScroll() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
    isInitialized = false;
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

export { gsap, ScrollTrigger };
