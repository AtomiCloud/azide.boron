import React, { useEffect, useRef, useState } from 'react';

export default function ConceptsMap() {
  const solutions = [
    'SOLID Principles',
    'Functional Thinking',
    'Domain-Driven Design',
    'Three-Layer Architecture',
    'Wiring It Together',
    'Testing',
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Respect reduced motion: reveal immediately, skip the staggered transition.
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    // Fallback: never leave content invisible if the observer is slow or misses
    // (e.g. tall mobile layouts where the element is hard to bring 5%+ into view at once).
    const fallback = window.setTimeout(() => setRevealed(true), 1400);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // Each layer (and the connector before it) reveals in sequence top-to-bottom.
  const layerStyle = (index: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: `${index * 0.12}s`,
  });

  // Static thin downward connector arrow (hairline; no perpetual motion).
  const Connector = ({ index }: { index: number }) => (
    <div className="flex justify-center my-3" style={layerStyle(index)}>
      <svg width="20" height="22" viewBox="0 0 20 22" className="text-muted-foreground" aria-hidden="true">
        <line x1="10" y1="0" x2="10" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <path
          d="M4 11 L10 18 L16 11"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <div className="my-8 md:my-12">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .cm-flow line { animation: none !important; }
          .cm-chip { transition: none !important; }
        }
        .cm-chip { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .cm-chip:hover { transform: translateY(-3px); box-shadow: 0 6px 16px -6px rgba(99,102,241,0.45); border-color: rgba(99,102,241,0.6); }
      `}</style>
      <div ref={containerRef} className="cm-flow bg-card border border-border rounded-lg p-5 md:p-8">
        {/* Goal Layer */}
        <div className="text-center mb-4" style={layerStyle(0)}>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Goal
          </span>
          <div className="inline-block bg-primary/20 border border-primary/50 rounded px-4 py-2 font-semibold text-primary text-sm sm:text-base">
            Changeability
          </div>
        </div>

        <Connector index={1} />

        {/* Core Property Layer */}
        <div className="text-center mb-4" style={layerStyle(2)}>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Core Property
          </span>
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500/50 rounded px-4 py-2 font-semibold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
            Locality
          </div>
        </div>

        <Connector index={3} />

        {/* Problem Layer */}
        <div className="text-center mb-4" style={layerStyle(4)}>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Problem
          </span>
          <div className="inline-block bg-sky-100 dark:bg-sky-900/30 border border-sky-500/50 rounded px-4 py-2 font-semibold text-sky-700 dark:text-sky-400 text-sm sm:text-base">
            Dependencies
          </div>
        </div>

        <Connector index={5} />

        {/* Tension Layer - Low Coupling (left) and High Cohesion (right) */}
        <div className="text-center mb-4" style={layerStyle(6)}>
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

        <Connector index={7} />

        {/* Solutions Layer */}
        <div className="text-center" style={layerStyle(8)}>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">
            Solutions (This Series)
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {solutions.map((solution, i) => (
              <div
                key={i}
                className="cm-chip bg-muted/50 border border-border rounded px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {solution}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center mt-3 text-xs text-muted-foreground italic">
        How the series fits together: the goal of changeability rests on locality, which is threatened by dependencies,
        balanced through a coupling/cohesion tension, and addressed by the solutions ahead.
      </p>
    </div>
  );
}
