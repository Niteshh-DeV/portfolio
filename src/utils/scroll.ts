import Lenis from 'lenis';

let lenis: Lenis | null = null;
let locks = 0;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Starts inertia scrolling for the page. Returns a cleanup function. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: false });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Scrolls the page to a position or element, through Lenis when it is running. */
export function scrollToTarget(target: number | HTMLElement, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true, duration: 1.4 });
    return;
  }

  const top =
    typeof target === 'number' ? target : target.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Freezes page scrolling behind an overlay; calls nest, so every lock needs its unlock. */
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    document.body.style.overflow = 'hidden';
    lenis?.stop();
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      document.body.style.overflow = '';
      lenis?.start();
    }
  };
}
