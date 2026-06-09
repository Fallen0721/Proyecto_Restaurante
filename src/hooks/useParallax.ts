import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// speed: 0.5 = mitad de velocidad del scroll, 1.2 = 20% más rápido
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (ref.current) {
            const offset = (self.progress - 0.5) * 200 * (1 - speed);
            gsap.set(ref.current, { y: offset });
          }
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}
