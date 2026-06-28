from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import asyncio
import datetime
import random
import urllib.request
import urllib.parse
import json
import logging

from .config import settings
from .database import (
    Base, engine, get_db, IncidentDB, SupplierDB, SessionLocal,
    CommodityPriceHistoryDB, GeopoliticalIntelligenceDB, WeatherAlertDB, DisasterAlertDB
)
from .agents.gemini import GeminiAgent
from .agents.graph import app_graph

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("geopulse")

# Pydantic Schema Helpers
class SimulateRequest(BaseModel):
    crisis_type: str
    severity: str
    duration: int
    regions: List[str]

class ChatRequest(BaseModel):
    message: str

class SignalRequest(BaseModel):
    signal_text: str

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache variables for 5-minute refreshes
latest_commodity_feed = []
latest_crisis_intelligence = []
latest_weather_alerts = []
latest_disaster_alerts = []
latest_digital_twin = {}
latest_war_room = []

# Core coordinates for monitored areas
MONITORED_COORDS = {
    "Strait of Hormuz": {"lat": 26.56, "lon": 56.25},
    "Bab-el-Mandeb Strait": {"lat": 12.58, "lon": 43.33},
    "Malacca Strait": {"lat": 1.43, "lon": 102.89},
    "Jamnagar Port": {"lat": 22.47, "lon": 70.07},
    "Mundra Port": {"lat": 22.84, "lon": 69.70},
    "Kochi Port": {"lat": 9.97, "lon": 76.27}
}

# Helper: http GET using standard library (zero-dependency)
def http_get_json(url: str, headers: dict = None) -> Optional[dict]:
    try:
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        logger.error(f"HTTP GET failed for {url}: {e}")
        return None

# Periodic Tasks Functions
async def fetch_and_store_commodity_prices(db: Session):
    brent, wti, lng = 86.20, 82.50, 12.10
    
    # Try fetching from EIA API if key is present
    if settings.EIA_API_KEY:
        # Note: EIA V2 endpoint examples
        brent_url = f"https://api.eia.gov/v2/petroleum/pri/spt/data/?frequency=daily&data[0]=value&facets[product][]=RBRT&sort[0][column]=period&sort[0][direction]=desc&length=1&api_key={settings.EIA_API_KEY}"
        brent_data = http_get_json(brent_url)
        if brent_data and "response" in brent_data and "data" in brent_data["response"] and brent_data["response"]["data"]:
            brent = float(brent_data["response"]["data"][0].get("value", brent))

        wti_url = f"https://api.eia.gov/v2/petroleum/pri/spt/data/?frequency=daily&data[0]=value&facets[product][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=1&api_key={settings.EIA_API_KEY}"
        wti_data = http_get_json(wti_url)
        if wti_data and "response" in wti_data and "data" in wti_data["response"] and wti_data["response"]["data"]:
            wti = float(wti_data["response"]["data"][0].get("value", wti))
            
    else:
        # Fallback: Dynamic Random Walk
        latest = db.query(CommodityPriceHistoryDB).order_by(CommodityPriceHistoryDB.timestamp.desc()).first()
        if latest:
            brent = latest.brent_price + random.uniform(-0.3, 0.3)
            wti = latest.wti_price + random.uniform(-0.25, 0.25)
            lng = latest.lng_price + random.uniform(-0.1, 0.1)
        else:
            brent += random.uniform(-0.3, 0.3)
            wti += random.uniform(-0.25, 0.25)
            lng += random.uniform(-0.1, 0.1)

    # Store prices
    db_price = CommodityPriceHistoryDB(
        brent_price=round(max(40.0, brent), 2),
        wti_price=round(max(40.0, wti), 2),
        lng_price=round(max(2.0, lng), 2)
    )
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    logger.info(f"Commodity prices updated: Brent=${db_price.brent_price}, WTI=${db_price.wti_price}")

