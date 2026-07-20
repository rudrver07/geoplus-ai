# GeoPulse AI — Tactical Geopolitical & Supply Chain Risk Intelligence Hub

GeoPulse AI is a secure strategic overwatch portal designed to monitor global transit chokepoints, predict supply chain disruptions, evaluate geopolitical risk vectors, and coordinate emergency responses. 

By combining real-time environmental telemetry, news crawlers, commodity spot prices, and satellite thermal anomaly feeds with LangGraph workflows and Google Gemini-powered intelligence, GeoPulse AI transforms raw geopolitical signals into structured, actionable policy directives within minutes.

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Key Features & Capabilities](#key-features--capabilities)
   - [1. Tactical Operations Console (Dashboard)](#1-tactical-operations-console-dashboard)
   - [2. Strategic Crisis Simulator](#2-strategic-crisis-simulator)
   - [3. AI Decision Copilot](#3-ai-decision-copilot)
   - [4. Procurement Intelligence & Supplier Hub](#4-procurement-intelligence--supplier-hub)
   - [5. National Supply Chain Digital Twin](#5-national-supply-chain-digital-twin)
   - [6. National War Room Command Center](#6-national-war-room-command-center)
4. [Continuous Ingestion Pipelines & Integrations](#continuous-ingestion-pipelines--integrations)
5. [Data Models & Schema Details](#data-models--schema-details)
6. [Local Development Setup](#local-development-setup)
   - [Backend Configuration & Launch](#backend-configuration--launch)
   - [Frontend Configuration & Launch](#frontend-configuration--launch)
7. [System OVERWATCH Classification](#system-overwatch-classification)

---

## System Architecture

```mermaid
graph TD
    %% Data Sources
    subgraph Data Ingestion Pipelines
        EIA[US EIA API - Spot Prices]
        News[NewsAPI - Geopolitical Feeds]
        Weather[OpenWeather API - Marine Telemetry]
        NASA[NASA FIRMS API - Thermal Anomaly Satellite Data]
    end

    %% Backend Services
    subgraph FastAPI Backend App
        Ingest[Background Ingestion Loop / Cache Manager]
        DB[(SQLite / PostgreSQL Database)]
        Gemini[Gemini 1.5 Pro - Risk Assessment & RAG]
        LGraph[LangGraph - Structured Policy Execution]
    end

    %% Frontend App
    subgraph Next.js Tactical UI
        Dashboard[Tactical Operations Console]
        Simulator[Strategic Crisis Simulator]
        Copilot[AI Decision Copilot]
        Procurement[Procurement Intelligence]
        Twin[Digital Twin Flow Graph]
        WarRoom[War Room Command Matrix]
    end

    %% Data Flow Connections
    EIA --> Ingest
    News --> Ingest
    Weather --> Ingest
    NASA --> Ingest

    Ingest --> DB
    Ingest --> Gemini
    Ingest --> LGraph

    DB --> Dashboard
    Gemini --> Copilot
    Gemini --> Simulator
    LGraph --> WarRoom
    DB --> Procurement
    DB --> Twin
```

---

## Technology Stack

- **Frontend Core**: Next.js 15, TypeScript, Vanilla CSS + TailwindCSS, Framer Motion
- **Data Visualization**: Recharts (price charts, risk timeline, supplier reliability grids), Lucide Icons
- **Interactive UI**: Responsive SVG Vector Map nodes and paths, interactive Legend overlays
- **Backend Framework**: FastAPI (Python 3)
- **Database ORM**: SQLAlchemy (configured for PostgreSQL with a local SQLite `geopulse.db` fallback)
- **AI Engine**: `google-generativeai` (Gemini 1.5 Pro model), `langgraph` (structured agent states & workflows)
- **Auditory Alerts**: Web Audio API (real-time synthesizer for War Room alerts & sonar cues)

---

## Key Features & Capabilities

### 1. Tactical Operations Console (Dashboard)
A dynamic monitoring deck displaying real-time metrics and threat evaluations.
* **Live Shipping Risks Overlay**: Integrates a spinning interactive SVG vector globe with clickable transit corridors (Strait of Hormuz, Bab-el-Mandeb, etc.) to view flow capacity, coordinates, and localized risk scores.
* **Critical Incident Feed**: A real-time log of security events (category, severity index, region, and timestamp) with a manual "Refresh Feed" POST endpoint trigger to update telemetry.
* **Risk Analytics**: Displays Recharts timeline charts tracking aggregate chokepoint risk indices alongside a Top Threat Regions Matrix (summarizing risk percentage, vulnerability factors, and active threats).
* **Shipping Intelligence**: Displays bar charts of daily throughput flows (Million bpd) versus congestion index percentages, and logs incidents in the Recent Incidents Registry.
* **Market Signals**: Area charts mapping WTI/Brent crude prices, LNG natural gas spot volatility, and crude market premiums.
* **Live News Terminal**: Real-time Google News search and integration. Users can query specific terms directly and receive verified articles with links to original sources.

### 2. Strategic Crisis Simulator
Models geopolitical blockades and OPEC production squeezes to evaluate national stock vulnerability.
* **Configure Scenario Parameters**: Define incident types (Strait of Hormuz Naval Closure, OPEC Production Quotas, Port Cyber Sabotage), severity level thresholds (`low`, `medium`, `high`), and expected duration parameters (1 to 60 days) on impacted corridors.
* **Forecasting Metrics**: Computes direct estimations of Economic Losses, GDP Drag %, CPI Inflation, Pump Fuel Price Surges, and Refinery Stress indices.
* **Reserve Stock Integrity**: Tracks strategic reserve depletion horizons (in days) and rings alarms if levels dip below safe thresholds.
* **Animated Risk Propagation Flow**: A visual 5-stage causal chain mapping step-by-step risk transmission from the initial event downstream to delays, supply shock, refinery stress, and retail inflation.
* **Gemini Recommendations & PDF Generation**: Generates contextual policy recommendations with confidence percentages and a print-friendly action briefing PDF.

### 3. AI Decision Copilot
A RAG-enabled chat terminal to query operational guidelines and model transit alternatives.
* **Gemini Agent Chat**: A terminal-style console for council members to query options (e.g. "What if Hormuz closes for 15 days?").
* **Source Citations**: A reference sidebar listing source documents (such as IEA directives or naval shipping registries) to ensure data authenticity.
* **Certainty Confidence Gauge**: A circular gauge showing the confidence percentage of Gemini's recommendation based on historical corridor matching.
* **Preset Prompt Chips**: Speed dial queries for rapid modeling of closures, alternate routes, and inflation drags.

### 4. Procurement Intelligence & Supplier Hub
Allows logistics teams to compare alternative routes and diversify spot market purchases.
* **Supplier Matrices**: Filters providers based on political stability ratings, shipping lead times, maximum prices per barrel, and origin regions.
* **Reliability vs Risk Profile Chart**: A bar chart visually highlighting high-reliability suppliers (Petrobras, ADNOC, Equinor) against high-risk options (Rosneft).
* **Shipping Corridor Routing Comparison**: Directly compares routes:
  * *Suez Canal Transit (Normal)*: High risk, short distance, standard insurance premium.
  * *Cape of Good Hope Bypass (Alternative)*: Low risk, long distance (+12 days), higher fuel premium, open ocean.
  * *Northern Sea Route (NSR)*: Critical ice risk, ultra-short distance, extreme ice fields insurance premium.

### 5. National Supply Chain Digital Twin
Topological SVG flow graph representing the national energy lifeline from import sources to the grid.
* **Topological Node Types**: Visualizes Sources, Maritime Corridors, Domestic Ports, Refineries, and Distribution Grids.
* **Interactive SVG Canvas**: Search bar filters, node category filters, and zoom modifiers (Zoom In, Zoom Out, Reset view).
* **Live Pulse Flows**: Animated pulse dots showing speed, flow percent, and direction along pipeline connections.
* **Red Sea Disruption Simulation**: A manual triggers step-by-step downstream propagation:
  1. *Strait of Bab-el-Mandeb blockaded* (status critical).
  2. *Kochi Port stock levels fall* (supplies depleted).
  3. *BPCL Kochi Refinery throttles throughput* (stress active).
  4. *Southern Power Grid experiences rolling shortages* (distribution failures).

### 6. National War Room Command Center
An emergency coordination panel for high-alert scenarios.
* **Breaking News Ticker Banner**: Flashes real-time red alerts and breaking stories across the deck.
* **Web Audio API Sound Effects**: Synthesizes warning sirens and sonar ping sound cues during crisis events.
* **Emergency Checklists**: Tracks resolution status of items like naval convoys, strategic reserve releases, bilateral swaps, and voluntary industrial conservation rules.
* **Active Theatre Map**: Highlights disrupted zones and ports dynamically.
* **Chronological playback**: Plays through historical or synthesized crises step-by-step, adjusting market volatility indexes.

---

## Continuous Ingestion Pipelines & Integrations

The FastAPI backend runs a background ingestion worker (refreshing every 5 minutes) integrating with the following data streams:
1. **US EIA Open Data Portal**: Fetches Brent, WTI, and LNG spot prices.
2. **NewsAPI**: Crawls geopolitical news streams using targeted queries.
3. **OpenWeather API**: Monitors severe weather and tropical cyclone anomalies at port coordinates.
4. **NASA FIRMS (MODIS/VIIRS)**: Tracks thermal anomalies and fire reports near refineries.
5. **Google Gemini 1.5 Pro Engine**: Translates raw text feeds into structured threat variables.

*Note: The backend has built-in fallbacks. If API limits are reached or keys are omitted, the worker simulates dynamic fluctuations and values automatically, keeping the console fully functional.*

---

## Data Models & Schema Details

Stored in SQL database using SQLAlchemy:
* **`SupplierDB`**: Profiles of suppliers (political stability, base price, shipping lead times, reliability, risk).
* **`CommodityPriceHistoryDB`**: Chronological log of Brent, WTI, and LNG Spot values.
* **`GeopoliticalIntelligenceDB`**: Evaluated news, impact scores, GDP drag, and supply chain disruptions.
* **`WeatherAlertDB` & `DisasterAlertDB`**: Coordinates and severity levels of environmental hazards.

---

## Local Development Setup

### Backend Configuration & Setup

1. **Install Python Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file inside the `backend` folder:
   ```env
   # Database connection (SQLite fallback used automatically if omitted)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geopulse

   # API Keys
   GEMINI_API_KEY=your_google_gemini_api_key
   EIA_API_KEY=your_us_eia_api_key
   NEWS_API_KEY=your_news_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   NASA_FIRMS_KEY=your_nasa_firms_map_key
   ```

3. **Launch the FastAPI Server**:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

### Frontend Configuration & Setup

1. **Install Node Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## System OVERWATCH Classification

> [!WARNING]
> **GEOPULSE SECURITY CLASSIFIED — FOR INTERNAL MINISTRY REVIEW ONLY**
> Unauthorized duplication, distribution, or decryption of tactical telemetry data pipelines or supply chain digital twin files is strictly prohibited under National Security Directive 2026.
