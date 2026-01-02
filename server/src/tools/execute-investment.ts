// Tool: execute_investment
// Execute a simulated investment (demo only - no real transactions)

import { getCoinById } from "../data/coins-catalog.js";
import { getCoinData, CoinGeckoError } from "../lib/coingecko.js";
import type { ExecuteInvestmentInput, ExecuteInvestmentOutput, MCPToolResponse } from "../lib/types.js";

/**
 * Generate a deterministic transaction ID
 */
function generateTransactionId(coinId: string, amount: number): string {
  const hash = (coinId + amount.toString() + Date.now()).split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const positive = Math.abs(hash);
  return `CW-${positive.toString(36).toUpperCase().slice(0, 8)}`;
}

/**
 * Handle execute_investment tool call
 */
export async function handleExecuteInvestment(input: ExecuteInvestmentInput): Promise<MCPToolResponse<ExecuteInvestmentOutput>> {
  const { coin_id, amount_usd } = input;

  // Validate amount
  if (amount_usd < 1) {
    const error = {
      code: "INVALID_AMOUNT",
      message: "Investment amount must be at least $1.",
      suggestion: "Enter an amount of $1 or more."
    };
    
    return {
      content: [{ type: "text", text: "Investment amount must be at least $1." }],
      structuredContent: {
        transaction_id: "",
        status: "failed",
        investment: {
          coin_id,
          coin_name: "",
          coin_symbol: "",
          amount_usd,
          price_at_purchase: 0,
          coins_purchased: 0,
          fee_usd: 0,
          total_usd: 0
        },
        timestamp: new Date().toISOString(),
        disclaimer: "This is a demo - no real investment was made.",
        error
      }
    };
  }

  // Try to get real-time price from CoinGecko
  let coinName: string;
  let coinSymbol: string;
  let currentPrice: number;

  try {
    const coinData = await getCoinData(coin_id);
    coinName = coinData.name;
    coinSymbol = coinData.symbol;
    currentPrice = coinData.market_data.current_price.usd;
  } catch (error) {
    // Check if coin not found
    if (error instanceof CoinGeckoError && error.statusCode === 404) {
      const errorObj = {
        code: "COIN_NOT_FOUND",
        message: `Cryptocurrency "${coin_id}" not found.`,
        suggestion: "Use list_coins to see available cryptocurrencies."
      };
      
      return {
        content: [{ type: "text", text: `Couldn't find cryptocurrency "${coin_id}".` }],
        structuredContent: {
          transaction_id: "",
          status: "failed",
          investment: {
            coin_id,
            coin_name: "",
            coin_symbol: "",
            amount_usd,
            price_at_purchase: 0,
            coins_purchased: 0,
            fee_usd: 0,
            total_usd: 0
          },
          timestamp: new Date().toISOString(),
          disclaimer: "This is a demo - no real investment was made.",
          error: errorObj
        }
      };
    }

    // Fall back to mock data
    console.error("[execute_investment] CoinGecko API error, using mock data:", error);
    
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
          transaction_id: "",
          status: "failed",
          investment: {
            coin_id,
            coin_name: "",
            coin_symbol: "",
            amount_usd,
            price_at_purchase: 0,
            coins_purchased: 0,
            fee_usd: 0,
            total_usd: 0
          },
          timestamp: new Date().toISOString(),
          disclaimer: "This is a demo - no real investment was made.",
          error: errorObj
        }
      };
    }

    coinName = coin.name;
    coinSymbol = coin.symbol;
    currentPrice = coin.current_price;
  }

  // Calculate investment details
  const feePercentage = 0.01; // 1% fee
  const feeUsd = amount_usd * feePercentage;
  const netAmount = amount_usd - feeUsd;
  const coinsPurchased = netAmount / currentPrice;
  const totalUsd = amount_usd;

  // Generate transaction ID
  const transactionId = generateTransactionId(coin_id, amount_usd);

  const investment = {
    coin_id,
    coin_name: coinName,
    coin_symbol: coinSymbol.toUpperCase(),
    amount_usd,
    price_at_purchase: currentPrice,
    coins_purchased: Number(coinsPurchased.toFixed(8)),
    fee_usd: Number(feeUsd.toFixed(2)),
    total_usd: totalUsd
  };

  // Format for display
  const coinsDisplay = coinsPurchased < 1 
    ? coinsPurchased.toFixed(6) 
    : coinsPurchased.toFixed(4);

  const contentText = `Investment confirmed! You purchased ${coinsDisplay} ${coinSymbol.toUpperCase()} for $${amount_usd.toLocaleString()}. Transaction ID: ${transactionId}. Note: This is a demo - no real investment was made.`;

  return {
    content: [{ type: "text", text: contentText }],
    structuredContent: {
      transaction_id: transactionId,
      status: "confirmed",
      investment,
      timestamp: new Date().toISOString(),
      disclaimer: "This is a demo - no real investment was made. No actual cryptocurrency was purchased."
    }
  };
}
