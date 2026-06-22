"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Truck, 
  Terminal, 
  Network, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Globe,
  Settings,
  Database,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  const navItems = [
    { name: "Landing", href: "/", icon: Globe },
    { name: "Overview Hub", href: "/dashboard", icon: LayoutDashboard },
    { name: "Crisis Simulator", href: "/simulator", icon: ShieldAlert },
    { name: "Procurement", href: "/procurement", icon: Truck },
    { name: "AI Copilot", href: "/copilot", icon: Terminal },
    { name: "Digital Twin", href: "/digital-twin", icon: Network },
    { name: "War Room", href: "/war-room", icon: Activity, isHot: true },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-14 bottom-0 left-0 z-40 flex flex-col bg-slate-950/90 backdrop-blur-md border-r border-slate-800 text-slate-300 select-none overflow-hidden"
      )}
    >
      {/* Nav List */}
      <div className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="block">
              <div
                className={cn(
                  "relative flex items-center h-10 px-3 rounded-md transition-all duration-200 group cursor-pointer",
                  isActive 
                    ? "bg-primary/20 text-white border-l-2 border-accent" 
                    : "hover:bg-slate-900/60 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 width-5 shrink-0 transition-colors duration-200", 
                  isActive ? "text-accent" : "text-slate-400 group-hover:text-accent"
                )} />

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.isHot && !isCollapsed && (
                  <span className="absolute right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-14 scale-0 group-hover:scale-100 transition-transform duration-150 origin-left bg-slate-900 border border-slate-800 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    {item.name} {item.isHot && "🔥"}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Terminal Stats Box */}
      <div className="p-3 border-t border-slate-900">
        <AnimatePresence initial={false}>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-950/60 border border-slate-900 rounded-md p-3 text-[10px] font-mono space-y-2 text-slate-500"
            >
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-500" /> SECURE LINK</span>
                <span className="text-emerald-500 font-bold animate-pulse">● LIVE</span>
              </div>
              <div className="flex justify-between">
                <span>RISK ENG:</span>
                <span className="text-slate-300 font-bold">GEMINI 1.5 PRO</span>
              </div>
              <div className="flex justify-between">
                <span>DB METRIC:</span>
                <span className="text-slate-300 flex items-center gap-1"><Database className="h-3 w-3" /> POSTGRES</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ["20%", "85%", "45%", "90%", "60%"] }} 
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="bg-accent h-full" 
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center text-slate-600">
              <Settings className="h-4 w-4 animate-spin-slow hover:text-accent cursor-pointer" />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Button */}
      <button
        onClick={handleToggle}
        className="h-8 border-t border-slate-900 hover:bg-slate-900/40 flex items-center justify-center text-slate-500 hover:text-white transition-colors duration-200"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.div>
  );
}
