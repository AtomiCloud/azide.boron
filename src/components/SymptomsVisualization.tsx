import React from 'react';

export default function SymptomsVisualization() {
  // Fragility web - more random/scattered layout
  const fragilityDots = [
    { x: 18, y: 28, hop: 0, onPath: true }, // source
    { x: 75, y: 18, hop: -1, onPath: false },
    { x: 35, y: 45, hop: 1, onPath: true }, // path
    { x: 12, y: 62, hop: -1, onPath: false },
    { x: 55, y: 22, hop: -1, onPath: false },
    { x: 48, y: 55, hop: 2, onPath: true }, // path
    { x: 28, y: 78, hop: -1, onPath: false },
    { x: 68, y: 35, hop: -1, onPath: false },
    { x: 62, y: 68, hop: 3, onPath: true }, // path
    { x: 45, y: 85, hop: -1, onPath: false },
    { x: 82, y: 52, hop: -1, onPath: false },
    { x: 78, y: 78, hop: 4, onPath: true }, // path - breaks here
    { x: 88, y: 35, hop: -1, onPath: false },
    { x: 15, y: 45, hop: -1, onPath: false },
    { x: 55, y: 88, hop: -1, onPath: false },
    { x: 92, y: 65, hop: -1, onPath: false },
    { x: 38, y: 15, hop: -1, onPath: false },
    { x: 8, y: 82, hop: -1, onPath: false },
  ] as const;

  // Random connections creating a more chaotic web
  const allFragilityConnections: readonly [number, number][] = [
    [0, 2],
    [0, 3],
    [0, 5],
    [0, 13],
    [1, 4],
    [1, 7],
    [1, 12],
    [2, 5],
    [2, 6],
    [2, 8],
    [3, 6],
    [3, 17],
    [4, 7],
    [4, 5],
    [5, 8],
    [5, 9],
    [6, 9],
    [6, 14],
    [7, 10],
    [7, 8],
    [7, 12],
    [8, 11],
    [8, 14],
    [8, 15],
    [9, 14],
    [9, 17],
    [10, 12],
    [10, 15],
    [11, 15],
    [11, 16],
    [12, 16],
    [13, 17],
    // Some cross-connections for randomness
    [1, 5],
    [3, 8],
    [4, 10],
    [6, 11],
    [9, 15],
  ];

  // Highlighted path connections only
  const pathConnections: readonly [number, number][] = [
    [0, 2],
    [2, 5],
    [5, 8],
    [8, 11],
  ];

  // Rigidity web - more mesh-like, not all need to change
  const rigidityDots = [
    { x: 22, y: 35, hop: 0, needsChange: true }, // source - must change
    { x: 35, y: 18, hop: 1, needsChange: true },
    { x: 30, y: 55, hop: 1, needsChange: true },
    { x: 15, y: 72, hop: 1, needsChange: false }, // doesn't need to change
    { x: 52, y: 25, hop: 2, needsChange: true },
    { x: 45, y: 62, hop: 2, needsChange: true },
    { x: 28, y: 85, hop: 2, needsChange: false },
    { x: 68, y: 38, hop: 3, needsChange: true },
    { x: 58, y: 75, hop: 3, needsChange: true },
    { x: 42, y: 88, hop: 3, needsChange: false },
    { x: 78, y: 52, hop: 4, needsChange: true },
    { x: 72, y: 82, hop: 4, needsChange: false },
    { x: 88, y: 62, hop: 5, needsChange: true },
    { x: 82, y: 35, hop: 3, needsChange: false },
    { x: 85, y: 85, hop: 5, needsChange: false },
    { x: 60, y: 15, hop: 2, needsChange: false },
    { x: 20, y: 50, hop: 1, needsChange: true },
    { x: 50, y: 45, hop: 2, needsChange: true },
  ] as const;

  // More mesh-like connections
  const rigidityConnections: readonly [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 16],
    [1, 4],
    [1, 15],
    [1, 16],
    [2, 5],
    [2, 6],
    [2, 17],
    [3, 6],
    [3, 9],
    [4, 7],
    [4, 15],
    [4, 17],
    [5, 8],
    [5, 9],
    [5, 17],
    [6, 9],
    [7, 10],
    [7, 13],
    [7, 17],
    [8, 11],
    [8, 14],
    [9, 14],
    [10, 12],
    [10, 13],
    [11, 14],
    [12, 14],
    [12, 15],
    [13, 15],
    [16, 17],
    // Cross mesh connections
    [1, 2],
    [4, 5],
    [7, 8],
    [10, 11],
  ];

  return (
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Fragility */}
        <div className="border border-rose-400/40 dark:border-rose-500/40 rounded-lg p-4 bg-rose-50/50 dark:bg-rose-950/20">
          <div className="text-center mb-3 text-sm font-semibold text-rose-600 dark:text-rose-400">
            Fragility (Action at a Distance)
          </div>

          <div className="relative aspect-square w-full max-w-[240px] md:max-w-[280px] mx-auto bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* All connections (faded) */}
              {allFragilityConnections.map(([from, to], i) => {
                const fromDot = fragilityDots[from]!;
                const toDot = fragilityDots[to]!;
                const isOnPath = pathConnections.some(([pf, pt]) => pf === from && pt === to);
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke="#f43f5e"
                    strokeOpacity={isOnPath ? 0.7 : 0.12}
                    strokeWidth={isOnPath ? 0.8 : 0.25}
                  />
                );
              })}

              {/* Dots not on path */}
              {fragilityDots.map((dot, i) => {
                if (dot.onPath) return null;
                return <circle key={i} cx={dot.x} cy={dot.y} r={1.5} fill="#fda4af" fillOpacity={0.35} />;
              })}

              {/* Highlighted path dots */}
              {fragilityDots.map((dot, i) => {
                if (!dot.onPath) return null;
                return (
                  <React.Fragment key={i}>
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.hop === 0 ? 3 : dot.hop === 4 ? 2.5 : 2}
                      fill={dot.hop === 0 ? '#6366f1' : dot.hop === 4 ? '#dc2626' : '#f43f5e'}
                    />
                    {dot.hop === 0 && (
                      <circle cx={dot.x} cy={dot.y} r={5} fill="none" stroke="#6366f1" strokeWidth={1} />
                    )}
                    {dot.hop === 4 && (
                      <>
                        {/* White background circle for contrast */}
                        <circle cx={dot.x} cy={dot.y} r={3.5} fill="white" stroke="#dc2626" strokeWidth={1} />
                        {/* X mark using lines for perfect centering */}
                        <line
                          x1={dot.x - 2}
                          y1={dot.y - 2}
                          x2={dot.x + 2}
                          y2={dot.y + 2}
                          stroke="#dc2626"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                        <line
                          x1={dot.x + 2}
                          y1={dot.y - 2}
                          x2={dot.x - 2}
                          y2={dot.y + 2}
                          stroke="#dc2626"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </svg>

            {/* Labels */}
            <div className="absolute top-2 left-2 text-[10px] bg-white/95 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              change here
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-red-200 dark:border-red-800 font-medium">
              breaks here
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
            "Change one thing, something far away breaks"
          </p>
        </div>

        {/* Right Panel: Rigidity */}
        <div className="border border-amber-400/40 dark:border-amber-500/40 rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="text-center mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
            Rigidity (Hard to Change)
          </div>

          <div className="relative aspect-square w-full max-w-[240px] md:max-w-[280px] mx-auto bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connections */}
              {rigidityConnections.map(([from, to], i) => {
                const fromDot = rigidityDots[from]!;
                const toDot = rigidityDots[to]!;
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke="#f59e0b"
                    strokeOpacity="0.25"
                    strokeWidth="0.25"
                  />
                );
              })}

              {/* Dots that don't need change (static) */}
              {rigidityDots.map((dot, i) => {
                if (dot.needsChange) return null;
                return <circle key={i} cx={dot.x} cy={dot.y} r={1.5} fill="#d1d5db" fillOpacity={0.4} />;
              })}

              {/* Dots that need change (with wave pulsation) */}
              {rigidityDots.map((dot, i) => {
                if (!dot.needsChange) return null;
                return (
                  <g key={i}>
                    {/* Wave rings for pulsation effect */}
                    {dot.hop === 0 && (
                      <>
                        <circle cx={dot.x} cy={dot.y} r={5} fill="none" stroke="#6366f1" strokeWidth={1} />
                        {/* Subtle wave rings */}
                        <circle
                          cx={dot.x}
                          cy={dot.y}
                          r={8}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth={0.5}
                          strokeOpacity={0.3}
                        >
                          <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                          <animate
                            attributeName="stroke-opacity"
                            values="0.3;0;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}
                    {dot.hop !== 0 && (
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={5}
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth={0.3}
                        strokeOpacity={0.4}
                      >
                        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.4;0.1;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* Main dot */}
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.hop === 0 ? 3 : 2}
                      fill={dot.hop === 0 ? '#6366f1' : '#fb923c'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Labels */}
            <div className="absolute top-8 left-2 text-[10px] bg-white/95 dark:bg-slate-900/90 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              want to change
            </div>
            <div className="absolute bottom-4 right-2 text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              must also change
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
            "To change one thing, you must change everything connected to it"
          </p>
        </div>
      </div>
    </div>
  );
}
