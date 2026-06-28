"use client";

import React, { useState, useMemo, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  Truck, 
  Filter, 
  Compass, 
  AlertTriangle, 
  Award,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Procurement() {
  const [regionFilter, setRegionFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(85);
  const [minStability, setMinStability] = useState(40);
  const [selectedRoute, setSelectedRoute] = useState("route-0"); // First route selected

  // API data states
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [digitalTwinNodes, setDigitalTwinNodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcurementData = async () => {
    setError(null);
    try {
      const [suppliersRes, twinRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/suppliers`),
        fetch(`${API_BASE_URL}/api/digital-twin`)
      ]);
      if (!suppliersRes.ok) {
        throw new Error(`HTTP error ${suppliersRes.status}`);
      }
      if (!twinRes.ok) {
        throw new Error(`HTTP error ${twinRes.status}`);
      }
      const [suppliersData, twinData] = await Promise.all([
        suppliersRes.json(),
        twinRes.json()
      ]);
      setSuppliers(suppliersData);
      setDigitalTwinNodes(twinData.nodes || []);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Failed to establish secure link with procurement systems.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProcurementData();
    const interval = setInterval(fetchProcurementData, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  // Dynamic routes risk evaluation
  const routesData = useMemo(() => {
    const redSeaNode = digitalTwinNodes.find(n => n.id === "node-cor-2");
    const redSeaRisk = redSeaNode?.details.riskScore || 45;
    
    return [
      {
        name: "Suez Canal Transit (Normal Route)",
        distanceKm: 11500,
        durationDays: 14,
        riskScore: Math.round(redSeaRisk),
        insurancePremiumDelta: Math.round(redSeaRisk * 1.8),
        fuelCostDelta: 0,
        chokepoints: ["Bab-el-Mandeb Strait", "Suez Canal"]
      },
      {
        name: "Cape of Good Hope Bypass (Alternative Route)",
        distanceKm: 19800,
        durationDays: 26,
        riskScore: 10,
        insurancePremiumDelta: -20,
        fuelCostDelta: 45,
        chokepoints: ["None (Open Ocean)"]
      },
      {
        name: "Northern Sea Route (NSR)",
        distanceKm: 8500,
        durationDays: 11,
        riskScore: 60,
        insurancePremiumDelta: 200,
        fuelCostDelta: -15,
        chokepoints: ["Bering Strait", "Arctic Ice Fields"]
      }
    ];
  }, [digitalTwinNodes]);

  // Supplier filtering logic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const isMiddleEast = s.country === "Saudi Arabia" || s.country === "United Arab Emirates" || s.country === "Iraq";
      const isAtlantic = s.country === "Brazil" || s.country === "Norway";
      const isAfrica = s.country === "Nigeria";
      
      if (regionFilter === "mid-east" && !isMiddleEast) return false;
      if (regionFilter === "atlantic" && !isAtlantic) return false;
      if (regionFilter === "africa" && !isAfrica) return false;
      if (s.basePricePerBarrel > maxPrice) return false;
      if (s.politicalStabilityScore < minStability) return false;
      return true;
    });
  }, [suppliers, regionFilter, maxPrice, minStability]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return suppliers.map(s => ({
      name: s.name.split(" ")[0],
      "Reliability Rating": s.reliabilityRating,
      "Risk Score": s.riskScore
    }));
  }, [suppliers]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-slate-900 bg-slate-950/40 rounded-lg font-mono text-xs">
        <Activity className="h-8 w-8 text-accent animate-pulse mb-4" />
        <span className="text-slate-400 font-bold tracking-wider">GEOPULSE TACTICAL OVERLINK SYNCHRONIZING...</span>
        <span className="text-[10px] text-slate-600 mt-1">Establishing link secure channels with procurement intelligence hub</span>
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
          onClick={fetchProcurementData}
          className="px-4 py-2 bg-danger/25 text-danger border border-danger/40 hover:bg-danger/40 rounded uppercase font-bold tracking-widest cursor-pointer transition-all"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative z-10 font-sans">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-accent" />
            Procurement Intelligence & Supplier Hub
          </h1>
          <p className="text-xs text-slate-400">
            Compare alternative suppliers, calculate route risks, and evaluate shipping cost premiums.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters + Supplier Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-6 self-start">
          <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-accent" /> Filter Suppliers
          </h2>

          {/* Region filter */}
          <div className="space-y-1.5 font-mono text-[10px]">
            <label className="text-slate-400 uppercase font-semibold">Origin Region</label>
            <div className="space-y-1 pt-1 text-xs">
              {[
                { id: "all", name: "All Regions" },
                { id: "mid-east", name: "Middle East" },
                { id: "atlantic", name: "Atlantic / Europe" },
                { id: "africa", name: "Africa" }
              ].map((r) => (
                <div 
                  key={r.id}
                  onClick={() => setRegionFilter(r.id)}
                  className={cn(
                    "px-2.5 py-1.5 border rounded cursor-pointer transition-colors",
                    regionFilter === r.id 
                      ? "bg-accent/15 border-accent text-white font-bold" 
                      : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300"
                  )}
                >
                  {r.name}
                </div>
              ))}
            </div>
          </div>

          {/* Max barrel price filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
              <span>Max Price / Barrel</span>
              <span className="text-white font-bold">${maxPrice} USD</span>
            </div>
            <input 
              type="range" 
              min="60" 
              max="90" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-600">
              <span>$60 BBL</span>
              <span>$75 BBL</span>
              <span>$90 BBL</span>
            </div>
          </div>

          {/* Political stability score threshold */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
              <span>Min Political Stability</span>
              <span className="text-white font-bold">{minStability}%</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="95" 
              value={minStability} 
              onChange={(e) => setMinStability(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-600">
              <span>30% RISK</span>
              <span>60% MODERATE</span>
              <span>95% PRISTINE</span>
            </div>
          </div>

        </div>

        {/* Supplier Ranking Table */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-3">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider pb-2 border-b border-slate-900">Alternative Supplier Matrix</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-slate-400 divide-y divide-slate-900">
                <thead>
                  <tr className="text-slate-500 pb-2">
                    <th className="py-2">SUPPLIER</th>
                    <th className="py-2">COUNTRY</th>
                    <th className="py-2">STABILITY</th>
                    <th className="py-2">BASE PRICE</th>
                    <th className="py-2 text-right">RISK SCORE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 font-bold text-white flex items-center gap-1.5">
                          {s.reliabilityRating > 90 && <Award className="h-3.5 w-3.5 text-accent" />}
                          {s.name}
                        </td>
                        <td className="py-3">{s.country}</td>
                        <td className={cn(
                          "py-3 font-bold",
                          s.politicalStabilityScore > 80 ? "text-success" : s.politicalStabilityScore > 50 ? "text-warning" : "text-danger"
                        )}>{s.politicalStabilityScore}%</td>
                        <td className="py-3 text-white font-bold">${s.basePricePerBarrel.toFixed(2)}/bbl</td>
                        <td className={cn(
                          "py-3 text-right font-bold",
                          s.riskScore > 70 ? "text-danger" : s.riskScore > 35 ? "text-warning" : "text-success"
                        )}>{s.riskScore}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-600 uppercase">
                        No suppliers match current filter threshold parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Route Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Supplier Reliability Graph */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Reliability vs Risk Profile</h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontFamily: "monospace", fontSize: "11px" }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "10px" }} />
                <Bar name="Reliability Score" dataKey="Reliability Rating" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar name="Risk Factor %" dataKey="Risk Score" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Comparison HUD */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
            <Compass className="h-4.5 w-4.5 text-accent" /> Shipping Corridor Routing Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Route links */}
            <div className="md:col-span-1 space-y-2 font-mono text-[10px]">
              {routesData.map((route, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRoute(`route-${i}`)}
                  className={cn(
                    "p-2.5 border rounded cursor-pointer transition-colors block text-left",
                    selectedRoute === `route-${i}`
                      ? "bg-accent/15 border-accent text-white"
                      : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300"
                  )}
                >
                  <div className="font-bold truncate">{route.name.split(" (")[0]}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5">CHOKEPOINTS: {route.chokepoints.length}</div>
                </div>
              ))}
            </div>

            {/* Route Stats */}
            {(() => {
              const idx = parseInt(selectedRoute.split("-")[1]);
              const r = routesData[idx];
              return (
                <div className="md:col-span-2 p-4 bg-slate-900/40 border border-slate-800 rounded-lg font-mono text-xs space-y-3">
                  <div className="flex justify-between items-center text-slate-300 font-bold uppercase border-b border-slate-800 pb-1.5">
                    <span>{r.name}</span>
                    <span className={cn(
                      "px-1 py-0.5 rounded text-[9px]",
                      r.riskScore > 60 ? "bg-danger/20 text-danger border border-danger/40" : "bg-success/20 text-success border border-success/40"
                    )}>
                      {r.riskScore > 60 ? "CRITICAL RISK" : "SECURE CORRIDOR"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 text-[10px]">TRANSIT DISTANCE:</span>
                      <div className="text-white font-bold">{r.distanceKm.toLocaleString()} KM</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">DURATION (DAYS):</span>
                      <div className="text-white font-bold">{r.durationDays} Days</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">INSURANCE RISK PREMIUM:</span>
                      <div className="text-danger font-bold">{r.insurancePremiumDelta > 0 ? `+${r.insurancePremiumDelta}%` : `${r.insurancePremiumDelta}%`}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">ADDITIONAL FUEL COST:</span>
                      <div className="text-warning font-bold">{r.fuelCostDelta > 0 ? `+${r.fuelCostDelta}%` : `0%`}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block mb-1">CONGESTION CHOKEPOINTS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.chokepoints.map((cp, j) => (
                        <span key={j} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-[9px] text-white">
                          {cp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>

      </div>

    </div>
  );
}
