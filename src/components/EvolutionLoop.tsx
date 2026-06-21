import React from 'react';

export default function EvolutionLoop() {
  // A cycle: run -> feedback -> extract rule -> backtest -> fold into rules -> next run starts better.
  const nodes = [
    { label: 'Run', sub: 'agent ships a slice' },
    { label: 'Feedback', sub: 'you flag the taste miss' },
    { label: 'Extract rule', sub: 'the underlying principle' },
    { label: 'Backtest', sub: 'does it hold in the codebase?' },
    { label: 'Fold in', sub: 'into the rules layer' },
    { label: 'Next run', sub: 'starts better' },
  ];

  // Position six nodes evenly around a circle.
  const cx = 190;
  const cy = 190;
  const r = 132;
  const positioned = nodes.map((n, i) => {
    const angle = (-90 + i * (360 / nodes.length)) * (Math.PI / 180);
    return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="mx-auto max-w-[420px]">
          <svg
            className="w-full h-auto"
            viewBox="0 0 380 380"
            role="img"
            aria-label="The evolution meta-loop: run, then feedback, extract rule, backtest, fold into the rules layer, and the next run starts better — a cycle that compounds."
          >
            <defs>
              <marker id="el-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Connecting arc segments between consecutive nodes */}
            {positioned.map((n, i) => {
              const next = positioned[(i + 1) % positioned.length]!;
              return (
                <path
                  key={`edge-${i}`}
                  d={`M ${n.x} ${n.y} A ${r} ${r} 0 0 1 ${next.x} ${next.y}`}
                  fill="none"
                  stroke="#94a3b8"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  markerEnd="url(#el-arrow)"
                  className="el-edge"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              );
            })}

            {/* Center label */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              className="fill-slate-700 dark:fill-slate-200"
            >
              compounds
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" className="fill-slate-400 dark:fill-slate-500">
              every loop
            </text>

            {/* Nodes */}
            {positioned.map((n, i) => (
              <g key={n.label}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="30"
                  className="fill-slate-50 stroke-indigo-400 dark:fill-slate-950 dark:stroke-indigo-600"
                  strokeWidth="1.5"
                />
                <text
                  x={n.x}
                  y={n.y - 1}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  className="fill-slate-800 dark:fill-slate-100"
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y + 11}
                  textAnchor="middle"
                  fontSize="6.7"
                  className="fill-slate-500 dark:fill-slate-400"
                >
                  {n.sub}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <style>{`
          .el-edge { stroke-dasharray: 6 4; animation: el-flow 2.4s linear infinite; }
          @keyframes el-flow { to { stroke-dashoffset: -20; } }
          @media (prefers-reduced-motion: reduce) {
            .el-edge { animation: none; stroke-dasharray: none; }
          }
        `}</style>

        <p className="mt-5 text-center text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">
          The evolution meta-loop: every run feeds a confirmed rule back into the harness, so the next run starts ahead
          of the last. The system improves itself.
        </p>
      </div>
    </div>
  );
}