async def fetch_and_store_news(db: Session):
    agent = GeminiAgent()
    news_items = []
    
    # Fetch from the new News API provider as the primary source
    if settings.NEWS_API_KEY:
        query = '(oil AND (imports OR exports)) OR "trade restrictions" OR sanctions OR tariffs OR "shipping disruptions" OR "geopolitical conflicts" OR "supply-chain risks"'
        encoded_query = urllib.parse.quote(query)
        news_url = f"https://newsapi.org/v2/everything?q={encoded_query}&pageSize=10&sortBy=publishedAt&language=en&apiKey={settings.NEWS_API_KEY}"
        
        # User-Agent header is good practice for NewsAPI
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        news_data = http_get_json(news_url, headers=headers)
        
        if news_data and "articles" in news_data:
            for art in news_data["articles"]:
                headline = art.get("title", "")
                description = art.get("description", "") or art.get("title", "") or ""
                source = art.get("source", {}).get("name", "News API") or "News API"
                if headline:
                    news_items.append({
                        "headline": headline,
                        "description": description,
                        "source": source
                    })
                
    # Fallback to high-fidelity mock signals if APIs failed/empty
    if not news_items:
        headlines = [
            ("Unmanned aerial vehicle swarm detected heading towards Bab-el-Mandeb Strait", "Military authorities spotted an active swarm of unidentified drones approaching Red Sea corridor, escalating transit warnings.", "Maritime Security Intel"),
            ("Rumors of unscheduled OPEC+ emergency meeting to discuss production cuts", "OPEC delegates hint at discussions surrounding potential new production cuts to curb volatility.", "OPEC+ Policy Brief"),
            ("Heavy congestion build-up in Malacca Strait due to sudden customs protocol shift", "Tankers and bulk carriers experience major holding delays near Singapore terminals due to sudden customs inspections.", "Singapore Port Authority"),
            ("Sanctions blacklist expanded to include 12 additional crude tankers", "Expanded lists of blacklisted ships issued to strictly enforce price caps, raising logistics re-routing costs.", "US Treasury Department"),
            ("Tropical cyclone brewing near Oman coast, tankers advised to steer east", "Tropical cyclone alert issued for Arabian Sea, warning commercial vessels to detour away from Oman coastline.", "Gulf Meteorological Agency")
        ]
        chosen = random.choice(headlines)
        news_items.append({
            "headline": chosen[0],
            "description": chosen[1],
            "source": chosen[2]
        })

    # Evaluate new news items using Gemini
    for item in news_items:
        # Check if already processed
        exists = db.query(GeopoliticalIntelligenceDB).filter(
            GeopoliticalIntelligenceDB.headline == item["headline"]
        ).first()
        if exists:
            continue
            
        # Analyze with Gemini
        analysis = await agent.analyze_geopolitical_news(item["headline"], item["description"])
        
        intel = GeopoliticalIntelligenceDB(
            source=item["source"],
            headline=item["headline"],
            description=item["description"],
            severity=analysis.get("severity", "medium"),
            category=analysis.get("category", "shipping"),
            impact_score=analysis.get("impact_score", 45),
            summary=analysis.get("summary", item["description"]),
            economic_loss_usd_m=analysis.get("economic_loss_usd_m", 50.0),
            gdp_drag_percent=analysis.get("gdp_drag_percent", -0.05),
            supply_disruption_forecast=analysis.get("supply_disruption_forecast", "No major delays expected.")
        )
        db.add(intel)
        db.commit()
        logger.info(f"Geopolitical intelligence saved: {intel.headline[:40]}... (Severity: {intel.severity})")

