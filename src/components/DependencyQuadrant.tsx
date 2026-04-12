import React from 'react';

export default function DependencyQuadrant() {
  return (
    <div className="my-8 md:my-12">
      <div className="bg-card border border-border rounded-lg p-5 md:p-8">
        <div className="max-w-lg mx-auto flex items-stretch gap-2">
          {/* Y-axis label (left side) */}
          <div className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 flex-shrink-0 px-1 gap-6">
            <span>Implicit</span>
            <svg width="2" height="40" viewBox="0 0 2 40" className="text-muted-foreground/40 flex-shrink-0">
              <line x1="1" y1="0" x2="1" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
            <span>Explicit</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Worst */}
            <div className="rounded-lg border-2 border-red-400 dark:border-red-500 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30">
              <div className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-[10px] sm:text-xs font-semibold text-red-700 dark:text-red-300 mb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                  <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="4" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="4" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Worst
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">Implicit + Fixed</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground">Cannot see it, cannot change it</div>
            </div>

            {/* Dangerous */}
            <div className="rounded-lg border-2 border-amber-400 dark:border-amber-500 p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/30">
              <div className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                  <path
                    d="M6 1 L11 10 L1 10 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <line x1="6" y1="5" x2="6" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
                </svg>
                Dangerous
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">Implicit + Flexible</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground">Can change it, cannot see it</div>
            </div>

            {/* Impossible */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 sm:p-4 bg-gray-100 dark:bg-gray-800/40">
              <div className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-gray-200 dark:bg-gray-700/50 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                  <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="line-through">Impossible</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">Explicit + Fixed</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground">Explicitness implies flexibility</div>
            </div>

            {/* Goal */}
            <div className="rounded-lg border-2 border-primary dark:border-primary p-3 sm:p-4 bg-primary/5 dark:bg-primary/10">
              <div className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-primary/15 dark:bg-primary/25 text-[10px] sm:text-xs font-bold text-primary mb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                  <polyline
                    points="2,6 5,9 10,3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Goal
              </div>
              <div className="text-xs sm:text-sm font-semibold text-foreground mb-1">Explicit + Flexible</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground">Can see it, can change it</div>
            </div>
          </div>
        </div>

        {/* X-axis label (bottom, centered under grid) */}
        <div className="max-w-lg mx-auto mt-5 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/80 pl-16">
          <span>Fixed</span>
          <svg width="60" height="2" viewBox="0 0 60 2" className="text-muted-foreground/40 flex-shrink-0">
            <line x1="0" y1="1" x2="60" y2="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span>Flexible</span>
        </div>
      </div>
    </div>
  );
}
