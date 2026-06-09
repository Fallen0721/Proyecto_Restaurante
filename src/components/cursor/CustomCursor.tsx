import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const CustomCursor = React.memo(function CustomCursor() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || !cursorRef.current || !dotRef.current) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'none',
      });

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseEnterExpand = () => {
      gsap.to(cursor, {
        scale: 2.5,
        opacity: 0.6,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseLeaveExpand = () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, dot], { scale: 0.8, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, dot], { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Expandir en elementos interactivos
    const expandElements = document.querySelectorAll(
      '[data-cursor="expand"], a, button, [role="button"]'
    );
    expandElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterExpand);
      el.addEventListener('mouseleave', onMouseLeaveExpand);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      expandElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterExpand);
        el.removeEventListener('mouseleave', onMouseLeaveExpand);
      });
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Anillo exterior */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[999] mix-blend-difference"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full h-full rounded-full border border-gold/80 bg-gold/10" />
      </div>
      {/* Punto central */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[999] bg-gold rounded-full"
        style={{ willChange: 'transform' }}
      />
    </>
  );
});

export default CustomCursor;
