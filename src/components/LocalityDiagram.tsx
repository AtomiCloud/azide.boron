import React from 'react';

export default function LocalityDiagram() {
  // Generate fixed positions for dots
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
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Without Locality (Global) */}
        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <div className="text-center mb-3 text-sm font-semibold text-destructive">Without Locality (Global)</div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
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
                      stroke="hsl(var(--destructive))"
                      strokeOpacity="0.3"
                      strokeWidth="0.3"
                    />
                  )),
              )}

              {/* Dots */}
              {globalDots.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={i === 7 ? 4 : 3}
                  fill={i === 7 ? 'hsl(var(--primary))' : 'hsl(var(--destructive) / 0.7)'}
                />
              ))}

              {/* Highlight ring on dot of interest */}
              <circle
                cx={globalDots[7]!.x}
                cy={globalDots[7]!.y}
                r="6"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
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
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Boundary box */}
              <rect
                x="25"
                y="30"
                width="50"
                height="45"
                fill="hsl(var(--primary) / 0.1)"
                stroke="hsl(var(--primary) / 0.5)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="4"
              />

              {/* Outside dots - faded */}
              {localOutsideDots.map((dot, i) => (
                <circle key={`outside-${i}`} cx={dot.x} cy={dot.y} r="2.5" fill="hsl(var(--muted-foreground) / 0.2)" />
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
                      stroke="hsl(var(--primary))"
                      strokeOpacity="0.5"
                      strokeWidth="0.5"
                    />
                  )),
              )}

              {/* Inside dots */}
              {localInsideDots.map((dot, i) => (
                <circle
                  key={`inside-dot-${i}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={i === 0 ? 4 : 3}
                  fill={i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.7)'}
                />
              ))}

              {/* Highlight ring on dot of interest */}
              <circle
                cx={localInsideDots[0]!.x}
                cy={localInsideDots[0]!.y}
                r="6"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />

              {/* Deferred arrow */}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="hsl(var(--muted-foreground))" />
                </marker>
              </defs>
              <line
                x1="75"
                y1="52"
                x2="88"
                y2="52"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                markerEnd="url(#arrowhead)"
              />
              <text x="78" y="48" fontSize="6" fill="hsl(var(--muted-foreground))">
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
