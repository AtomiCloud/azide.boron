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
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
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
          <div className="mt-1 inline-block bg-secondary/50 border border-secondary-foreground/30 rounded px-4 py-2 font-semibold text-secondary-foreground">
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
          <div className="mt-1 inline-block bg-accent/50 border border-accent rounded px-4 py-2 font-semibold text-accent-foreground">
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
            <div className="bg-secondary/50 border border-secondary rounded px-3 py-1.5 text-sm font-medium text-secondary-foreground">
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
