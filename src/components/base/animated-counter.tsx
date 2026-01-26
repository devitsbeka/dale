'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 800,
  className = '',
  formatFn = (v) => v.toLocaleString(),
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // If value hasn't changed, do nothing
    if (value === prevValueRef.current) return;

    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();
    const isIncreasing = endValue > startValue;

    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
        setIsAnimating(false);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      className={`${className} ${
        isAnimating ? 'transition-colors duration-300' : ''
      }`}
      style={{
        color: isAnimating
          ? displayValue > prevValueRef.current
            ? 'rgb(34 197 94)' // green-500
            : displayValue < prevValueRef.current
            ? 'rgb(239 68 68)' // red-500
            : undefined
          : undefined,
      }}
    >
      {formatFn(displayValue)}
    </span>
  );
}
