/**
 * Tavily API Client
 * 
 * Provides web search functionality for sentiment analysis.
 * Requires TAVILY_API_KEY environment variable.
 */

// Tavily API base URL
const BASE_URL = "https://api.tavily.com";

// API response types
export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  response_time: number;
}

// API error type
export class TavilyError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "TavilyError";
  }
}

/**
 * Search the web using Tavily API
 */
export async function searchWeb(
  query: string,
  options: {
    max_results?: number;
    search_depth?: "basic" | "advanced";
    include_domains?: string[];
    exclude_domains?: string[];
  } = {}
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new TavilyError(
      "TAVILY_API_KEY environment variable is not set. Sentiment analysis requires a Tavily API key."
    );
  }
  
  const {
    max_results = 5,
    search_depth = "basic",
    include_domains = [],
    exclude_domains = []
  } = options;
  
  try {
    const response = await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results,
        search_depth,
        include_domains,
        exclude_domains
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new TavilyError("Invalid Tavily API key.", 401);
      }
      if (response.status === 429) {
        throw new TavilyError("Tavily rate limit exceeded.", 429);
      }
      throw new TavilyError(
        `Tavily API error: ${response.statusText}`,
        response.status
      );
    }
    
    const data = await response.json() as TavilySearchResponse;
    return data;
    
  } catch (error) {
    if (error instanceof TavilyError) {
      throw error;
    }
    throw new TavilyError(
      `Failed to search with Tavily: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Check if Tavily API is configured
 */
export function isTavilyConfigured(): boolean {
  return !!process.env.TAVILY_API_KEY;
}

