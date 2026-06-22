from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from .config import settings
from .database import Base, engine, get_db, IncidentDB, SupplierDB
from .agents.gemini import GeminiAgent
from .agents.graph import app_graph

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup DB Tables creation
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class SimulationRequest(BaseModel):
    crisis_type: str
    severity: str
    duration: int
    regions: List[str]

class ChatRequest(BaseModel):
    message: str

class SignalRequest(BaseModel):
    signal_text: str

# Endpoints
@app.get("/health")
def health_check():
    return {"status": "operational", "project": settings.PROJECT_NAME}

@app.post(f"{settings.API_V1_STR}/simulate")
async def simulate_scenario(payload: SimulationRequest):
    agent = GeminiAgent()
    # Leverage Gemini reasoning to build a briefing
    briefing = await agent.get_crisis_briefing(
        crisis_type=payload.crisis_type,
        severity=payload.severity,
        duration=payload.duration
    )
    
    # Calculate mock metrics based on inputs
    multiplier = 3 if payload.severity == "high" else 2 if payload.severity == "medium" else 1
    duration_factor = payload.duration / 30
    
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
    # Execute LangGraph workflow state machine
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
