// Shared TypeScript types for CoinWatch MCP Server
// 5 stateless tools for cryptocurrency tracking

// ============================================================================
// Common Types
// ============================================================================

/**
 * Standard error structure for graceful failures
 */
export interface ToolError {
  code: string;
  message: string;
  suggestion: string;
}

/**
 * Next action hint for widgets
 */
export interface NextAction {
  type: string;
  label: string;
  enabledIf?: string;
}

// ============================================================================
// Tool Input Types (Stateless)
// ============================================================================

export interface ListCoinsInput {
  limit?: number;
  category?: string;
}

export interface GetPriceInput {
  coin_id: string;
}

export interface GetHistoryInput {
  coin_id: string;
  days: 7 | 30 | 90;
}

export interface GetSentimentInput {
  coin_id: string;
}

export interface ExecuteInvestmentInput {
  coin_id: string;
  amount_usd: number;
}

// ============================================================================
// Tool Output Types
// ============================================================================

// --- list_coins ---

export interface CoinCard {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
}

export interface ListCoinsOutput {
  coins: CoinCard[];
  total_count: number;
  last_updated: string;
  error?: ToolError;
}

// --- get_price ---

export interface PriceMetrics {
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
}

export interface GetPriceOutput {
  coin_id: string;
  symbol: string;
  name: string;
  image: string;
  metrics: PriceMetrics;
  last_updated: string;
  error?: ToolError;
}

// --- get_history ---

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface GetHistoryOutput {
  coin_id: string;
  symbol: string;
  name: string;
  days: number;
  prices: PricePoint[];
  price_change_percentage: number;
  high: number;
  low: number;
  error?: ToolError;
}

// --- get_sentiment ---

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  snippet: string;
  published_date?: string;
}

export type SentimentScore = "bullish" | "bearish" | "neutral";

export interface GetSentimentOutput {
  coin_id: string;
  coin_name: string;
  sentiment: SentimentScore;
  sentiment_score: number; // -1 to 1
  news_items: NewsItem[];
  summary: string;
  powered_by: string;
  error?: ToolError;
}

// --- execute_investment ---

export interface InvestmentDetails {
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  amount_usd: number;
  price_at_purchase: number;
  coins_purchased: number;
  fee_usd: number;
  total_usd: number;
}

export interface ExecuteInvestmentOutput {
  transaction_id: string;
  status: "confirmed" | "failed";
  investment: InvestmentDetails;
  timestamp: string;
  disclaimer: string;
  error?: ToolError;
}

// ============================================================================
// Catalog Types (Internal / Mock Data)
// ============================================================================

export interface CatalogCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  description: string;
}

// ============================================================================
// MCP Response Types
// ============================================================================

export interface MCPToolResponse<T> {
  content: Array<{ type: "text"; text: string }>;
  structuredContent: T;
}
