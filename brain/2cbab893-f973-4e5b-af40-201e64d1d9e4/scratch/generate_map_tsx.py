import re

src_svg = r"c:\Users\YASH SAHU\Desktop\geoplus ai\public\world.svg"
dest_tsx = r"c:\Users\YASH SAHU\Desktop\geoplus ai\src\components\map\VectorMap.tsx"

with open(src_svg, "r", encoding="utf-8") as f:
    svg_content = f.read()

# Match paths and extract d, id, and title
path_blocks = re.findall(r'<path\s+[^>]+>', svg_content, re.IGNORECASE | re.DOTALL)
extracted_paths = []
for block in path_blocks:
    d_match = re.search(r'd\s*=\s*"([^"]+)"', block, re.IGNORECASE | re.DOTALL)
    id_match = re.search(r'id\s*=\s*"([^"]+)"', block, re.IGNORECASE)
    title_match = re.search(r'title\s*=\s*"([^"]+)"', block, re.IGNORECASE)
    
    if d_match:
        d_val = d_match.group(1).strip()
        id_val = id_match.group(1).strip() if id_match else ""
        title_val = title_match.group(1).strip() if title_match else ""
        extracted_paths.append({
            "id": id_val,
            "title": title_val.replace('"', '\\"'),
            "d": d_val
        })

print(f"Extracted {len(extracted_paths)} paths.")

# Build the countries path JSX string
path_jsx = ""
for ep in extracted_paths:
    path_jsx += f'          <path\n            key="{ep["id"]}"\n            id="{ep["id"]}"\n            title="{ep["title"]}"\n            d="{ep["d"]}"\n            fill="rgba(15, 23, 42, 0.6)"\n            stroke="rgba(30, 41, 59, 0.8)"\n            strokeWidth="0.5"\n          />\n'

# Raw string template containing the component code
template = """"use client";

import React, { useState } from "react";
import { Radio, ZoomIn, ZoomOut } from "lucide-react";
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
    { id: "map-saudi", name: "Saudi Arabia (Aramco)", type: "source", x: 618, y: 382, riskScore: 28, status: "healthy", flowRate: "8.5M bpd", notes: "Core supplier loading point." },
    { id: "map-uae", name: "Abu Dhabi Port", type: "source", x: 632, y: 388, riskScore: 22, status: "healthy", flowRate: "3.2M bpd", notes: "Hormuz-bypass pipeline connection." },
    { id: "map-hormuz", name: "Strait of Hormuz", type: "chokepoint", x: 638, y: 374, riskScore: 92, status: "critical", flowRate: "20.8M bpd", notes: "Critical chokepoint. Heightened drone/naval activity." },
    { id: "map-bab", name: "Bab-el-Mandeb Strait", type: "chokepoint", x: 605, y: 422, riskScore: 87, status: "critical", flowRate: "8.8M bpd", notes: "Houthi drone threats. 70% tanker bypass active." },
    { id: "map-suez", name: "Suez Canal Corridor", type: "chokepoint", x: 585, y: 350, riskScore: 65, status: "warning", flowRate: "9.2M bpd", notes: "Bottlenecked due to southern Red Sea reroutings." },
    { id: "map-cape", name: "Cape of Good Hope Bypass", type: "chokepoint", x: 550, y: 555, riskScore: 10, status: "healthy", flowRate: "14.5M bpd", notes: "Safe open-ocean path. Adds 10-14 transit days." },
    { id: "map-jamnagar", name: "Jamnagar Port (Gujarat)", type: "port", x: 712, y: 395, riskScore: 35, status: "healthy", flowRate: "Refinery: 1.2M bpd", notes: "World's largest refining complex offloading." },
    { id: "map-kochi", name: "Kochi Refinery Port", type: "port", x: 730, y: 432, riskScore: 68, status: "warning", flowRate: "Refinery: 310k bpd", notes: "Delayed supply arrivals from Suez route." },
    { id: "map-malacca", name: "Malacca Strait", type: "chokepoint", x: 785, y: 455, riskScore: 48, status: "warning", flowRate: "16.0M bpd", notes: "Piracy warnings. High merchant density." }
  ];

  const routes: MapRoute[] = [
    { id: "route-hormuz-jamnagar", name: "Hormuz Core Route", path: "M 632 388 Q 672 390 712 395", status: "healthy" },
    { id: "route-redsea-kochi", name: "Suez Red Sea Channel", path: "M 585 350 Q 595 385 605 422 T 667 428 Q 698 430 730 432", status: "critical" },
    { id: "route-cape-kochi", name: "Atlantic Cape Route", path: "M 585 350 Q 520 450 550 555 T 670 495 Q 700 460 730 432", status: "healthy", isAlternative: true }
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
    <div className="relative w-full h-[500px] bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden select-none">
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
          viewBox="0 0 1010 666"
        >
          {/* Tactical Grid Overlay */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Correct Real-world SVG Continents & Countries */}
__PATH_JSX__

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
            top: `${Math.min(500, Math.max(10, hoveredNode.y * zoom + pan.y - 80))}px`,
            left: `${Math.min(750, Math.max(10, hoveredNode.x * zoom + pan.x + 15))}px`
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
"""

# Render final TSX content
tsx_code = template.replace("__PATH_JSX__", path_jsx)

# Write out the generated TSX file
with open(dest_tsx, "w", encoding="utf-8") as f:
    f.write(tsx_code)

print(f"React component TSX file successfully written to {dest_tsx}!")
