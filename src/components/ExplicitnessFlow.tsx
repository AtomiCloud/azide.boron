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
              <div className="rounded-lg border-2 border-amber-400 dark:border-amber-500 bg-amber-50/60 dark:bg-amber-950/15 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Path A
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300">
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
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-amber-500 dark:text-amber-400">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="w-full">
              <div className="rounded-lg border border-amber-200 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-950/10 p-3 text-center">
                <div className="text-[10px] sm:text-xs text-foreground/70 dark:text-foreground/60 space-y-0.5">
                  <div>Temporal coupling</div>
                  <div>Test pollution</div>
                  <div>Race conditions</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-amber-500 dark:text-amber-400">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Blocked */}
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-600 bg-amber-50/30 dark:bg-amber-950/10 p-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="text-amber-600 dark:text-amber-400 flex-shrink-0"
                >
                  <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="5" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="11" y1="5" x2="5" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-foreground/60 dark:text-foreground/50">
                  Blocked
                </span>
              </div>
            </div>
          </div>

          {/* Right path: Construction-time injection (good) */}
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="rounded-lg border-2 border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Path B
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
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
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-emerald-500 dark:text-emerald-400">
                <path d="M8 0 L8 12 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="w-full">
              <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/60 dark:bg-emerald-950/10 p-3 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 mb-1 block">
                  Result
                </span>
                <div className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Flexibility + Immutability
                </div>
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
