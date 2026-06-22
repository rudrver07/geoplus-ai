import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "oil shipping geopolitics chokepoint";

  try {
    // Fetch RSS from Google News
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed from Google News");
    }

    const xmlText = await response.text();

    // Custom lightweight XML parser for RSS item structure
    // <item>
    //   <title>...</title>
    //   <link>...</link>
    //   <pubDate>...</pubDate>
    //   <source url="...">...</source>
    // </item>
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      const getTagContent = (tag: string) => {
        const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`);
        const m = regex.exec(itemContent);
        return m ? m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
      };

      const title = getTagContent("title");
      const link = getTagContent("link");
      const pubDate = getTagContent("pubDate");
      const source = getTagContent("source");

      // Build item
      if (title && link) {
        items.push({
          id: `news-${Math.random().toString(36).substr(2, 9)}`,
          title: decodeHtmlEntities(title),
          link,
          pubDate,
          source: decodeHtmlEntities(source) || "Google News",
          timestamp: formatRelativeTime(pubDate)
        });
      }
    }

    return NextResponse.json(items.slice(0, 20)); // Limit to 20 articles

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
  } catch (e) {
    return "Recent";
  }
}
