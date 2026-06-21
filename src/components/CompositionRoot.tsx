import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

type Phase = 'assemble' | 'freeze' | 'flow' | 'reset';

interface NodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
  // order in the assembly sequence (lower = built earlier)
  step: number;
  color: string;
}

interface EdgeDef {
  from: string;
  to: string;
}

// Layout: a dependency TREE drawn bottom-up.
// viewBox is 320 x 240. Bottom layers (infrastructure) sit low; App sits at the top.
const NODES: NodeDef[] = [
  // Layer 0: Infrastructure (built first)
  { id: 'db', label: 'db', x: 60, y: 200, step: 0, color: '#64748b' },
  { id: 'http', label: 'httpClient', x: 160, y: 200, step: 0, color: '#64748b' },
  { id: 'logger', label: 'logger', x: 260, y: 200, step: 0, color: '#64748b' },
  // Layer 1: Repositories
  { id: 'userRepo', label: 'userRepo', x: 90, y: 150, step: 1, color: '#10b981' },
  { id: 'orderRepo', label: 'orderRepo', x: 200, y: 150, step: 1, color: '#10b981' },
  // Layer 2: Domain services
  { id: 'userSvc', label: 'userService', x: 100, y: 100, step: 2, color: '#6366f1' },
  { id: 'orderSvc', label: 'orderService', x: 210, y: 100, step: 2, color: '#6366f1' },
  // Layer 3: Controllers
  { id: 'userCtrl', label: 'userCtrl', x: 110, y: 55, step: 3, color: '#f59e0b' },
  { id: 'orderCtrl', label: 'orderCtrl', x: 215, y: 55, step: 3, color: '#f59e0b' },
  // Layer 4: App (root, built last)
  { id: 'app', label: 'App', x: 160, y: 22, step: 4, color: '#f43f5e' },
];

const EDGES: EdgeDef[] = [
  // repositories -> infrastructure
  { from: 'userRepo', to: 'db' },
  { from: 'orderRepo', to: 'db' },
  // domain services -> repositories + logger
  { from: 'userSvc', to: 'userRepo' },
  { from: 'userSvc', to: 'logger' },
  { from: 'orderSvc', to: 'orderRepo' },
  { from: 'orderSvc', to: 'userSvc' },
  { from: 'orderSvc', to: 'logger' },
  // controllers -> domain services
  { from: 'userCtrl', to: 'userSvc' },
  { from: 'orderCtrl', to: 'orderSvc' },
  // app -> controllers (and uses httpClient at the edge)
  { from: 'app', to: 'userCtrl' },
  { from: 'app', to: 'orderCtrl' },
  { from: 'app', to: 'http' },
];

const MAX_STEP = 4; // app
const NODE_BY_ID = Object.fromEntries(NODES.map(n => [n.id, n]));

// Phase timing (ms)
const STEP_MS = 300; // delay per assembly layer
const ASSEMBLE_MS = (MAX_STEP + 1) * STEP_MS; // all layers in
const FREEZE_MS = 1200;
const FLOW_MS = 2900;

