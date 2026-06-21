import React from 'react';

interface Tier {
  /** Label shown on the tier */
  label: string;
  /** Sublabel (smaller, descriptive) */
  sub: string;
  /** Half-width of the tier at its widest (centered on x=100) */
  halfWidth: number;
  /** y of the tier top edge */
  top: number;
  /** y of the tier bottom edge */
  bottom: number;
  /** Fill colour */
  fill: string;
  /** Whether this tier carries the single focal moving dot */
  focal: boolean;
  /** Seconds for the focal dot to traverse — bigger = slower */
  dur: number;
  /** Reveal order index (0 = first/base) */
  order: number;
}

// Trapezoid points for a tier, given its top/bottom widths.
// The pyramid narrows linearly from base to apex; each tier's top is
// narrower than its bottom in proportion to where it sits.
function tierPoints(t: Tier, topHalf: number): string {
  const cx = 100;
  return [
    `${cx - t.halfWidth},${t.bottom}`,
    `${cx + t.halfWidth},${t.bottom}`,
    `${cx + topHalf},${t.top}`,
    `${cx - topHalf},${t.top}`,
  ].join(' ');
}

export default function TestPyramid() {
  // Geometry: pyramid spans y=18 (apex) to y=150 (base) inside a 200x170 viewBox.
  // Half-widths shrink from base (widest) to apex (narrowest).
  const tiers: Tier[] = [
    {
      label: 'Unit',
      sub: 'white-box · 100% coverage',
      halfWidth: 88,
      top: 124,
      bottom: 150,
      fill: '#10b981',
      focal: true,
      dur: 4.5,
      order: 0,
    },
    {
      label: 'Functional',
      sub: 'black-box · LSP contracts',
      halfWidth: 70,
      top: 100,
      bottom: 124,
      fill: '#6366f1',
      focal: false,
      dur: 2.4,
      order: 1,
    },
    {
      label: 'Integration',
      sub: 'Testcontainers',
      halfWidth: 52,
      top: 74,
      bottom: 100,
      fill: '#6366f1',
      focal: false,
      dur: 3.4,
      order: 2,
    },
    {
      label: 'SIT',
      sub: 'k6 / Gatling',
      halfWidth: 34,
      top: 46,
      bottom: 74,
      fill: '#f59e0b',
      focal: false,
      dur: 4.8,
      order: 3,
    },
    {
      label: 'E2E',
      sub: 'Playwright / Cypress',
      halfWidth: 16,
      top: 18,
      bottom: 46,
      fill: '#f43f5e',
      focal: false,
      dur: 6.5,
      order: 4,
    },
  ];

  // Map each tier's top half-width to the *next* tier's bottom half-width so
  // the trapezoids stack into one continuous pyramid. Apex top half-width is 0.
  const topHalfFor = (i: number): number => (i === tiers.length - 1 ? 0 : tiers[i + 1]!.halfWidth);

  // Stagger the bottom-up reveal: each tier appears 0.45s after the one below.
  const revealDelay = (order: number) => 0.45 + order * 0.55;

  // A single centred lane for the focal dot, kept inside the narrowest (top)
  // edge so it never spills outside the trapezoid. Only the focal tier carries
  // a moving dot — the rest of the pyramid stays calm and static.
  const focalLane = (t: Tier, topHalf: number): { y: number; x0: number; x1: number } | null => {
    if (!t.focal) return null;
    const usable = Math.max(topHalf - 4, 4); // stay inside the narrow edge
    const midY = (t.top + t.bottom) / 2;
    return { y: midY, x0: 100 - usable, x1: 100 + usable };
  };

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 md:p-6">
        <div className="text-center mb-4 text-base font-bold text-slate-700 dark:text-slate-200">The Test Pyramid</div>

        {/* ===================== MOBILE: readable stacked tiers ===================== */}
        <div className="md:hidden">
          <div className="text-[11px] font-semibold mb-2 px-1 text-rose-500 dark:text-rose-400">
            Slow · Expensive · Few
          </div>
          <div className="flex flex-col items-center gap-2">
            {[...tiers].reverse().map(t => {
              const pct = Math.round((t.halfWidth / 88) * 100);
              return (
                <div key={t.label} className="w-full flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-md border py-1.5 px-2"
                    style={{ width: `${pct}%`, minWidth: '76px', backgroundColor: `${t.fill}22`, borderColor: t.fill }}
                  >
                    <span className="text-sm font-bold" style={{ color: t.fill }}>
                      {t.label}
                    </span>
                  </div>
                  <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 text-center">{t.sub}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] font-semibold mt-2 px-1 text-emerald-600 dark:text-emerald-400">
            Fast · Cheap · Many
          </div>
        </div>

        {/* ===================== DESKTOP: SVG pyramid ===================== */}
        <div className="hidden md:block mx-auto w-full max-w-2xl">
          <svg
            className="w-full h-auto"
            viewBox="0 0 200 170"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Test pyramid: Unit tests form the wide, fast base; Functional, Integration, SIT and E2E tests narrow toward the slow, expensive apex."
          >
            <style>{`
              @media (prefers-reduced-motion: reduce) {
                .tp-dot { display: none; }
              }
            `}</style>

            {/* Left axis: the fundamental trade-off, bottom (fast/cheap/many) to top (slow/expensive/few) */}
            <line x1="8" y1="18" x2="8" y2="150" stroke="#94a3b8" strokeWidth="0.8" />
            <polygon points="8,15 6,20 10,20" fill="#94a3b8" />
            <polygon points="8,153 6,148 10,148" fill="#94a3b8" />

            <g className="fill-rose-500 dark:fill-rose-400" fontSize="6" fontWeight="700">
              <text x="13" y="26">
                Slow
              </text>
            </g>
            <g className="fill-slate-500 dark:fill-slate-400" fontSize="5">
              <text x="13" y="33">
                Expensive · Few
              </text>
            </g>
            <g className="fill-emerald-600 dark:fill-emerald-400" fontSize="6" fontWeight="700">
              <text x="13" y="143">
                Fast
              </text>
            </g>
            <g className="fill-slate-500 dark:fill-slate-400" fontSize="5">
              <text x="13" y="150">
                Cheap · Many
              </text>
            </g>

            {/* Pyramid tiers, revealed bottom-up */}
            {tiers.map((t, i) => {
              const topHalf = topHalfFor(i);
              const cx = 100;
              const labelY = (t.top + t.bottom) / 2;
              return (
                <g key={t.label}>
                  <polygon
                    points={tierPoints(t, topHalf)}
                    fill={t.fill}
                    fillOpacity={0.18}
                    stroke={t.fill}
                    strokeWidth="0.5"
                  />

                  {/* A single, slow focal dot streams along the wide Unit base; the
                      rest of the pyramid stays calm and static. */}
                  {(() => {
                    const lane = focalLane(t, topHalf);
                    if (!lane) return null;
                    return (
                      <circle className="tp-dot" cy={lane.y} r={1.5} fill={t.fill}>
                        <animate
                          attributeName="cx"
                          values={`${lane.x0};${lane.x1};${lane.x0}`}
                          dur={`${t.dur}s`}
                          begin={`${revealDelay(t.order) + 0.3}s`}
                          repeatCount="indefinite"
                          keyTimes="0;0.5;1"
                          calcMode="spline"
                          keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                        />
                      </circle>
                    );
                  })()}

                  {/* Tier label */}
                  <text
                    x={cx}
                    y={labelY - 1}
                    textAnchor="middle"
                    fontSize={t.order >= 3 ? 5.5 : 7}
                    fontWeight="700"
                    fill={t.fill}
                  >
                    {t.label}
                  </text>
                  <text
                    x={cx}
                    y={labelY + 6}
                    textAnchor="middle"
                    fontSize="4"
                    className="fill-slate-500 dark:fill-slate-400"
                  >
                    {t.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend: speed/cost trade-off restated */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> many fast dots
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> few slow dots
          </span>
        </div>
      </div>

      <p className="text-center mt-3 text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
        Tiers reveal from the base up; then the dots run — the wide Unit base streams many fast tests, while each higher
        tier carries progressively fewer, slower ones, the same trade-off the pyramid encodes.
      </p>
    </div>
  );
}
