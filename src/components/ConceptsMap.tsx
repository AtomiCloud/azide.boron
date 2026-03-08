import React from 'react';

export default function ConceptsMap() {
  const solutions = [
    'SOLID Principles',
    'Functional Thinking',
    'Domain-Driven Design',
    'Three-Layer Architecture',
    'Wiring It Together',
    'Testing',
  ];

  return (
    <div className="my-8 md:my-12">
      <div className="bg-card border border-border rounded-lg p-5 md:p-8">
        {/* Goal Layer */}
        <div className="text-center mb-4">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Goal
          </span>
          <div className="inline-block bg-primary/20 border border-primary/50 rounded px-4 py-2 font-semibold text-primary text-sm sm:text-base">
            Changeability
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-3">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-muted-foreground">
            <path d="M10 0 L10 14 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Core Property Layer */}
        <div className="text-center mb-4">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Core Property
          </span>
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500/50 rounded px-4 py-2 font-semibold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
            Locality
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-3">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-muted-foreground">
            <path d="M10 0 L10 14 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Problem Layer */}
        <div className="text-center mb-4">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Problem
          </span>
          <div className="inline-block bg-sky-100 dark:bg-sky-900/30 border border-sky-500/50 rounded px-4 py-2 font-semibold text-sky-700 dark:text-sky-400 text-sm sm:text-base">
            Dependencies
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-3">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-muted-foreground">
            <path d="M10 0 L10 14 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Tension Layer - Low Coupling (left) and High Cohesion (right) */}
        <div className="text-center mb-4">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">
            Tension
          </span>
          <div className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 max-w-md mx-auto px-2">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 border border-red-500/50 rounded px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-sm font-medium text-red-700 dark:text-red-400">
              Low Coupling
            </div>
            <span className="text-muted-foreground text-base sm:text-lg flex-shrink-0">↔</span>
            <div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500/50 rounded px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
              High Cohesion
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-3">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-muted-foreground">
            <path d="M10 0 L10 14 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Solutions Layer */}
        <div className="text-center">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">
            Solutions (This Series)
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {solutions.map((solution, i) => (
              <div
                key={i}
                className="bg-muted/50 border border-border rounded px-2.5 py-1.5 text-xs font-medium text-foreground"
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