async def fetch_and_store_weather(db: Session):
    for loc, coords in MONITORED_COORDS.items():
        temp, desc, wind = 28.5, "clear sky", 5.0
        is_anomaly = "stable"
        
        if settings.OPENWEATHER_API_KEY:
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={coords['lat']}&lon={coords['lon']}&appid={settings.OPENWEATHER_API_KEY}&units=metric"
            w_data = http_get_json(weather_url)
            if w_data and "main" in w_data:
                temp = w_data["main"].get("temp", temp)
                wind = w_data.get("wind", {}).get("speed", wind)
                desc = w_data.get("weather", [{}])[0].get("description", desc)
                if wind > 15.0 or "storm" in desc.lower() or "cyclone" in desc.lower():
                    is_anomaly = "critical" if wind > 20.0 else "warning"
        else:
            # Fallback/simulation
            temp = round(28.0 + random.uniform(-4, 4), 1)
            wind = round(4.0 + random.uniform(0, 10), 1)
            desc = random.choice(["clear sky", "scattered clouds", "broken clouds", "light rain"])
            
            # 5% chance of introducing severe weather anomaly
            if random.random() < 0.05:
                is_anomaly = "critical" if random.random() < 0.3 else "warning"
                wind = round(18.0 + random.uniform(0, 12), 1)
                desc = "Heavy Monsoon Storm" if is_anomaly == "critical" else "Gale Warning"

        w_alert = WeatherAlertDB(
            location=loc,
            temp_c=temp,
            weather_desc=desc,
            wind_speed_ms=wind,
            is_anomaly=is_anomaly
        )
        db.add(w_alert)
        db.commit()
    logger.info("Weather conditions successfully logged.")

async def fetch_and_store_disasters(db: Session):
    # Try fetching active fire signals
    # Fallback to random disaster reports
    if random.random() < 0.05: # 5% chance of a disaster report
        loc_name = random.choice(list(MONITORED_COORDS.keys()))
        coords = MONITORED_COORDS[loc_name]
        
        disaster = DisasterAlertDB(
            latitude=coords["lat"] + random.uniform(-0.05, 0.05),
            longitude=coords["lon"] + random.uniform(-0.05, 0.05),
            confidence=round(random.uniform(70, 100), 1),
            satellite=random.choice(["MODIS", "VIIRS"]),
            alert_type="Thermal Anomaly (Fire / Flare)"
        )
        db.add(disaster)
        db.commit()
        logger.info(f"Disaster alert recorded near {loc_name}")

