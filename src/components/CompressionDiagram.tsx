import React from 'react';

export default function CompressionDiagram() {
  return (
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-2 gap-2 md:gap-6">
        {/* Traditional Compression */}
        <div className="border border-green-500/30 rounded p-2 md:p-3 bg-green-500/5">
          <div className="text-center mb-2 text-xs md:text-sm font-semibold">Traditional</div>
          <div className="space-y-1 md:space-y-2">
            <div className="bg-primary/20 border border-primary rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Start</div>
              <div className="font-mono text-xs md:text-sm font-bold">3 bytes</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-green-500/20 border border-green-500 rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Compress</div>
              <div className="font-mono text-xs md:text-sm font-bold">1 byte</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-blue-500/20 border border-blue-500 rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Transmit</div>
              <div className="font-mono text-xs md:text-sm font-bold">1 byte</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-green-500/20 border border-green-500 rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Decompress</div>
              <div className="font-mono text-xs md:text-sm font-bold">3 bytes</div>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] md:text-xs text-muted-foreground">Minimize wire cost</div>
        </div>

        {/* The Decompression Tax */}
        <div className="border border-destructive/30 rounded p-2 md:p-3 bg-destructive/5">
          <div className="text-center mb-2 text-xs md:text-sm font-semibold">LLM Decompression</div>
          <div className="space-y-1 md:space-y-2">
            <div className="bg-primary/20 border border-primary rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Start</div>
              <div className="font-mono text-xs md:text-sm font-bold">3 bytes</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-destructive/20 border border-destructive rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">AI Expand</div>
              <div className="font-mono text-xs md:text-sm font-bold">10 bytes</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-destructive/30 border border-destructive rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">Transmit</div>
              <div className="font-mono text-xs md:text-sm font-bold">10 bytes</div>
            </div>
            <div className="text-center text-sm md:text-lg">↓</div>
            <div className="bg-primary/20 border border-primary rounded p-1.5 md:p-2 text-center">
              <div className="text-[10px] md:text-xs text-muted-foreground">AI Compress</div>
              <div className="font-mono text-xs md:text-sm font-bold">3 bytes</div>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] md:text-xs text-destructive font-semibold">
            Maximize wire cost
          </div>
        </div>
      </div>
    </div>
  );
}
