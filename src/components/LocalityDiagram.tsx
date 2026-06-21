import React from 'react';

export default function LocalityDiagram() {
  // Generate fixed positions for dots - more dots to show same complexity
  // Dot of interest is now in the center (index 0 at x:50, y:50)
  const globalDots = [
    { x: 50, y: 50 }, // dot of interest - CENTER
    { x: 8, y: 12 },
    { x: 22, y: 8 },
    { x: 38, y: 15 },
    { x: 52, y: 10 },
    { x: 68, y: 18 },
    { x: 82, y: 12 },
    { x: 92, y: 22 },
    { x: 12, y: 32 },
    { x: 28, y: 28 },
    { x: 45, y: 35 },
    { x: 62, y: 30 },
    { x: 78, y: 38 },
    { x: 88, y: 45 },
    { x: 5, y: 52 },
    { x: 18, y: 55 },
    { x: 35, y: 50 },
    { x: 55, y: 48 },
    { x: 72, y: 55 },
    { x: 85, y: 58 },
    { x: 95, y: 52 },
    { x: 10, y: 72 },
    { x: 25, y: 68 },
    { x: 42, y: 75 },
    { x: 58, y: 70 },
    { x: 75, y: 78 },
    { x: 90, y: 72 },
    { x: 15, y: 88 },
    { x: 32, y: 85 },
    { x: 50, y: 90 },
    { x: 68, y: 82 },
    { x: 85, y: 88 },
    { x: 95, y: 92 },
  ];

  // Smaller region of dots we care about - centered around middle (dot of interest at center)
  const localInsideDots = [
    { x: 50, y: 50 },
    { x: 42, y: 58 },
    { x: 58, y: 55 },
    { x: 48, y: 42 },
  ];

  // Outside dots (same pattern, just faded)
  const localOutsideDots = [
    { x: 8, y: 12 },
    { x: 22, y: 8 },
    { x: 68, y: 18 },
    { x: 82, y: 12 },
    { x: 92, y: 22 },
    { x: 12, y: 32 },
    { x: 78, y: 38 },
    { x: 88, y: 45 },
    { x: 5, y: 52 },
    { x: 18, y: 55 },
    { x: 72, y: 55 },
    { x: 85, y: 58 },
    { x: 95, y: 52 },
    { x: 10, y: 72 },
    { x: 25, y: 68 },
    { x: 75, y: 78 },
    { x: 90, y: 72 },
    { x: 15, y: 88 },
    { x: 32, y: 85 },
    { x: 68, y: 82 },
    { x: 85, y: 88 },
    { x: 95, y: 92 },
  ];

  return (
    <div className="my-8 md:my-12">
      <style>{`
        .ld-line { transform-box: fill-box; transform-origin: center; }
        .ld-dot { transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .ld-line, .ld-dot { animation: none; }
          .ld-anim animate { animation: none; }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Without Locality (Global) */}
        <div className="border-2 border-rose-500/50 rounded-lg p-4 md:p-6 bg-rose-500/10">
          <div className="text-center mb-4 text-base font-bold text-rose-600 dark:text-rose-400">
            Without Locality (Global)
          </div>

          <div className="relative aspect-square w-full max-w-[200px] md:max-w-[240px] mx-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <svg className="ld-anim w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines - all interconnected (faded, static hairlines) */}
              {globalDots.map((dot, i) =>
                globalDots
                  .slice(i + 1)
                  .map((otherDot, j) => (
                    <line
                      key={`${i}-${j}`}
                      x1={dot.x}
                      y1={dot.y}
                      x2={otherDot.x}
                      y2={otherDot.y}
                      stroke="#f43f5e"
                      strokeOpacity="0.15"
                      strokeWidth="0.2"
                    />
                  )),
              )}

              {/* Dots (static) */}
              {globalDots.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={i === 0 ? 2.5 : 1.5}
                  fill={i === 0 ? '#6366f1' : '#f43f5e'}
                  fillOpacity={i === 0 ? 1 : 0.7}
                />
              ))}

              {/* Highlight ring on dot of interest */}
              <circle cx={globalDots[0]!.x} cy={globalDots[0]!.y} r="5" fill="none" stroke="#6366f1" strokeWidth="1" />
              {/* Pulsing highlight ring (subtle) */}
              <circle cx={globalDots[0]!.x} cy={globalDots[0]!.y} r="5" fill="none" stroke="#6366f1" strokeWidth="0.75">
                <animate
                  attributeName="r"
                  values="5;6;5"
                  dur="4s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.6;0.4;0.6"
                  dur="4s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* Label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-medium bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              dot of interest
            </div>
          </div>

          <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
            "To understand one dot, you must account for every other dot — up to infinity"
          </p>
        </div>

        {/* Right Panel: With Locality (Field Abstraction) */}
        <div className="border-2 border-indigo-500/50 rounded-lg p-4 md:p-6 bg-indigo-500/10">
          <div className="text-center mb-4 text-base font-bold text-indigo-600 dark:text-indigo-400">
            With Locality (Field Abstraction)
          </div>

          <div className="relative aspect-square w-full max-w-[200px] md:max-w-[240px] mx-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <svg className="ld-anim w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Boundary box - centered around dot of interest */}
              {/* Static fill */}
              <rect x="32" y="32" width="36" height="36" fill="#6366f1" fillOpacity="0.1" rx="3" />
              {/* Self-drawing dashed stroke (perimeter ~ 144) */}
              <rect
                x="32"
                y="32"
                width="36"
                height="36"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.75"
                rx="3"
                strokeDasharray="144"
                strokeDashoffset="144"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="144;0"
                  dur="1.4s"
                  begin="0s"
                  fill="freeze"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.2 1"
                />
              </rect>
              {/* Dashed border (fades in after draw-in, then settles) */}
              <rect
                x="32"
                y="32"
                width="36"
                height="36"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.75"
                rx="3"
                strokeDasharray="4 2"
                strokeOpacity="0"
              >
                <animate attributeName="stroke-opacity" values="0;1" dur="0.5s" begin="1.3s" fill="freeze" />
              </rect>

              {/* Outside dots - faded */}
              {localOutsideDots.map((dot, i) => (
                <circle key={`outside-${i}`} cx={dot.x} cy={dot.y} r="1.5" fill="#94a3b8" fillOpacity="0.3" />
              ))}

              {/* Inside connection lines */}
              {localInsideDots.map((dot, i) =>
                localInsideDots
                  .slice(i + 1)
                  .map((otherDot, j) => (
                    <line
                      key={`inside-${i}-${j}`}
                      x1={dot.x}
                      y1={dot.y}
                      x2={otherDot.x}
                      y2={otherDot.y}
                      stroke="#6366f1"
                      strokeOpacity="0.5"
                      strokeWidth="0.4"
                    />
                  )),
              )}

              {/* Inside dots */}
              {localInsideDots.map((dot, i) => (
                <circle key={`inside-dot-${i}`} cx={dot.x} cy={dot.y} r={i === 0 ? 2.5 : 1.8} fill="#6366f1" />
              ))}

              {/* Highlight ring on dot of interest */}
              <circle
                cx={localInsideDots[0]!.x}
                cy={localInsideDots[0]!.y}
                r="5"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.75"
              />
              {/* Pulsing highlight ring (subtle) */}
              <circle
                cx={localInsideDots[0]!.x}
                cy={localInsideDots[0]!.y}
                r="5"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.75"
              >
                <animate
                  attributeName="r"
                  values="5;6;5"
                  dur="4s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.6;0.4;0.6"
                  dur="4s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Deferred arrow */}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#64748b" />
                </marker>
              </defs>
              <line
                x1="68"
                y1="50"
                x2="85"
                y2="50"
                stroke="#64748b"
                strokeWidth="0.75"
                strokeOpacity="0.7"
                markerEnd="url(#arrowhead)"
              />
              <text x="70" y="46" fontSize="6" fill="#64748b" fontWeight="500" opacity="0.8">
                deferred
              </text>
            </svg>

            {/* Label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-medium bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              field boundary
            </div>
          </div>

          <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
            "You only need to know the field. How the field is formed is deferred elsewhere"
          </p>
        </div>
      </div>
    </div>
  );
}
