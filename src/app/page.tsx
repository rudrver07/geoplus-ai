"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Truck, 
  Network, 
  TrendingUp, 
  Globe, 
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  Lock
} from "lucide-react";
import { alertsData } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Home() {
  const [currentAlertIdx, setCurrentAlertIdx] = useState(0);

  // Cycle floating alerts in the hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIdx((prev) => (prev + 1) % alertsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeAlert = alertsData[currentAlertIdx];

  const stats = [
    { label: "Countries Monitored", value: "128", icon: Globe },
    { label: "Active Shipping Routes", value: "42", icon: Truck },
    { label: "Global Risk Events Logged", value: "1,840+", icon: ShieldAlert },
    { label: "Prediction Accuracy", value: "98.4%", icon: TrendingUp },
  ];

  const features = [
    {
      title: "Live Risk Intelligence",
      description: "Continuous monitoring of global chokepoints, shipping lanes, and refinery reserves.",
      href: "/dashboard",
      icon: Activity,
      color: "text-accent"
    },
    {
      title: "Crisis Simulator",
      description: "Run synthetic scenarios like chokepoint closures to forecast economic and price impacts.",
      href: "/simulator",
      icon: ShieldAlert,
      color: "text-danger"
    },
    {
      title: "AI Decision Copilot",
      description: "LLM agent powered chat console with confidence scores and source citation panels.",
      href: "/copilot",
      icon: Terminal,
      color: "text-primary"
    },
    {
      title: "Procurement Intelligence",
      description: "Evaluate alternative suppliers dynamically based on price, stability, and routing metrics.",
      href: "/procurement",
      icon: Truck,
      color: "text-warning"
    },
    {
      title: "National Digital Twin",
      description: "Map and analyze supply chains from source country to regional pipelines.",
      href: "/digital-twin",
      icon: Network,
      color: "text-success"
    },
    {
      title: "War Room Mode",
      description: "Trigger real-time scenario playback with news alerts, pulsing red alerts, and dynamic action checklists.",
      href: "/war-room",
      icon: ShieldAlert,
      color: "text-danger",
      isHot: true
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden bg-cyber-grid bg-cyber-grid-fine">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Header / Top bar */}
      <header className="w-full h-16 flex items-center justify-between px-8 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-20">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded border border-accent bg-accent/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm font-bold tracking-wider">GEOPULSE <span className="text-accent font-mono text-[10px] bg-accent/20 rounded px-1 ml-1">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white font-medium transition-colors">
            Tactical Console
          </Link>
          <Link href="/war-room" className="text-xs text-danger hover:text-white font-medium flex items-center gap-1.5 transition-colors border border-danger/30 rounded px-2.5 py-1 bg-danger/5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-danger"></span> WAR ROOM
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 lg:px-12 py-16 lg:py-24 text-center z-10">
        
        {/* Floating Active Alerts HUD */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
          <motion.div 
            key={activeAlert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg shadow-2xl backdrop-blur-md text-left"
          >
            <div className="flex items-center gap-1.5 bg-danger/10 border border-danger/30 text-danger text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 animate-pulse">
              LIVE SIGNAL
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate flex-1">
              <span className="text-white font-semibold">[{activeAlert.region}]</span> {activeAlert.headline}
            </div>
            <div className="text-[9px] font-mono text-slate-500 shrink-0">
              {activeAlert.timestamp}
            </div>
          </motion.div>
        </div>

        {/* Outer Circle Ring */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-slate-900 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-slate-900/40 border-dashed" />
        </div>

        {/* Content Box */}
        <div className="max-w-4xl space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono font-semibold tracking-wide uppercase">
              <Lock className="h-3.5 w-3.5" /> SECURE STRATEGIC OVERWATCH PORTAL
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Predict Energy Crises <br />
              <span className="text-accent glow-text-cyan">Before They Happen.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-400 leading-relaxed">
              GeoPulse AI transforms geopolitical signals, shipping intelligence, and supply chain disruptions into actionable decisions in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/95 text-white rounded font-semibold text-sm tracking-wide shadow-lg hover:shadow-primary/30 border border-primary/20 hover:border-accent/40 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300">
                Launch Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/war-room" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-900/80 text-danger rounded font-semibold text-sm tracking-wide border border-danger/40 hover:border-danger/80 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300">
                <span className="h-2 w-2 rounded-full bg-danger animate-ping"></span> Enter War Room Mode
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Interactive Spinning Wireframe Globe */}
        <div className="mt-16 w-80 h-80 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/5 border border-accent/20 blur-sm pointer-events-none" />
          
          <svg className="w-full h-full text-accent/25 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d="M 5 50 H 95 M 50 5 V 95" fill="none" stroke="currentColor" strokeWidth="0.2" />
            
            {/* Latitudes & Longitudes */}
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
            
            {/* Pulse Hotspots */}
            <circle cx="20" cy="38" r="1.5" fill="#EF4444" className="animate-pulse" />
            <circle cx="82" cy="45" r="1.5" fill="#06B6D4" className="animate-pulse" />
            <circle cx="50" cy="78" r="1.5" fill="#F59E0B" className="animate-pulse" />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Global Status</span>
            <span className="text-lg font-bold text-accent">98.4% SAFE</span>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-900 bg-slate-950/60 py-10 z-10">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-1.5 border-r border-slate-900 last:border-none">
                <div className="flex justify-center text-accent"><Icon className="h-5 w-5" /></div>
                <div className="text-3xl font-extrabold text-white font-mono">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES MATRIX SECTION */}
      <section className="max-w-6xl mx-auto px-8 py-20 space-y-12 z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Complete Supply Chain Resilience Capabilities</h2>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            A comprehensive suite of tools mapping every chokepoint, supplier, and distribution line for crisis readiness.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link key={i} href={feature.href} className="group block">
                <div className="h-full p-6 bg-slate-950/40 border border-slate-900 group-hover:border-slate-800 hover:bg-slate-900/30 rounded-lg space-y-4 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none group-hover:bg-accent/10 transition-colors" />
                  
                  <div className={cn("p-2 w-10 h-10 rounded border border-slate-900 bg-slate-950 flex items-center justify-center group-hover:border-accent/40 group-hover:bg-accent/5 transition-all", feature.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-accent flex items-center gap-1.5 transition-colors">
                      {feature.title}
                      {feature.isHot && (
                        <span className="text-[9px] bg-danger/10 border border-danger/40 text-danger rounded px-1.5 font-mono py-0.5">CRITICAL</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ARCHITECTURE PIPELINE SECTION */}
      <section className="max-w-5xl mx-auto px-8 py-16 border-t border-slate-900 z-10">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-white">Continuous Intelligence Architecture</h2>
          <p className="text-xs text-slate-400">From raw signal capture to autonomous policy execution</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-900 bg-slate-950/40 rounded-xl p-8 relative">
          
          {/* Node 1 */}
          <div className="flex flex-col items-center text-center max-w-[150px] space-y-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Database className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">Data Sources</div>
            <div className="text-[9px] text-slate-500 leading-normal">AIS Shiptracking, News Wire, Satellite Images, Weather Hubs</div>
          </div>

          <ArrowRight className="hidden md:block h-5 w-5 text-slate-700" />

          {/* Node 2 */}
          <div className="flex flex-col items-center text-center max-w-[150px] space-y-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">AI Agents</div>
            <div className="text-[9px] text-slate-500 leading-normal">Gemini Engine, LangGraph orchestration, RAG embeddings</div>
          </div>

          <ArrowRight className="hidden md:block h-5 w-5 text-slate-700" />

          {/* Node 3 */}
          <div className="flex flex-col items-center text-center max-w-[150px] space-y-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Layers className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">Risk Engine</div>
            <div className="text-[9px] text-slate-500 leading-normal">National digital twins, stress analysis, price prediction</div>
          </div>

          <ArrowRight className="hidden md:block h-5 w-5 text-slate-700" />

          {/* Node 4 */}
          <div className="flex flex-col items-center text-center max-w-[150px] space-y-2.5">
            <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white">Action Plan</div>
            <div className="text-[9px] text-slate-500 leading-normal">Supplier re-routing, reserves release, strategic briefings</div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-900 py-6 text-center font-mono text-[10px] text-slate-600 bg-slate-950 z-20">
        <div>GEOPULSE SECURITY CLASSIFIED - FOR INTERNAL MINISTRY REVIEW ONLY</div>
        <div className="mt-1">© 2026 GEOPULSE AI INC. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}
