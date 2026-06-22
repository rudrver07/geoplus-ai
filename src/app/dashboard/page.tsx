"use client";

import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Compass, 
  DollarSign, 
  Layers, 
  Clock, 
  PlusCircle, 
  AlertTriangle,
  ExternalLink,
  Radio
} from "lucide-react";
import VectorMap from "@/components/map/VectorMap";
import { 
  alertsData, 
  incidentsData, 
  commodityPrices, 
  threatRegions, 
  criticalCorridors 
} from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "risk" | "shipping" | "market" | "feed" | "live-news">("overview");
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);

  // Live News State
  const [searchQueryNews, setSearchQueryNews] = useState("oil shipping geopolitics chokepoint");
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const fetchLiveNews = async (query: string) => {
    setIsLoadingNews(true);
    setNewsError(null);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to load news");
      const data = await res.json();
      setLiveNews(data);
    } catch (e: any) {
      setNewsError(e.message || "Failed to load live feeds");
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    if (activeTab === "live-news" && liveNews.length === 0) {
      fetchLiveNews(searchQueryNews);
    }
  }, [activeTab]);

  // Top Metrics calculation
  const metrics = [
    {
      title: "Global Risk Index",
      value: "74.8",
      delta: "+5.2%",
      isRed: true,
      desc: "Escalating Red Sea and Strait of Hormuz alerts",
      icon: ShieldAlert
    },
    {
      title: "National Supply Risk",
      value: "42.0%",
      delta: "-1.8%",
      isRed: false,
      desc: "Buffer stock levels stable at 18 days demand",
      icon: Activity
    },
    {
      title: "Shipping Disruption Risk",
      value: "86.5",
      delta: "+12.4%",
      isRed: true,
      desc: "Suez bypass rate hitting all-time high of 78%",
      icon: Compass
    },
    {
      title: "Oil Price Volatility",
      value: "32.4%",
      delta: "+4.1%",
      isRed: true,
      desc: "Imminent OPEC production quota meetings",
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-6 relative z-10">
      
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-accent" />
            Tactical Operations Console
          </h1>
          <p className="text-xs text-slate-400">
            Real-time geopolitical signal evaluation and national reserve supply analysis.
          </p>
        </div>
        
        {/* Connection status tag */}
        <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-900 border border-slate-800 rounded px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          NODE-IND-MUM: SECURE LINK ACTIVE
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-lg space-y-2 relative overflow-hidden transition-all">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono uppercase tracking-wider">{m.title}</span>
                <Icon className={cn("h-4 w-4", m.isRed ? "text-danger" : "text-success")} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-mono">{m.value}</span>
                <span className={cn(
                  "text-[10px] font-bold font-mono",
                  m.isRed ? "text-danger" : "text-success"
                )}>
                  {m.delta}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-900 text-xs font-mono overflow-x-auto whitespace-nowrap">
        {[
          { id: "overview", name: "Overview" },
          { id: "risk", name: "Risk Analytics" },
          { id: "shipping", name: "Shipping Intelligence" },
          { id: "market", name: "Market Signals" },
          { id: "feed", name: "Geopolitical Feed" },
          { id: "live-news", name: "Live News Terminal" }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 border-b-2 font-semibold -mb-[2px] transition-all cursor-pointer",
                isActive 
                  ? "border-accent text-white bg-slate-900/20 font-bold" 
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* World Map Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono text-slate-400 font-bold uppercase tracking-wider">Live Shipping Risks Overlay</h2>
              {selectedMapNode && (
                <button 
                  onClick={() => setSelectedMapNode(null)} 
                  className="text-[10px] font-mono text-slate-500 hover:text-white"
                >
                  Clear Selection [x]
                </button>
              )}
            </div>
            <VectorMap 
              onNodeSelect={(node) => setSelectedMapNode(node)} 
              activeNodeId={selectedMapNode?.id} 
            />
            
            {/* Map node selected details */}
            {selectedMapNode && (
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 font-bold uppercase">
                  <span>Selected Node: {selectedMapNode.name}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px]",
                    selectedMapNode.status === "critical" && "bg-danger/20 text-danger",
                    selectedMapNode.status === "warning" && "bg-warning/20 text-warning",
                    selectedMapNode.status === "healthy" && "bg-success/20 text-success"
                  )}>{selectedMapNode.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/60">
                  <div>
                    <div className="text-slate-500 text-[10px]">FLOW CAPACITY:</div>
                    <div className="text-white font-bold">{selectedMapNode.flowRate || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">LOCAL RISK SCORE:</div>
                    <div className="text-white font-bold">{selectedMapNode.riskScore}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">COORDS:</div>
                    <div className="text-white font-bold">{selectedMapNode.x}°N, {selectedMapNode.y}°E</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">STABILITY:</div>
                    <div className="text-white font-bold">STABLE PROFILE</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar components */}
          <div className="space-y-6">
            {/* Live Alerts feed */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-4">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider border-b border-slate-900 pb-2 flex justify-between items-center">
                <span>Critical Incident Feed</span>
                <span className="h-1.5 w-1.5 rounded-full bg-danger animate-ping"></span>
              </h3>
              
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="p-3 bg-slate-900/40 border border-slate-800/60 rounded hover:border-slate-800 transition-colors space-y-1.5">
                    <div className="flex justify-between items-center font-mono text-[9px]">
                      <span className={cn(
                        "px-1 rounded font-bold uppercase",
                        alert.severity === "critical" && "bg-danger/25 text-danger border border-danger/30",
                        alert.severity === "high" && "bg-warning/25 text-warning border border-warning/30",
                        alert.severity === "medium" && "bg-primary/25 text-primary border border-primary/30",
                        alert.severity === "low" && "bg-slate-800 text-slate-400"
                      )}>{alert.severity}</span>
                      <span className="text-slate-500">{alert.timestamp}</span>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-200">{alert.headline}</h4>
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>REGION: <span className="text-white font-semibold">{alert.region}</span></span>
                      <span>IMPACT: {alert.impactScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "risk" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Line Chart */}
          <div className="lg:col-span-2 bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Geopolitical Risk index timeline</h3>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commodityPrices}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontFamily: "monospace", fontSize: "11px" }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Line name="Aggregate Chokepoint Risk Index" type="monotone" dataKey="brentOil" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top threat regions table */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Top Threat Regions Matrix</h3>
            
            <div className="divide-y divide-slate-900">
              {threatRegions.map((region, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">{region.name}</div>
                    <div className="text-[9px] font-mono text-slate-500">ACTIVE THREATS: {region.activeThreats}</div>
                  </div>
                  <div className="text-right space-y-0.5 font-mono">
                    <div className={cn(
                      "font-bold",
                      region.riskIndex > 75 ? "text-danger" : region.riskIndex > 40 ? "text-warning" : "text-success"
                    )}>{region.riskIndex}% RISK</div>
                    <div className="text-[8px] text-slate-500 uppercase">VULNERABILITY: {region.vulnerabilityFactor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "shipping" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Shipping Congestion Bar Chart */}
            <div className="lg:col-span-2 bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Corridor Congestion & Flow Matrix</h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={criticalCorridors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontFamily: "monospace", fontSize: "11px" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                    <Bar name="Throughput (M bpd)" dataKey="dailyFlowMillionBarrels" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    <Bar name="Congestion Index %" dataKey="congestionIndex" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical Corridors Status */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Critical Corridors Standings</h3>
              <div className="space-y-3 font-mono">
                {criticalCorridors.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-900/20 border border-slate-900 rounded space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-white">{c.name}</span>
                      <span className={cn(
                        "text-[9px] uppercase px-1 rounded",
                        c.status === "critical" && "bg-danger/25 text-danger border border-danger/30",
                        c.status === "warning" && "bg-warning/25 text-warning border border-warning/30",
                        c.status === "healthy" && "bg-success/25 text-success border border-success/30"
                      )}>{c.status}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>DAILY FLOW: {c.dailyFlowMillionBarrels}M bpd</span>
                      <span>RISK INDEX: {c.currentRiskScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Incidents Table */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Recent Incidents Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-slate-400 divide-y divide-slate-900">
                <thead>
                  <tr className="text-slate-500 pb-2">
                    <th className="py-2">LOCATION</th>
                    <th className="py-2">INCIDENT TYPE</th>
                    <th className="py-2">IMPACT SCENARIO</th>
                    <th className="py-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {incidentsData.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 font-bold text-white">{inc.location}</td>
                      <td className="py-3 text-accent">{inc.type}</td>
                      <td className="py-3">{inc.impact}</td>
                      <td className="py-3">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                          inc.status === "active" && "bg-danger/20 text-danger border border-danger/40",
                          inc.status === "monitored" && "bg-warning/20 text-warning border border-warning/40",
                          inc.status === "resolved" && "bg-success/20 text-success border border-success/40"
                        )}>{inc.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "market" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commodity Price Area Chart */}
          <div className="lg:col-span-2 bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Energy Price Volatility Index</h3>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={commodityPrices}>
                  <defs>
                    <linearGradient id="brentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="lngGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", fontFamily: "monospace", fontSize: "11px" }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                  <Area name="Brent Crude Oil ($/bbl)" type="monotone" dataKey="brentOil" stroke="#2563EB" fillOpacity={1} fill="url(#brentGrad)" strokeWidth={1.5} />
                  <Area name="LNG Natural Gas ($/MMBtu)" type="monotone" dataKey="lngNaturalGas" stroke="#06B6D4" fillOpacity={1} fill="url(#lngGrad)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pricing Standings Card */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Spot Price Overview</h3>
            
            <div className="space-y-4 font-mono">
              <div className="p-3 bg-slate-900/30 border border-slate-900 rounded space-y-1">
                <div className="text-[10px] text-slate-500">BRENT SPOT CRUDE</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-bold text-white">$86.20</span>
                  <span className="text-xs font-bold text-emerald-500">+1.43%</span>
                </div>
                <p className="text-[9px] text-slate-500">Premium pricing due to Red Sea chokepoint rerouting.</p>
              </div>

              <div className="p-3 bg-slate-900/30 border border-slate-900 rounded space-y-1">
                <div className="text-[10px] text-slate-500">WTI SPOT CRUDE</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-bold text-white">$82.50</span>
                  <span className="text-xs font-bold text-emerald-500">+1.12%</span>
                </div>
                <p className="text-[9px] text-slate-500">West Texas Intermediate price tracks Brent benchmark.</p>
              </div>

              <div className="p-3 bg-slate-900/30 border border-slate-900 rounded space-y-1">
                <div className="text-[10px] text-slate-500">LNG NATURAL GAS</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-bold text-white">$12.10</span>
                  <span className="text-xs font-bold text-danger">-0.38%</span>
                </div>
                <p className="text-[9px] text-slate-500">Natural gas stockpiles robust in European depots.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "feed" && (
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-6 space-y-4 max-w-4xl mx-auto">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider border-b border-slate-900 pb-3 flex justify-between items-center">
            <span>Intelligence Operations Feed</span>
            <span className="text-[10px] font-normal text-slate-500">TOTAL LOGS: {alertsData.length}</span>
          </h3>

          <div className="space-y-4">
            {alertsData.map((alert) => (
              <div key={alert.id} className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg hover:border-slate-800 transition-colors flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded border shrink-0 mt-0.5",
                  alert.severity === "critical" && "bg-danger/10 border-danger/30 text-danger",
                  alert.severity === "high" && "bg-warning/10 border-warning/30 text-warning",
                  alert.severity === "medium" && "bg-primary/10 border-primary/30 text-primary",
                  alert.severity === "low" && "bg-slate-800 border-slate-700 text-slate-400"
                )}>
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 space-y-1 font-mono text-xs">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-slate-400 font-bold">[{alert.source}]</span>
                    <span className="text-slate-500 text-[10px]">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{alert.headline}</h4>
                  <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 border-t border-slate-900 mt-2">
                    <span>SECTOR: <span className="text-slate-300 font-semibold">{alert.category.toUpperCase()}</span></span>
                    <span>REGION: <span className="text-white font-semibold">{alert.region}</span></span>
                    <span>THREAT INDEX: <span className="text-danger font-semibold">{alert.impactScore}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "live-news" && (
        <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-6 space-y-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <span>Live Google News Feed</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">REAL-TIME GOOGLE SEARCH</span>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 font-mono">
            <input 
              type="text" 
              value={searchQueryNews}
              onChange={(e) => setSearchQueryNews(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLiveNews(searchQueryNews)}
              placeholder="Search specific topic (e.g. Strait of Hormuz, tanker attack)..."
              className="flex-1 bg-slate-950 border border-slate-900 focus:border-accent text-white text-xs rounded px-3 py-2 outline-none"
            />
            <button
              onClick={() => fetchLiveNews(searchQueryNews)}
              className="px-4 py-2 bg-accent text-slate-950 font-bold text-xs rounded hover:bg-accent/80 transition-colors cursor-pointer"
            >
              SEARCH
            </button>
          </div>

          {/* Loading and Error states */}
          {isLoadingNews && (
            <div className="py-12 text-center text-slate-500 font-mono text-xs animate-pulse">
              Synthesizing feeds directly from Google News registry...
            </div>
          )}

          {newsError && (
            <div className="p-4 bg-danger/10 border border-danger/30 text-danger text-xs font-mono rounded text-center">
              ERROR: {newsError}. Verify local server connection status.
            </div>
          )}

          {/* News items list */}
          {!isLoadingNews && !newsError && (
            <div className="space-y-4">
              {liveNews.length > 0 ? (
                liveNews.map((article: any) => (
                  <div key={article.id} className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg hover:border-slate-800 transition-colors flex items-start gap-4">
                    <div className="p-2 rounded border shrink-0 mt-0.5 bg-accent/10 border-accent/20 text-accent">
                      <Radio className="h-4.5 w-4.5 animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-1 font-mono text-xs">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-slate-400 font-bold">[{article.source}]</span>
                        <span className="text-slate-500 text-[10px]">{article.timestamp} ({new Date(article.pubDate).toLocaleTimeString()})</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{article.title}</h4>
                      <div className="pt-2 flex justify-end">
                        <a 
                          href={article.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-white underline text-[9px] flex items-center gap-1"
                        >
                          READ SOURCE ARTICLE <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-600 font-mono text-xs uppercase">
                  No live news reports found for current query.
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
