import React from 'react';

// Faithful to the talk's illustrations:
//  - LEFT  (the model we imagine): a ladder with a stick figure climbing it,
//    rungs from "beginner" up to "genius", an arrow labelled "smarter".
//  - RIGHT (what it's actually like): a smooth blue "human" circle with a
//    jagged orange "LLM" star — spikes that punch past the human baseline
//    (superhuman) sitting right next to dips that fall inside it (blind spots).

const rungs = ['genius', 'principal', 'staff', 'senior', 'mid', 'junior', 'beginner'];

// Jagged spike lengths as a fraction of the human-circle radius.
// >1 pokes past the circle (superhuman); <1 recedes inside it (a blind spot).
const spikes = [1.5, 0.42, 1.18, 0.6, 1.46, 0.38, 1.0, 0.66, 1.34, 0.5, 1.12];

function starPath(cx: number, cy: number, R: number, inner: number): string {
  const n = spikes.length;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = R * spikes[i]!;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
    const a2 = a + Math.PI / n;
    pts.push(`${(cx + Math.cos(a2) * inner).toFixed(1)},${(cy + Math.sin(a2) * inner).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

export default function JaggedFrontier() {
  // RIGHT-panel geometry
  const cx = 116;
  const cy = 120;
  const R = 58; // human-circle radius (the "baseline")
  // a long spike (index 0, straight up) → superhuman; a short one (index 5) → blind spot
  const supA = (0 / spikes.length) * Math.PI * 2 - Math.PI / 2;
  const supR = R * spikes[0]!;
  const supX = cx + Math.cos(supA) * supR;
  const supY = cy + Math.sin(supA) * supR;
  const dipA = (5 / spikes.length) * Math.PI * 2 - Math.PI / 2;
  const dipR = R * spikes[5]!;
  const dipX = cx + Math.cos(dipA) * dipR;
  const dipY = cy + Math.sin(dipA) * dipR;

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* ===================== LEFT: the ladder ===================== */}
          <div>
            <div className="mb-3 text-center">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                The model we imagine
              </span>
            </div>
            <svg
              className="w-full h-auto max-w-[260px] mx-auto block"
              viewBox="0 0 200 260"
              role="img"
              aria-label="A ladder with a stick figure on a low rung. Rungs are labelled from beginner at the bottom to genius at the top, with an arrow up the side labelled smarter."
            >
              {/* smarter arrow */}
              <defs>
                <marker id="jf-up" markerWidth="7" markerHeight="7" refX="3.5" refY="5" orient="auto">
                  <polygon points="0 5, 3.5 0, 7 5" className="fill-slate-400 dark:fill-slate-500" />
                </marker>
              </defs>
              <line
                x1="34"
                y1="238"
                x2="34"
                y2="32"
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth="1.25"
                markerEnd="url(#jf-up)"
              />
              <text
                x="22"
                y="135"
                fontSize="9"
                transform="rotate(-90 22 135)"
                textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
              >
                smarter
              </text>

              {/* rails */}
              <line
                x1="66"
                y1="24"
                x2="66"
                y2="246"
                className="stroke-slate-500 dark:stroke-slate-300"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="120"
                y1="24"
                x2="120"
                y2="246"
                className="stroke-slate-500 dark:stroke-slate-300"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* rungs + labels */}
              {rungs.map((label, i) => {
                const y = 40 + i * 32;
                return (
                  <g key={label}>
                    <line
                      x1="66"
                      y1={y}
                      x2="120"
                      y2={y}
                      className="stroke-slate-400 dark:stroke-slate-500"
                      strokeWidth="1.5"
                    />
                    <text x="128" y={y + 3} fontSize="9.5" className="fill-slate-600 dark:fill-slate-300">
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* stick figure standing near the 'junior' rung (y = 40 + 5*32 = 200) */}
              <g className="stroke-orange-500" strokeWidth="2" strokeLinecap="round" fill="none">
                <circle cx="93" cy="180" r="5" className="fill-orange-500 stroke-orange-500" />
                <line x1="93" y1="185" x2="93" y2="198" />
                <line x1="93" y1="189" x2="85" y2="195" />
                <line x1="93" y1="189" x2="101" y2="195" />
                <line x1="93" y1="198" x2="87" y2="200" />
                <line x1="93" y1="198" x2="99" y2="200" />
              </g>
            </svg>
            <p className="mt-4 text-center text-xs italic text-slate-500 dark:text-slate-400">
              One scalar. Climb the rungs.
            </p>
          </div>

          {/* ===================== RIGHT: the jagged star vs the human circle ===================== */}
          <div>
            <div className="mb-3 text-center">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                What it's actually like
              </span>
            </div>
            <svg
              className="w-full h-auto max-w-[280px] mx-auto block"
              viewBox="0 0 232 240"
              role="img"
              aria-label="A smooth blue circle labelled human capability, overlaid with a jagged orange star labelled LLM capability. Some star points punch out past the circle (superhuman) while others fall well inside it (blind spots)."
            >
              {/* human capability — the smooth baseline circle */}
              <circle cx={cx} cy={cy} r={R} fill="#60a5fa" fillOpacity="0.18" stroke="#3b82f6" strokeWidth="1.5" />
              {/* LLM capability — the jagged star */}
              <path
                d={starPath(cx, cy, R, 18)}
                fill="#f97316"
                fillOpacity="0.7"
                stroke="#ea580c"
                strokeWidth="1"
                strokeLinejoin="round"
              />

              {/* annotations */}
              <line
                x1={supX}
                y1={supY}
                x2={supX + 22}
                y2={supY - 6}
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth="0.75"
              />
              <text
                x={supX + 24}
                y={supY - 7}
                fontSize="8.5"
                fontWeight="600"
                className="fill-orange-600 dark:fill-orange-400"
              >
                superhuman
              </text>
              <line
                x1={dipX}
                y1={dipY}
                x2={dipX - 18}
                y2={dipY + 10}
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth="0.75"
              />
              <text
                x={dipX - 20}
                y={dipY + 13}
                fontSize="8.5"
                fontWeight="600"
                textAnchor="end"
                className="fill-slate-500 dark:fill-slate-400"
              >
                blind spot
              </text>

              {/* legend */}
              <circle cx="14" cy="224" r="5" fill="#60a5fa" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1" />
              <text x="23" y="227" fontSize="8.5" className="fill-slate-500 dark:fill-slate-400">
                human
              </text>
              <path d={starPath(120, 224, 6, 2)} fill="#f97316" fillOpacity="0.8" />
              <text x="130" y="227" fontSize="8.5" className="fill-slate-500 dark:fill-slate-400">
                LLM
              </text>
            </svg>
            <p className="mt-4 text-center text-xs italic text-slate-500 dark:text-slate-400">
              Strengths and weaknesses don't follow human intuition.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-base md:text-lg font-bold text-slate-700 dark:text-slate-200">
          Intelligence isn't a height to climb — it's a jagged shape to map.
        </p>
      </div>
    </div>
  );
}
