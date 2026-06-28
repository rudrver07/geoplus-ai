import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "GeoPulse AI Backend"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./geopulse.db"
    )
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    EIA_API_KEY: str = os.getenv("EIA_API_KEY", "")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    NASA_FIRMS_KEY: str = os.getenv("NASA_FIRMS_KEY", "")
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        case_sensitive = True

settings = Settings()
