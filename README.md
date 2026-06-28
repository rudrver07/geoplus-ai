This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Backend Configuration & Setup

The **GeoPulse AI** backend is a FastAPI Python service that handles real-time data ingestion, database storage in PostgreSQL, and security signal evaluation using Gemini.

### Required Environment Variables

Create a `.env` file inside the `backend` folder with the following variables:

```env
# Database connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geopulse

# API Keys
GEMINI_API_KEY=your_google_gemini_api_key
EIA_API_KEY=your_us_eia_api_key
NEWS_API_KEY=your_news_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
NASA_FIRMS_KEY=your_nasa_firms_map_key
```

* **GEMINI_API_KEY**: Get a key from [Google AI Studio](https://aistudio.google.com/). Used for evaluating security signals and news briefings.
* **EIA_API_KEY**: Get a key from [EIA Open Data Portal](https://www.eia.gov/opendata/). Used for fetching live Brent, WTI, and LNG spot prices.
* **NEWS_API_KEY**: Get a key from [NewsAPI](https://newsapi.org/). Used alongside GDELT to crawl global geopolitical feeds.
* **OPENWEATHER_API_KEY**: Get a key from [OpenWeather](https://openweathermap.org/api). Used to monitor storm and cyclone anomalies at chokepoint regions.
* **NASA_FIRMS_KEY**: Get a free Map Key from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/config/map_key/). Used to monitor active fires/thermal anomalies near port terminals and refineries.

*Note: The backend has built-in grace fallbacks. If any of the optional keys are omitted or endpoints time out, the system will continue to generate dynamic simulated values in real-time without breaking.*

### Running the Backend locally

1. **Install Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Run Server**:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

