"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, ShieldAlert, Cpu, RefreshCw, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";

export default function Navbar() {
  const [livePrices, setLivePrices] = useState({ brentOil: 86.20, wtiOil: 82.50, lngNaturalGas: 12.10 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    const fetchPricesAndAlerts = async () => {
      setIsUpdating(true);
      try {
        const pricesRes = await fetch(`${API_BASE_URL}/api/commodity-feed`);
        if (!pricesRes.ok) {
          throw new Error(`HTTP error ${pricesRes.status}`);
        }
        const pricesData = await pricesRes.json();
        if (pricesData && pricesData.length > 0) {
          setLivePrices(pricesData[pricesData.length - 1]);
        }
        
        const intelRes = await fetch(`${API_BASE_URL}/api/crisis-intelligence`);
        if (!intelRes.ok) {
          throw new Error(`HTTP error ${intelRes.status}`);
        }
        const intelData = await intelRes.json();
        const criticalCount = intelData.filter((a: any) => a.severity === "critical" || a.severity === "high").length;
        setActiveAlerts(criticalCount);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setTimeout(() => setIsUpdating(false), 800);
      }
    };

    fetchPricesAndAlerts();
    const interval = setInterval(fetchPricesAndAlerts, 300000); // 5 minutes refresh

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 select-none">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative flex items-center justify-center h-8 w-8 rounded border border-accent/60 bg-accent/10">
          <Activity className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -inset-0.5 rounded bg-accent/20 blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
        </div>
        <span className="text-sm font-bold tracking-wider text-white">
          GEOPULSE<span className="text-accent text-[11px] font-mono ml-1 px-1 bg-accent/20 rounded">AI</span>
        </span>
      </Link>

      {/* Ticker Section */}
      <div className="hidden md:flex items-center gap-6 text-xs font-mono bg-slate-900/40 border border-slate-800/80 rounded px-4 py-1.5 overflow-hidden">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold border-r border-slate-800 pr-3 mr-1">
          <BarChart2 className="h-3.5 w-3.5 text-accent" />
          COMMODITY FEED:
        </div>

        {/* Brent Crude */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">BRENT CRUDE</span>
          <motion.span 
            animate={{ color: isUpdating ? "#06B6D4" : "#ffffff" }}
            className="text-white font-bold"
          >
            ${livePrices.brentOil.toFixed(2)}
          </motion.span>
          <span className="text-emerald-500 font-semibold text-[10px]">+1.4%</span>
        </div>

        {/* WTI Crude */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <span className="text-slate-400">WTI CRUDE</span>
          <motion.span
            animate={{ color: isUpdating ? "#06B6D4" : "#ffffff" }}
            className="text-white font-bold"
          >
            ${livePrices.wtiOil.toFixed(2)}
          </motion.span>
          <span className="text-emerald-500 font-semibold text-[10px]">+1.1%</span>
        </div>

        {/* LNG */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <span className="text-slate-400">LNG GAS</span>
          <motion.span
            animate={{ color: isUpdating ? "#06B6D4" : "#ffffff" }}
            className="text-white font-bold"
          >
            ${livePrices.lngNaturalGas.toFixed(2)}
          </motion.span>
          <span className="text-danger font-semibold text-[10px]">-0.4%</span>
        </div>

        {/* Live Pulse */}
        <div className="flex items-center gap-1 pl-2">
          <RefreshCw className={`h-3 w-3 text-accent ${isUpdating ? "animate-spin" : "opacity-40"}`} />
        </div>
      </div>

      {/* Security Status Panel */}
      <div className="flex items-center gap-4">
        {/* Risk Level */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-danger/10 border border-danger/30 text-danger text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
          <ShieldAlert className="h-3 w.3" />
          CRISIS LEVEL: STAGE III
        </div>

        {/* Alerts Badge */}
        <Link href="/dashboard" className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded border border-transparent hover:border-slate-800 transition-all duration-200">
          <ShieldAlert className="h-4.5 w-4.5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white leading-none">
              {activeAlerts}
            </span>
          )}
        </Link>

        {/* Processing Core Indicator */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <Cpu className="h-4 w-4 text-emerald-500" />
          <div className="hidden sm:block text-left text-[9px] font-mono leading-none">
            <div className="text-white font-bold uppercase">SECURE ENGINE</div>
            <div className="text-slate-500">PING: 14ms</div>
          </div>
        </div>
      </div>
    </header>
  );
}
