import React, { useEffect, useRef, useState } from 'react';

interface Cell {
  key: string;
  row: 'Implicit' | 'Explicit';
  col: 'Fixed' | 'Flexible';
  title: string;
  subtitle: string;
  // visual treatment
  variant: 'worst' | 'dangerous' | 'impossible' | 'goal';
  order: number; // reveal order
}

const CELLS: Cell[] = [
  {
    key: 'implicit-fixed',
    row: 'Implicit',
    col: 'Fixed',
    title: 'Worst',
    subtitle: 'Cannot see it, cannot change it',
    variant: 'worst',
    order: 0,
  },
  {
    key: 'implicit-flexible',
    row: 'Implicit',
    col: 'Flexible',
    title: 'Dangerous',
    subtitle: 'Can change it, cannot see it',
    variant: 'dangerous',
    order: 1,
  },
  {
    key: 'explicit-fixed',
    row: 'Explicit',
    col: 'Fixed',
    title: 'Does not exist',
    subtitle: 'Forcing the user to provide it makes it flexible',
    variant: 'impossible',
    order: 2,
  },
  {
    key: 'explicit-flexible',
    row: 'Explicit',
    col: 'Flexible',
    title: 'The Goal',
    subtitle: 'Can see it, can change it',
    variant: 'goal',
    order: 3,
  },
];

const PALETTE = {
  worst: '#f43f5e',
  dangerous: '#f59e0b',
  goal: '#10b981',
  neutral: '#64748b',
};

export default function DependencyMatrix() {
  const [revealed, setRevealed] = useState(false);
  const [motionOk, setMotionOk] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setMotionOk(false);
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="my-8 md:my-12" ref={ref}>
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <svg
          className="w-full h-auto"
          viewBox="0 0 360 300"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="A 2x2 matrix of dependency properties: rows are Implicit and Explicit, columns are Fixed and Flexible. Implicit-Fixed is the worst, Implicit-Flexible is dangerous, Explicit-Fixed does not exist, and Explicit-Flexible is the goal."
        >
          <defs>
            {/* cross-hatch pattern for the impossible cell */}
            <pattern id="dm-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={PALETTE.neutral} strokeWidth="1" strokeOpacity="0.5" />
            </pattern>
            {/* soft glow for the goal cell */}
            <filter id="dm-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Column headers */}
          <text
            x="170"
            y="28"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            className="fill-slate-700 dark:fill-slate-200"
          >
            Fixed
          </text>
          <text
            x="285"
            y="28"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            className="fill-slate-700 dark:fill-slate-200"
          >
            Flexible
          </text>

          {/* Row headers (rotated) */}
          <text
            x="22"
            y="100"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            transform="rotate(-90 22 100)"
            className="fill-slate-700 dark:fill-slate-200"
          >
            Implicit
          </text>
          <text
            x="22"
            y="215"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            transform="rotate(-90 22 215)"
            className="fill-slate-700 dark:fill-slate-200"
          >
            Explicit
          </text>

          {/* Cells */}
          {CELLS.map(cell => {
            const x = cell.col === 'Fixed' ? 48 : 196;
            const y = cell.row === 'Implicit' ? 42 : 158;
            const w = 116;
            const h = 100;
            const cx = x + w / 2;
            const cy = y + h / 2;
            const delay = `${cell.order * 0.45}s`;

            const accent =
              cell.variant === 'worst'
                ? PALETTE.worst
                : cell.variant === 'dangerous'
                  ? PALETTE.dangerous
                  : cell.variant === 'goal'
                    ? PALETTE.goal
                    : PALETTE.neutral;

            return (
              <g
                key={cell.key}
                className="dm-cell"
                style={{ ['--dm-delay' as string]: delay, opacity: revealed ? undefined : 0 }}
              >
                <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                  {/* base fill */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="8"
                    fill={accent}
                    fillOpacity={cell.variant === 'impossible' ? 0.06 : 0.12}
                    stroke={accent}
                    strokeOpacity={cell.variant === 'impossible' ? 0.4 : 0.6}
                    strokeWidth={cell.variant === 'goal' ? 1.25 : 1}
                    strokeDasharray={cell.variant === 'impossible' ? '5 4' : undefined}
                    filter={cell.variant === 'goal' && revealed ? 'url(#dm-glow)' : undefined}
                  >
                    {cell.variant === 'goal' && motionOk && (
                      <animate
                        attributeName="fill-opacity"
                        values="0.12;0.2;0.12"
                        dur="4s"
                        calcMode="spline"
                        keyTimes="0;0.5;1"
                        keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>

                  {/* goal: single calm hairline emphasis ring */}
                  {cell.variant === 'goal' && (
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx="8"
                      fill="none"
                      stroke={PALETTE.goal}
                      strokeWidth="1"
                      strokeOpacity={0.7}
                    >
                      {motionOk && (
                        <animate
                          attributeName="stroke-opacity"
                          values="0.45;0.9;0.45"
                          dur="4s"
                          calcMode="spline"
                          keyTimes="0;0.5;1"
                          keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                          repeatCount="indefinite"
                        />
                      )}
                    </rect>
                  )}

                  {/* impossible: static cross-hatch overlay */}
                  {cell.variant === 'impossible' && (
                    <rect x={x} y={y} width={w} height={h} rx="8" fill="url(#dm-hatch)" opacity="0.4" />
                  )}
                </g>

                {/* title */}
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill={cell.variant === 'impossible' ? PALETTE.neutral : accent}
                  opacity={cell.variant === 'impossible' ? 0.7 : 1}
                >
                  {cell.title}
                </text>

                {/* subtitle */}
                <text
                  x={cx}
                  y={cy + 18}
                  textAnchor="middle"
                  fontSize="9.5"
                  className="fill-slate-500 dark:fill-slate-400"
                >
                  {wrapWords(cell.subtitle).map((line, i) => (
                    <tspan key={i} x={cx} dy={i === 0 ? 0 : 12}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>

        <style>{`
          @keyframes dm-reveal {
            0% { opacity: 0; transform: scale(0.96); }
            100% { opacity: 1; transform: scale(1); }
          }
          .dm-cell {
            animation: dm-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
            animation-delay: var(--dm-delay, 0s);
            transform-box: fill-box;
            transform-origin: center;
          }
          @media (prefers-reduced-motion: reduce) {
            .dm-cell {
              animation: none !important;
              opacity: 1 !important;
            }
          }
        `}</style>
      </div>

      <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
        Two binary properties yield only three real combinations. The worst (implicit + fixed) and dangerous (implicit +
        flexible) cells are hidden traps; explicit + fixed dissolves because it cannot exist; explicit + flexible glows
        as the goal dependency injection aims for.
      </p>
    </div>
  );
}

// Naive word wrap for SVG tspans, ~22 chars per line.
function wrapWords(text: string, max = 22): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}
