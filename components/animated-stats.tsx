"use client";

import { useEffect, useRef } from "react";

type Stat = { target: number; label: string; suffix?: string };

const defaultStats: Stat[] = [
  { target: 120, label: "Businesses Served", suffix: "+" },
  { target: 40, label: "Avg. Sales Growth Achieved", suffix: "%" },
  { target: 98, label: "Client Satisfaction", suffix: "%" },
  { target: 12, label: "Years of Experience", suffix: "+" },
];

interface AnimatedStatsProps {
  stats?: Stat[];
}

export default function AnimatedStats({ stats = defaultStats }: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRefs = useRef<number[]>([]);
  const intervalRefs = useRef<number[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll('[data-stat-target]')) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    function start() {
      items.forEach((item, i) => {
        const target = Number(item.dataset.statTarget) || 0;
        const valueEl = item.querySelector('[data-stat-value]') as HTMLElement;
        if (!valueEl) return;

        const duration = 1400 + i * 120;
        const startTime = performance.now();

        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          const current = Math.round(eased * target);
          valueEl.textContent = String(current) + (item.dataset.statSuffix || "");
          if (t < 1) {
            rafRefs.current[i] = requestAnimationFrame(step);
          }
        };

        rafRefs.current[i] = requestAnimationFrame(step);
        item.style.transition = "transform 1200ms ease-in-out";
        intervalRefs.current[i] = window.setInterval(() => {
          const rx = (Math.random() - 0.5) * 12;
          const ry = (Math.random() - 0.5) * 8;
          item.style.transform = `translate(${rx}px, ${ry}px)`;
        }, 1600 + Math.round(Math.random() * 900));
      });
    }

    function stop() {
      rafRefs.current.forEach((id) => cancelAnimationFrame(id));
      intervalRefs.current.forEach((id) => clearInterval(id));
      items.forEach((item) => {
        item.style.transform = "none";
      });
      rafRefs.current = [];
      intervalRefs.current = [];
    }

    return () => {
      stop();
      observer.disconnect();
    };
  }, [stats]);

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="-mt-8 grid grid-cols-2 gap-6 py-16 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            data-stat-target={s.target}
            data-stat-suffix={s.suffix || ""}
            className="rounded-[2rem] border border-border/60 bg-white/90 p-7 text-center shadow-xl backdrop-blur-xl transition-transform will-change-transform"
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className="text-4xl font-display font-extrabold text-primary">
              <span data-stat-value>0</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
