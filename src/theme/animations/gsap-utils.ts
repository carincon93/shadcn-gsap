/**
 * GSAP Animation Utilities
 * Reusable animation presets for the theme
 */
import { gsap } from 'gsap';

/** Fade in an element from transparent */
export function fadeIn(
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number; y?: number } = {}
) {
  const { duration = 0.8, delay = 0, y = 0 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
  );
}

/** Slide an element up from below */
export function slideUp(
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number; distance?: number } = {}
) {
  const { duration = 0.8, delay = 0, distance = 60 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, y: distance },
    { opacity: 1, y: 0, duration, delay, ease: 'power3.out' }
  );
}

/** Slide an element in from the left */
export function slideInLeft(
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number; distance?: number } = {}
) {
  const { duration = 0.8, delay = 0, distance = 60 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, x: -distance },
    { opacity: 1, x: 0, duration, delay, ease: 'power3.out' }
  );
}

/** Stagger-reveal a collection of elements */
export function staggerReveal(
  elements: gsap.TweenTarget,
  options: { duration?: number; stagger?: number; y?: number } = {}
) {
  const { duration = 0.6, stagger = 0.12, y = 40 } = options;
  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
  );
}

/** Scale-in entrance animation */
export function scaleIn(
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number; scale?: number } = {}
) {
  const { duration = 0.6, delay = 0, scale = 0.85 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, scale },
    { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' }
  );
}

/** Smooth parallax effect for background elements */
export function parallaxScroll(
  element: gsap.TweenTarget,
  options: { speed?: number } = {}
) {
  const { speed = 0.5 } = options;
  return gsap.to(element, {
    y: () => window.innerHeight * speed * -1,
    ease: 'none',
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/** Text reveal animation (character by character) */
export function textReveal(
  element: HTMLElement,
  options: { duration?: number; stagger?: number; delay?: number } = {}
) {
  const { duration = 0.5, stagger = 0.03, delay = 0 } = options;
  const text = element.textContent || '';
  element.textContent = '';
  element.style.visibility = 'visible';

  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    element.appendChild(span);
    return span;
  });

  return gsap.fromTo(
    chars,
    { opacity: 0, y: 20, rotateX: -90 },
    { opacity: 1, y: 0, rotateX: 0, duration, stagger, delay, ease: 'back.out(1.7)' }
  );
}
