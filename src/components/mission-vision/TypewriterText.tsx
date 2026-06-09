import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText = React.memo(function TypewriterText({
  text,
  speed = 40,
  className = '',
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    setDisplayed('');

    const type = () => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(type, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [started, text, speed, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-0.5 h-[1em] bg-gold ml-0.5 animate-pulse align-text-bottom" />
      )}
    </span>
  );
});

export default TypewriterText;