export default function CompositionRoot() {
  const [phase, setPhase] = useState<Phase>('reset');
  const [visibleStep, setVisibleStep] = useState(-1); // highest assembly layer revealed
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // The bottom-up assembly plays once; after that we never wipe the tree back to empty.
  const assembledRef = useRef(false);

  // Respect reduced-motion: show the fully assembled, frozen tree statically.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Only animate while on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (e) setActive(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drive the phase loop.
  useEffect(() => {
    if (reduced || !active) {
      setPhase('freeze');
      setVisibleStep(MAX_STEP);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const push = (fn: () => void, ms: number) => timers.push(setTimeout(() => !cancelled && fn(), ms));

    // After the tree is built, loop only between freeze and flow — never back to empty.
    const loopFreezeFlow = () => {
      setPhase('freeze');
      push(() => setPhase('flow'), FREEZE_MS);
      push(loopFreezeFlow, FREEZE_MS + FLOW_MS);
    };

    if (!assembledRef.current) {
      // First time on screen: assemble bottom-up, once.
      setPhase('assemble');
      setVisibleStep(-1);
      for (let s = 0; s <= MAX_STEP; s++) {
        push(() => setVisibleStep(s), s * STEP_MS + 60);
      }
      push(() => {
        assembledRef.current = true;
        setVisibleStep(MAX_STEP);
        loopFreezeFlow();
      }, ASSEMBLE_MS);
    } else {
      // Already assembled earlier (e.g. scrolled away and back): keep the full tree, just loop.
      setVisibleStep(MAX_STEP);
      loopFreezeFlow();
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced, active]);

  const frozen = phase === 'freeze' || phase === 'flow';
  const flowing = phase === 'flow';

  const nodeVisible = (n: NodeDef) =>
    reduced || phase === 'freeze' || phase === 'flow' ? true : n.step <= visibleStep;

  const edgeVisible = (e: EdgeDef) => {
    const from = NODE_BY_ID[e.from]!;
    return reduced || frozen ? true : from.step <= visibleStep;
  };

  const layerLabels = [
    { y: 200, text: 'Infrastructure' },
    { y: 150, text: 'Repositories' },
    { y: 100, text: 'Domain Services' },
    { y: 55, text: 'Controllers' },
    { y: 22, text: 'App' },
  ];

  const phaseCaption: Record<Phase, string> = {
    reset: 'Cooling down…',
    assemble: 'Assembling the dependency tree, bottom layer first',
    freeze: 'The tree freezes — services are now immutable (the laws)',
    flow: 'An event flows down; a result flows back up (the matter)',
  };

  return (
    <div className="my-8 md:my-12" ref={containerRef}>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 md:p-6">
        <style>{`
          @keyframes cr-down {
            0%   { transform: translate(160px, 22px); opacity: 0; }
            12%  { opacity: 1; }
            25%  { transform: translate(215px, 55px); }
            50%  { transform: translate(210px, 100px); }
            75%  { transform: translate(200px, 150px); }
            90%  { opacity: 1; }
            100% { transform: translate(60px, 200px); opacity: 0; }
          }
          @keyframes cr-up {
            0%   { transform: translate(60px, 200px); opacity: 0; }
            12%  { opacity: 1; }
            25%  { transform: translate(200px, 150px); }
            50%  { transform: translate(210px, 100px); }
            75%  { transform: translate(215px, 55px); }
            90%  { opacity: 1; }
            100% { transform: translate(160px, 22px); opacity: 0; }
          }
          .cr-flow-down { animation: cr-down 1.4s cubic-bezier(0.4,0,0.2,1) both; }
          .cr-flow-up { animation: cr-up 1.4s cubic-bezier(0.4,0,0.2,1) both; animation-delay: 1.2s; }
          @media (prefers-reduced-motion: reduce) {
            .cr-flow-down, .cr-flow-up { animation: none; opacity: 0; }
          }
        `}</style>
        {/* Phase indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-[11px] md:text-xs font-medium">
          {(['assemble', 'freeze', 'flow'] as Phase[]).map(p => {
            const isOn = phase === p || (reduced && p === 'freeze') || (p === 'assemble' && phase === 'reset');
            const colors: Record<string, string> = {
              assemble: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/40',
              freeze: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/40',
              flow: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/40',
            };
            const off = 'text-slate-400 dark:text-slate-500 bg-transparent border-slate-200 dark:border-slate-700';
            const labels: Record<string, string> = {
              assemble: '1 · Assemble',
              freeze: '2 · Freeze',
              flow: '3 · Data flows',
            };
            return (
              <span
                key={p}
                className={cn('px-2.5 py-1 rounded-full border transition-colors duration-300', isOn ? colors[p] : off)}
              >
                {labels[p]}
              </span>
            );
          })}
        </div>

        <div className="relative w-full max-w-2xl mx-auto">
          <svg
            className="w-full h-auto"
            viewBox="0 0 320 240"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Composition root assembling a frozen dependency tree, then data flowing through it"
          >
            <defs>
              <marker id="cr-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
              <filter id="cr-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Layer guide labels */}
            {layerLabels.map(l => (
              <text
                key={l.text}
                x={6}
                y={l.y - 11}
                fontSize="5.5"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ textAnchor: 'start' }}
              >
                {l.text}
              </text>
            ))}

            {/* Frozen "field" enclosing box — appears on freeze */}
            <rect
              x={28}
              y={10}
              width={282}
              height={208}
              rx={10}
              fill="#10b981"
              fillOpacity={frozen ? 0.06 : 0}
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="5 3"
              strokeOpacity={frozen ? 0.7 : 0}
              style={{ transition: 'fill-opacity 0.5s ease, stroke-opacity 0.5s ease' }}
            >
              {frozen && !reduced && (
                <animate
                  attributeName="stroke-opacity"
                  values="0.7;0.5;0.7"
                  dur="4s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
                />
              )}
            </rect>

            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = NODE_BY_ID[e.from]!;
              const to = NODE_BY_ID[e.to]!;
              const show = edgeVisible(e);
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={frozen ? '#10b981' : '#94a3b8'}
                  strokeWidth={1}
                  strokeOpacity={frozen ? 0.55 : 0.4}
                  markerEnd="url(#cr-arrow)"
                  style={{ opacity: show ? 1 : 0, transition: 'opacity 0.4s ease, stroke 0.5s ease' }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map(n => {
              const show = nodeVisible(n);
              return (
                <g
                  key={n.id}
                  style={{
                    opacity: show ? 1 : 0,
                    transform: show ? 'scale(1)' : 'scale(0.4)',
                    transformOrigin: `${n.x}px ${n.y}px`,
                    transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  {/* freeze glow ring */}
                  {frozen && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={11}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={0.5}
                      strokeOpacity={0.5}
                      filter="url(#cr-glow)"
                    />
                  )}
                  <circle cx={n.x} cy={n.y} r={9} fill={n.color} fillOpacity={frozen ? 0.92 : 0.85} />
                  {/* tiny lock on freeze to signal immutability */}
                  {frozen && (
                    <g style={{ transition: 'opacity 0.4s ease' }}>
                      <rect x={n.x - 2.2} y={n.y - 0.6} width={4.4} height={3.6} rx={0.8} fill="#ffffff" />
                      <path
                        d={`M ${n.x - 1.4} ${n.y - 0.6} v -1.1 a 1.4 1.4 0 0 1 2.8 0 v 1.1`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={0.7}
                      />
                    </g>
                  )}
                  <text
                    x={n.x}
                    y={n.y + 17}
                    fontSize="5.4"
                    className="fill-slate-600 dark:fill-slate-300"
                    style={{ textAnchor: 'middle' }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* Data packet: event flows DOWN, result flows back UP.
                Driven by CSS motion (keyframes below) — CSS animations reliably
                start on mount, unlike dynamically-inserted SMIL with begin="0s". */}
            {flowing && !reduced && (
              <>
                {/* event (matter) descending */}
                <g className="cr-flow-down">
                  <circle r={3.5} fill="#f59e0b" />
                  <text x={5} y={-3} fontSize="5" fill="#f59e0b" fontWeight="600">
                    event
                  </text>
                </g>
                {/* result flowing back up */}
                <g className="cr-flow-up">
                  <circle r={3.5} fill="#10b981" />
                  <text x={5} y={-3} fontSize="5" fill="#10b981" fontWeight="600">
                    result
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Live phase note */}
        <p
          className="text-center mt-4 text-xs md:text-sm text-slate-500 dark:text-slate-400 italic min-h-[2.5rem] leading-relaxed"
          aria-live="polite"
        >
          {reduced ? phaseCaption.freeze : phaseCaption[phase]}
        </p>
      </div>

      <p className="text-center mt-3 text-xs md:text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
        The composition root as a big bang: every service is constructed once — infrastructure, then repositories,
        domain services, controllers, and finally the App — into a dependency tree that <em>freezes</em> into immutable
        laws. Afterward, events (matter) flow down through the frozen tree and results flow back up.
      </p>
    </div>
  );
}
