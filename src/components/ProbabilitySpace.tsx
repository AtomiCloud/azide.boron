import React, { useEffect, useMemo, useState } from 'react';

// Deterministic pseudo-random so the cloud is stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A fixed cloud (the possibility space) centred off the solution. Each "run"
// just highlights a different existing point — the cloud never changes.
function buildCloud(count: number) {
  const rng = mulberry32(1337);
  const cx = 168;
  const cy = 120;
  const points: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    // Gaussian-ish via summed uniforms.
    const gx = (rng() + rng() + rng() - 1.5) / 1.5;
    const gy = (rng() + rng() + rng() - 1.5) / 1.5;
    points.push({
      x: cx + gx * 58,
      y: cy + gy * 42,
      r: 2.2 + rng() * 2.2,
    });
  }
  return points;
}

const SOLUTION = { x: 300, y: 96, r: 34 };

export default function ProbabilitySpace() {
  const points = useMemo(() => buildCloud(46), []);
  // Three "runs": each picks a different sampled point as the materialization.
  const runs = useMemo(() => [11, 28, 39], []);
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setRun(r => (r + 1) % runs.length), 1800);
    return () => clearInterval(id);
  }, [reduced, runs.length]);

  const materialized = points[runs[run]!]!;

  return (
    <div className="my-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
      <svg
        viewBox="0 0 380 240"
        className="w-full h-auto"
        role="img"
        aria-label="A possibility-space cloud of sampled points sitting off the solution target, with one materialized point highlighted."
      >
        {/* solution region */}
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

        {/* possibility cloud */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} className="fill-slate-400/50 dark:fill-slate-500/50" />
        ))}
        <text
          x={168}
          y={196}
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
        >
          possibility space
        </text>

        {/* materialized sample */}
        <circle
          cx={materialized.x}
          cy={materialized.y}
          r={7}
          className="fill-primary stroke-white dark:stroke-slate-900"
          strokeWidth={2}
          style={{ transition: reduced ? undefined : 'cx 0.5s ease, cy 0.5s ease' }}
        />
      </svg>

      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Same input, three runs. The cloud is identical; only the{' '}
          <span className="text-primary font-semibold">materialized point</span> moves.
        </p>
        <div className="flex gap-1.5" role="group" aria-label="Select a run">
          {runs.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRun(i)}
              aria-pressed={run === i}
              className={
                'h-6 px-2.5 rounded-md text-[11px] font-mono border transition-colors ' +
                (run === i
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400')
              }
            >
              run {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
