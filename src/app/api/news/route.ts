import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let query = searchParams.get("q") || "";
  
  if (!query || query === "oil shipping geopolitics chokepoint") {
    query = '(oil AND (imports OR exports)) OR "trade restrictions" OR sanctions OR tariffs OR "shipping disruptions" OR "geopolitical conflicts" OR "supply-chain risks"';
  }

  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    return NextResponse.json({ error: "NEWS_API_KEY is not configured in the environment" }, { status: 500 });
  }

  try {
    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=20&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`;
    
    const response = await fetch(newsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to fetch news from News API (Status: ${response.status})`);
    }

    const data = await response.json();
    const articles = data.articles || [];

    const items = articles
      .map((art: any) => {
        const pubDate = art.publishedAt || new Date().toISOString();
        return {
          id: `news-${Math.random().toString(36).substr(2, 9)}`,
          title: decodeHtmlEntities(art.title || ""),
          link: art.url || "",
          pubDate,
          source: decodeHtmlEntities(art.source?.name || "News API"),
          timestamp: formatRelativeTime(pubDate)
        };
      })
      .filter((item: any) => item.title && item.link);

    return NextResponse.json(items);

  } catch (error: any) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load news feed" }, { status: 500 });
  }
}

// Helpers
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function formatRelativeTime(dateStr: string): string {
  try {
    const pubTime = new Date(dateStr).getTime();
    const diffMs = Date.now() - pubTime;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  } catch {
    return "Recent";
  }
}
