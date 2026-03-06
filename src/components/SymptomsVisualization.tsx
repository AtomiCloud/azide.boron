import React from 'react';

export default function SymptomsVisualization() {
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
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Panel: Fragility */}
        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <div className="text-center mb-3 text-sm font-semibold text-destructive">
            Fragility (Action at a Distance)
          </div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connections */}
              {fragilityConnections.map(([from, to], i) => {
                const fromDot = fragilityDots[from]!;
                const toDot = fragilityDots[to]!;
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke="hsl(var(--destructive) / 0.5)"
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
                    fill={
                      dot.hop === 0
                        ? 'hsl(var(--primary))'
                        : dot.hop === 4
                          ? 'hsl(var(--destructive))'
                          : 'hsl(var(--destructive) / 0.7)'
                    }
                  />
                  {dot.hop === 0 && (
                    <circle cx={dot.x} cy={dot.y} r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  )}
                  {dot.hop === 4 && (
                    <text x={dot.x} y={dot.y + 1} textAnchor="middle" className="fill-background text-[8px] font-bold">
                      ✕
                    </text>
                  )}
                </g>
              ))}
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
        <div className="border border-accent/30 rounded-lg p-4 bg-accent/5">
          <div className="text-center mb-3 text-sm font-semibold text-accent-foreground">Rigidity (Hard to Change)</div>

          <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-muted/30 rounded border border-border overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Connections */}
              {rigidityConnections.map(([from, to], i) => {
                const fromDot = rigidityDots[from]!;
                const toDot = rigidityDots[to]!;
                return (
                  <line
                    key={i}
                    x1={fromDot.x}
                    y1={fromDot.y}
                    x2={toDot.x}
                    y2={toDot.y}
                    stroke="hsl(var(--accent) / 0.5)"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Dots */}
              {rigidityDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.hop === 0 ? 4 : 3}
                    fill={dot.hop === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent) / 0.8)'}
                  />
                  {dot.hop === 0 && (
                    <circle cx={dot.x} cy={dot.y} r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  )}
                  {dot.hop > 0 && (
                    <text x={dot.x} y={dot.y + 4} textAnchor="middle" className="fill-background text-[6px]">
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
            <div className="absolute bottom-2 right-2 text-[9px] bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded">
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
