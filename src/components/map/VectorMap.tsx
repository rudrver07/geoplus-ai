"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Compass, MapPin, Radio, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapNode {
  id: string;
  name: string;
  type: "source" | "chokepoint" | "port";
  x: number;
  y: number;
  riskScore: number;
  status: "healthy" | "warning" | "critical";
  flowRate?: string;
  notes: string;
}

interface MapRoute {
  id: string;
  name: string;
  path: string;
  status: "healthy" | "warning" | "critical";
  isAlternative?: boolean;
}

interface VectorMapProps {
  onNodeSelect?: (node: MapNode) => void;
  activeNodeId?: string;
  threatHighlightId?: string;
}

export default function VectorMap({ onNodeSelect, activeNodeId, threatHighlightId }: VectorMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);

  const nodes: MapNode[] = [
    { id: "map-saudi", name: "Saudi Arabia (Aramco)", type: "source", x: 210, y: 175, riskScore: 28, status: "healthy", flowRate: "8.5M bpd", notes: "Core supplier loading point." },
    { id: "map-uae", name: "Abu Dhabi Port", type: "source", x: 245, y: 195, riskScore: 22, status: "healthy", flowRate: "3.2M bpd", notes: "Hormuz-bypass pipeline connection." },
    { id: "map-hormuz", name: "Strait of Hormuz", type: "chokepoint", x: 260, y: 185, riskScore: 92, status: "critical", flowRate: "20.8M bpd", notes: "Critical chokepoint. Heightened drone/naval activity." },
    { id: "map-bab", name: "Bab-el-Mandeb Strait", type: "chokepoint", x: 175, y: 250, riskScore: 87, status: "critical", flowRate: "8.8M bpd", notes: "Houthi drone threats. 70% tanker bypass active." },
    { id: "map-suez", name: "Suez Canal Corridor", type: "chokepoint", x: 140, y: 155, riskScore: 65, status: "warning", flowRate: "9.2M bpd", notes: "Bottlenecked due to southern Red Sea reroutings." },
    { id: "map-cape", name: "Cape of Good Hope Bypass", type: "chokepoint", x: 125, y: 440, riskScore: 10, status: "healthy", flowRate: "14.5M bpd", notes: "Safe open-ocean path. Adds 10-14 transit days." },
    { id: "map-jamnagar", name: "Jamnagar Port (Gujarat)", type: "port", x: 395, y: 180, riskScore: 35, status: "healthy", flowRate: "Refinery: 1.2M bpd", notes: "World's largest refining complex offloading." },
    { id: "map-kochi", name: "Kochi Refinery Port", type: "port", x: 410, y: 275, riskScore: 68, status: "warning", flowRate: "Refinery: 310k bpd", notes: "Delayed supply arrivals from Suez route." },
    { id: "map-malacca", name: "Malacca Strait", type: "chokepoint", x: 550, y: 310, riskScore: 48, status: "warning", flowRate: "16.0M bpd", notes: "Piracy warnings. High merchant density." }
  ];

  const routes: MapRoute[] = [
    { id: "route-hormuz-jamnagar", name: "Hormuz Core Route", path: "M 245 195 Q 320 200 395 180", status: "healthy" },
    { id: "route-redsea-kochi", name: "Suez Red Sea Channel", path: "M 140 155 Q 160 210 175 250 T 260 290 Q 320 310 410 275", status: "critical" },
    { id: "route-cape-kochi", name: "Atlantic Cape Route", path: "M 140 155 Q 80 250 125 440 T 300 420 Q 370 360 410 275", status: "healthy", isAlternative: true }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.6, Math.min(3, prev * factor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden select-none select-none">
      {/* HUD Watermark & Controls */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-slate-500 space-y-1 bg-slate-950/80 border border-slate-900 rounded p-2 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-accent font-bold"><Radio className="h-3 w-3 animate-pulse" /> TACTICAL SUPPLY GLOBAL GRID</div>
        <div>COORDS: 24.8607° N, 67.0011° E</div>
        <div>ACTIVE REROUTES: +3 GLOBAL</div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button 
          onClick={() => handleZoom(1.2)} 
          className="p-2 bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent rounded transition-all"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button 
          onClick={() => handleZoom(0.8)} 
          className="p-2 bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent rounded transition-all"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button 
          onClick={resetView} 
          className="p-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 hover:border-accent rounded transition-all"
        >
          RESET
        </button>
      </div>

      {/* Map Canvas */}
      <div
        className={cn(
          "w-full h-full cursor-grab",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center"
          }}
          viewBox="0 0 800 500"
        >
          {/* Tactical Grid Overlay */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Abstract Cyber Continents */}
          {/* Europe & North Asia */}
          <path 
            d="M 50 20 L 160 30 L 250 15 L 350 40 L 520 20 L 680 50 L 720 120 L 650 160 L 550 130 L 450 150 L 320 120 L 280 90 L 180 80 L 100 90 Z" 
            fill="rgba(15, 23, 42, 0.6)" 
            stroke="rgba(30, 41, 59, 0.8)" 
            strokeWidth="1.5" 
          />
          {/* Africa */}
          <path 
            d="M 60 170 L 160 160 L 170 190 L 155 240 L 170 290 L 140 380 L 125 440 L 110 420 L 80 300 L 50 220 Z" 
            fill="rgba(15, 23, 42, 0.6)" 
            stroke="rgba(30, 41, 59, 0.8)" 
            strokeWidth="1.5" 
          />
          {/* Middle East & Indian Subcontinent */}
          <path 
            d="M 170 150 L 205 150 L 230 160 L 270 155 L 290 195 L 340 160 L 380 165 L 420 260 L 440 280 L 450 230 L 490 200 L 560 220 L 580 320 L 520 330 L 470 290 L 380 200 L 280 230 L 250 230 L 200 230 Z" 
            fill="rgba(15, 23, 42, 0.6)" 
            stroke="rgba(30, 41, 59, 0.8)" 
            strokeWidth="1.5" 
          />
          {/* East Asia & SE Islands */}
          <path 
            d="M 580 180 L 650 150 L 720 180 L 680 320 L 600 350 L 580 300 Z" 
            fill="rgba(15, 23, 42, 0.6)" 
            stroke="rgba(30, 41, 59, 0.8)" 
            strokeWidth="1.5" 
          />

          {/* Animated Shipping Lanes / Routes */}
          {routes.map((route) => {
            const isCritical = route.status === "critical";
            const color = isCritical 
              ? "stroke-danger/60" 
              : route.isAlternative 
                ? "stroke-accent/50" 
                : "stroke-primary/50";
            
            return (
              <g key={route.id}>
                {/* Background Shadow Link */}
                <path 
                  d={route.path} 
                  fill="none" 
                  className={cn("stroke-[3px]", color)}
                />
                {/* Overlay pulsing laser line */}
                <path 
                  d={route.path} 
                  fill="none" 
                  className={cn(
                    "stroke-[1.5px] stroke-cyan-400 opacity-80",
                    isCritical ? "stroke-red-400" : ""
                  )}
                  strokeDasharray="8, 12"
                  strokeDashoffset="0"
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values={isCritical ? "60;0" : "100;0"} 
                    dur={isCritical ? "12s" : "6s"} 
                    repeatCount="indefinite" 
                  />
                </path>
              </g>
            );
          })}

          {/* Radar Ring overlay for active chokepoints */}
          {nodes.map((node) => {
            const isHighlighted = threatHighlightId === node.id || activeNodeId === node.id;
            const isCritical = node.status === "critical";
            const isWarning = node.status === "warning";
            
            let color = "rgba(16, 185, 129, 0.8)"; // healthy
            if (isCritical) color = "rgba(239, 68, 68, 0.8)";
            else if (isWarning) color = "rgba(245, 158, 11, 0.8)";

            return (
              <g key={node.id}>
                {/* Blinking outer radar loop */}
                {(isCritical || isHighlighted) && (
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="12" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="1"
                    className="origin-center animate-radar"
                    style={{
                      transformOrigin: `${node.x}px ${node.y}px`
                    }}
                  />
                )}

                {/* Node Anchor */}
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isHighlighted ? "6" : "4.5"} 
                  fill={color} 
                  className={cn(
                    "cursor-pointer hover:r-7 transition-all duration-200 shadow-md",
                    isCritical ? "animate-pulse" : ""
                  )}
                  onClick={() => onNodeSelect && onNodeSelect(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                />

                {/* Tactical visual crosshair for highlighted ones */}
                {isHighlighted && (
                  <g stroke={color} strokeWidth="0.5">
                    <line x1={node.x - 12} y1={node.y} x2={node.x + 12} y2={node.y} />
                    <line x1={node.x} y1={node.y - 12} x2={node.x} y2={node.y + 12} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip Card */}
      {hoveredNode && (
        <div 
          className="absolute z-20 pointer-events-none p-3 bg-slate-950/95 border border-slate-800 rounded shadow-xl font-mono text-[10px] w-64 space-y-1.5"
          style={{
            top: `${Math.min(350, Math.max(10, hoveredNode.y * zoom + pan.y - 80))}px`,
            left: `${Math.min(520, Math.max(10, hoveredNode.x * zoom + pan.x + 15))}px`
          }}
        >
          <div className="flex justify-between items-center border-b border-slate-900 pb-1">
            <span className="text-white font-bold">{hoveredNode.name}</span>
            <span className={cn(
              "px-1 rounded text-[8px] font-bold uppercase",
              hoveredNode.status === "critical" && "bg-danger/20 text-danger border border-danger/40",
              hoveredNode.status === "warning" && "bg-warning/20 text-warning border border-warning/40",
              hoveredNode.status === "healthy" && "bg-success/20 text-success border border-success/40"
            )}>
              {hoveredNode.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TYPE:</span>
            <span className="text-slate-300 uppercase">{hoveredNode.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">RISK INDEX:</span>
            <span className={cn(
              "font-bold",
              hoveredNode.riskScore > 75 ? "text-danger" : hoveredNode.riskScore > 40 ? "text-warning" : "text-success"
            )}>{hoveredNode.riskScore}%</span>
          </div>
          {hoveredNode.flowRate && (
            <div className="flex justify-between">
              <span className="text-slate-500">THROUGHPUT:</span>
              <span className="text-slate-300 font-bold">{hoveredNode.flowRate}</span>
            </div>
          )}
          <p className="text-[9px] text-slate-400 border-t border-slate-900 pt-1 leading-normal italic">
            {hoveredNode.notes}
          </p>
        </div>
      )}
    </div>
  );
}
