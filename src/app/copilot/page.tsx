"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Send, 
  BookOpen, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  confidence?: number;
  citations?: string[];
  actions?: { label: string; route: string }[];
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "GEOPULSE SYSTEM INTERFACE ACTIVE. I am your Gemini-powered tactical logistics agent. I can model supply chain reroutes, analyze corridor congestion, and suggest policy actions. How can I assist you with energy security decision-making today?",
      confidence: 98,
      citations: ["GeoPulse Global Database v4.2", "IEA Oil Reserves Directive"]
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCitations, setActiveCitations] = useState<string[]>(["GeoPulse Global Database v4.2", "IEA Oil Reserves Directive"]);
  const [currentConfidence, setCurrentConfidence] = useState(98);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const presetPrompts = [
    { text: "What if Hormuz closes for 15 days?", id: "hormuz" },
    { text: "Recommend alternate suppliers.", id: "suppliers" },
    { text: "Estimate inflation impact.", id: "inflation" },
    { text: "Should strategic reserves be released?", id: "reserves" }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    messageIdCounter.current += 1;
    // Add user message
    const userMsg: Message = {
      id: `msg-user-${messageIdCounter.current}`,
      sender: "user",
      text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate response latency
    setTimeout(() => {
      setIsTyping(false);
      let responseText = "";
      let confidence = 85;
      let citations = ["Generic database citation"];
      let actions: { label: string; route: string }[] = [];

      const query = text.toLowerCase();
      if (query.includes("hormuz") || query.includes("15 days")) {
        responseText = "Modeling a 15-day closure of the Strait of Hormuz indicates a bottleneck of ~300M barrels. Brent Crude price is estimated to surge by +$14.20/bbl (16.5%). Indian port arrivals will drop by 60%, raising Kochi refinery stress to 88% by day 10. Recommend activating the emergency bypass pipelines and tapping 10M barrels from strategic stockpiles.";
        confidence = 92;
        citations = ["IEA World Energy Outlook 2026", "Lloyd's List Shipping Intelligence", "Saudi Aramco Bypass Pipeline Specs"];
        actions = [
          { label: "Run Hormuz Closure in Simulator", route: "/simulator" },
          { label: "Check Strategic Stockpiles", route: "/dashboard" }
        ];
      } else if (query.includes("supplier") || query.includes("alternate")) {
        responseText = "Based on current Bab-el-Mandeb disruptions, I recommend shifting 25% of spot crude procurement to Petrobras (Brazil) and 15% to Equinor (Norway). Brazil's Atlantic routes bypass middle-eastern chokepoints entirely, reducing transit risk score from 75 to 10, despite an additional 12 days lead time.";
        confidence = 89;
        citations = ["Alternative Supplier Risk Database", "Atlantic Route Congestion Index", "Equinor Spot Pricing Chart"];
        actions = [
          { label: "View Supplier Comparison Matrix", route: "/procurement" }
        ];
      } else if (query.includes("inflation") || query.includes("impact")) {
        responseText = "If Red Sea threats persist for 30 days, global freight insurance premiums will spike by 150%, leading to retail fuel price hikes of 12-14%. This is forecasted to trigger a +1.2% drag on CPI Inflation index and -0.3% GDP growth reduction over the current quarter.";
        confidence = 86;
        citations = ["Consumer Price Index Forecast Model", "OECD Maritime Transport Costs", "IMF Global Shipping Friction Analysis"];
        actions = [
          { label: "Model CPI Drag in Simulator", route: "/simulator" }
        ];
      } else if (query.includes("reserve") || query.includes("strategic")) {
        responseText = "National crude reserve stock currently stands at 18 days of demand. If the Suez Canal corridor remains closed, the reserves depletion horizon will hit the critical 7-day mark. I recommend initiating a 1.2M bpd release of Strategic Petroleum Reserves (SPR) immediately to keep core refinery pipelines pressurized.";
        confidence = 94;
        citations = ["National Petroleum Reserves Audit", "Refinery Throughput Conservation Guidelines", "Ministry of Energy Strategic Directives"];
        actions = [
          { label: "Review Emergency Checklist", route: "/war-room" }
        ];
      } else {
        responseText = `I have logged your request: "${text}". Analysing geopolitical feeds and shipping registries... My recommendation is to maintain current buffer inventories and monitor Bab-el-Mandeb corridor activity closely for the next 48 hours.`;
        confidence = 78;
        citations = ["Default GeoPulse Intelligence Registry"];
      }

      messageIdCounter.current += 1;
      const copilotMsg: Message = {
        id: `msg-copilot-${messageIdCounter.current}`,
        sender: "copilot",
        text: responseText,
        confidence,
        citations,
        actions
      };

      setMessages(prev => [...prev, copilotMsg]);
      setCurrentConfidence(confidence);
      setActiveCitations(citations);
    }, 1800);
  };

  return (
    <div className="space-y-6 relative z-10 font-sans">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="h-6 w-6 text-accent" />
            AI Decision Copilot
          </h1>
          <p className="text-xs text-slate-400">
            Query the Gemini-powered knowledge base for geopolitical analysis, routing decisions, and policy suggestions.
          </p>
        </div>
      </div>

      {/* Interface grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Chat Console */}
        <div className="lg:col-span-3 flex flex-col h-[520px] bg-slate-950/40 border border-slate-900 rounded-lg overflow-hidden relative">
          
          {/* Chat Headers */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-sm font-mono text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><Activity className="h-3 w.3 text-accent animate-pulse" /> LIVE AGENT CHANNEL</span>
            <span>SECURE GEMINI-LINK</span>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={cn(
                  "flex flex-col space-y-1.5 max-w-[85%] rounded p-3 text-xs leading-relaxed font-mono",
                  m.sender === "user"
                    ? "bg-primary/10 border border-primary/30 text-white ml-auto"
                    : "bg-slate-900/40 border border-slate-800 text-slate-200"
                )}
              >
                <div className="text-[9px] text-slate-500 font-bold uppercase">
                  {m.sender === "user" ? "COUNCIL MEMBER" : "GEOPULSE INTEL AGENT"}
                </div>
                <div>{m.text}</div>
                
                {/* Actions inside messages if any */}
                {m.actions && m.actions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {m.actions.map((act, idx) => (
                      <a href={act.route} key={idx}>
                        <button className="px-2 py-1 bg-slate-950 border border-slate-800 hover:border-accent text-accent hover:text-white rounded text-[9px] flex items-center gap-1 transition-all">
                          {act.label} <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="bg-slate-900/40 border border-slate-800 text-slate-400 rounded p-3 text-xs max-w-[60%] flex items-center gap-2 font-mono">
                <Terminal className="h-3.5 w-3.5 text-accent animate-spin" />
                <span>Gemini is synthesizing routing models...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Chips */}
          <div className="px-4 py-2 border-t border-slate-900/60 bg-slate-950/60 flex flex-wrap gap-1.5">
            {presetPrompts.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSend(chip.text)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-900/60 border border-slate-800 hover:border-accent text-[9px] font-mono text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                {chip.text}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-slate-900 bg-slate-950 flex gap-2">
            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputVal)}
              placeholder="Ask for routing options, inventory stress levels, etc..."
              className="flex-1 bg-slate-950 border border-slate-900 focus:border-accent text-white font-mono text-xs rounded px-3 py-2 outline-none"
            />
            <button
              onClick={() => handleSend(inputVal)}
              className="p-2 bg-primary hover:bg-primary/95 text-white border border-primary/20 rounded cursor-pointer transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Citations and Confidence Sidebars */}
        <div className="space-y-6">
          
          {/* Confidence Score Gauge */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 text-center space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-success" /> AI Confidence Gauge
            </h3>

            <div className="flex flex-col items-center py-2 space-y-2">
              {/* Spinning circular progress gauge */}
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="6" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="6" 
                    strokeDasharray={251}
                    strokeDashoffset={251 - (251 * currentConfidence) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center font-mono">
                  <span className="text-2xl font-extrabold text-white">{currentConfidence}%</span>
                  <span className="text-[8px] text-slate-500 uppercase">CERTAINTY</span>
                </div>
              </div>

              <p className="text-[9px] font-mono text-slate-500 leading-normal max-w-[200px]">
                Reflects signal consistency, historical corridor routing correlation, and vector citation matching density.
              </p>
            </div>
          </div>

          {/* Citation Panel */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-accent" /> Source Citations
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto font-mono text-[10px] text-slate-300 pr-1">
              {activeCitations.map((cit, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/30 border border-slate-900 rounded hover:border-slate-800 transition-colors space-y-1">
                  <div className="text-[8px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Info className="h-2.5 w-2.5 text-accent" /> CITATION [{idx + 1}]
                  </div>
                  <div className="font-bold text-white">{cit}</div>
                  <div className="text-[8px] text-slate-500 flex justify-between">
                    <span>DATABASE: VERIFIED</span>
                    <span className="text-accent underline flex items-center gap-0.5 cursor-pointer">
                      VERIFY ORIGIN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
