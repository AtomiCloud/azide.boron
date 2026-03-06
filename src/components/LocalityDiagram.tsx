import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/utils';

export default function LocalityDiagram() {
  const [isVisible, setIsVisible] = useState(false);
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

  // Generate fixed positions for dots (deterministic for consistency)
  const globalDots = [
    { x: 15, y: 20 },
    { x: 45, y: 15 },
    { x: 75, y: 25 },
    { x: 25, y: 50 },
    { x: 55, y: 45 },
    { x: 85, y: 55 },
    { x: 10, y: 75 },
    { x: 40, y: 80 },
    { x: 70, y: 70 },
    { x: 90, y: 85 },
    { x: 30, y: 35 },
    { x: 60, y: 65 },
    { x: 20, y: 90 },
    { x: 80, y: 40 },
    { x: 50, y: 10 },
  ];

  const localInsideDots = [
    { x: 35, y: 40 },
    { x: 50, y: 55 },
    { x: 65, y: 45 },
    { x: 45, y: 70 },
  ];

  const localOutsideDots = [
    { x: 10, y: 20 },
    { x: 85, y: 15 },
    { x: 90, y: 80 },
    { x: 15, y: 85 },
    { x: 5, y: 50 },
    { x: 95, y: 50 },
  ];

  return (
    <div ref={containerRef} className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Without Locality (Global) */}
        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <div className="text-center mb-3 text-sm font-semibold text-destructive">Without Locality (Global)</div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connection lines - all interconnected */}
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
                      className={cn(
                        'transition-all duration-500',
                        isVisible ? 'stroke-destructive/40 animate-global-cascade' : 'stroke-muted-foreground/20',
                      )}
                      style={{ animationDelay: `${(i + j) * 0.05}s` }}
                      strokeWidth="0.3"
                    />
                  )),
              )}

              {/* Dots */}
              {globalDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r="3"
                    className={cn(
                      'transition-all duration-300',
                      i === 7
                        ? 'fill-primary'
                        : isVisible
                          ? 'fill-destructive/80 animate-pulse'
                          : 'fill-muted-foreground/40',
                    )}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  {i === 7 && (
                    <circle cx={dot.x} cy={dot.y} r="5" className="fill-none stroke-primary stroke-2 animate-ping" />
                  )}
                </g>
              ))}
            </svg>

            {/* Label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-background/80 px-2 py-0.5 rounded">
              dot of interest
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-muted-foreground italic">
            "To understand one dot, you must account for every other dot — up to infinity"
          </p>
        </div>

        {/* Right Panel: With Locality (Field Abstraction) */}
        <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
          <div className="text-center mb-3 text-sm font-semibold text-primary">With Locality (Field Abstraction)</div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Boundary box */}
              <rect
                x="25"
                y="30"
                width="50"
                height="45"
                className="fill-primary/10 stroke-primary/50"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="4"
              />

              {/* Outside dots - faded */}
              {localOutsideDots.map((dot, i) => (
                <circle key={`outside-${i}`} cx={dot.x} cy={dot.y} r="2.5" className="fill-muted-foreground/20" />
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
                      className={cn(
                        'transition-all duration-500',
                        isVisible ? 'stroke-primary/60' : 'stroke-muted-foreground/20',
                      )}
                      strokeWidth="0.5"
                    />
                  )),
              )}

              {/* Inside dots */}
              {localInsideDots.map((dot, i) => (
                <g key={`inside-dot-${i}`}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r="3"
                    className={cn(
                      'transition-all duration-300',
                      i === 0 ? 'fill-primary' : isVisible ? 'fill-primary/80' : 'fill-muted-foreground/40',
                    )}
                  />
                  {i === 0 && isVisible && (
                    <circle cx={dot.x} cy={dot.y} r="5" className="fill-none stroke-primary stroke-2 animate-pulse" />
                  )}
                </g>
              ))}

              {/* Deferred arrow */}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" className="fill-muted-foreground" />
                </marker>
              </defs>
              <line
                x1="75"
                y1="52"
                x2="88"
                y2="52"
                className="stroke-muted-foreground"
                strokeWidth="1"
                markerEnd="url(#arrowhead)"
              />
              <text x="78" y="48" className="text-[7px] fill-muted-foreground">
                deferred
              </text>
            </svg>

            {/* Label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-background/80 px-2 py-0.5 rounded">
              field boundary
            </div>
          </div>

          <p className="text-center mt-3 text-xs text-muted-foreground italic">
            "You only need to know the field. How the field is formed is deferred elsewhere"
          </p>
        </div>
      </div>
    </div>
  );
}
