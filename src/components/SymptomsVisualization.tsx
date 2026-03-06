import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

export default function SymptomsVisualization() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Loop animation every 5 seconds
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Fragility web - dots with hop distances from source
  const fragilityDots = [
    { x: 20, y: 30, hop: 0 }, // source
    { x: 35, y: 20, hop: 1 },
    { x: 40, y: 45, hop: 1 },
    { x: 25, y: 55, hop: 1 },
    { x: 55, y: 25, hop: 2 },
    { x: 50, y: 50, hop: 2 },
    { x: 30, y: 75, hop: 2 },
    { x: 70, y: 35, hop: 3 },
    { x: 65, y: 60, hop: 3 },
    { x: 80, y: 70, hop: 4 }, // breaks here
  ] as const;

  const fragilityConnections: readonly [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3], // hop 1
    [1, 4],
    [2, 5],
    [3, 6], // hop 2
    [4, 7],
    [5, 8], // hop 3
    [7, 9],
    [8, 9], // hop 4
  ];

  // Rigidity web
  const rigidityDots = [
    { x: 25, y: 40, hop: 0 }, // thing to change
    { x: 40, y: 25, hop: 1 },
    { x: 45, y: 55, hop: 1 },
    { x: 20, y: 65, hop: 1 },
    { x: 60, y: 35, hop: 2 },
    { x: 55, y: 70, hop: 2 },
    { x: 35, y: 80, hop: 2 },
    { x: 75, y: 50, hop: 3 },
    { x: 70, y: 75, hop: 3 },
  ] as const;

  const rigidityConnections: readonly [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 8],
  ];

  return (
    <div ref={containerRef} className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Fragility */}
        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <div className="text-center mb-3 text-sm font-semibold text-destructive">
            Fragility (Action at a Distance)
          </div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg
              key={`fragility-${animationKey}`}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connections */}
              {fragilityConnections.map(([from, to], i) => {
                const fromDot = fragilityDots[from]!;
                const toDot = fragilityDots[to]!;
                const maxHop = Math.max(fromDot.hop, toDot.hop);
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    className={cn(
                      'transition-all duration-300',
                      isVisible ? 'stroke-destructive/50' : 'stroke-muted-foreground/20',
                    )}
                    style={{
                      animationDelay: `${maxHop * 0.3}s`,
                    }}
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Dots */}
              {fragilityDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.hop === 0 ? 4 : dot.hop === 4 ? 3.5 : 3}
                    className={cn(
                      'transition-all duration-300',
                      dot.hop === 0
                        ? 'fill-primary'
                        : dot.hop === 4
                          ? isVisible
                            ? 'fill-destructive animate-shake'
                            : 'fill-muted-foreground/40'
                          : isVisible
                            ? 'fill-destructive/70'
                            : 'fill-muted-foreground/40',
                    )}
                    style={{
                      animationDelay: `${dot.hop * 0.3}s`,
                    }}
                  />
                  {dot.hop === 0 && isVisible && (
                    <circle cx={dot.x} cy={dot.y} r="6" className="fill-none stroke-primary stroke-2 animate-pulse" />
                  )}
                  {dot.hop === 4 && isVisible && (
                    <text x={dot.x} y={dot.y + 1} textAnchor="middle" className="fill-background text-[8px] font-bold">
                      ✕
                    </text>
                  )}
                </g>
              ))}

              {/* Shockwave effect */}
              {isVisible && (
                <circle
                  cx={fragilityDots[0]!.x}
                  cy={fragilityDots[0]!.y}
                  r="0"
                  className="fill-none stroke-destructive/30 animate-shockwave"
                />
              )}
            </svg>

            {/* Labels */}
            <div className="absolute top-2 left-2 text-[9px] bg-background/80 px-1.5 py-0.5 rounded">change here</div>
            <div className="absolute bottom-2 right-2 text-[9px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
              breaks here
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-muted-foreground italic">
            "Change one thing, something far away breaks"
          </p>
        </div>

        {/* Right Panel: Rigidity */}
        <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-500/5">
          <div className="text-center mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
            Rigidity (Hard to Change)
          </div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg
              key={`rigidity-${animationKey}`}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connections */}
              {rigidityConnections.map(([from, to], i) => {
                const fromDot = rigidityDots[from]!;
                const toDot = rigidityDots[to]!;
                const maxHop = Math.max(fromDot.hop, toDot.hop);
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    className={cn(
                      'transition-all duration-300',
                      isVisible ? 'stroke-amber-500/50' : 'stroke-muted-foreground/20',
                    )}
                    style={{
                      animationDelay: `${maxHop * 0.3}s`,
                    }}
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Growing scope overlay */}
              {isVisible && <ellipse cx="50" cy="55" rx="0" ry="0" className="fill-amber-500/10 animate-grow-scope" />}

              {/* Dots */}
              {rigidityDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.hop === 0 ? 4 : 3}
                    className={cn(
                      'transition-all duration-300',
                      dot.hop === 0 ? 'fill-primary' : isVisible ? 'fill-amber-500/80' : 'fill-muted-foreground/40',
                    )}
                    style={{
                      animationDelay: `${dot.hop * 0.25}s`,
                    }}
                  />
                  {dot.hop === 0 && isVisible && (
                    <circle cx={dot.x} cy={dot.y} r="6" className="fill-none stroke-primary stroke-2 animate-pulse" />
                  )}
                  {dot.hop > 0 && isVisible && (
                    <text
                      x={dot.x}
                      y={dot.y + 4}
                      textAnchor="middle"
                      className="fill-background text-[6px]"
                      style={{ animationDelay: `${dot.hop * 0.25}s` }}
                    >
                      also
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Labels */}
            <div className="absolute top-2 left-2 text-[9px] bg-background/80 px-1.5 py-0.5 rounded">
              want to change
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
              must also change
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-muted-foreground italic">
            "To change one thing, you must change everything connected to it"
          </p>
        </div>
      </div>
    </div>
  );
}
