// Tool: get_history
// Get historical price data for a cryptocurrency

import { getCoinById, generateMockHistoricalData } from "../data/coins-catalog.js";
import { getCoinMarketChart, CoinGeckoError } from "../lib/coingecko.js";
import type { GetHistoryInput, GetHistoryOutput, MCPToolResponse } from "../lib/types.js";

/**
 * Handle get_history tool call
 */
export async function handleGetHistory(input: GetHistoryInput): Promise<MCPToolResponse<GetHistoryOutput>> {
  const { coin_id, days = 7 } = input;

  try {
    // Try to fetch from CoinGecko API
    const chartData = await getCoinMarketChart(coin_id, days);

    // Convert to our format
    const priceData = chartData.prices.map(([timestamp, price]) => ({
      timestamp,
      price: Number(price.toFixed(price < 1 ? 6 : 2))
    }));

    // Calculate stats from the data
    const prices = priceData.map(p => p.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChangePercentage = ((lastPrice - firstPrice) / firstPrice) * 100;

    // We need the coin name/symbol - try to get from catalog first
    const catalogCoin = getCoinById(coin_id);
    const coinName = catalogCoin?.name || coin_id;
    const coinSymbol = catalogCoin?.symbol || coin_id;

    const contentText = `${coinName} price history over the last ${days} days: High $${high.toLocaleString()}, Low $${low.toLocaleString()}, Change ${priceChangePercentage >= 0 ? '+' : ''}${priceChangePercentage.toFixed(2)}%.`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coin_id,
        symbol: coinSymbol,
        name: coinName,
        days,
        prices: priceData,
        price_change_percentage: Number(priceChangePercentage.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2))
      }
    };

  } catch (error) {
    // Check if it's a 404 (coin not found)
    if (error instanceof CoinGeckoError && error.statusCode === 404) {
      const errorObj = {
        code: "COIN_NOT_FOUND",
        message: `Cryptocurrency "${coin_id}" not found.`,
        suggestion: "Use list_coins to see available cryptocurrencies."
      };
      
      return {
        content: [{ type: "text", text: `Couldn't find cryptocurrency "${coin_id}".` }],
        structuredContent: {
          coin_id,
          symbol: "",
          name: "",
          days,
          prices: [],
          price_change_percentage: 0,
          high: 0,
          low: 0,
          error: errorObj
        }
      };
    }

    // Fall back to mock data on other API errors
    console.error("[get_history] CoinGecko API error, using mock data:", error);

    const coin = getCoinById(coin_id);

    if (!coin) {
      const errorObj = {
        code: "COIN_NOT_FOUND",
        message: `Cryptocurrency "${coin_id}" not found.`,
        suggestion: "Use list_coins to see available cryptocurrencies."
      };
      
      return {
        content: [{ type: "text", text: `Couldn't find cryptocurrency "${coin_id}".` }],
        structuredContent: {
          coin_id,
          symbol: "",
          name: "",
          days,
          prices: [],
          price_change_percentage: 0,
          high: 0,
          low: 0,
          error: errorObj
        }
      };
    }

    // Generate mock historical data
    const priceData = generateMockHistoricalData(coin, days);

    // Calculate stats from the data
    const prices = priceData.map(p => p.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChangePercentage = ((lastPrice - firstPrice) / firstPrice) * 100;

    const isRateLimit = error instanceof CoinGeckoError && error.isRateLimit;
    const contentText = `${coin.name} price history over the last ${days} days: High $${high.toLocaleString()}, Low $${low.toLocaleString()}, Change ${priceChangePercentage >= 0 ? '+' : ''}${priceChangePercentage.toFixed(2)}%.${isRateLimit ? " (Using cached data due to rate limit)" : " (Using demo data)"}`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coin_id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        days,
        prices: priceData,
        price_change_percentage: Number(priceChangePercentage.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2))
      }
    };
  }
}
