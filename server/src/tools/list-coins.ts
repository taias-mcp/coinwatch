// Tool: list_coins
// List available cryptocurrencies with market data

import { getAllCoins } from "../data/coins-catalog.js";
import { getCoinsMarkets, CoinGeckoError } from "../lib/coingecko.js";
import type { ListCoinsInput, ListCoinsOutput, CoinCard, MCPToolResponse } from "../lib/types.js";

/**
 * Handle list_coins tool call
 */
export async function handleListCoins(input: ListCoinsInput): Promise<MCPToolResponse<ListCoinsOutput>> {
  const { limit = 10, category = "all" } = input;

  try {
    // Try to fetch from CoinGecko API
    const apiCoins = await getCoinsMarkets({
      per_page: limit,
      category: category !== "all" ? category : undefined
    });

    // Convert to CoinCard format
    const coinCards: CoinCard[] = apiCoins.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume
    }));

    const contentText = coinCards.length > 0
      ? `Found ${coinCards.length} cryptocurrencies. Showing top coins by market cap.`
      : `No cryptocurrencies found for category "${category}".`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coins: coinCards,
        total_count: coinCards.length,
        last_updated: new Date().toISOString()
      }
    };

  } catch (error) {
    // Fall back to mock data on API error
    console.error("[list_coins] CoinGecko API error, using mock data:", error);

    let coins = getAllCoins();

    // Filter by category (mock implementation)
    if (category !== "all") {
      switch (category) {
        case "defi":
          coins = coins.filter(c => ["uniswap", "chainlink", "avalanche-2"].includes(c.id));
          break;
        case "stablecoins":
          coins = [];
          break;
        case "meme":
          coins = coins.filter(c => ["dogecoin"].includes(c.id));
          break;
      }
    }

    // Apply limit
    coins = coins.slice(0, limit);

    // Convert to CoinCard format
    const coinCards: CoinCard[] = coins.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume
    }));

    const isRateLimit = error instanceof CoinGeckoError && error.isRateLimit;
    const contentText = coinCards.length > 0
      ? `Found ${coinCards.length} cryptocurrencies.${isRateLimit ? " (Using cached data due to rate limit)" : " (Using demo data)"}`
      : `No cryptocurrencies found for category "${category}".`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coins: coinCards,
        total_count: coinCards.length,
        last_updated: new Date().toISOString()
      }
    };
  }
}