def update_global_cache(db: Session):
    global latest_commodity_feed, latest_crisis_intelligence, latest_weather_alerts, latest_disaster_alerts, latest_digital_twin, latest_war_room
    
    # 1. Commodity Feed Cache
    prices = db.query(CommodityPriceHistoryDB).order_by(CommodityPriceHistoryDB.timestamp.desc()).limit(10).all()
    latest_commodity_feed = [
        {
            "date": p.timestamp.strftime("%b %d (%H:%M)"),
            "brentOil": p.brent_price,
            "wtiOil": p.wti_price,
            "lngNaturalGas": p.lng_price
        } for p in reversed(prices)
    ]
    
    # 2. Crisis Intelligence Cache
    intels = db.query(GeopoliticalIntelligenceDB).order_by(GeopoliticalIntelligenceDB.timestamp.desc()).limit(15).all()
    latest_crisis_intelligence = [
        {
            "id": f"intel-{intel.id}",
            "timestamp": f"{(datetime.datetime.utcnow() - intel.timestamp).seconds // 60}m ago" if (datetime.datetime.utcnow() - intel.timestamp).days == 0 else intel.timestamp.strftime("%b %d"),
            "source": intel.source,
            "headline": intel.headline,
            "description": intel.description,
            "severity": intel.severity,
            "category": intel.category,
            "impactScore": int(intel.impact_score),
            "summary": intel.summary,
            "economic_loss_usd_m": intel.economic_loss_usd_m,
            "gdp_drag_percent": intel.gdp_drag_percent,
            "supply_disruption_forecast": intel.supply_disruption_forecast
        } for intel in intels
    ]
    
    # 3. Weather Alerts Cache
    w_alerts = db.query(WeatherAlertDB).order_by(WeatherAlertDB.timestamp.desc()).limit(len(MONITORED_COORDS)).all()
    latest_weather_alerts = [
        {
            "location": w.location,
            "temp_c": w.temp_c,
            "weather_desc": w.weather_desc,
            "wind_speed_ms": w.wind_speed_ms,
            "is_anomaly": w.is_anomaly,
            "timestamp": w.timestamp.isoformat()
        } for w in w_alerts
    ]
    
    # 4. Disaster Alerts Cache
    d_alerts = db.query(DisasterAlertDB).order_by(DisasterAlertDB.timestamp.desc()).limit(5).all()
    latest_disaster_alerts = [
        {
            "latitude": d.latitude,
            "longitude": d.longitude,
            "confidence": d.confidence,
            "satellite": d.satellite,
            "alert_type": d.alert_type,
            "timestamp": d.timestamp.isoformat()
        } for d in d_alerts
    ]

    # 5. Live Digital Twin Nodes Cache
    # Nodes status evaluation based on active alerts
    nodes = [
        # Source Countries
        { "id": "node-src-1", "label": "Saudi Arabia (Ghawar)", "type": "source", "status": "healthy", "x": 100, "y": 150, "details": { "capacity": "12M bpd", "riskScore": 25, "location": "Gulf Region" } },
        { "id": "node-src-2", "label": "Abu Dhabi (Zakum)", "type": "source", "status": "healthy", "x": 100, "y": 300, "details": { "capacity": "4M bpd", "riskScore": 18, "location": "UAE" } },
        { "id": "node-src-3", "label": "Iraq (Basra)", "type": "source", "status": "healthy", "x": 100, "y": 450, "details": { "capacity": "4.5M bpd", "riskScore": 55, "location": "Persian Gulf" } },
        # Corridors
        { "id": "node-cor-1", "label": "Strait of Hormuz", "type": "corridor", "status": "healthy", "x": 280, "y": 220, "details": { "flowRate": "18.5M bpd", "riskScore": 28, "delayDays": 0 } },
        { "id": "node-cor-2", "label": "Bab-el-Mandeb (Red Sea)", "type": "corridor", "status": "healthy", "x": 280, "y": 380, "details": { "flowRate": "7.8M bpd", "riskScore": 45, "delayDays": 0 } },
        # Ports
        { "id": "node-port-1", "label": "Jamnagar Port (Gujarat)", "type": "port", "status": "healthy", "x": 480, "y": 200, "details": { "capacity": "2.5M bpd", "stockLevelPercent": 82, "location": "Gujarat Coast" } },
        { "id": "node-port-2", "label": "Mundra Port (Gujarat)", "type": "port", "status": "healthy", "x": 480, "y": 320, "details": { "capacity": "1.8M bpd", "stockLevelPercent": 78, "location": "Kutch Gulf" } },
        { "id": "node-port-3", "label": "Kochi Port (Kerala)", "type": "port", "status": "healthy", "x": 480, "y": 440, "details": { "capacity": "1.2M bpd", "stockLevelPercent": 75, "location": "Malabar Coast" } },
        # Refineries
        { "id": "node-ref-1", "label": "Reliance Jamnagar Refinery", "type": "refinery", "status": "healthy", "x": 680, "y": 210, "details": { "capacity": "1.24M bpd", "stockLevelPercent": 88 } },
        { "id": "node-ref-2", "label": "IOCL Koyali Refinery", "type": "refinery", "status": "healthy", "x": 680, "y": 310, "details": { "capacity": "270k bpd", "stockLevelPercent": 75 } },
        { "id": "node-ref-3", "label": "BPCL Kochi Refinery", "type": "refinery", "status": "healthy", "x": 680, "y": 410, "details": { "capacity": "310k bpd", "stockLevelPercent": 70 } },
        # Distribution
        { "id": "node-dist-1", "label": "Northern Grid (NCR / Punjab)", "type": "distribution", "status": "healthy", "x": 880, "y": 150, "details": { "capacity": "Demand: 1.2M bpd", "delayDays": 0 } },
        { "id": "node-dist-2", "label": "Western Industrial Hub", "type": "distribution", "status": "healthy", "x": 880, "y": 280, "details": { "capacity": "Demand: 1.6M bpd", "delayDays": 0 } },
        { "id": "node-dist-3", "label": "Southern Power Grid", "type": "distribution", "status": "healthy", "x": 880, "y": 410, "details": { "capacity": "Demand: 950k bpd", "delayDays": 0 } }
    ]

    # Map node index positions to verify anomalies quickly
    for node in nodes:
        label = node["label"]
        # Match weather alerts
        match_w = next((w for w in latest_weather_alerts if w["location"] in label), None)
        if match_w and match_w["is_anomaly"] != "stable":
            node["status"] = match_w["is_anomaly"]
            
        # Match critical intelligence
        match_i = next((i for i in latest_crisis_intelligence if i["severity"] in ["critical", "high"] and i["headline"].lower().find(label.split(" (")[0].lower()) != -1), None)
        if match_i:
            node["status"] = "critical" if match_i["severity"] == "critical" else "warning"

    latest_digital_twin = {
        "nodes": nodes,
        "edges": [
            { "id": "edge-1", "source": "node-src-1", "target": "node-cor-1", "status": nodes[3]["status"], "flowPercent": 75, "pulseSpeed": 4 if nodes[3]["status"] == "healthy" else 15 },
            { "id": "edge-2", "source": "node-src-2", "target": "node-cor-1", "status": nodes[3]["status"], "flowPercent": 90, "pulseSpeed": 5 },
            { "id": "edge-3", "source": "node-src-3", "target": "node-cor-1", "status": "warning" if nodes[3]["status"] == "critical" else "healthy", "flowPercent": 60, "pulseSpeed": 8 },
            { "id": "edge-4", "source": "node-src-1", "target": "node-cor-2", "status": nodes[4]["status"], "flowPercent": 25, "pulseSpeed": 6 },
            { "id": "edge-5", "source": "node-cor-1", "target": "node-port-1", "status": nodes[5]["status"], "flowPercent": 50, "pulseSpeed": 3 },
            { "id": "edge-6", "source": "node-cor-1", "target": "node-port-2", "status": nodes[6]["status"], "flowPercent": 40, "pulseSpeed": 4 },
            { "id": "edge-7", "source": "node-cor-2", "target": "node-port-3", "status": nodes[7]["status"], "flowPercent": 95, "pulseSpeed": 12 },
            { "id": "edge-8", "source": "node-port-1", "target": "node-ref-1", "status": nodes[8]["status"], "flowPercent": 100, "pulseSpeed": 2 },
            { "id": "edge-9", "source": "node-port-2", "target": "node-ref-2", "status": nodes[9]["status"], "flowPercent": 80, "pulseSpeed": 3 },
            { "id": "edge-10", "source": "node-port-3", "target": "node-ref-3", "status": nodes[10]["status"], "flowPercent": 70, "pulseSpeed": 5 },
            { "id": "edge-11", "source": "node-ref-1", "target": "node-dist-1", "status": nodes[11]["status"], "flowPercent": 40, "pulseSpeed": 2 },
            { "id": "edge-12", "source": "node-ref-1", "target": "node-dist-2", "status": nodes[12]["status"], "flowPercent": 60, "pulseSpeed": 2 },
            { "id": "edge-13", "source": "node-ref-2", "target": "node-dist-2", "status": nodes[12]["status"], "flowPercent": 100, "pulseSpeed": 3 },
            { "id": "edge-14", "source": "node-ref-3", "target": "node-dist-3", "status": nodes[13]["status"], "flowPercent": 100, "pulseSpeed": 6 }
        ]
    }

    # 6. Live War Room Scenario
    # Dynamically generated scenario steps mapped to latest critical intelligence alerts
    active_critical = [i for i in latest_crisis_intelligence if i["severity"] in ["critical", "high"]]
    steps = []
    if active_critical:
        for idx, intel in enumerate(active_critical[:5]):
            steps.append({
                "timeOffset": idx * 8,
                "headline": intel["headline"].upper(),
                "details": intel["summary"],
                "alertSeverity": intel["severity"],
                "riskIndexChange": int(intel["impactScore"]),
                "brentPriceChange": round(intel["economic_loss_usd_m"] / 20.0, 2),
                "impactedNodes": ["node-cor-1" if "Hormuz" in intel["headline"] else "node-cor-2" if "Red Sea" in intel["headline"] or "Mandeb" in intel["headline"] else "node-port-1"],
                "causalChainStep": idx
            })
    else:
        # Default scenario steps if no active critical news is loaded
        steps = [
            {
                "timeOffset": 0,
                "headline": "GEOPOLITICAL CRISIS TRIGGERED",
                "details": "Unidentified suicide drone attacks two commercial tankers loading crude at Fujairah Anchorage outside the Strait of Hormuz. Small explosions reported on hulls. Fires under control.",
                "alertSeverity": "high",
                "riskIndexChange": 15,
                "brentPriceChange": 3.20,
                "impactedNodes": ["node-cor-1"],
                "causalChainStep": 0
            },
            {
                "timeOffset": 8,
                "headline": "STRAIT OF HORMUZ PARTIALLY CLOSED",
                "details": "Regional military naval force establishes a temporary security search zone. All commercial tankers halted or ordered to hold position. Shipping lane transit capacity down 70%. Insurance underwriters suspend new cover certificates.",
                "alertSeverity": "critical",
                "riskIndexChange": 35,
                "brentPriceChange": 8.50,
                "impactedNodes": ["node-cor-1", "node-port-1", "node-port-2"],
                "causalChainStep": 1
            }
        ]
    latest_war_room = steps

