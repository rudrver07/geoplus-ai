"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col scanline-effect">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col scanline-effect">
      {/* Top Header */}
      <Navbar />

      <div className="flex-1 flex relative">
        {/* Navigation Sidebar */}
        <Sidebar onToggle={(collapsed) => setIsCollapsed(collapsed)} />

        {/* Main Content Area */}
        <main
          className="flex-1 min-h-[calc(100vh-3.5rem)] flex flex-col transition-all duration-300 ease-in-out relative overflow-y-auto"
          style={{ paddingLeft: isCollapsed ? "4rem" : "16.25rem" }}
        >
          {/* Cyber Overlay fine grid */}
          <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20 z-0" />
          
          <div className="flex-1 p-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
