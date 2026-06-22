import React from 'react';

// Deck slide 7: the jagged shape isn't fixed — it grows and shifts across
// model generations. The human circle stays put; the LLM star pushes further
// past it over time, while the short spikes (blind spots) stay stubbornly inside.

const spikes = [1.5, 0.42, 1.18, 0.6, 1.46, 0.38, 1.0, 0.66, 1.34, 0.5, 1.12];

function starPath(cx: number, cy: number, R: number, inner: number, rot: number): string {
  const n = spikes.length;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + rot;
    const r = R * spikes[i]!;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
    const a2 = a + Math.PI / n;
    pts.push(`${(cx + Math.cos(a2) * inner).toFixed(1)},${(cy + Math.sin(a2) * inner).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

const gens = [
  { label: 'gpt-4', scale: 0.6, rot: 0 },
  { label: 'gpt-5', scale: 0.82, rot: 0.28 },
  { label: 'in the future', scale: 1.12, rot: 0.56 },
];

export default function JaggedSurface() {
  const R = 34; // human-circle radius
  const cx = 64;
  const cy = 60;
  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {gens.map(g => (
            <div key={g.label}>
              <svg
                className="w-full h-auto"
                viewBox="0 0 128 120"
                role="img"
                aria-label={`${g.label}: the jagged LLM star pushes further past the human circle`}
              >
                <circle cx={cx} cy={cy} r={R} fill="#60a5fa" fillOpacity="0.16" stroke="#3b82f6" strokeWidth="1.25" />
                <path
                  d={starPath(cx, cy, R * g.scale, R * g.scale * 0.3, g.rot)}
                  fill="#f97316"
                  fillOpacity="0.7"
                  stroke="#ea580c"
                  strokeWidth="0.75"
                  strokeLinejoin="round"
                />
                <text x={cx} y={112} textAnchor="middle" fontSize="9" className="fill-slate-500 dark:fill-slate-400">
                  {g.label}
                </text>
              </svg>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs italic text-slate-500 dark:text-slate-400">
          The shape moves — spikes push further out, blind spots stay put. Capability varies across model, input and
          task.
        </p>
      </div>
    </div>
  );
}
