import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const SectionTitle = React.memo(function SectionTitle({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current!.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div
      ref={ref}
      className={['flex flex-col gap-3', alignClass, className].join(' ')}
    >
      {label && (
        <span className="text-gold font-body text-xs tracking-[0.3em] uppercase">
          {label}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-warmgray font-body text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={[
          'flex gap-1 mt-2',
          align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : '',
        ].join(' ')}
      >
        <span className="w-8 h-px bg-gold" />
        <span className="w-2 h-px bg-gold/50" />
        <span className="w-1 h-px bg-gold/30" />
      </div>
    </div>
  );
});

export default SectionTitle;
