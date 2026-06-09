import { useCallback } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | number, offset = 80) => {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) return;

      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;

      gsap.to(window, {
        scrollTo: { y: top, autoKill: false },
        duration: 1.2,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }
  }, []);

  return { scrollTo };
}
