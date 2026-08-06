'use client';

import { useEffect, useRef, useState } from 'react';
import type { Stat } from '@/lib/data';

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center reveal"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="font-display text-4xl font-bold text-primary md:text-5xl">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="mt-2 text-sm font-medium text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
