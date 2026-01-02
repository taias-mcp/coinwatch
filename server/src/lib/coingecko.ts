/**
 * CoinGecko API Client
 * 
 * Provides typed access to CoinGecko's free API with caching
 * to respect rate limits (30 calls/min free, 500/min with API key).
 */

// Cache configuration
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// CoinGecko API base URL
const BASE_URL = "https://api.coingecko.com/api/v3";

// API response types
export interface CoinGeckoMarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinGeckoCoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_rank: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
    atl_date: { usd: string };
  };
  last_updated: string;
}

export interface CoinGeckoMarketChart {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// API error type
export class CoinGeckoError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isRateLimit: boolean = false
  ) {
    super(message);
    this.name = "CoinGeckoError";
  }
}

/**
 * Make a request to CoinGecko API
 */
async function fetchCoinGecko<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const cacheKey = url;
  
  // Check cache first
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Build headers
  const headers: HeadersInit = {
    "Accept": "application/json",
  };
  
  // Add API key if available (increases rate limit)
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new CoinGeckoError(
          "Rate limit exceeded. Please try again in a moment.",
          429,
          true
        );
      }
      throw new CoinGeckoError(
        `CoinGecko API error: ${response.statusText}`,
        response.status
      );
    }
    
    const data = await response.json() as T;
    
    // Cache the response
    setCache(cacheKey, data);
    
    return data;
  } catch (error) {
    if (error instanceof CoinGeckoError) {
      throw error;
    }
    throw new CoinGeckoError(
      `Failed to fetch from CoinGecko: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get list of coins with market data
 */
export async function getCoinsMarkets(options: {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
  category?: string;
} = {}): Promise<CoinGeckoMarketCoin[]> {
  const {
    vs_currency = "usd",
    order = "market_cap_desc",
    per_page = 10,
    page = 1,
    category
  } = options;
  
  let endpoint = `/coins/markets?vs_currency=${vs_currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=false`;
  
  if (category && category !== "all") {
    endpoint += `&category=${category}`;
  }
  
  return fetchCoinGecko<CoinGeckoMarketCoin[]>(endpoint);
}

/**
 * Get detailed data for a specific coin
 */
export async function getCoinData(coinId: string): Promise<CoinGeckoCoinDetail> {
  const endpoint = `/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
  return fetchCoinGecko<CoinGeckoCoinDetail>(endpoint);
}

/**
 * Get historical market data for a coin
 */
export async function getCoinMarketChart(
  coinId: string,
  days: number = 7
): Promise<CoinGeckoMarketChart> {
  const endpoint = `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  return fetchCoinGecko<CoinGeckoMarketChart>(endpoint);
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
}

