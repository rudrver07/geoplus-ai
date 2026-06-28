"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { 
  Radio, 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckSquare, 
  AlertTriangle,
  RotateCcw,
  Layers,
  Skull,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import VectorMap from "@/components/map/VectorMap";

export default function WarRoom() {
  const [isCrisisActive, setIsCrisisActive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [oilPrice, setOilPrice] = useState(86.20);
  const [riskIndex, setRiskIndex] = useState(74.8);
  const [activeNews, setActiveNews] = useState("PEACE STATE SECURED. CORRIDORS MONITORED BY SATELLITE OVERWATCH.");
  
  const [steps, setSteps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checklist, setChecklist] = useState([
    { id: "chk-1", text: "Initiate Naval escorts for flagship crude carriers", done: false },
    { id: "chk-2", text: "Tap strategic petroleum reserves (SPR) for 10M barrels", done: false },
    { id: "chk-3", text: "Mobilize bypass pipeline agreements with UAE terminals", done: false },
    { id: "chk-4", text: "Enact voluntary retail conservation protocols", done: false },
    { id: "chk-5", text: "Activate bilateral spot market swaps with Brazil", done: false }
  ]);

  const fetchWarRoomData = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/war-room`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      setSteps(data || []);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Failed to establish a secure link with War Room command data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWarRoomData();
    const interval = setInterval(fetchWarRoomData, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  // Audio synthesizer using Web Audio API for a futuristic sonar ping/siren
  const playSirenSound = (frequency = 440, type: OscillatorType = "sine", duration = 0.3) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API not allowed yet by user interaction", e);
    }
  };

  // Playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCrisisActive && steps.length > 0) {
      // Periodic step increment
      interval = setInterval(() => {
        setCurrentStepIdx((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx < steps.length) {
            const step = steps[nextIdx];
            
            // Trigger alerts & update state
            setActiveNews(`[BREAKING NEWS] ${step.headline} - ${step.details}`);
            setOilPrice(86.20 + step.brentPriceChange);
            setRiskIndex(74.8 + step.riskIndexChange);
            
            // Synthesizer cue
            playSirenSound(nextIdx === 4 ? 660 : 550, "sawtooth", 0.6);
            
            return nextIdx;
          } else {
            clearInterval(interval);
            return prevIdx;
          }
        });
      }, 7000); // 7 seconds per propagation step
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCrisisActive, soundEnabled, steps]);

  const handleStartCrisis = () => {
    if (steps.length === 0) return;
    setIsCrisisActive(true);
    setCurrentStepIdx(0);
    const step = steps[0];
    
    // Set initial step parameters
    setActiveNews(`[BREAKING NEWS] ${step.headline} - ${step.details}`);
    setOilPrice(86.20 + step.brentPriceChange);
    setRiskIndex(74.8 + step.riskIndexChange);
    
    // Siren synthesize sound
    playSirenSound(587.33, "sawtooth", 0.5);
    setTimeout(() => playSirenSound(523.25, "sawtooth", 0.5), 200);
  };

  const handleReset = () => {
    setIsCrisisActive(false);
    setCurrentStepIdx(0);
    setOilPrice(86.20);
    setRiskIndex(74.8);
    setActiveNews("PEACE STATE SECURED. CORRIDORS MONITORED BY SATELLITE OVERWATCH.");
    setChecklist(prev => prev.map(c => ({ ...c, done: false })));
    playSirenSound(330, "sine", 0.3);
  };

  const handleCheckToggle = (id: string) => {
    setChecklist(prev => 
      prev.map(c => {
        if (c.id === id) {
          playSirenSound(880, "sine", 0.15);
          return { ...c, done: !c.done };
        }
        return c;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-slate-900 bg-slate-950/40 rounded-lg font-mono text-xs">
        <Activity className="h-8 w-8 text-accent animate-pulse mb-4" />
        <span className="text-slate-400 font-bold tracking-wider">GEOPULSE TACTICAL OVERLINK SYNCHRONIZING...</span>
        <span className="text-[10px] text-slate-600 mt-1">Establishing link secure channels with command war room node</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-danger/30 bg-danger/5 rounded-lg font-mono text-xs p-6 space-y-4">
        <AlertTriangle className="h-10 w-10 text-danger animate-bounce" />
        <div className="text-center">
          <div className="text-danger font-bold text-sm uppercase">OVERLINK LINK FAILURE</div>
          <div className="text-slate-400 mt-2 max-w-md">{error}</div>
        </div>
        <button 
          onClick={fetchWarRoomData}
          className="px-4 py-2 bg-danger/25 text-danger border border-danger/40 hover:bg-danger/40 rounded uppercase font-bold tracking-widest cursor-pointer transition-all"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-6 relative z-10 font-sans min-h-[calc(100vh-6rem)] transition-all duration-500 rounded-lg p-2 border border-transparent",
      isCrisisActive && "animate-red-alert"
    )}>
      
      {/* Breaking news ticker banner */}
      <div className={cn(
        "w-full h-8 flex items-center overflow-hidden border font-mono text-xs font-semibold select-none",
        isCrisisActive 
          ? "bg-danger/20 border-danger/40 text-danger" 
          : "bg-slate-900 border-slate-800 text-slate-400"
      )}>
        <div className={cn(
          "px-3 py-1 flex items-center gap-1.5 shrink-0 uppercase tracking-widest",
          isCrisisActive ? "bg-danger text-slate-950" : "bg-slate-800 text-white"
        )}>
          <Radio className="h-3.5 w-3.5 animate-pulse" /> NEWS TICKER
        </div>
        <div className="flex-1 px-4 truncate animate-pulse">
          {activeNews}
        </div>
      </div>

      {/* Title + Master controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Skull className={cn("h-6 w-6", isCrisisActive ? "text-danger animate-pulse" : "text-slate-500")} />
            National War Room Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Emergency response command matrix. Coordinate reserves release, convoy escorts, and supplier reallocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound settings */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4.5 w-4.5 text-accent" /> : <VolumeX className="h-4.5 w-4.5 text-slate-500" />}
          </button>

          {/* Master trigger buttons */}
          {isCrisisActive ? (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-900/60 border border-slate-800 hover:border-accent text-white font-mono text-xs rounded flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-accent" /> Reset Command Center
            </button>
          ) : (
            <button
              onClick={handleStartCrisis}
              className="px-5 py-2.5 bg-danger hover:bg-danger/95 text-white font-bold text-xs uppercase tracking-widest rounded border border-danger/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-danger/25"
            >
              <Bell className="h-4 w-4 animate-bounce" /> Start Crisis Scenario
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Tactical Map Overview */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-accent" /> Active Theatre Operations Map
          </h2>
          
          <VectorMap 
            threatHighlightId={isCrisisActive ? "map-hormuz" : undefined} 
            activeNodeId={isCrisisActive ? "map-kochi" : undefined}
          />
        </div>

        {/* HUD Stats & Actions checklists */}
        <div className="space-y-6">
          
          {/* Emergency Metrics Indicator */}
          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg space-y-4 font-mono">
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1">
              <AlertTriangle className={cn("h-4 w-4", isCrisisActive ? "text-danger animate-pulse" : "text-slate-500")} /> Theatre Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/20 border border-slate-900 rounded">
                <span className="text-[9px] text-slate-500 block">BRENT BENCHMARK</span>
                <span className={cn(
                  "text-lg font-bold",
                  isCrisisActive ? "text-danger" : "text-white"
                )}>${oilPrice.toFixed(2)}</span>
              </div>

              <div className="p-3 bg-slate-900/20 border border-slate-900 rounded">
                <span className="text-[9px] text-slate-500 block">THREAT RISK INDEX</span>
                <span className={cn(
                  "text-lg font-bold",
                  isCrisisActive ? "text-danger" : "text-white"
                )}>{riskIndex.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Emergency Action Checklist */}
          <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-lg space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <CheckSquare className="h-4.5 w-4.5 text-accent" /> Emergency Checklist
            </h3>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCheckToggle(item.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded text-xs font-mono cursor-pointer transition-all",
                    item.done
                      ? "bg-success/15 border-success text-white font-bold"
                      : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center shrink-0 text-[10px]",
                    item.done ? "border-success bg-success text-slate-950" : "border-slate-800 bg-slate-950"
                  )}>
                    {item.done && "✓"}
                  </div>
                  <span className="leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological scenario step visualizer */}
          {isCrisisActive && steps.length > 0 && (
            <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-danger font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-danger rounded-full animate-ping"></span> SCENARIO PLAYBACK
                </span>
                <span className="text-slate-500">STAGE {currentStepIdx + 1} OF {steps.length}</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-white font-bold">{steps[currentStepIdx]?.headline}</div>
                <p className="text-slate-400 leading-normal text-[9px] italic">
                  {steps[currentStepIdx]?.details}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
