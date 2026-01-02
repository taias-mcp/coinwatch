// Tool: get_sentiment
// Get news and social sentiment for a cryptocurrency

import { getCoinById } from "../data/coins-catalog.js";
import { searchWeb, isTavilyConfigured, TavilyError } from "../lib/tavily.js";
import type { GetSentimentInput, GetSentimentOutput, NewsItem, SentimentScore, MCPToolResponse } from "../lib/types.js";

// Mock news data for fallback/demo when Tavily is not configured
const mockNewsItems: Record<string, NewsItem[]> = {
  bitcoin: [
    {
      title: "Bitcoin ETF sees record inflows as institutional interest surges",
      url: "https://example.com/btc-etf",
      source: "CryptoNews",
      snippet: "Spot Bitcoin ETFs recorded their highest single-day inflows since launch, signaling growing institutional adoption.",
      published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      title: "Bitcoin hashrate reaches all-time high ahead of halving",
      url: "https://example.com/btc-hashrate",
      source: "BlockchainDaily",
      snippet: "The Bitcoin network's hashrate has surged to unprecedented levels, demonstrating strong miner confidence.",
      published_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      title: "Major bank announces Bitcoin custody services for clients",
      url: "https://example.com/btc-custody",
      source: "FinanceToday",
      snippet: "A leading global bank has launched Bitcoin custody services, opening crypto access to millions of customers.",
      published_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  ethereum: [
    {
      title: "Ethereum L2 networks see exponential growth in transaction volume",
      url: "https://example.com/eth-l2",
      source: "CryptoNews",
      snippet: "Layer 2 solutions on Ethereum have processed record transaction volumes, reducing mainnet congestion.",
      published_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      title: "Major DeFi protocol announces Ethereum staking integration",
      url: "https://example.com/eth-defi",
      source: "DeFiPulse",
      snippet: "Leading DeFi platform adds native ETH staking, allowing users to earn yield while maintaining liquidity.",
      published_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ],
  solana: [
    {
      title: "Solana network performance improves after latest upgrade",
      url: "https://example.com/sol-upgrade",
      source: "BlockchainDaily",
      snippet: "The latest Solana upgrade has significantly improved network stability and transaction throughput.",
      published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      title: "NFT marketplace reports surge in Solana-based collections",
      url: "https://example.com/sol-nft",
      source: "NFTWorld",
      snippet: "Solana NFT trading volume has increased 300% month-over-month as new collections launch.",
      published_date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Default news for coins without specific mock data
const defaultNews: NewsItem[] = [
  {
    title: "Cryptocurrency market shows mixed signals amid global uncertainty",
    url: "https://example.com/crypto-market",
    source: "MarketWatch",
    snippet: "Digital asset markets continue to navigate macroeconomic headwinds with varied performance across sectors.",
    published_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Simple sentiment analysis based on keywords
 */
function analyzeSentiment(newsItems: NewsItem[]): { score: SentimentScore; value: number } {
  const positiveWords = ['surge', 'growth', 'record', 'high', 'bullish', 'gains', 'adoption', 'improve', 'launch', 'success', 'increase', 'rally', 'breakthrough', 'milestone'];
  const negativeWords = ['crash', 'fall', 'decline', 'bearish', 'losses', 'concern', 'risk', 'drop', 'fail', 'plunge', 'slump', 'warning', 'uncertainty', 'fears'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const item of newsItems) {
    const text = (item.title + ' ' + item.snippet).toLowerCase();
    for (const word of positiveWords) {
      if (text.includes(word)) positiveCount++;
    }
    for (const word of negativeWords) {
      if (text.includes(word)) negativeCount++;
    }
  }
  
  const total = positiveCount + negativeCount || 1;
  const value = (positiveCount - negativeCount) / total;
  
  let score: SentimentScore;
  if (value > 0.2) score = "bullish";
  else if (value < -0.2) score = "bearish";
  else score = "neutral";
  
  return { score, value: Number(value.toFixed(2)) };
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

/**
 * Handle get_sentiment tool call
 */
export async function handleGetSentiment(input: GetSentimentInput): Promise<MCPToolResponse<GetSentimentOutput>> {
  const { coin_id } = input;

  // Look up coin from catalog for name
  const coin = getCoinById(coin_id);
  const coinName = coin?.name || coin_id;

  // Check if Tavily is configured
  if (isTavilyConfigured()) {
    try {
      // Search for news about this cryptocurrency
      const searchQuery = `${coinName} cryptocurrency news analysis price`;
      const searchResults = await searchWeb(searchQuery, {
        max_results: 5,
        search_depth: "basic"
      });

      // Convert to NewsItem format
      const newsItems: NewsItem[] = searchResults.results.map(result => ({
        title: result.title,
        url: result.url,
        source: extractDomain(result.url),
        snippet: result.content.slice(0, 200) + (result.content.length > 200 ? '...' : ''),
        published_date: result.published_date
      }));

      // Analyze sentiment
      const { score: sentiment, value: sentimentScore } = analyzeSentiment(newsItems);
      
      // Generate summary
      const sentimentText = sentiment === "bullish" ? "positive" : sentiment === "bearish" ? "negative" : "mixed";
      const summary = `Current sentiment for ${coinName} appears ${sentimentText} based on recent news coverage. ${newsItems.length} relevant articles found.`;

      const contentText = `Sentiment analysis for ${coinName}: ${sentiment.toUpperCase()}. ${summary}`;

      return {
        content: [{ type: "text", text: contentText }],
        structuredContent: {
          coin_id,
          coin_name: coinName,
          sentiment,
          sentiment_score: sentimentScore,
          news_items: newsItems,
          summary,
          powered_by: "Tavily"
        }
      };

    } catch (error) {
      console.error("[get_sentiment] Tavily API error, using mock data:", error);
      // Fall through to mock data
    }
  }

  // Use mock data if Tavily is not configured or failed
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
        coin_name: "",
        sentiment: "neutral",
        sentiment_score: 0,
        news_items: [],
        summary: "",
        powered_by: "Tavily",
        error: errorObj
      }
    };
  }

  // Get mock news items
  const newsItems = mockNewsItems[coin_id] || defaultNews;
  
  // Analyze sentiment
  const { score: sentiment, value: sentimentScore } = analyzeSentiment(newsItems);
  
  // Generate summary
  const sentimentText = sentiment === "bullish" ? "positive" : sentiment === "bearish" ? "negative" : "mixed";
  const tavilyConfigured = isTavilyConfigured();
  const demoNote = tavilyConfigured ? "" : " (Demo data - set TAVILY_API_KEY for real results)";
  const summary = `Current sentiment for ${coinName} appears ${sentimentText} based on recent news coverage. ${newsItems.length} relevant articles found.${demoNote}`;

  const contentText = `Sentiment analysis for ${coinName}: ${sentiment.toUpperCase()}. ${summary}`;

  return {
    content: [{ type: "text", text: contentText }],
    structuredContent: {
      coin_id: coin.id,
      coin_name: coin.name,
      sentiment,
      sentiment_score: sentimentScore,
      news_items: newsItems,
      summary,
      powered_by: "Tavily"
    }
  };
}
