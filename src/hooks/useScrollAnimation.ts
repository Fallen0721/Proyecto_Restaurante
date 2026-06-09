import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions extends gsap.TweenVars {
  start?: string;
  once?: boolean;
}

export function useScrollAnimation(
  selector: string,
  animation: gsap.TweenVars,
  options: ScrollAnimationOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { start = 'top 80%', once = true, ...tweenOptions } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start,
        onEnter: () => {
          gsap.to(containerRef.current!.querySelectorAll(selector), {
            ...animation,
            ...tweenOptions,
          });
        },
        once,
      });

      return () => trigger.kill();
    }, containerRef);

    return () => ctx.revert();
  }, [selector, start, once]);

  return containerRef;
}
