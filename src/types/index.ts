export interface GeopoliticalAlert {
  id: string;
  timestamp: string;
  source: string;
  headline: string;
  severity: "low" | "medium" | "high" | "critical";
  region: string;
  impactScore: number; // 0 to 100
  category: "shipping" | "military" | "embargo" | "weather" | "production";
}

export interface Incident {
  id: string;
  location: string;
  date: string;
  description: string;
  type: string;
  impact: string;
  status: "resolved" | "active" | "monitored";
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  politicalStabilityScore: number; // 0 to 100
  basePricePerBarrel: number; // USD
  shippingLeadTimeDays: number;
  capacityBarrelsPerDay: number;
  riskScore: number; // 0 to 100
  reliabilityRating: number; // 0 to 100
  notes: string;
}

export interface RouteComparison {
  name: string;
  distanceKm: number;
  durationDays: number;
  riskScore: number;
  insurancePremiumDelta: number; // percentage
  fuelCostDelta: number; // percentage
  chokepoints: string[];
}

export interface CommodityPrice {
  date: string;
  brentOil: number;
  wtiOil: number;
  lngNaturalGas: number;
}

export interface ThreatRegion {
  name: string;
  riskIndex: number;
  status: "critical" | "warning" | "stable";
  activeThreats: number;
  vulnerabilityFactor: number;
}

export interface CriticalCorridor {
  name: string;
  dailyFlowMillionBarrels: number;
  currentRiskScore: number;
  congestionIndex: number; // 0 to 100
  status: "healthy" | "warning" | "critical";
}

export interface NetworkNode {
  id: string;
  label: string;
  type: "source" | "corridor" | "port" | "refinery" | "distribution";
  status: "healthy" | "warning" | "critical";
  x: number;
  y: number;
  details: {
    capacity?: string;
    flowRate?: string;
    riskScore?: number;
    delayDays?: number;
    stockLevelPercent?: number;
    location?: string;
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  status: "healthy" | "warning" | "critical";
  flowPercent: number;
  pulseSpeed?: number; // lower is faster
}

export interface ScenarioStep {
  timeOffset: number; // seconds from start
  headline: string;
  details: string;
  alertSeverity: "low" | "medium" | "high" | "critical";
  riskIndexChange: number;
  brentPriceChange: number;
  impactedNodes: string[]; // node IDs
  causalChainStep: number; // index of causal chain highlighted
}
