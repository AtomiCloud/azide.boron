import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

export default function ConceptsMap() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const solutions = [
    'SOLID Principles',
    'Functional Thinking',
    'Domain-Driven Design',
    'Three-Layer Architecture',
    'Wiring It Together',
    'Testing',
  ];

  return (
    <div ref={containerRef} className="my-8 md:my-12">
      <div
        className={cn(
          'bg-card border border-border rounded-lg p-4 md:p-6 transition-opacity duration-700',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* Goal Layer */}
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Goal</span>
          <div className="mt-1 inline-block bg-primary/20 border border-primary rounded px-4 py-2 font-semibold text-primary">
            Changeability
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2 md:my-3">
          <svg width="20" height="24" viewBox="0 0 20 24" className="text-muted-foreground">
            <path d="M10 0 L10 16 M4 12 L10 18 L16 12" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Core Property Layer */}
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Core Property</span>
          <div className="mt-1 inline-block bg-blue-500/20 border border-blue-500 rounded px-4 py-2 font-semibold text-blue-500 dark:text-blue-400">
            Locality
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2 md:my-3">
          <svg width="20" height="24" viewBox="0 0 20 24" className="text-muted-foreground">
            <path d="M10 0 L10 16 M4 12 L10 18 L16 12" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Problem Layer */}
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Problem</span>
          <div className="mt-1 inline-block bg-amber-500/20 border border-amber-500 rounded px-4 py-2 font-semibold text-amber-600 dark:text-amber-400">
            Dependencies
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2 md:my-3">
          <svg width="20" height="24" viewBox="0 0 20 24" className="text-muted-foreground">
            <path d="M10 0 L10 16 M4 12 L10 18 L16 12" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Tension Layer */}
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Tension</span>
          <div className="mt-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="bg-destructive/20 border border-destructive rounded px-3 py-1.5 text-sm font-medium text-destructive">
              Low Coupling
            </div>
            <span className="text-muted-foreground text-lg hidden sm:block">←→</span>
            <span className="text-muted-foreground text-sm sm:hidden">↔</span>
            <div className="bg-green-500/20 border border-green-500 rounded px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400">
              High Cohesion
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2 md:my-3">
          <svg width="20" height="24" viewBox="0 0 20 24" className="text-muted-foreground">
            <path d="M10 0 L10 16 M4 12 L10 18 L16 12" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Solutions Layer */}
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Solutions (This Series)</span>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {solutions.map((solution, i) => (
              <div
                key={i}
                className="bg-muted border border-border rounded px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {solution}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
