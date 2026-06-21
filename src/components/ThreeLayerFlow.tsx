import React from 'react';

type Kind = 'edge' | 'normal' | 'domain';

interface Station {
  label: string;
  sub: string;
  kind: Kind;
}

interface Gap {
  mapper?: string;
  flow?: string;
  color?: 'emerald' | 'amber';
}

const stations: Station[] = [
  { label: 'External', sub: 'HTTP · CLI · WS', kind: 'edge' },
  { label: 'Controller', sub: 'Inward layer', kind: 'normal' },
  { label: 'Domain', sub: 'Pure core', kind: 'domain' },
  { label: 'Repository', sub: 'Outward layer', kind: 'normal' },
  { label: 'Database', sub: 'APIs · FS', kind: 'edge' },
];

// Gaps between consecutive stations (length = stations.length - 1)
const gaps: Gap[] = [
  {},
  { mapper: 'Controller Mapper', flow: 'Req/Res ⇄ Domain', color: 'emerald' },
  { mapper: 'Repository Mapper', flow: 'Domain ⇄ Data', color: 'amber' },
  {},
];

export default function ThreeLayerFlow() {
  const trackY = 210;

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        {/* ===================== MOBILE: vertical flow ===================== */}
        <div className="md:hidden flex flex-col items-stretch">
          {stations.map((s, i) => {
            const cardClass =
              s.kind === 'domain'
                ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20'
                : s.kind === 'edge'
                  ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                  : 'border-indigo-400/70 bg-white dark:bg-slate-900';
            const gap = i < gaps.length ? gaps[i] : undefined;
            return (
              <React.Fragment key={s.label}>
                <div className={`relative rounded-xl border px-4 py-3 text-center ${cardClass}`}>
                  {s.kind === 'domain' && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Pure Domain
                    </span>
                  )}
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100">{s.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.sub}</div>
                </div>

                {gap && (
                  <div className="flex flex-col items-center py-1.5">
                    <svg
                      className="h-5 w-5 text-slate-400 dark:text-slate-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                    {gap.mapper && (
                      <div
                        className={`rounded-md border px-2.5 py-1 text-center ${
                          gap.color === 'emerald'
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-amber-500/40 bg-amber-500/10'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-bold ${
                            gap.color === 'emerald'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {gap.mapper}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{gap.flow}</div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          <div className="mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-3 py-2 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            All dependencies point inward toward the Domain
          </div>
        </div>

        {/* ===================== DESKTOP: horizontal SVG ===================== */}
        <div className="hidden md:block">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1000 420"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="A request packet flows from the external world inward through the controller and its mapper into the pure domain core, then outward through the repository and its mapper to the database, with all dependency arrows pointing inward toward the domain."
          >
            <defs>
              <marker id="tlf-arrow-slate" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#64748b" />
              </marker>
              <marker id="tlf-arrow-indigo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#6366f1" />
              </marker>
              <path id="tlf-path-in" d="M 130 210 H 900" fill="none" />
            </defs>

            {/* Domain core emphasis band */}
            <rect
              x="448"
              y="70"
              width="184"
              height="280"
              rx="16"
              fill="#6366f1"
              fillOpacity="0.08"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text
              x="540"
              y="96"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              className="fill-indigo-600 dark:fill-indigo-300"
            >
              PURE DOMAIN
            </text>

            {/* Horizontal track baseline */}
            <line x1="130" y1={trackY} x2="900" y2={trackY} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 4" />

            {/* Stations */}
            {[
              { x: 90, label: 'External', sub: 'HTTP · CLI · WS' },
              { x: 320, label: 'Controller', sub: 'Inward layer' },
              { x: 540, label: 'Domain', sub: 'Pure core' },
              { x: 760, label: 'Repository', sub: 'Outward layer' },
              { x: 940, label: 'Database', sub: 'APIs · FS' },
            ].map(s => {
              const isDomain = s.label === 'Domain';
              const isEdge = s.label === 'External' || s.label === 'Database';
              const w = isDomain ? 120 : 116;
              const h = isDomain ? 100 : 84;
              return (
                <g key={s.label}>
                  <rect
                    x={s.x - w / 2}
                    y={trackY - h / 2}
                    width={w}
                    height={h}
                    rx="12"
                    className={
                      isDomain
                        ? 'fill-indigo-500/15 dark:fill-indigo-500/25'
                        : isEdge
                          ? 'fill-slate-100 dark:fill-slate-800'
                          : 'fill-white dark:fill-slate-900'
                    }
                    stroke={isDomain ? '#6366f1' : isEdge ? '#94a3b8' : '#6366f1'}
                    strokeWidth={isDomain ? 1.5 : 1}
                    strokeOpacity={isEdge ? 0.7 : 1}
                  />
                  <text
                    x={s.x}
                    y={trackY - 4}
                    textAnchor="middle"
                    fontSize={isDomain ? 17 : 15}
                    fontWeight="700"
                    className="fill-slate-800 dark:fill-slate-100"
                  >
                    {s.label}
                  </text>
                  <text
                    x={s.x}
                    y={trackY + 16}
                    textAnchor="middle"
                    fontSize="11"
                    className="fill-slate-500 dark:fill-slate-400"
                  >
                    {s.sub}
                  </text>
                </g>
              );
            })}

            {/* Flow connectors */}
            <line
              x1="148"
              y1={trackY}
              x2="258"
              y2={trackY}
              stroke="#64748b"
              strokeWidth="1.5"
              markerEnd="url(#tlf-arrow-slate)"
            />
            <line
              x1="378"
              y1={trackY}
              x2="476"
              y2={trackY}
              stroke="#6366f1"
              strokeWidth="2"
              markerEnd="url(#tlf-arrow-indigo)"
            />
            <line
              x1="604"
              y1={trackY}
              x2="700"
              y2={trackY}
              stroke="#6366f1"
              strokeWidth="2"
              markerEnd="url(#tlf-arrow-indigo)"
            />
            <line
              x1="818"
              y1={trackY}
              x2="878"
              y2={trackY}
              stroke="#64748b"
              strokeWidth="1.5"
              markerEnd="url(#tlf-arrow-slate)"
            />

            {/* Mapper boundary markers */}
            <g>
              <line x1="430" y1="120" x2="430" y2="300" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
              <text
                x="430"
                y="116"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className="fill-emerald-600 dark:fill-emerald-400"
              >
                Controller Mapper
              </text>
              <text
                x="430"
                y="316"
                textAnchor="middle"
                fontSize="10"
                className="fill-emerald-600/90 dark:fill-emerald-400/90"
              >
                Req/Res ⇄ Domain
              </text>
            </g>
            <g>
              <line x1="652" y1="120" x2="652" y2="300" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
              <text
                x="652"
                y="116"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className="fill-amber-600 dark:fill-amber-400"
              >
                Repository Mapper
              </text>
              <text
                x="652"
                y="316"
                textAnchor="middle"
                fontSize="10"
                className="fill-amber-600/90 dark:fill-amber-400/90"
              >
                Domain ⇄ Data
              </text>
            </g>

            {/* Dependency-direction annotation */}
            <g opacity="0.95">
              <line
                x1="300"
                y1="370"
                x2="490"
                y2="370"
                stroke="#6366f1"
                strokeWidth="1.5"
                markerEnd="url(#tlf-arrow-indigo)"
              />
              <text x="300" y="388" fontSize="10" className="fill-indigo-600 dark:fill-indigo-300">
                Controller depends on →
              </text>
            </g>
            <g opacity="0.95">
              <defs>
                <marker id="tlf-arrow-indigo-l" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 7 3, 0 6" fill="#6366f1" />
                </marker>
              </defs>
              <line
                x1="780"
                y1="370"
                x2="590"
                y2="370"
                stroke="#6366f1"
                strokeWidth="1.5"
                markerEnd="url(#tlf-arrow-indigo-l)"
              />
              <text x="640" y="388" fontSize="10" textAnchor="end" className="fill-indigo-600 dark:fill-indigo-300">
                ← implements Domain
              </text>
            </g>
            <text
              x="540"
              y="404"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              className="fill-indigo-600 dark:fill-indigo-300"
            >
              All dependencies point INWARD
            </text>

            {/* The travelling data packet — single calm focal token */}
            <g className="motion-reduce:hidden">
              <g>
                <animateMotion
                  dur="9s"
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keyPoints="0;1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                >
                  <mpath href="#tlf-path-in" />
                </animateMotion>
                <circle r="9" fill="#6366f1" fillOpacity="0.9" stroke="#6366f1" strokeWidth="1">
                  <animate
                    attributeName="opacity"
                    dur="9s"
                    repeatCount="indefinite"
                    keyTimes="0;0.5;1"
                    values="0.55;1;0.55"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                  />
                </circle>
              </g>
            </g>
            <g className="hidden motion-reduce:block">
              <circle cx="540" cy={trackY - 60} r="10" fill="#6366f1" />
            </g>
          </svg>
        </div>

        {/* Legend for packet transformation */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="inline-block h-3 w-3 rounded-[2px] bg-slate-500" /> Req/Res shape
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="inline-block h-3 w-3 rounded-full bg-indigo-500" /> Domain shape
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="inline-block h-3 w-3 rotate-45 bg-amber-500" /> Data shape
          </span>
        </div>

        <p className="mt-3 text-center text-sm italic text-slate-500 dark:text-slate-400">
          A request packet travels inward from the external world, is reshaped by the controller mapper into a domain
          value, processed by the pure core, then reshaped again by the repository mapper into data on its way to the
          database — and back. Notice every dependency arrow points <em>inward</em> toward the domain.
        </p>
      </div>
    </div>
  );
}