async def run_periodic_tasks():
    logger.info("Background periodic ingestion loop started.")
    while True:
        try:
            db = SessionLocal()
            await fetch_and_store_commodity_prices(db)
            await fetch_and_store_news(db)
            await fetch_and_store_weather(db)
            await fetch_and_store_disasters(db)
            update_global_cache(db)
            db.close()
        except Exception as e:
            logger.error(f"Error in background ingestion loop: {e}", exc_info=True)
        # Sleep for 5 minutes
        await asyncio.sleep(300)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    
    # Initialize some mock data if DB is empty to make sure we don't start with blank views
    db = SessionLocal()
    if not db.query(CommodityPriceHistoryDB).first():
        logger.info("Initializing DB with initial commodity records.")
        for p in [78.4, 79.1, 77.9, 81.5, 84.6, 86.2]:
            db.add(CommodityPriceHistoryDB(brent_price=p, wti_price=p-4.0, lng_price=10.0 + (p/10.0)))
        db.commit()

    if not db.query(SupplierDB).first():
        logger.info("Initializing DB with initial supplier profiles.")
        suppliers = [
            SupplierDB(name="Saudi Aramco", country="Saudi Arabia", political_stability=78.0, base_price=76.5, shipping_time=14, capacity=12000000, risk_score=28.0, reliability=95.0),
            SupplierDB(name="ADNOC", country="United Arab Emirates", political_stability=84.0, base_price=78.0, shipping_time=13, capacity=4000000, risk_score=22.0, reliability=94.0),
            SupplierDB(name="Petrobras", country="Brazil", political_stability=72.0, base_price=74.0, shipping_time=24, capacity=3200000, risk_score=35.0, reliability=88.0),
            SupplierDB(name="NNPC", country="Nigeria", political_stability=48.0, base_price=72.8, shipping_time=22, capacity=1500000, risk_score=58.0, reliability=70.0),
            SupplierDB(name="Equinor", country="Norway", political_stability=98.0, base_price=83.5, shipping_time=26, capacity=2000000, risk_score=5.0, reliability=99.0),
            SupplierDB(name="Rosneft (Sanctioned)", country="Russia", political_stability=35.0, base_price=62.0, shipping_time=32, capacity=9600000, risk_score=85.0, reliability=60.0)
        ]
        db.add_all(suppliers)
        db.commit()
    db.close()
    
    # Run the worker immediately to populate cache
    loop = asyncio.get_event_loop()
    loop.create_task(run_periodic_tasks())

