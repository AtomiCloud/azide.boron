import React from 'react';

export default function DipInversion() {
  // One-shot entrance = 5s, plays once then freezes on the decoupled end state:
  //   0.00 - 0.30  COUPLED   : A -> B direct arrow, "depends on / coupled" label
  //   0.30 - 0.55  interface X slides down between A and B
  //   0.55 - 1.00  INVERTED  : A -> X, B -> X (B reversed to point UP), "decoupled" badge
  //
  // The animation is driven entirely by SMIL <animate> elements (no JS state). It
  // plays ONCE and settles (fill="freeze") on the inverted state rather than looping
  // forever, keeping the diagram calm. Reduced-motion users get the same static
  // "inverted" end state via the media query in the scoped <style> block.
  const DUR = '5s';

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="text-center mb-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          Dependency Inversion: inserting an interface to decouple A and B
        </div>

        <div className="relative w-full max-w-[560px] mx-auto">
          <svg
            className="dip-svg w-full h-auto"
            viewBox="0 0 320 220"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Animation showing A depending directly on B, then an interface X being inserted so that both A and B depend on X, decoupling them."
          >
            <defs>
              <marker id="dip-arrow-bad" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#f43f5e" />
              </marker>
              <marker id="dip-arrow-good" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#6366f1" />
              </marker>
            </defs>

            {/* ===================== COUPLED STATE ===================== */}
            <g className="dip-coupled">
              <animate
                attributeName="opacity"
                values="1;1;0;0"
                keyTimes="0;0.30;0.46;1"
                dur={DUR}
                repeatCount="1"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
              />

              {/* direct arrow A -> B (rose / coupled) */}
              <line x1="92" y1="60" x2="228" y2="60" stroke="#f43f5e" strokeWidth="1" markerEnd="url(#dip-arrow-bad)" />
              <text x="160" y="48" textAnchor="middle" fontSize="11" fontWeight="600" className="dip-label-bad">
                depends on / coupled
              </text>
            </g>

            {/* ===================== INVERTED STATE ===================== */}
            <g className="dip-inverted">
              <animate
                attributeName="opacity"
                values="0;0;1;1"
                keyTimes="0;0.46;0.62;1"
                dur={DUR}
                repeatCount="1"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
              />

              {/* A -> X (indigo) */}
              <line
                x1="92"
                y1="64"
                x2="148"
                y2="118"
                stroke="#6366f1"
                strokeWidth="1"
                markerEnd="url(#dip-arrow-good)"
              />
              {/* B -> X, reversed to point UP toward X (indigo) */}
              <line
                x1="228"
                y1="64"
                x2="172"
                y2="118"
                stroke="#6366f1"
                strokeWidth="1"
                markerEnd="url(#dip-arrow-good)"
              />

              {/* decoupled badge */}
              <g transform="translate(160 198)">
                <rect
                  x="-44"
                  y="-13"
                  width="88"
                  height="24"
                  rx="12"
                  fill="#10b981"
                  fillOpacity="0.15"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#10b981">
                  decoupled
                </text>
              </g>
            </g>

            {/* ===================== INTERFACE NODE X (slides in) ===================== */}
            <g className="dip-interface">
              {/* fade in as it arrives, then stay */}
              <animate
                attributeName="opacity"
                values="0;0;1;1"
                keyTimes="0;0.30;0.55;1"
                dur={DUR}
                repeatCount="1"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
              />
              {/* slide down from behind A/B into the middle gap, then settle */}
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -70; 0 -70; 0 0; 0 0"
                keyTimes="0;0.30;0.55;1"
                dur={DUR}
                repeatCount="1"
                fill="freeze"
                additive="sum"
                calcMode="spline"
                keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"
              />
              <g transform="translate(160 130)">
                <rect
                  x="-30"
                  y="-22"
                  width="60"
                  height="44"
                  rx="8"
                  fill="#6366f1"
                  fillOpacity="0.12"
                  stroke="#6366f1"
                  strokeWidth="1"
                  strokeDasharray="5 3"
                />
                <text x="0" y="-3" textAnchor="middle" fontSize="16" fontWeight="800" fill="#6366f1">
                  X
                </text>
                <text x="0" y="13" textAnchor="middle" fontSize="8" fontWeight="600" fill="#6366f1" fillOpacity="0.8">
                  interface
                </text>
              </g>
            </g>

            {/* ===================== NODE A (high-level) ===================== */}
            <g transform="translate(60 60)">
              <circle r="32" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1.25" />
              <text x="0" y="6" textAnchor="middle" fontSize="22" fontWeight="800" fill="#6366f1">
                A
              </text>
            </g>

            {/* ===================== NODE B (low-level) ===================== */}
            <g transform="translate(260 60)">
              <circle r="32" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1.25" />
              <text x="0" y="6" textAnchor="middle" fontSize="22" fontWeight="800" fill="#10b981">
                B
              </text>
            </g>
          </svg>
        </div>

        <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
          A starts directly coupled to B (<span className="text-rose-500">A &rarr; B</span>). Slide an interface X
          between them and reverse B&rsquo;s dependency to point up at X, and the result is{' '}
          <span className="text-indigo-500">A &rarr; X &larr; B</span> &mdash; B can now be swapped without touching A.
        </p>

        <style>{`
          .dip-label-bad { fill: #e11d48; }
          :global(.dark) .dip-label-bad { fill: #fb7185; }
          @media (prefers-reduced-motion: reduce) {
            .dip-svg animate,
            .dip-svg animateTransform { display: none; }
            /* Freeze on the decoupled (inverted) end state */
            .dip-coupled { opacity: 0; }
            .dip-inverted { opacity: 1; }
            .dip-interface { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
