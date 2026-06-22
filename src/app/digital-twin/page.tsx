"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Search, 
  Settings2, 
  Activity, 
  TrendingUp, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut,
  Info,
  CheckCircle,
  AlertTriangle,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { networkNodes, networkEdges } from "@/data/mockData";

export default function DigitalTwin() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeType, setSelectedNodeType] = useState("all");
  const [selectedNode, setSelectedNode] = useState<any>(networkNodes[0]);
  const [isPropagating, setIsPropagating] = useState(false);
  const [propagationStep, setPropagationStep] = useState(0);

  // Filter nodes based on search and type dropdown
  const filteredNodes = useMemo(() => {
    return networkNodes.filter((node) => {
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedNodeType === "all" || node.type === selectedNodeType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedNodeType]);

  // Handle zoom modifiers
  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.6, Math.min(2.5, prev * factor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Run or Pause Risk Propagation simulation
  const toggleRiskPropagation = () => {
    if (isPropagating) {
      setIsPropagating(false);
      setPropagationStep(0);
    } else {
      setIsPropagating(true);
      setPropagationStep(1);

      // Chronological propagation timer
      let step = 1;
      const interval = setInterval(() => {
        step += 1;
        setPropagationStep(step);
        if (step > 4) {
          clearInterval(interval);
          setIsPropagating(false);
        }
      }, 3000);
    }
  };

  // Helper to determine active node status under propagation state
  const getNodeStatus = (node: any) => {
    if (!isPropagating || propagationStep === 0) return node.status;
    
    // Disruption triggers at Bab-el-Mandeb (node-cor-2)
    if (node.id === "node-cor-2" && propagationStep >= 1) return "critical";
    // Disruption flows to Kochi Port (node-port-3)
    if (node.id === "node-port-3" && propagationStep >= 2) return "critical";
    // Flows to BPCL Kochi Refinery (node-ref-3)
    if (node.id === "node-ref-3" && propagationStep >= 3) return "critical";
    // Flows to Southern Power Grid (node-dist-3)
    if (node.id === "node-dist-3" && propagationStep >= 4) return "critical";

    return node.status;
  };

  return (
    <div className="space-y-6 relative z-10 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-6 w-6 text-accent" />
            National Energy Supply Chain Digital Twin
          </h1>
          <p className="text-xs text-slate-400">
            Interactive topological flow graph representing sources, shipping corridors, refineries, and grids.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-950/40 border border-slate-900 rounded-lg">
        
        {/* Node Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search nodes (e.g., Jamnagar, Kochi, Saudi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-xs rounded pl-9 pr-3 py-2 outline-none focus:border-accent"
          />
        </div>

        {/* Node Type filter */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase shrink-0">TYPE:</label>
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs rounded p-2 outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="source">Sources</option>
            <option value="corridor">Corridors</option>
            <option value="port">Ports</option>
            <option value="refinery">Refineries</option>
            <option value="distribution">Distribution</option>
          </select>
        </div>

        {/* Risk propagation toggle */}
        <button
          onClick={toggleRiskPropagation}
          className={cn(
            "px-4 py-2 border rounded text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer",
            isPropagating 
              ? "bg-danger/25 border-danger text-danger animate-pulse" 
              : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          )}
        >
          {isPropagating ? (
            <>
              <Pause className="h-4.5 w-4.5" /> STOP PROPAGATION SIM
            </>
          ) : (
            <>
              <Play className="h-4.5 w-4.5 text-accent" /> PROPAGATE RED SEA RISK
            </>
          )}
        </button>

      </div>

      {/* Network Canvas + Info drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Canvas area */}
        <div className="lg:col-span-3 h-[500px] bg-slate-950/80 border border-slate-900 rounded-lg overflow-hidden relative">
          
          {/* Legend and zoom keys */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-slate-500 space-y-1 bg-slate-950/80 border border-slate-900 rounded p-2.5">
            <div className="font-bold text-slate-300 uppercase mb-1">Grid Legend</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success"></span> HEALTHY SUPPLY</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning"></span> DELAY IN TRANSIT</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger"></span> SUPPLY STOCK DEPLETING</div>
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
              className="px-2 py-1.5 text-[10px] font-mono bg-slate-900 border border-slate-800 hover:border-accent rounded transition-all"
            >
              RESET
            </button>
          </div>

          {/* SVG Network Graph */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <svg 
              className="w-full h-full"
              viewBox="0 0 1000 550"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center"
              }}
            >
              {/* Grid Background */}
              <rect width="100%" height="100%" fill="none" />

              {/* Draw Edges */}
              {networkEdges.map((edge) => {
                const sourceNode = networkNodes.find(n => n.id === edge.source);
                const targetNode = networkNodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;

                // Propagated edge status check
                let edgeStatus = edge.status;
                if (isPropagating) {
                  const isRedSeaLink = edge.source === "node-cor-2" && edge.target === "node-port-3";
                  const isKochiPortLink = edge.source === "node-port-3" && edge.target === "node-ref-3";
                  const isKochiRefineryLink = edge.source === "node-ref-3" && edge.target === "node-dist-3";

                  if (isRedSeaLink && propagationStep >= 2) edgeStatus = "critical";
                  if (isKochiPortLink && propagationStep >= 3) edgeStatus = "critical";
                  if (isKochiRefineryLink && propagationStep >= 4) edgeStatus = "critical";
                }

                const strokeColor = edgeStatus === "critical" 
                  ? "rgba(239, 68, 68, 0.7)" 
                  : edgeStatus === "warning" 
                    ? "rgba(245, 158, 11, 0.7)" 
                    : "rgba(37, 99, 235, 0.4)";

                return (
                  <g key={edge.id}>
                    {/* Path line */}
                    <line 
                      x1={sourceNode.x} 
                      y1={sourceNode.y} 
                      x2={targetNode.x} 
                      y2={targetNode.y} 
                      stroke={strokeColor} 
                      strokeWidth={edgeStatus === "critical" ? 2.5 : 1.5}
                      className={cn(edgeStatus === "critical" ? "animate-pulse" : "")}
                    />

                    {/* Flow pulse dot */}
                    <circle r="3.5" fill={edgeStatus === "critical" ? "#EF4444" : "#06B6D4"}>
                      <animateMotion 
                        path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`} 
                        dur={edgeStatus === "critical" ? "6s" : "3s"} 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {networkNodes.map((node) => {
                const status = getNodeStatus(node);
                const isSelected = selectedNode?.id === node.id;
                const isSearchMatch = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());

                let color = "rgba(16, 185, 129, 0.8)";
                if (status === "critical") color = "rgba(239, 68, 68, 0.8)";
                else if (status === "warning") color = "rgba(245, 158, 11, 0.8)";

                return (
                  <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                    {/* Outline indicator for selected or search matched */}
                    {(isSelected || isSearchMatch) && (
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r="14" 
                        fill="none" 
                        stroke={isSearchMatch ? "#06B6D4" : color} 
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}

                    {/* Base Node Circle */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={node.type === "corridor" || node.type === "port" ? "9" : "7.5"} 
                      fill={color} 
                    />

                    {/* Text Label */}
                    <text 
                      x={node.x} 
                      y={node.y - 15} 
                      textAnchor="middle" 
                      fill="#FFFFFF" 
                      fontSize="9" 
                      fontFamily="monospace"
                      fontWeight={isSelected ? "bold" : "normal"}
                      className="bg-slate-950"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>

        </div>

        {/* Node details sidebar panel */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-6">
          <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Settings2 className="h-4 w-4 text-accent" /> Telemetry Control Panel
          </h2>

          {selectedNode ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 font-bold uppercase border-b border-slate-800 pb-1.5">
                <span>{selectedNode.label}</span>
                <span className={cn(
                  "px-1 py-0.5 rounded text-[9px]",
                  getNodeStatus(selectedNode) === "critical" && "bg-danger/25 text-danger border border-danger/30",
                  getNodeStatus(selectedNode) === "warning" && "bg-warning/25 text-warning border border-warning/30",
                  getNodeStatus(selectedNode) === "healthy" && "bg-success/25 text-success border border-success/30"
                )}>{getNodeStatus(selectedNode)}</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">NODE TYPE:</span>
                  <span className="text-white uppercase font-bold">{selectedNode.type}</span>
                </div>
                {selectedNode.details.location && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">COORDINATES:</span>
                    <span className="text-white">{selectedNode.details.location}</span>
                  </div>
                )}
                {selectedNode.details.capacity && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">OPERATIONAL FLOW:</span>
                    <span className="text-white font-bold">{selectedNode.details.capacity}</span>
                  </div>
                )}
                {selectedNode.details.flowRate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">CONGESTION LEVEL:</span>
                    <span className="text-white font-bold">{selectedNode.details.flowRate}</span>
                  </div>
                )}
                {selectedNode.details.stockLevelPercent !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">STOCK VOLUME:</span>
                      <span className="text-white font-bold">{selectedNode.details.stockLevelPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded overflow-hidden p-0.5 border border-slate-800">
                      <div 
                        className={cn(
                          "h-full rounded-sm",
                          selectedNode.details.stockLevelPercent < 50 ? "bg-danger" : "bg-success"
                        )}
                        style={{ width: `${selectedNode.details.stockLevelPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Propagation telemetry display */}
              {isPropagating && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded text-[10px] space-y-1.5">
                  <div className="font-bold text-danger uppercase flex items-center gap-1">
                    <Flame className="h-3 w.3 animate-pulse" /> RISK DRAFT PROPAGATION ACTIVE
                  </div>
                  <p className="text-slate-400 leading-normal">
                    Bab-el-Mandeb blockade delaying tankers. Kochi port stock level falling below safe buffer thresholds. Refinery cuts throughput.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 font-mono text-xs text-slate-600 uppercase">
              Select a node on the network canvas map to read telemetry details.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