# Endpoints
@app.get("/health")
def health_check():
    return {"status": "operational", "project": settings.PROJECT_NAME}

@app.get("/api/suppliers")
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(SupplierDB).all()
    # Apply dynamic risk modifications based on digital twin corridor statuses
    # For example, if Strait of Hormuz node is warning/critical, raise risk score for Gulf suppliers
    hormuz_status = "healthy"
    if latest_digital_twin and "nodes" in latest_digital_twin:
        hormuz_node = next((n for n in latest_digital_twin["nodes"] if n["id"] == "node-cor-1"), None)
        if hormuz_node:
            hormuz_status = hormuz_node["status"]
            
    out = []
    for s in suppliers:
        risk = s.risk_score
        if s.country in ["Saudi Arabia", "United Arab Emirates", "Iraq"] and hormuz_status != "healthy":
            risk = min(100.0, s.risk_score + (35.0 if hormuz_status == "critical" else 15.0))
        out.append({
            "id": f"sup-{s.id}",
            "name": s.name,
            "country": s.country,
            "politicalStabilityScore": s.political_stability,
            "basePricePerBarrel": s.base_price,
            "shippingLeadTimeDays": s.shipping_time,
            "capacityBarrelsPerDay": s.capacity,
            "riskScore": risk,
            "reliabilityRating": s.reliability
        })
    return out

