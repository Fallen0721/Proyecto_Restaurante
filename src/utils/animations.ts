import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animación de texto staggered por letras
export function animateLettersIn(
  selector: string,
  delay = 0
): gsap.core.Timeline {
  return gsap.timeline({ delay }).from(selector, {
    opacity: 0,
    y: 60,
    stagger: 0.05,
    duration: 0.8,
    ease: 'power3.out',
  });
}

// Fade in desde abajo al hacer scroll
export function createScrollReveal(
  element: Element | string,
  options: gsap.TweenVars = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        ...options,
      });
    },
    once: true,
  });
}

// Animación de clip-path reveal
export function clipPathReveal(
  element: Element | string,
  delay = 0
): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      delay,
      ease: 'power4.out',
    }
  );
}

// Parallax con ScrollTrigger
export function createParallax(
  element: Element | string,
  speed = 0.5
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(element, {
        y: self.progress * 100 * speed * -1,
      });
    },
  });
}

// Animación de tarjetas staggered
export function staggerCards(
  selector: string,
  containerElement: Element | string
): void {
  ScrollTrigger.create({
    trigger: containerElement,
    start: 'top 75%',
    onEnter: () => {
      gsap.from(selector, {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
      });
    },
    once: true,
  });
}

export { gsap, ScrollTrigger };
