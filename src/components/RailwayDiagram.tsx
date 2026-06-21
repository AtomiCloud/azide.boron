import React from 'react';

export default function RailwayDiagram() {
  // Four stations laid out along the rails
  const stations = [
    { x: 130, label: 'getOrder' },
    { x: 300, label: 'validate' },
    { x: 470, label: 'calculate' },
    { x: 640, label: 'invoice' },
  ];

  const successY = 70; // green rail (top)
  const errorY = 200; // red rail (bottom)
  const startX = 30;
  const endX = 740;

  const failIndex = 1; // fails at 'validate'
  const failX = stations[failIndex]!.x;
  const tokenPath = `M ${startX} ${successY} L ${failX} ${successY} L ${failX} ${errorY} L ${endX} ${errorY}`;
  const cycle = 9; // seconds total

  // ---- Vertical layout (mobile) ----
  const vOkX = 64;
  const vErrX = 236;
  const vTop = 74;
  const vBottom = 470;
  const vStations = stations.map((s, i) => ({ ...s, y: 140 + i * 90 }));
  const vFailY = vStations[failIndex]!.y;
  const vTokenPath = `M ${vOkX} ${vTop} L ${vOkX} ${vFailY} L ${vErrX} ${vFailY} L ${vErrX} ${vBottom}`;

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        {/* ===================== MOBILE: vertical rails ===================== */}
        <div className="md:hidden mx-auto max-w-[300px]">
          <svg
            className="w-full h-auto"
            viewBox="0 0 300 520"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Railway-oriented programming: a token rides the green success rail downward until a station fails, then drops onto the red error rail and skips the rest."
          >
            <defs>
              <marker id="railv-arrow-green" markerWidth="7" markerHeight="7" refX="3.5" refY="5" orient="auto">
                <polygon points="0 0, 3.5 7, 7 0" fill="#10b981" />
              </marker>
              <marker id="railv-arrow-red" markerWidth="7" markerHeight="7" refX="3.5" refY="5" orient="auto">
                <polygon points="0 0, 3.5 7, 7 0" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Rail labels */}
            <text x={vOkX} y={vTop - 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#10b981">
              Ok rail
            </text>
            <text x={vErrX} y={vTop - 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#f43f5e">
              Err rail
            </text>

            {/* Rails */}
            <line
              x1={vOkX}
              y1={vTop}
              x2={vOkX}
              y2={vBottom}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd="url(#railv-arrow-green)"
            />
            <line
              x1={vErrX}
              y1={vTop}
              x2={vErrX}
              y2={vBottom}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd="url(#railv-arrow-red)"
            />

            {/* Switch connectors + stations */}
            {vStations.map(s => (
              <g key={s.label}>
                <line
                  x1={vOkX}
                  y1={s.y}
                  x2={vErrX}
                  y2={s.y}
                  stroke="#94a3b8"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <text
                  x={150}
                  y={s.y - 16}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  className="fill-slate-700 dark:fill-slate-200"
                >
                  {s.label}
                </text>
                <circle cx={vOkX} cy={s.y} r="11" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                <circle cx={vOkX} cy={s.y} r="4" fill="#10b981" />
                <circle cx={vErrX} cy={s.y} r="6" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />
              </g>
            ))}

            {/* Start / end caps */}
            <circle cx={vOkX} cy={vTop} r="6" fill="#6366f1" />
            <circle cx={vOkX} cy={vBottom} r="6" fill="#10b981" />
            <circle cx={vErrX} cy={vBottom} r="6" fill="#f43f5e" />

            {/* Failure-switch marker */}
            <circle cx={vOkX} cy={vFailY} r="11" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" />

            {/* Travelling token */}
            <g className="rd-token">
              <circle r="9" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5">
                <animateMotion
                  dur={`${cycle}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1;1"
                  keyTimes="0;0.82;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0 0 1 1"
                  path={vTokenPath}
                />
                <animate
                  attributeName="fill"
                  values="#6366f1;#6366f1;#f43f5e;#f43f5e"
                  keyTimes="0;0.34;0.42;1"
                  dur={`${cycle}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </circle>
            </g>
          </svg>
        </div>

        {/* ===================== DESKTOP: horizontal rails ===================== */}
        <div className="hidden md:block relative w-full max-w-3xl mx-auto">
          <svg
            className="w-full h-auto"
            viewBox="0 0 770 250"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Railway-oriented programming: a token rides the green success rail until a station fails, then drops onto the red error rail and skips the rest."
          >
            <defs>
              <marker id="rail-arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#10b981" />
              </marker>
              <marker id="rail-arrow-red" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#f43f5e" />
              </marker>
            </defs>

            <text x={startX} y={successY - 22} fontSize="13" fontWeight="700" fill="#10b981">
              Ok rail
            </text>
            <text x={startX} y={errorY + 34} fontSize="13" fontWeight="700" fill="#f43f5e">
              Err rail
            </text>

            <line
              x1={startX}
              y1={successY}
              x2={endX}
              y2={successY}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd="url(#rail-arrow-green)"
            />
            <line
              x1={startX}
              y1={errorY}
              x2={endX}
              y2={errorY}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeLinecap="round"
              markerEnd="url(#rail-arrow-red)"
            />

            {stations.map(s => (
              <line
                key={`switch-${s.label}`}
                x1={s.x}
                y1={successY}
                x2={s.x}
                y2={errorY}
                stroke="#94a3b8"
                strokeOpacity="0.35"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            ))}

            {stations.map(s => (
              <g key={s.label}>
                <circle cx={s.x} cy={successY} r="11" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                <circle cx={s.x} cy={successY} r="4" fill="#10b981" />
                <text
                  x={s.x}
                  y={successY - 22}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  className="fill-slate-700 dark:fill-slate-200"
                >
                  {s.label}
                </text>
                <circle cx={s.x} cy={errorY} r="6" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />
              </g>
            ))}

            <circle cx={startX} cy={successY} r="6" fill="#6366f1" />
            <circle cx={endX} cy={successY} r="6" fill="#10b981" />
            <circle cx={endX} cy={errorY} r="6" fill="#f43f5e" />

            <circle cx={failX} cy={successY} r="11" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" />

            <g className="rd-token">
              <circle r="9" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5">
                <animateMotion
                  dur={`${cycle}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1;1"
                  keyTimes="0;0.82;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0 0 1 1"
                  path={tokenPath}
                />
                <animate
                  attributeName="fill"
                  values="#6366f1;#6366f1;#f43f5e;#f43f5e"
                  keyTimes="0;0.34;0.42;1"
                  dur={`${cycle}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </circle>
            </g>
          </svg>
        </div>

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .rd-token { display: none; }
          }
        `}</style>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" /> token (Ok)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> token (Err)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-amber-500" /> failure switch
          </span>
        </div>

        <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
          Railway-oriented programming: the token rides the green Ok rail through each station — getOrder, validate,
          calculate, invoice. When a station fails, it drops through the switch onto the red Err rail and runs straight
          to the end, skipping all remaining work.
        </p>
      </div>
    </div>
  );
}