@app.get("/api/commodity-feed")
def get_commodity_feed():
    if not latest_commodity_feed:
        # Emergency backup response if cache hasn't loaded yet
        return [
            { "date": "Live Spot", "brentOil": 86.20, "wtiOil": 82.50, "lngNaturalGas": 12.10 }
        ]
    return latest_commodity_feed

@app.get("/api/crisis-intelligence")
def get_crisis_intelligence():
    if not latest_crisis_intelligence:
        return [
            {
                "id": "intel-default",
                "timestamp": "Just now",
                "source": "System Monitor",
                "headline": "GeoPulse secure intelligence stream active",
                "description": "Ingesting data channels from satellite radars, naval AIS streams, and commodity spot feeds.",
                "severity": "low",
                "category": "shipping",
                "impactScore": 10,
                "summary": "Monitoring global chokepoints and maritime corridors.",
                "economic_loss_usd_m": 0.0,
                "gdp_drag_percent": 0.0,
                "supply_disruption_forecast": "No major chokepoint delays detected."
            }
        ]
    return latest_crisis_intelligence

@app.get("/api/weather-alerts")
def get_weather_alerts():
    return {
        "weather": latest_weather_alerts,
        "disasters": latest_disaster_alerts
    }

@app.get("/api/digital-twin")
def get_digital_twin():
    if not latest_digital_twin or "nodes" not in latest_digital_twin:
        return {
            "nodes": [],
            "edges": []
        }
    return latest_digital_twin

@app.get("/api/war-room")
def get_war_room():
    return latest_war_room

@app.post(f"{settings.API_V1_STR}/simulate")
async def simulate_scenario(payload: SimulateRequest = None):
    # Maintain legacy simulator support
    agent = GeminiAgent()
    # Mock payload extraction (if none is sent)
    c_type = "hormuz"
    severity = "high"
    duration = 30
    if payload:
        c_type = payload.crisis_type
        severity = payload.severity
        duration = payload.duration
        
    briefing = await agent.get_crisis_briefing(
        crisis_type=c_type,
        severity=severity,
        duration=duration
    )
    
    multiplier = 3 if severity == "high" else 2 if severity == "medium" else 1
    duration_factor = duration / 30
    
    return {
        "summary": briefing,
        "economic_loss_usd_m": round(420 * multiplier * duration_factor, 1),
        "gdp_impact_percent": round(-0.25 * multiplier * duration_factor, 2),
        "refinery_stress_index": min(100, round(25 * multiplier * duration_factor)),
        "inventory_depletion_days": max(2, round(20 / (multiplier * duration_factor)))
    }

@app.post(f"{settings.API_V1_STR}/copilot")
async def copilot_chat(payload: ChatRequest):
    agent = GeminiAgent()
    response = await agent.get_copilot_response(payload.message)
    return {"response": response, "confidence": 92}

@app.post(f"{settings.API_V1_STR}/evaluate-signal")
def evaluate_geopolitical_signal(payload: SignalRequest):
    inputs = {
        "raw_signal": payload.signal_text,
        "severity": "",
        "impacted_regions": [],
        "threat_assessment": "",
        "action_plan": []
    }
    result = app_graph.invoke(inputs)
    return {
        "signal": payload.signal_text,
        "severity_level": result["severity"],
        "threat_assessment": result["threat_assessment"],
        "action_plan": result["action_plan"]
    }


