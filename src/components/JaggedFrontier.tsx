import React from 'react';

// Wrong model (left): intelligence as a single ladder — humans neatly ranked by
// one scalar "smartness". Right model (right): capability as a jagged frontier —
// superhuman spikes next to near-zero dips, with no human-intuitive ordering.

interface Rung {
  label: string;
  // 0 (bottom) .. 1 (top) position on the ladder
  level: number;
}

const ladder: Rung[] = [
  { label: 'Expert', level: 0.92 },
  { label: 'Senior', level: 0.72 },
  { label: 'Mid', level: 0.52 },
  { label: 'Junior', level: 0.32 },
  { label: 'Novice', level: 0.12 },
];

interface Task {
  label: string;
  // 0 (near-useless) .. 1 (superhuman) capability on this specific task
  capability: number;
}

// A deliberately jagged profile: high spikes (translation, boilerplate),
// then trivial-looking dips (counting letters, simple arithmetic at scale).
const tasks: Task[] = [
  { label: 'Translate', capability: 0.96 },
  { label: 'Summarize', capability: 0.82 },
  { label: 'Count letters', capability: 0.14 },
  { label: 'Boilerplate', capability: 0.9 },
  { label: 'Big-num math', capability: 0.22 },
  { label: 'Draft prose', capability: 0.85 },
  { label: 'Tic-tac-toe', capability: 0.18 },
  { label: 'Code review', capability: 0.7 },
];

export default function JaggedFrontier() {
  // Right-panel chart geometry (SVG user units).
  const W = 320;
  const H = 200;
  const padL = 28;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const barGap = 8;
  const barW = (plotW - barGap * (tasks.length - 1)) / tasks.length;

  // "Human baseline" reference line — capability above it is superhuman.
  const baseline = 0.55;
  const baselineY = padT + plotH * (1 - baseline);

  // Polyline tracing the jagged frontier across bar tops.
  const frontier = tasks
    .map((t, i) => {
      const x = padL + i * (barW + barGap) + barW / 2;
      const y = padT + plotH * (1 - t.capability);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ===================== LEFT: the ladder (wrong model) ===================== */}
          <div>
            <div className="mb-3 text-center">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                The wrong model
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {ladder.map(rung => (
                <div
                  key={rung.label}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60"
                  style={{ marginLeft: `${(1 - rung.level) * 24}px` }}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: '#64748b', opacity: 0.4 + rung.level * 0.6 }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{rung.label}</span>
                  <span className="ml-auto font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    rung {ladder.length - ladder.indexOf(rung)}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs italic text-slate-500 dark:text-slate-400">
              One scalar. More-or-less smart. Climb the ladder.
            </p>
          </div>

          {/* ===================== RIGHT: the jagged frontier (right model) ===================== */}
          <div>
            <div className="mb-3 text-center">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                The right model
              </span>
            </div>

            <svg
              className="w-full h-auto"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="A jagged capability chart across eight tasks. Some bars rise well above a human-baseline line (superhuman: translate, boilerplate, draft prose) while others collapse near zero (count letters, big-number math, tic-tac-toe), with no smooth ordering."
            >
              {/* Y axis ticks */}
              {[0, 0.5, 1].map(t => {
                const y = padT + plotH * (1 - t);
                return (
                  <g key={t}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={W - padR}
                      y2={y}
                      stroke="#cbd5e1"
                      strokeOpacity={0.4}
                      strokeWidth={0.5}
                      strokeDasharray="2 3"
                    />
                  </g>
                );
              })}

              {/* Human baseline */}
              <line
                x1={padL}
                y1={baselineY}
                x2={W - padR}
                y2={baselineY}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text
                x={W - padR}
                y={baselineY - 4}
                textAnchor="end"
                fontSize={8}
                className="fill-slate-500 dark:fill-slate-400"
              >
                human baseline
              </text>

              {/* Bars */}
              {tasks.map((t, i) => {
                const x = padL + i * (barW + barGap);
                const y = padT + plotH * (1 - t.capability);
                const h = padT + plotH - y;
                const superhuman = t.capability >= baseline;
                return (
                  <g key={t.label}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      rx={2}
                      fill={superhuman ? '#6366f1' : '#f43f5e'}
                      fillOpacity={0.85}
                    />
                    <text
                      x={x + barW / 2}
                      y={H - padB + 9}
                      textAnchor="end"
                      fontSize={6.5}
                      transform={`rotate(-32 ${x + barW / 2} ${H - padB + 9})`}
                      className="fill-slate-500 dark:fill-slate-400"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}

              {/* The jagged frontier line over the bars */}
              <path
                d={frontier}
                fill="none"
                stroke="#0f172a"
                strokeOpacity={0.55}
                strokeWidth={1.25}
                className="dark:stroke-white"
              />
              {tasks.map((t, i) => {
                const x = padL + i * (barW + barGap) + barW / 2;
                const y = padT + plotH * (1 - t.capability);
                return <circle key={t.label} cx={x} cy={y} r={1.8} fill="#0f172a" className="dark:fill-white" />;
              })}
            </svg>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-indigo-500" /> superhuman
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-rose-500" /> trivially bad
              </span>
            </div>

            <p className="mt-3 text-center text-xs italic text-slate-500 dark:text-slate-400">
              Capability varies per task. Spikes and dips, no smooth ladder.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
          Intelligence isn't a height to climb — it's a jagged surface to map.
        </p>
      </div>
    </div>
  );
}
