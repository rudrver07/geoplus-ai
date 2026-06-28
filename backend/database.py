from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from .config import settings

if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB Models
class IncidentDB(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True)
    incident_type = Column(String)
    description = Column(Text)
    impact = Column(String)
    status = Column(String) # active, monitored, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SupplierDB(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String)
    political_stability = Column(Float)
    base_price = Column(Float)
    shipping_time = Column(Integer)
    capacity = Column(Integer)
    risk_score = Column(Float)
    reliability = Column(Float)

class CommodityPriceHistoryDB(Base):
    __tablename__ = "commodity_prices_history"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    brent_price = Column(Float)
    wti_price = Column(Float)
    lng_price = Column(Float)

class GeopoliticalIntelligenceDB(Base):
    __tablename__ = "geopolitical_intelligence"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    source = Column(String)
    headline = Column(String, index=True)
    description = Column(Text)
    severity = Column(String)  # low, medium, high, critical
    category = Column(String)  # military, production, shipping, embargo, weather
    impact_score = Column(Float)  # 0 to 100
    summary = Column(Text)
    economic_loss_usd_m = Column(Float)
    gdp_drag_percent = Column(Float)
    supply_disruption_forecast = Column(Text)

class WeatherAlertDB(Base):
    __tablename__ = "weather_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    location = Column(String, index=True)
    temp_c = Column(Float)
    weather_desc = Column(String)
    wind_speed_ms = Column(Float)
    is_anomaly = Column(String)  # stable, warning, critical

class DisasterAlertDB(Base):
    __tablename__ = "disaster_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    confidence = Column(Float)
    satellite = Column(String)
    alert_type = Column(String)  # e.g., Fire, Cyclone

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
