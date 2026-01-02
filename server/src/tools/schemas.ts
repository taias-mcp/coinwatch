// JSON Schema objects for MCP tool registration
// 5 stateless tools for the CoinWatch demo flow

export const listCoinsSchema = {
  name: "list_coins",
  description:
    "List available cryptocurrencies with current prices and market data. Returns top coins by market cap.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 50,
        default: 10,
        description: "Number of coins to return (max 50)"
      },
      category: {
        type: "string",
        enum: ["all", "defi", "stablecoins", "meme"],
        default: "all",
        description: "Filter by category"
      }
    },
    required: []
  }
} as const;

export const getPriceSchema = {
  name: "get_price",
  description:
    "Get detailed current price and market metrics for a specific cryptocurrency.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      coin_id: {
        type: "string",
        description: "The coin ID (e.g., 'bitcoin', 'ethereum', 'solana')"
      }
    },
    required: ["coin_id"]
  }
} as const;

export const getHistorySchema = {
  name: "get_history",
  description:
    "Get historical price data for a cryptocurrency over a specified time period.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      coin_id: {
        type: "string",
        description: "The coin ID (e.g., 'bitcoin', 'ethereum', 'solana')"
      },
      days: {
        type: "integer",
        enum: [7, 30, 90],
        default: 7,
        description: "Number of days of historical data (7, 30, or 90)"
      }
    },
    required: ["coin_id"]
  }
} as const;

export const getSentimentSchema = {
  name: "get_sentiment",
  description:
    "Get news and social sentiment analysis for a cryptocurrency. Powered by web search.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      coin_id: {
        type: "string",
        description: "The coin ID (e.g., 'bitcoin', 'ethereum', 'solana')"
      }
    },
    required: ["coin_id"]
  }
} as const;

export const executeInvestmentSchema = {
  name: "execute_investment",
  description:
    "Execute a simulated investment in a cryptocurrency. This is a demo - no real money is involved.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      coin_id: {
        type: "string",
        description: "The coin ID to invest in (e.g., 'bitcoin', 'ethereum')"
      },
      amount_usd: {
        type: "number",
        minimum: 1,
        maximum: 100000,
        description: "Amount to invest in USD"
      }
    },
    required: ["coin_id", "amount_usd"]
  }
} as const;

// Export all schemas as an array for easy registration
export const allToolSchemas = [
  listCoinsSchema,
  getPriceSchema,
  getHistorySchema,
  getSentimentSchema,
  executeInvestmentSchema
] as const;
