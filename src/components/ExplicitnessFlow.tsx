import React from 'react';

export default function ExplicitnessFlow() {
  return (
    <div className="my-8 md:my-12">
      <div className="bg-card border border-border rounded-lg p-5 md:p-8">
        {/* Starting question */}
        <div className="text-center mb-3">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1.5 block">
            Starting point
          </span>
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/50 rounded px-4 py-2 font-semibold text-primary text-sm sm:text-base">
            <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="8" y="12" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">
                ?
              </text>
            </svg>
            Want flexibility?
          </div>
        </div>

        {/* Branching arrow */}
        <div className="flex justify-center my-3">
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-muted-foreground">
            <path d="M10 0 L10 14 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 text-center block mb-3">
          Two paths
        </span>

        {/* Two paths side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-lg mx-auto">
          {/* Left path: Mutable globals (bad) */}
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="rounded-lg border-2 border-accent bg-accent/15 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Path A
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-foreground">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                    <path
                      d="M7 1 L13 12 L1 12 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <line x1="7" y1="6" x2="7" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="7" cy="9.5" r="0.5" fill="currentColor" />
                  </svg>
                  Mutable globals
                </div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent-foreground/60">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="w-full">
              <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-center">
                <div className="text-[10px] sm:text-xs text-foreground/70 dark:text-foreground/60 space-y-0.5">
                  <div>Temporal coupling</div>
                  <div>Test pollution</div>
                  <div>Race conditions</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent-foreground/60">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Blocked */}
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted p-3">
                <svg width="16" height="16" viewBox="0 0 16 16" className="text-destructive flex-shrink-0">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="5" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="11" y1="5" x2="5" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Blocked</span>
              </div>
            </div>
          </div>

          {/* Right path: Construction-time injection (good) */}
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="rounded-lg border-2 border-primary bg-primary/10 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Path B
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                    <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="7" y1="4" x2="7" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Construction-time injection
                </div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-primary/60">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="w-full">
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Result
                </span>
                <div className="text-xs sm:text-sm font-semibold text-primary">Flexibility + Immutability</div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-primary">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Explicitness (inevitable) */}
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary dark:border-primary bg-primary/5 dark:bg-primary/10 p-3 text-center">
                <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0 text-primary">
                  <polyline
                    points="2,7 5,10 12,4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-primary">Explicitness</div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground italic mt-0.5">inevitable</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="text-center mt-6">
          <div className="inline-block rounded bg-muted/50 border border-border px-4 py-2 text-xs sm:text-sm text-muted-foreground italic">
            Explicitness is a consequence, not a goal
          </div>
        </div>
      </div>
    </div>
  );
}
