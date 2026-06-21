import React, { useMemo } from 'react';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cloud(seed: number, spreadX: number, spreadY: number, count: number) {
  const rng = mulberry32(seed);
  const pts: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    const gx = (rng() + rng() + rng() - 1.5) / 1.5;
    const gy = (rng() + rng() + rng() - 1.5) / 1.5;
    pts.push({ x: 95 + gx * spreadX, y: 80 + gy * spreadY, r: 2 + rng() * 2 });
  }
  return pts;
}

function Panel({ label, input, pts }: { label: string; input: string; pts: { x: number; y: number; r: number }[] }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-1 truncate">{input}</div>
      <svg viewBox="0 0 190 160" className="w-full h-auto" role="img" aria-label={label}>
        <rect
          x={1}
          y={1}
          width={188}
          height={158}
          rx={8}
          className="fill-slate-50/60 dark:fill-slate-800/30 stroke-slate-200 dark:stroke-slate-800"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} className="fill-primary/60" />
        ))}
      </svg>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-center">{label}</div>
    </div>
  );
}

export default function TwoInputClouds() {
  const broad = useMemo(() => cloud(21, 62, 50, 44), []);
  const tight = useMemo(() => cloud(21, 16, 13, 44), []);

  return (
    <div className="my-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
      <div className="flex gap-4 md:gap-8">
        <Panel label="broad cloud" input='"an algorithm in Ruby"' pts={broad} />
        <Panel label="tight cloud" input='"a binary search in Ruby"' pts={tight} />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        A tighter input produces a tighter cloud. Specificity is a knob on the space.
      </p>
    </div>
  );
}
