// Tool: get_price
// Get detailed current price and market metrics for a cryptocurrency

import { getCoinById } from "../data/coins-catalog.js";
import { getCoinData, CoinGeckoError } from "../lib/coingecko.js";
import type { GetPriceInput, GetPriceOutput, MCPToolResponse } from "../lib/types.js";

/**
 * Handle get_price tool call
 */
export async function handleGetPrice(input: GetPriceInput): Promise<MCPToolResponse<GetPriceOutput>> {
  const { coin_id } = input;

  try {
    // Try to fetch from CoinGecko API
    const coinData = await getCoinData(coin_id);
    const md = coinData.market_data;

    const metrics = {
      current_price: md.current_price.usd,
      price_change_24h: md.price_change_24h,
      price_change_percentage_24h: md.price_change_percentage_24h,
      high_24h: md.high_24h.usd,
      low_24h: md.low_24h.usd,
      market_cap: md.market_cap.usd,
      market_cap_rank: md.market_cap_rank,
      total_volume: md.total_volume.usd,
      circulating_supply: md.circulating_supply,
      total_supply: md.total_supply,
      max_supply: md.max_supply,
      ath: md.ath.usd,
      ath_change_percentage: md.ath_change_percentage.usd,
      ath_date: md.ath_date.usd,
      atl: md.atl.usd,
      atl_change_percentage: md.atl_change_percentage.usd,
      atl_date: md.atl_date.usd
    };

    // Format price display
    const priceDisplay = metrics.current_price < 1 
      ? `$${metrics.current_price.toFixed(4)}`
      : `$${metrics.current_price.toLocaleString()}`;

    const changeDirection = metrics.price_change_percentage_24h >= 0 ? "up" : "down";
    const changeDisplay = `${Math.abs(metrics.price_change_percentage_24h).toFixed(2)}%`;

    const contentText = `${coinData.name} (${coinData.symbol.toUpperCase()}) is currently trading at ${priceDisplay}, ${changeDirection} ${changeDisplay} in the last 24 hours.`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coin_id: coinData.id,
        symbol: coinData.symbol,
        name: coinData.name,
        image: coinData.image.large,
        metrics,
        last_updated: coinData.last_updated
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
          image: "",
          metrics: {
            current_price: 0,
            price_change_24h: 0,
            price_change_percentage_24h: 0,
            high_24h: 0,
            low_24h: 0,
            market_cap: 0,
            market_cap_rank: 0,
            total_volume: 0,
            circulating_supply: 0,
            total_supply: null,
            max_supply: null,
            ath: 0,
            ath_change_percentage: 0,
            ath_date: "",
            atl: 0,
            atl_change_percentage: 0,
            atl_date: ""
          },
          last_updated: new Date().toISOString(),
          error: errorObj
        }
      };
    }

    // Fall back to mock data on other API errors
    console.error("[get_price] CoinGecko API error, using mock data:", error);

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
          image: "",
          metrics: {
            current_price: 0,
            price_change_24h: 0,
            price_change_percentage_24h: 0,
            high_24h: 0,
            low_24h: 0,
            market_cap: 0,
            market_cap_rank: 0,
            total_volume: 0,
            circulating_supply: 0,
            total_supply: null,
            max_supply: null,
            ath: 0,
            ath_change_percentage: 0,
            ath_date: "",
            atl: 0,
            atl_change_percentage: 0,
            atl_date: ""
          },
          last_updated: new Date().toISOString(),
          error: errorObj
        }
      };
    }

    // Calculate 24h price change in USD
    const priceChange24h = coin.current_price * (coin.price_change_percentage_24h / 100);

    const metrics = {
      current_price: coin.current_price,
      price_change_24h: Number(priceChange24h.toFixed(2)),
      price_change_percentage_24h: coin.price_change_percentage_24h,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_change_percentage: coin.atl_change_percentage,
      atl_date: coin.atl_date
    };

    // Format price display
    const priceDisplay = coin.current_price < 1 
      ? `$${coin.current_price.toFixed(4)}`
      : `$${coin.current_price.toLocaleString()}`;

    const changeDirection = coin.price_change_percentage_24h >= 0 ? "up" : "down";
    const changeDisplay = `${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%`;

    const isRateLimit = error instanceof CoinGeckoError && error.isRateLimit;
    const contentText = `${coin.name} (${coin.symbol.toUpperCase()}) is currently trading at ${priceDisplay}, ${changeDirection} ${changeDisplay} in the last 24 hours.${isRateLimit ? " (Using cached data due to rate limit)" : " (Using demo data)"}`;

    return {
      content: [{ type: "text", text: contentText }],
      structuredContent: {
        coin_id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        metrics,
        last_updated: new Date().toISOString()
      }
    };
  }
}
