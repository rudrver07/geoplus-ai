import { 
  GeopoliticalAlert, 
  Incident, 
  Supplier, 
  RouteComparison, 
  CommodityPrice, 
  ThreatRegion, 
  CriticalCorridor, 
  NetworkNode, 
  NetworkEdge,
  ScenarioStep
} from "@/types";

export const alertsData: GeopoliticalAlert[] = [
  {
    id: "alert-1",
    timestamp: "10 mins ago",
    source: "Maritime Security Intel",
    headline: "Unmanned aerial vehicle swarm detected heading towards Bab-el-Mandeb Strait",
    severity: "critical",
    region: "Red Sea",
    impactScore: 88,
    category: "military"
  },
  {
    id: "alert-2",
    timestamp: "45 mins ago",
    source: "OPEC+ Policy Brief",
    headline: "Rumors of unscheduled OPEC emergency meeting to discuss production cuts",
    severity: "high",
    region: "Middle East",
    impactScore: 72,
    category: "production"
  },
  {
    id: "alert-3",
    timestamp: "2 hours ago",
    source: "Singapore Port Authority",
    headline: "Heavy congestion build-up in Malacca Strait due to sudden customs protocol shift",
    severity: "medium",
    region: "Southeast Asia",
    impactScore: 45,
    category: "shipping"
  },
  {
    id: "alert-4",
    timestamp: "4 hours ago",
    source: "US Treasury Department",
    headline: "Sanctions blacklist expanded to include 12 additional crude tankers",
    severity: "high",
    region: "Global",
    impactScore: 68,
    category: "embargo"
  },
  {
    id: "alert-5",
    timestamp: "6 hours ago",
    source: "Gulf Meteorological Agency",
    headline: "Tropical cyclone brewing near Oman coast, tankers advised to steer east",
    severity: "medium",
    region: "Arabian Sea",
    impactScore: 50,
    category: "weather"
  }
];

export const incidentsData: Incident[] = [
  {
    id: "inc-1",
    location: "Bab-el-Mandeb Strait",
    date: "2026-06-22",
    description: "Drone strike attempt on commercial chemical tanker. Escorted safely by coalition naval assets.",
    type: "Drone Attack",
    impact: "Vessels rerouting around Cape of Good Hope (+12 days)",
    status: "active"
  },
  {
    id: "inc-2",
    location: "Strait of Hormuz",
    date: "2026-06-20",
    description: "Iranian Revolutionary Guard boards and detains a container vessel suspected of cargo violations.",
    type: "Vessel Detention",
    impact: "Insurance risk premiums surge by 15%",
    status: "monitored"
  },
  {
    id: "inc-3",
    location: "Port of Houston, USA",
    date: "2026-06-18",
    description: "Ransomware cyberattack disables terminal scheduling system, causing loading queues.",
    type: "Cyberattack",
    impact: "Avg loading delay increased by 38 hours",
    status: "resolved"
  },
  {
    id: "inc-4",
    location: "Novorossiysk Oil Terminal, Russia",
    date: "2026-06-15",
    description: "Storm damage to loading buoys limits daily throughput capability by 40%.",
    type: "Infrastructure",
    impact: "Black Sea exports bottlenecked",
    status: "active"
  }
];

