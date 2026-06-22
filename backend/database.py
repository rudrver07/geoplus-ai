from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from .config import settings

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
