import React from 'react';

interface Segment {
  label: string;
  pct: number;
  className: string;
  swatch: string;
}

const segments: Segment[] = [
  { label: 'System prompt', pct: 8, className: 'bg-amber-500/80', swatch: 'bg-amber-500/80' },
  { label: 'Tools', pct: 12, className: 'bg-orange-500/80', swatch: 'bg-orange-500/80' },
  { label: 'MCP servers', pct: 9, className: 'bg-rose-500/70', swatch: 'bg-rose-500/70' },
  { label: 'Memory', pct: 10, className: 'bg-violet-500/70', swatch: 'bg-violet-500/70' },
  { label: 'Skills', pct: 6, className: 'bg-sky-500/70', swatch: 'bg-sky-500/70' },
  { label: 'Messages', pct: 30, className: 'bg-indigo-500/80', swatch: 'bg-indigo-500/80' },
  {
    label: 'Free space',
    pct: 25,
    className: 'bg-slate-300 dark:bg-slate-700',
    swatch: 'bg-slate-300 dark:bg-slate-700',
  },
];

export default function TokenBudget() {
  return (
    <div className="my-8">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            One context window
          </div>
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">fixed size</div>
        </div>

        {/* Stacked bar */}
        <div className="flex h-9 w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
          {segments.map((s, i) => (
            <div
              key={i}
              className={s.className}
              style={{ width: `${s.pct}%` }}
              title={`${s.label} — ${s.pct}%`}
              aria-label={`${s.label} ${s.pct}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={'inline-block h-3 w-3 flex-none rounded-[2px] ' + s.swatch} />
              <span className="text-xs text-slate-600 dark:text-slate-300">{s.label}</span>
              <span className="ml-auto text-xs tabular-nums text-slate-400 dark:text-slate-500">~{s.pct}%</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-sm italic text-slate-500 dark:text-slate-400">
          Everything competes for the same budget. Every file you read and every tool result eats into it — so context
          is finite and contested, not free.
        </p>
      </div>
    </div>
  );
}