export const suppliersData: Supplier[] = [
  {
    id: "sup-1",
    name: "Saudi Aramco",
    country: "Saudi Arabia",
    politicalStabilityScore: 78,
    basePricePerBarrel: 76.5,
    shippingLeadTimeDays: 14,
    capacityBarrelsPerDay: 12000000,
    riskScore: 28,
    reliabilityRating: 95,
    notes: "Largest global exporter. Highly reliable shipping routes, but subject to regional geopolitical escalations in Strait of Hormuz."
  },
  {
    id: "sup-2",
    name: "ADNOC",
    country: "United Arab Emirates",
    politicalStabilityScore: 84,
    basePricePerBarrel: 78.0,
    shippingLeadTimeDays: 13,
    capacityBarrelsPerDay: 4000000,
    riskScore: 22,
    reliabilityRating: 94,
    notes: "High quality grade crude. Stable regulatory environment. Actively developing offshore bypassing pipelines."
  },
  {
    id: "sup-3",
    name: "Petrobras",
    country: "Brazil",
    politicalStabilityScore: 72,
    basePricePerBarrel: 74.0,
    shippingLeadTimeDays: 24,
    capacityBarrelsPerDay: 3200000,
    riskScore: 35,
    reliabilityRating: 88,
    notes: "Deepwater pre-salt crude. Safe Atlantic shipping corridors, bypassing middle eastern chokepoints. Longer transit times."
  },
  {
    id: "sup-4",
    name: "NNPC",
    country: "Nigeria",
    politicalStabilityScore: 48,
    basePricePerBarrel: 72.8,
    shippingLeadTimeDays: 22,
    capacityBarrelsPerDay: 1500000,
    riskScore: 58,
    reliabilityRating: 70,
    notes: "Sweet crude grade (Bonny Light). Frequent pipeline sabotage, port theft, and vessel queues increase supply disruption risk."
  },
  {
    id: "sup-5",
    name: "Equinor",
    country: "Norway",
    politicalStabilityScore: 98,
    basePricePerBarrel: 83.5,
    shippingLeadTimeDays: 26,
    capacityBarrelsPerDay: 2000000,
    riskScore: 5,
    reliabilityRating: 99,
    notes: "Premium pricing due to near-zero risk. Pristine political and shipping profile. Ideal strategic backup supplier."
  },
  {
    id: "sup-6",
    name: "Rosneft (Sanctioned)",
    country: "Russia",
    politicalStabilityScore: 35,
    basePricePerBarrel: 62.0,
    shippingLeadTimeDays: 32,
    capacityBarrelsPerDay: 9600000,
    riskScore: 85,
    reliabilityRating: 60,
    notes: "Deep discount Urals grade. Heavy risk of sanctions, seizure, banking settlement blockages, and shipping insurance denials."
  }
];

