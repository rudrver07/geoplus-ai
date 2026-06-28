import google.generativeai as genai
from ..config import settings

class GeminiAgent:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel("gemini-1.5-pro")
        else:
            self.model = None

    async def get_crisis_briefing(self, crisis_type: str, severity: str, duration: int) -> str:
        """
        Generate a crisis advisory briefing from Gemini.
        """
        if not self.model:
            return (
                f"Gemini API offline. Simulated advice: Release strategic reserves for {crisis_type} at {severity} severity."
            )
        
        prompt = (
            f"Analyze an energy security crisis: {crisis_type} with severity level {severity} lasting {duration} days. "
            f"Provide 3 key threat impacts and 3 policy recommendations for the national grid."
        )
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error contacting Gemini: {str(e)}"
            
    async def get_copilot_response(self, user_query: str) -> str:
        """
        Get chat response for Copilot.
        """
        if not self.model:
            return "Gemini API offline. Please configure your API key."
        try:
            response = self.model.generate_content(user_query)
            return response.text
        except Exception as e:
            return f"Error processing chat: {str(e)}"

    async def analyze_geopolitical_news(self, headline: str, description: str) -> dict:
        """
        Analyze news and return a structured dictionary containing severity, impact, etc.
        """
        default_analysis = {
            "severity": "medium",
            "impact_score": 45.0,
            "summary": description[:200] if description else headline,
            "economic_loss_usd_m": 50.0,
            "gdp_drag_percent": -0.05,
            "supply_disruption_forecast": "No major chokepoint delays expected.",
            "category": "shipping"
        }

        # Apply rule-based fallbacks based on keywords
        combined = f"{headline} {description}".lower()
        if any(w in combined for w in ["drone", "attack", "explosion", "strike", "military", "missile"]):
            default_analysis.update({
                "severity": "critical",
                "impact_score": 85.0,
                "category": "military",
                "economic_loss_usd_m": 420.0,
                "gdp_drag_percent": -0.25,
                "supply_disruption_forecast": "Bab-el-Mandeb and Red Sea transit routes alert (+12 days bypass)."
            })
        elif any(w in combined for w in ["meeting", "quota", "opec", "production", "cut"]):
            default_analysis.update({
                "severity": "high",
                "impact_score": 72.0,
                "category": "production",
                "economic_loss_usd_m": 150.0,
                "gdp_drag_percent": -0.12,
                "supply_disruption_forecast": "Volatile spot market pricing expected. Strategic stockpiles monitored."
            })
        elif any(w in combined for w in ["sanction", "blacklist", "embargo"]):
            default_analysis.update({
                "severity": "high",
                "impact_score": 68.0,
                "category": "embargo",
                "economic_loss_usd_m": 110.0,
                "gdp_drag_percent": -0.08,
                "supply_disruption_forecast": "Additional tanker blacklists causing route rescheduling."
            })
        elif any(w in combined for w in ["storm", "cyclone", "weather", "typhoon", "hurricane"]):
            default_analysis.update({
                "severity": "medium",
                "impact_score": 50.0,
                "category": "weather",
                "economic_loss_usd_m": 80.0,
                "gdp_drag_percent": -0.04,
                "supply_disruption_forecast": "Temporary weather detours. Congestion expected at nearby ports."
            })

        if not self.model:
            return default_analysis

        prompt = f"""
Analyze the following geopolitical news item related to global oil supply chain, shipping corridors, or energy security:
Headline: {headline}
Description: {description}

You must return a raw JSON object (and nothing else) with exactly the following fields:
- "severity": "low", "medium", "high", or "critical"
- "impact_score": integer/float from 0 to 100
- "summary": a brief 1-2 sentence tactical summary
- "economic_loss_usd_m": float estimate of potential economic loss in millions USD
- "gdp_drag_percent": float estimate of GDP drag percentage (negative float or 0.0)
- "supply_disruption_forecast": a short description of route/port delays
- "category": "military", "production", "shipping", "embargo", or "weather"

Response format:
{{
  "severity": "...",
  "impact_score": 0,
  "summary": "...",
  "economic_loss_usd_m": 0.0,
  "gdp_drag_percent": 0.0,
  "supply_disruption_forecast": "...",
  "category": "..."
}}
"""
        try:
            # Generate content using Gemini
            response = self.model.generate_content(prompt)
            text = response.text
            
            # Clean up potential markdown formatting in response
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            text = text.strip()
            
            import json
            data = json.loads(text)
            
            # Ensure correct types
            if "severity" in data:
                data["severity"] = str(data["severity"]).lower()
            if "impact_score" in data:
                data["impact_score"] = float(data["impact_score"])
            if "economic_loss_usd_m" in data:
                data["economic_loss_usd_m"] = float(data["economic_loss_usd_m"])
            if "gdp_drag_percent" in data:
                data["gdp_drag_percent"] = float(data["gdp_drag_percent"])
            if "category" in data:
                data["category"] = str(data["category"]).lower()
                
            return data
        except Exception as e:
            # Return rule-based fallback if JSON parse or API fails
            print(f"Gemini evaluation error, using fallback: {str(e)}")
            return default_analysis

