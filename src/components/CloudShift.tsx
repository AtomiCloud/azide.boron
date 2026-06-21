import React, { useEffect, useMemo, useState } from 'react';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SOLUTION = { x: 290, y: 110, r: 30 };

export default function CloudShift() {
  const [shifted, setShifted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShifted(true);
      return;
    }
    const id = setInterval(() => setShifted(s => !s), 2400);
    return () => clearInterval(id);
  }, [reduced]);

  // Two cloud configurations: broad+off, and tight+on-target.
  const clouds = useMemo(() => {
    const rng = mulberry32(7);
    const base: { gx: number; gy: number; r: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const gx = (rng() + rng() + rng() - 1.5) / 1.5;
      const gy = (rng() + rng() + rng() - 1.5) / 1.5;
      base.push({ gx, gy, r: 2 + rng() * 2 });
    }
    const off = base.map(p => ({
      x: 110 + p.gx * 56,
      y: 130 + p.gy * 40,
      r: p.r,
    }));
    const on = base.map(p => ({
      x: SOLUTION.x + p.gx * 20,
      y: SOLUTION.y + p.gy * 16,
      r: p.r,
    }));
    return { off, on };
  }, []);

  const active = shifted ? clouds.on : clouds.off;

  return (
    <div className="my-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
      <svg
        viewBox="0 0 380 220"
        className="w-full h-auto"
        role="img"
        aria-label="A broad cloud sitting off the solution shifting and shrinking until it lands on the solution target."
      >
        <circle
          cx={SOLUTION.x}
          cy={SOLUTION.y}
          r={SOLUTION.r}
          className="fill-emerald-500/10 stroke-emerald-500/70"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <text
          x={SOLUTION.x}
          y={SOLUTION.y - SOLUTION.r - 8}
          textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-semibold"
        >
          solution
        </text>

        {active.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            className="fill-primary/60"
            style={{
              transition: reduced ? undefined : 'cx 0.9s ease, cy 0.9s ease, r 0.9s ease',
            }}
          />
        ))}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Shape the cloud onto the solution — <span className="font-semibold">shift</span> it, then{' '}
          <span className="font-semibold">shrink</span> it.
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setShifted(s => !s)}
            className="h-6 px-2.5 rounded-md text-[11px] font-mono border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 transition-colors"
          >
            {shifted ? 'reset' : 'engineer'}
          </button>
        )}
      </div>
    </div>
  );
}
