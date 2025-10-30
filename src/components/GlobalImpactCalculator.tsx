import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function GlobalImpactCalculator() {
  // Sliders state
  const [dailyMessages, setDailyMessages] = useState(100); // billions
  const [aiExpansionPercent, setAiExpansionPercent] = useState(10); // percent
  const [expansionFactor, setExpansionFactor] = useState(2); // multiplier
  const [aiCompressionPercent, setAiCompressionPercent] = useState(0); // percent of expanded messages

  // Constants (with sources)
  const AVG_MESSAGE_TOKENS = 130; // Average business email: 75-100 words ≈ 130 tokens
  const ENERGY_PER_TOKEN_KWH = 0.00000111; // Llama 65B: ~0.00037 kWh per 333 tokens
  const CO2_PER_KWH = 0.4; // kg CO2, US average
  const ELECTRICITY_COST_PER_KWH = 0.15; // USD, global average
  const CLOUD_STORAGE_COST_PER_GB_YEAR = 0.023; // USD per GB per year (AWS S3)
  const BANDWIDTH_COST_PER_GB = 0.08; // USD per GB transferred (CDN average)
  const GZIP_COMPRESSION_RATIO_TERSE = 0.4; // Terse text compresses to ~40% of original
  const GZIP_COMPRESSION_RATIO_VERBOSE = 0.6; // Verbose AI text compresses to ~60% (less efficient)

  // Calculations
  const messagesExpandedDaily = ((dailyMessages * aiExpansionPercent) / 100) * 1e9; // absolute number
  const messagesCompressedDaily = messagesExpandedDaily * (aiCompressionPercent / 100);

  // Tokens
  const originalTokens = messagesExpandedDaily * AVG_MESSAGE_TOKENS;
  const expandedTokens = messagesExpandedDaily * AVG_MESSAGE_TOKENS * expansionFactor;
  const wastedTokens = expandedTokens - originalTokens; // extra tokens transmitted

  // Energy for expansion
  const expansionEnergyDaily = expandedTokens * ENERGY_PER_TOKEN_KWH; // kWh

  // Energy for compression (uses ~50% of generation energy)
  const compressionEnergyDaily =
    messagesCompressedDaily * AVG_MESSAGE_TOKENS * expansionFactor * ENERGY_PER_TOKEN_KWH * 0.5;

  // Total
  const totalEnergyDaily = expansionEnergyDaily + compressionEnergyDaily; // kWh
  const totalEnergyAnnual = (totalEnergyDaily * 365) / 1e9; // TWh

  // CO2
  const co2Daily = (totalEnergyDaily * CO2_PER_KWH) / 1e6; // million kg = thousand tonnes
  const co2Annual = co2Daily * 365; // thousand tonnes per year

  // Storage
  const storageWasteGBDaily = (wastedTokens * 4) / (1024 * 1024 * 1024); // bytes to GB
  const storageWasteGBAnnual = storageWasteGBDaily * 365; // GB per year
  const storageWasteTBAnnual = storageWasteGBAnnual / 1024; // TB per year

  // Bandwidth/Transmission (accounting for gzip)
  const originalBytesDaily = originalTokens * 4; // raw bytes
  const expandedBytesDaily = expandedTokens * 4; // raw bytes
  const originalGzippedDaily = originalBytesDaily * GZIP_COMPRESSION_RATIO_TERSE; // after gzip
  const expandedGzippedDaily = expandedBytesDaily * GZIP_COMPRESSION_RATIO_VERBOSE; // after gzip (compresses less efficiently)
  const extraBytesTransmittedDaily = expandedGzippedDaily - originalGzippedDaily; // extra bandwidth used
  const extraBytesTransmittedAnnual = extraBytesTransmittedDaily * 365; // annual
  const bandwidthWasteGBAnnual = extraBytesTransmittedAnnual / (1024 * 1024 * 1024); // GB per year
  const bandwidthWasteTBAnnual = bandwidthWasteGBAnnual / 1024; // TB per year

  // Costs (in millions USD)
  const energyCostAnnual = (totalEnergyAnnual * 1e9 * ELECTRICITY_COST_PER_KWH) / 1e6; // millions USD
  const storageCostAnnual = (storageWasteGBAnnual * CLOUD_STORAGE_COST_PER_GB_YEAR) / 1e6; // millions USD
  const bandwidthCostAnnual = (bandwidthWasteGBAnnual * BANDWIDTH_COST_PER_GB) / 1e6; // millions USD
  const totalCostAnnual = energyCostAnnual + storageCostAnnual + bandwidthCostAnnual; // millions USD

  return (
    <div className="my-12">
      <Card className="md:border md:shadow-sm border-0 shadow-none">
        <CardHeader className="md:p-6 p-0">
          <CardTitle className="text-2xl">Global Impact Calculator</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Adjust the sliders to explore different scenarios. These are rough estimates to illustrate scale.
          </p>
        </CardHeader>
        <CardContent className="md:p-6 p-0 md:pt-0 pt-6">
          <div className="space-y-8">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Daily messages globally: <span className="text-primary font-bold">{dailyMessages}B</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={dailyMessages}
                  onChange={e => setDailyMessages(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100B</span>
                  <span>500B</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Messages using AI expansion: <span className="text-primary font-bold">{aiExpansionPercent}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={aiExpansionPercent}
                  onChange={e => setAiExpansionPercent(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Average expansion factor: <span className="text-primary font-bold">{expansionFactor}×</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={expansionFactor}
                  onChange={e => setExpansionFactor(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2×</span>
                  <span>10×</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipients using AI compression:{' '}
                  <span className="text-primary font-bold">{aiCompressionPercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={aiCompressionPercent}
                  onChange={e => setAiCompressionPercent(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="pt-6 border-t border-border">
              <h4 className="font-semibold mb-4 hidden md:block">Annual Global Impact</h4>

              {/* Metrics - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <div className="text-xs text-muted-foreground mb-1">Energy</div>
                  <div className="text-2xl font-bold">{totalEnergyAnnual.toFixed(1)} TWh</div>
                  <div className="text-xs text-muted-foreground mt-1">per year</div>
                </div>

                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <div className="text-xs text-muted-foreground mb-1">CO₂</div>
                  <div className="text-2xl font-bold">{(co2Annual / 1e3).toFixed(1)}M</div>
                  <div className="text-xs text-muted-foreground mt-1">million tonnes/yr</div>
                </div>

                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <div className="text-xs text-muted-foreground mb-1">Bandwidth</div>
                  <div className="text-2xl font-bold">{bandwidthWasteTBAnnual.toFixed(0)} TB</div>
                  <div className="text-xs text-muted-foreground mt-1">extra (gzipped)</div>
                </div>

                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <div className="text-xs text-muted-foreground mb-1">Storage</div>
                  <div className="text-2xl font-bold">{storageWasteTBAnnual.toFixed(0)} TB</div>
                  <div className="text-xs text-muted-foreground mt-1">per year</div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
                <h4 className="font-semibold mb-3">Annual Costs (USD)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Energy cost:</span>
                    <span className="font-bold">${energyCostAnnual.toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bandwidth cost:</span>
                    <span className="font-bold">${bandwidthCostAnnual.toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Storage cost:</span>
                    <span className="font-bold">${storageCostAnnual.toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-primary/20 pt-2 mt-2">
                    <span className="font-semibold">Total waste:</span>
                    <span className="font-bold text-lg">${totalCostAnnual.toFixed(0)}M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assumptions Table - Collapsible */}
            <details className="pt-6 border-t border-border">
              <summary className="cursor-pointer text-sm font-semibold mb-3 hover:text-primary">
                Show calculation assumptions
              </summary>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-medium">Parameter</th>
                      <th className="text-left p-2 font-medium">Value</th>
                      <th className="text-left p-2 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b border-border/50">
                      <td className="p-2">Average message length</td>
                      <td className="p-2 font-mono">{AVG_MESSAGE_TOKENS} tokens</td>
                      <td className="p-2 text-muted-foreground">Business email avg: 75-100 words</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Energy per token</td>
                      <td className="p-2 font-mono">{ENERGY_PER_TOKEN_KWH} kWh</td>
                      <td className="p-2 text-muted-foreground">arXiv 2505.09598v1 (LLM inference benchmark)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Compression energy ratio</td>
                      <td className="p-2 font-mono">50% of generation</td>
                      <td className="p-2 text-muted-foreground">Estimate (summarization uses less compute)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">CO₂ per kWh</td>
                      <td className="p-2 font-mono">{CO2_PER_KWH} kg</td>
                      <td className="p-2 text-muted-foreground">US grid average</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Token size</td>
                      <td className="p-2 font-mono">4 bytes</td>
                      <td className="p-2 text-muted-foreground">UTF-8 approximate</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Electricity cost</td>
                      <td className="p-2 font-mono">${ELECTRICITY_COST_PER_KWH}/kWh</td>
                      <td className="p-2 text-muted-foreground">Global average</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Cloud storage cost</td>
                      <td className="p-2 font-mono">${CLOUD_STORAGE_COST_PER_GB_YEAR}/GB/year</td>
                      <td className="p-2 text-muted-foreground">AWS S3 pricing</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Bandwidth cost</td>
                      <td className="p-2 font-mono">${BANDWIDTH_COST_PER_GB}/GB</td>
                      <td className="p-2 text-muted-foreground">CDN average</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Gzip compression (terse)</td>
                      <td className="p-2 font-mono">{(GZIP_COMPRESSION_RATIO_TERSE * 100).toFixed(0)}%</td>
                      <td className="p-2 text-muted-foreground">Short messages compress well</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-2">Gzip compression (verbose)</td>
                      <td className="p-2 font-mono">{(GZIP_COMPRESSION_RATIO_VERBOSE * 100).toFixed(0)}%</td>
                      <td className="p-2 text-muted-foreground">AI text compresses less (repetitive tokens)</td>
                    </tr>
                    <tr>
                      <td className="p-2">Daily messages globally</td>
                      <td className="p-2 font-mono">~330B/day</td>
                      <td className="p-2 text-muted-foreground">~330B emails + ~20B+ chat messages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                <p className="mb-2">
                  <strong>Note:</strong> These are rough estimates, not rigorous calculations. They're meant to give a
                  sense of scale. Actual impact varies significantly by model efficiency, hardware, grid carbon
                  intensity, adoption rates, and usage patterns.
                </p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
