import React from 'react';

export default function SteeringLoop() {
  // The grind: a short prompt, a short wait, repeated all day. You never leave the loop.
  const steps = [
    { label: 'You prompt', sub: '~3 min', tone: 'human' as const },
    { label: 'It works', sub: '~3 min', tone: 'agent' as const },
    { label: 'It misses something', sub: 'a test breaks', tone: 'miss' as const },
    { label: 'You correct it', sub: 'back in', tone: 'human' as const },
  ];

  const toneClasses: Record<string, string> = {
    human:
      'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    agent:
      'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    miss: 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
  };

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="relative mx-auto max-w-2xl">
          {/* Cycle arrow ring (decorative) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className={`sl-step flex items-center gap-3 rounded-lg border p-3 ${toneClasses[s.tone]}`}
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                  {i + 1}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{s.label}</span>
                  <span className="font-mono text-[11px] opacity-70">{s.sub}</span>
                </span>
              </div>
            ))}
          </div>

          {/* The loop-back hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span className="sl-arrow">&#8635;</span>
            <span>repeat all day</span>
          </div>
        </div>

        <style>{`
          @keyframes sl-pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          .sl-step { animation: sl-pulse 3.6s ease-in-out infinite; }
          .sl-arrow { display: inline-block; animation: sl-spin 3.6s linear infinite; }
          @keyframes sl-spin { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) {
            .sl-step, .sl-arrow { animation: none; opacity: 1; }
          }
        `}</style>

        <p className="mt-5 text-center text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">
          Three minutes prompting, three minutes waiting — and you never step out of the loop. Your whole day is
          steering.
        </p>
      </div>
    </div>
  );
}