export const routesData: RouteComparison[] = [
  {
    name: "Suez Canal Transit (Normal Route)",
    distanceKm: 11500,
    durationDays: 14,
    riskScore: 75,
    insurancePremiumDelta: 150,
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

export const commodityPrices: CommodityPrice[] = [
  { date: "May 25", brentOil: 78.4, wtiOil: 74.2, lngNaturalGas: 9.8 },
  { date: "Jun 01", brentOil: 79.1, wtiOil: 74.9, lngNaturalGas: 10.1 },
  { date: "Jun 08", brentOil: 77.9, wtiOil: 73.8, lngNaturalGas: 9.6 },
  { date: "Jun 15", brentOil: 81.5, wtiOil: 77.3, lngNaturalGas: 10.8 },
  { date: "Jun 20", brentOil: 84.6, wtiOil: 80.1, lngNaturalGas: 11.4 },
  { date: "Jun 22 (Live)", brentOil: 86.2, wtiOil: 82.5, lngNaturalGas: 12.1 }
];

export const threatRegions: ThreatRegion[] = [
  {
    name: "Strait of Hormuz",
    riskIndex: 92,
    status: "critical",
    activeThreats: 5,
    vulnerabilityFactor: 0.95
  },
  {
    name: "Bab-el-Mandeb & Red Sea",
    riskIndex: 87,
    status: "critical",
    activeThreats: 8,
    vulnerabilityFactor: 0.88
  },
  {
    name: "Malacca Strait",
    riskIndex: 48,
    status: "warning",
    activeThreats: 2,
    vulnerabilityFactor: 0.65
  },
  {
    name: "Gulf of Guinea",
    riskIndex: 56,
    status: "warning",
    activeThreats: 3,
    vulnerabilityFactor: 0.40
  },
  {
    name: "English Channel",
    riskIndex: 12,
    status: "stable",
    activeThreats: 0,
    vulnerabilityFactor: 0.15
  }
];

export const criticalCorridors: CriticalCorridor[] = [
  {
    name: "Strait of Hormuz",
    dailyFlowMillionBarrels: 21.0,
    currentRiskScore: 92,
    congestionIndex: 42,
    status: "critical"
  },
  {
    name: "Malacca Strait",
    dailyFlowMillionBarrels: 16.0,
    currentRiskScore: 48,
    congestionIndex: 78,
    status: "warning"
  },
  {
    name: "Suez Canal & Bab-el-Mandeb",
    dailyFlowMillionBarrels: 8.8,
    currentRiskScore: 87,
    congestionIndex: 15,
    status: "critical"
  },
  {
    name: "Panama Canal",
    dailyFlowMillionBarrels: 5.0,
    currentRiskScore: 30,
    congestionIndex: 65,
    status: "warning"
  },
  {
    name: "Danish Straits",
    dailyFlowMillionBarrels: 3.2,
    currentRiskScore: 18,
    congestionIndex: 12,
    status: "healthy"
  }
];

export const networkNodes: NetworkNode[] = [
  // Source Countries
  { id: "node-src-1", label: "Saudi Arabia (Ghawar)", type: "source", status: "healthy", x: 100, y: 150, details: { capacity: "12M bpd", riskScore: 25, location: "Gulf Region" } },
  { id: "node-src-2", label: "Abu Dhabi (Zakum)", type: "source", status: "healthy", x: 100, y: 300, details: { capacity: "4M bpd", riskScore: 18, location: "UAE" } },
  { id: "node-src-3", label: "Iraq (Basra)", type: "source", status: "warning", x: 100, y: 450, details: { capacity: "4.5M bpd", riskScore: 55, location: "Persian Gulf" } },
  
  // Corridors
  { id: "node-cor-1", label: "Strait of Hormuz", type: "corridor", status: "healthy", x: 280, y: 220, details: { flowRate: "18.5M bpd", riskScore: 28, delayDays: 0 } },
  { id: "node-cor-2", label: "Bab-el-Mandeb (Red Sea)", type: "corridor", status: "critical", x: 280, y: 380, details: { flowRate: "7.8M bpd", riskScore: 87, delayDays: 12 } },
  
  // Indian Ports
  { id: "node-port-1", label: "Jamnagar Port (Gujarat)", type: "port", status: "healthy", x: 480, y: 200, details: { capacity: "2.5M bpd", stockLevelPercent: 82, location: "Gujarat Coast" } },
  { id: "node-port-2", label: "Mundra Port (Gujarat)", type: "port", status: "healthy", x: 480, y: 320, details: { capacity: "1.8M bpd", stockLevelPercent: 78, location: "Kutch Gulf" } },
  { id: "node-port-3", label: "Kochi Port (Kerala)", type: "port", status: "warning", x: 480, y: 440, details: { capacity: "1.2M bpd", stockLevelPercent: 55, location: "Malabar Coast" } },
  
  // Refineries
  { id: "node-ref-1", label: "Reliance Jamnagar Refinery", type: "refinery", status: "healthy", x: 680, y: 210, details: { capacity: "1.24M bpd", stockLevelPercent: 88 } },
  { id: "node-ref-2", label: "IOCL Koyali Refinery", type: "refinery", status: "healthy", x: 680, y: 310, details: { capacity: "270k bpd", stockLevelPercent: 75 } },
  { id: "node-ref-3", label: "BPCL Kochi Refinery", type: "refinery", status: "warning", x: 680, y: 410, details: { capacity: "310k bpd", stockLevelPercent: 48 } },
  
  // Distribution Regions
  { id: "node-dist-1", label: "Northern Grid (NCR / Punjab)", type: "distribution", status: "healthy", x: 880, y: 150, details: { capacity: "Demand: 1.2M bpd", delayDays: 0 } },
  { id: "node-dist-2", label: "Western Industrial Hub", type: "distribution", status: "healthy", x: 880, y: 280, details: { capacity: "Demand: 1.6M bpd", delayDays: 0 } },
  { id: "node-dist-3", label: "Southern Power Grid", type: "distribution", status: "warning", x: 880, y: 410, details: { capacity: "Demand: 950k bpd", delayDays: 3 } }
];

export const networkEdges: NetworkEdge[] = [
  // Sources to Corridors
  { id: "edge-1", source: "node-src-1", target: "node-cor-1", status: "healthy", flowPercent: 75, pulseSpeed: 4 },
  { id: "edge-2", source: "node-src-2", target: "node-cor-1", status: "healthy", flowPercent: 90, pulseSpeed: 5 },
  { id: "edge-3", source: "node-src-3", target: "node-cor-1", status: "warning", flowPercent: 60, pulseSpeed: 8 },
  { id: "edge-4", source: "node-src-1", target: "node-cor-2", status: "healthy", flowPercent: 25, pulseSpeed: 6 },
  
  // Corridors to Ports
  { id: "edge-5", source: "node-cor-1", target: "node-port-1", status: "healthy", flowPercent: 50, pulseSpeed: 3 },
  { id: "edge-6", source: "node-cor-1", target: "node-port-2", status: "healthy", flowPercent: 40, pulseSpeed: 4 },
  { id: "edge-7", source: "node-cor-2", target: "node-port-3", status: "critical", flowPercent: 95, pulseSpeed: 20 },
  
  // Ports to Refineries
  { id: "edge-8", source: "node-port-1", target: "node-ref-1", status: "healthy", flowPercent: 100, pulseSpeed: 2 },
  { id: "edge-9", source: "node-port-2", target: "node-ref-2", status: "healthy", flowPercent: 80, pulseSpeed: 3 },
  { id: "edge-10", source: "node-port-3", target: "node-ref-3", status: "warning", flowPercent: 70, pulseSpeed: 5 },
  
  // Refineries to Distribution
  { id: "edge-11", source: "node-ref-1", target: "node-dist-1", status: "healthy", flowPercent: 40, pulseSpeed: 2 },
  { id: "edge-12", source: "node-ref-1", target: "node-dist-2", status: "healthy", flowPercent: 60, pulseSpeed: 2 },
  { id: "edge-13", source: "node-ref-2", target: "node-dist-2", status: "healthy", flowPercent: 100, pulseSpeed: 3 },
  { id: "edge-14", source: "node-ref-3", target: "node-dist-3", status: "warning", flowPercent: 100, pulseSpeed: 6 }
];

export const scenarioSteps: ScenarioStep[] = [
  {
    timeOffset: 0,
    headline: "GEOPOLITICAL CRISIS TRIGGERED",
    details: "Unidentified suicide drone attacks two commercial tankers loading crude at Fujairah Anchorage outside the Strait of Hormuz. Small explosions reported on hulls. Fires under control.",
    alertSeverity: "high",
    riskIndexChange: 15,
    brentPriceChange: 3.20,
    impactedNodes: ["node-cor-1"],
    causalChainStep: 0
  },
  {
    timeOffset: 8,
    headline: "STRAIT OF HORMUZ PARTIALLY CLOSED",
    details: "Regional military naval force establishes a temporary security search zone. All commercial tankers halted or ordered to hold position. Shipping lane transit capacity down 70%. Insurance underwriters suspend new cover certificates.",
    alertSeverity: "critical",
    riskIndexChange: 35,
    brentPriceChange: 8.50,
    impactedNodes: ["node-cor-1", "node-port-1", "node-port-2"],
    causalChainStep: 1
  },
  {
    timeOffset: 16,
    headline: "SUPPLY CHAIN DISRUPTION PROPAGATING",
    details: "Expected crude tankers due at Jamnagar and Mundra fail to arrive. Combined port stock levels fall from 80% to 54%. Offloading operations grind to near-halt. Reliances issues supply warning.",
    alertSeverity: "critical",
    riskIndexChange: 55,
    brentPriceChange: 12.40,
    impactedNodes: ["node-port-1", "node-port-2", "node-ref-1", "node-ref-2"],
    causalChainStep: 2
  },
  {
    timeOffset: 24,
    headline: "REFINERY STRESS CRITICAL",
    details: "Jamnagar refinery runs at minimum threshold throughput (52% capacity) to prevent catalyst damage. Kochi Refinery reduces throughput by 30%. National Strategic Crude Reserves tapped to keep core supply pipelines pressurized.",
    alertSeverity: "critical",
    riskIndexChange: 72,
    brentPriceChange: 18.00,
    impactedNodes: ["node-ref-1", "node-ref-2", "node-ref-3"],
    causalChainStep: 3
  },
  {
    timeOffset: 32,
    headline: "FUEL PRICES VOLATILITY SPIKE",
    details: "Local retail gasoline and diesel pump prices hiked by 14% to curb surging demand. Public transport operators levy emergency surcharges. Major manufacturing hubs report production rollbacks due to diesel generation rationing.",
    alertSeverity: "critical",
    riskIndexChange: 85,
    brentPriceChange: 24.50,
    impactedNodes: ["node-dist-1", "node-dist-2", "node-dist-3"],
    causalChainStep: 4
  }
];
