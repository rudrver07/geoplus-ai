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
