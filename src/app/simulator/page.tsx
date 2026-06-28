"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Play, 
  Download, 
  Flame, 
  Clock, 
  Cpu, 
  RefreshCw,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Simulator() {
  const [crisisType, setCrisisType] = useState("hormuz");
  const [severity, setSeverity] = useState("high");
  const [duration, setDuration] = useState(30);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["mid-east", "red-sea"]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulated results state
  const [results, setResults] = useState({
    economicLoss: "$1.48 Billion",
    gdpImpact: "-0.95%",
    inflationForecast: "+3.8%",
    fuelPriceForecast: "+24.5%",
    refineryStress: 88, // 0 to 100
    supplyRemaining: 7, // days
    causalChainIndex: 4,
    recommendations: [
      "Release 15M barrels from the National Strategic Petroleum Reserves immediately to stabilize pressure.",
      "Initiate secondary supply contract protocols with Petrobras (Brazil) and Equinor (Norway) to cover shortfalls.",
      "Impose voluntary refining throughput caps in non-disrupted sectors to conserve raw inventory.",
      "Deploy naval escort patrols in cooperation with maritime security alliance for critical tankers."
    ]
  });

  const regions = [
    { id: "mid-east", name: "Middle East / Persian Gulf" },
    { id: "red-sea", name: "Red Sea & Bab-el-Mandeb" },
    { id: "se-asia", name: "Southeast Asia / Malacca" },
    { id: "atlantic", name: "Atlantic Transit corridors" }
  ];

  const handleRegionToggle = (id: string) => {
    setSelectedRegions(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate API call lag
    setTimeout(() => {
      setIsSimulating(false);
      
      // Calculate dynamic outputs based on dropdown selection and sliders
      let economicLoss = "$420 Million";
      let gdpImpact = "-0.24%";
      let inflationForecast = "+1.1%";
      let fuelPriceForecast = "+8.4%";
      let refineryStress = 45;
      let supplyRemaining = 18;
      let causalChainIndex = 2;
      let recommendations: string[] = [];

      const severityMultiplier = severity === "high" ? 3 : severity === "medium" ? 2 : 1;
      const durationFactor = duration / 30;

      if (crisisType === "hormuz") {
        const loss = (1.8 * severityMultiplier * durationFactor).toFixed(2);
        economicLoss = `$${loss} Billion`;
        gdpImpact = `-${(0.3 * severityMultiplier * durationFactor).toFixed(2)}%`;
        inflationForecast = `+${(1.2 * severityMultiplier * durationFactor).toFixed(1)}%`;
        fuelPriceForecast = `+${(8 * severityMultiplier * durationFactor).toFixed(1)}%`;
        refineryStress = Math.min(100, Math.round(30 * severityMultiplier * durationFactor));
        supplyRemaining = Math.max(2, Math.round(20 / (severityMultiplier * durationFactor)));
        causalChainIndex = 4;
        recommendations = [
          "Activate emergency bilateral supply swaps with UAE and Saudi bypass pipeline terminals.",
          "Release strategic petroleum reserves (SPR) at a rate of 1.2M barrels/day.",
          "Mandate national energy conservation quotas for secondary industrial networks."
        ];
      } else if (crisisType === "red-sea") {
        const loss = (800 * severityMultiplier * durationFactor).toFixed(0);
        economicLoss = `$${loss} Million`;
        gdpImpact = `-${(0.12 * severityMultiplier * durationFactor).toFixed(2)}%`;
        inflationForecast = `+${(0.5 * severityMultiplier * durationFactor).toFixed(1)}%`;
        fuelPriceForecast = `+${(4 * severityMultiplier * durationFactor).toFixed(1)}%`;
        refineryStress = Math.min(100, Math.round(20 * severityMultiplier * durationFactor));
        supplyRemaining = Math.max(5, Math.round(25 / (severityMultiplier * durationFactor)));
        causalChainIndex = 3;
        recommendations = [
          "Subsidize Cape of Good Hope cargo freight premiums to encourage voluntary merchant reroutes.",
          "Coordinate naval logistics corridors for Indian flag oil tankers transiting Bab-el-Mandeb.",
          "Accelerate domestic refining stocks distribution to Southern and Western hubs."
        ];
      } else {
        const loss = (300 * severityMultiplier * durationFactor).toFixed(0);
        economicLoss = `$${loss} Million`;
        gdpImpact = `-${(0.08 * severityMultiplier * durationFactor).toFixed(2)}%`;
        inflationForecast = `+${(0.3 * severityMultiplier * durationFactor).toFixed(1)}%`;
        fuelPriceForecast = `+${(2.5 * severityMultiplier * durationFactor).toFixed(1)}%`;
        refineryStress = Math.min(100, Math.round(15 * severityMultiplier * durationFactor));
        supplyRemaining = Math.max(8, Math.round(30 / (severityMultiplier * durationFactor)));
        causalChainIndex = 2;
        recommendations = [
          "Re-negotiate supply quotas with bilateral spot sellers in Southeast Asia.",
          "Incorporate high-stability suppliers from Brazil and Norway to offset Middle East concentration.",
          "Leverage public-private pipeline reserves to smooth grid distribution delays."
        ];
      }

      setResults({
        economicLoss,
        gdpImpact,
        inflationForecast,
        fuelPriceForecast,
        refineryStress,
        supplyRemaining,
        causalChainIndex,
        recommendations
      });
    }, 1500);
  };

  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div className="space-y-6 relative z-10">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-danger" />
            Strategic Crisis Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Model chokepoint closures and geopolitical incidents to estimate supply reserves stress and economic impact.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel - Simulator Configuration */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-6">
          <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-accent" /> Configure Scenario Parameters
          </h2>

          {/* Scenario Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Incident / Crisis Type</label>
            <select
              value={crisisType}
              onChange={(e) => setCrisisType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-accent text-white font-mono text-xs rounded p-2.5 outline-none cursor-pointer"
            >
              <option value="hormuz">Strait of Hormuz Naval Closure</option>
              <option value="red-sea">Red Sea drone warfare escalations</option>
              <option value="opec">OPEC Production Quota Squeeze</option>
              <option value="port">Major Port Cyber Sabotage</option>
              <option value="sanctions">Expanded Bilateral Crude Sanctions</option>
            </select>
          </div>

          {/* Severity Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
              <span>Threat Severity</span>
              <span className={cn(
                "font-bold",
                severity === "high" && "text-danger",
                severity === "medium" && "text-warning",
                severity === "low" && "text-success"
              )}>{severity.toUpperCase()}</span>
            </div>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSeverity(level)}
                  className={cn(
                    "flex-1 py-1.5 text-[10px] font-mono border rounded uppercase cursor-pointer transition-all",
                    severity === level 
                      ? level === "high" 
                        ? "bg-danger/20 border-danger text-danger font-bold" 
                        : level === "medium" 
                          ? "bg-warning/20 border-warning text-warning font-bold"
                          : "bg-success/20 border-success text-success font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Duration slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
              <span>Expected Duration</span>
              <span className="text-white font-bold">{duration} Days</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-600">
              <span>1 DAY</span>
              <span>30 DAYS</span>
              <span>60 DAYS</span>
            </div>
          </div>

          {/* Regions Checklist */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Impacted Shipping Corridors</label>
            <div className="space-y-2 pt-1">
              {regions.map((region) => {
                const isChecked = selectedRegions.includes(region.id);
                return (
                  <div 
                    key={region.id} 
                    onClick={() => handleRegionToggle(region.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 border rounded font-mono text-[10px] cursor-pointer transition-colors",
                      isChecked 
                        ? "bg-accent/10 border-accent text-white" 
                        : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <div className={cn(
                      "h-3.5 w-3.5 rounded border flex items-center justify-center font-bold text-[8px] font-sans",
                      isChecked ? "border-accent bg-accent text-slate-950" : "border-slate-800 bg-slate-950"
                    )}>
                      {isChecked && "✓"}
                    </div>
                    {region.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execute CTA */}
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-3.5 bg-danger hover:bg-danger/95 text-white font-bold text-xs uppercase tracking-widest rounded border border-danger/20 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-danger/30 transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> RUNNING ALGORITHMS...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Run Simulation Engine
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Results Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulated Statistics Output Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg text-center space-y-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Economic Loss</span>
              <div className="text-lg font-bold font-mono text-danger">{results.economicLoss}</div>
              <span className="text-[8px] font-mono text-slate-500">Gross direct impact</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg text-center space-y-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">GDP Drag</span>
              <div className="text-lg font-bold font-mono text-danger">{results.gdpImpact}</div>
              <span className="text-[8px] font-mono text-slate-500">Gross Domestic Product</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg text-center space-y-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">CPI Inflation</span>
              <div className="text-lg font-bold font-mono text-danger">{results.inflationForecast}</div>
              <span className="text-[8px] font-mono text-slate-500">Consumer price delta</span>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg text-center space-y-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Pump Fuel Price</span>
              <div className="text-lg font-bold font-mono text-danger">{results.fuelPriceForecast}</div>
              <span className="text-[8px] font-mono text-slate-500">Gasoline & Diesel index</span>
            </div>

          </div>

          {/* Refinery Stress Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stress dial */}
            <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-lg space-y-4">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1"><Flame className="h-4 w-4 text-danger animate-pulse" /> Refinery Stress Index</h3>
              
              <div className="flex flex-col items-center py-2 space-y-3">
                {/* Visual bar representation of stress */}
                <div className="w-full bg-slate-900 h-6 rounded-md overflow-hidden border border-slate-800 p-0.5 relative">
                  <div 
                    className={cn(
                      "h-full rounded-sm transition-all duration-500",
                      results.refineryStress > 75 
                        ? "bg-gradient-to-r from-warning to-danger" 
                        : results.refineryStress > 40 
                          ? "bg-warning" 
                          : "bg-success"
                    )}
                    style={{ width: `${results.refineryStress}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white uppercase mix-blend-difference">
                    STRESS: {results.refineryStress}%
                  </div>
                </div>

                <p className="text-[10px] font-mono text-slate-500 leading-normal text-center">
                  Critical range warning thresholds: Amber (&gt;40%), Red (&gt;75%). Catalyst damage risk active at 85%+.
                </p>
              </div>
            </div>

            {/* Strategic Reserve Supply Level */}
            <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-lg space-y-4">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1"><Clock className="h-4 w-4 text-accent" /> Reserve Stock Integrity</h3>
              
              <div className="flex flex-col items-center py-2 space-y-3">
                <div className="text-3xl font-extrabold font-mono text-accent">{results.supplyRemaining} Days</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Strategic Reserve Depletion Horizon
                </div>
                
                {/* Depletion safety alert */}
                <div className={cn(
                  "w-full text-center py-1.5 rounded font-mono text-[9px] font-bold border",
                  results.supplyRemaining < 10 
                    ? "bg-danger/10 border-danger/30 text-danger animate-pulse" 
                    : "bg-success/10 border-success/30 text-success"
                )}>
                  {results.supplyRemaining < 10 ? "CRITICAL RISK: DEPLETION WITHIN WARNING THRESHOLD" : "SECURE: INVENTORY WELL BUFFERED"}
                </div>
              </div>
            </div>

          </div>

          {/* Causal Chain Animation Flow */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <Info className="h-4 w-4 text-accent" /> Animated Risk Propagation Flow
            </h3>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 font-mono text-[10px]">
              
              {/* Event node */}
              <div className={cn(
                "p-3 rounded border text-center flex-1 transition-all",
                results.causalChainIndex >= 0 ? "bg-danger/20 border-danger text-danger font-bold" : "bg-slate-950 border-slate-900 text-slate-600"
              )}>
                <div>1. EVENT</div>
                <div className="text-[8px] font-normal uppercase">Chokepoint blocked</div>
              </div>

              <div className="text-center text-slate-700 hidden md:block">➔</div>

              {/* Shipping Delay */}
              <div className={cn(
                "p-3 rounded border text-center flex-1 transition-all",
                results.causalChainIndex >= 1 ? "bg-danger/20 border-danger text-danger font-bold" : "bg-slate-950 border-slate-900 text-slate-600"
              )}>
                <div>2. DELAYS</div>
                <div className="text-[8px] font-normal uppercase">Ocean routes +14d</div>
              </div>

              <div className="text-center text-slate-700 hidden md:block">➔</div>

              {/* Supply Shock */}
              <div className={cn(
                "p-3 rounded border text-center flex-1 transition-all",
                results.causalChainIndex >= 2 ? "bg-danger/20 border-danger text-danger font-bold" : "bg-slate-950 border-slate-900 text-slate-600"
              )}>
                <div>3. SHOCK</div>
                <div className="text-[8px] font-normal uppercase">Offloading dips</div>
              </div>

              <div className="text-center text-slate-700 hidden md:block">➔</div>

              {/* Refinery Stress */}
              <div className={cn(
                "p-3 rounded border text-center flex-1 transition-all",
                results.causalChainIndex >= 3 ? "bg-danger/20 border-danger text-danger font-bold" : "bg-slate-950 border-slate-900 text-slate-600"
              )}>
                <div>4. STRESS</div>
                <div className="text-[8px] font-normal uppercase">Refineries throttled</div>
              </div>

              <div className="text-center text-slate-700 hidden md:block">➔</div>

              {/* Inflation */}
              <div className={cn(
                "p-3 rounded border text-center flex-1 transition-all",
                results.causalChainIndex >= 4 ? "bg-danger/20 border-danger text-danger font-bold" : "bg-slate-950 border-slate-900 text-slate-600"
              )}>
                <div>5. INFLATION</div>
                <div className="text-[8px] font-normal uppercase">Retail price surge</div>
              </div>

            </div>
          </div>

          {/* AI Advisor Recommendations Panel */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-accent" /> Gemini Decision Recommendations
              </h3>
              <div className="text-[9px] font-mono bg-accent/10 border border-accent/30 text-accent rounded px-2 py-0.5">
                CONFIDENCE: 92%
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc marker:text-accent font-medium leading-relaxed">
              {results.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-900 flex justify-end">
              <button 
                onClick={handlePrintBrief}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-900/60 border border-slate-800 hover:border-accent text-white font-mono text-[10px] rounded flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-accent" /> Generate Crisis Briefing PDF
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
