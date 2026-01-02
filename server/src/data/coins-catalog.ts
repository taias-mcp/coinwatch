// Mock catalog of cryptocurrencies for demo/fallback
// Used when CoinGecko API is unavailable or for testing

import type { CatalogCoin } from "../lib/types.js";

export const CATALOG_VERSION = "v1";

export const coinsCatalog: CatalogCoin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67432.00,
    price_change_percentage_24h: 2.34,
    market_cap: 1327000000000,
    market_cap_rank: 1,
    total_volume: 28500000000,
    high_24h: 68100.00,
    low_24h: 65800.00,
    circulating_supply: 19700000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 73750.00,
    ath_change_percentage: -8.56,
    ath_date: "2024-03-14T07:10:36.635Z",
    atl: 67.81,
    atl_change_percentage: 99340.5,
    atl_date: "2013-07-06T00:00:00.000Z",
    description: "Bitcoin is the first and most widely recognized cryptocurrency, created by Satoshi Nakamoto in 2009."
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3456.78,
    price_change_percentage_24h: -1.23,
    market_cap: 415000000000,
    market_cap_rank: 2,
    total_volume: 14200000000,
    high_24h: 3520.00,
    low_24h: 3410.00,
    circulating_supply: 120200000,
    total_supply: null,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -29.15,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 798045.2,
    atl_date: "2015-10-20T00:00:00.000Z",
    description: "Ethereum is a decentralized platform for smart contracts and decentralized applications."
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 178.45,
    price_change_percentage_24h: 5.67,
    market_cap: 82000000000,
    market_cap_rank: 5,
    total_volume: 3200000000,
    high_24h: 182.00,
    low_24h: 168.50,
    circulating_supply: 460000000,
    total_supply: 580000000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -31.35,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 35540.2,
    atl_date: "2020-05-11T19:35:23.449Z",
    description: "Solana is a high-performance blockchain supporting builders around the world."
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.456,
    price_change_percentage_24h: -0.89,
    market_cap: 16200000000,
    market_cap_rank: 10,
    total_volume: 320000000,
    high_24h: 0.465,
    low_24h: 0.448,
    circulating_supply: 35500000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -85.24,
    ath_date: "2021-09-02T06:00:10.474Z",
    atl: 0.01925275,
    atl_change_percentage: 2268.5,
    atl_date: "2020-03-13T02:22:55.044Z",
    description: "Cardano is a proof-of-stake blockchain platform with a research-driven approach."
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.142,
    price_change_percentage_24h: 8.45,
    market_cap: 20500000000,
    market_cap_rank: 8,
    total_volume: 1800000000,
    high_24h: 0.148,
    low_24h: 0.130,
    circulating_supply: 144500000000,
    total_supply: null,
    max_supply: null,
    ath: 0.731578,
    ath_change_percentage: -80.58,
    ath_date: "2021-05-08T05:08:23.458Z",
    atl: 0.0000869,
    atl_change_percentage: 163245.8,
    atl_date: "2015-05-06T00:00:00.000Z",
    description: "Dogecoin is a cryptocurrency featuring a likeness of the Shiba Inu dog from the 'Doge' meme."
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 7.23,
    price_change_percentage_24h: 1.12,
    market_cap: 10200000000,
    market_cap_rank: 14,
    total_volume: 280000000,
    high_24h: 7.35,
    low_24h: 7.10,
    circulating_supply: 1410000000,
    total_supply: 1450000000,
    max_supply: null,
    ath: 54.98,
    ath_change_percentage: -86.85,
    ath_date: "2021-11-04T14:10:09.301Z",
    atl: 2.7,
    atl_change_percentage: 167.8,
    atl_date: "2020-08-20T05:48:11.359Z",
    description: "Polkadot enables cross-blockchain transfers of any type of data or asset."
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 14.56,
    price_change_percentage_24h: 3.21,
    market_cap: 8700000000,
    market_cap_rank: 16,
    total_volume: 520000000,
    high_24h: 14.80,
    low_24h: 14.10,
    circulating_supply: 600000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 52.7,
    ath_change_percentage: -72.36,
    ath_date: "2021-05-10T00:13:57.214Z",
    atl: 0.148183,
    atl_change_percentage: 9728.5,
    atl_date: "2017-11-29T00:00:00.000Z",
    description: "Chainlink is a decentralized oracle network providing real-world data to smart contracts."
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 35.67,
    price_change_percentage_24h: -2.34,
    market_cap: 14100000000,
    market_cap_rank: 12,
    total_volume: 420000000,
    high_24h: 36.80,
    low_24h: 34.90,
    circulating_supply: 395000000,
    total_supply: 720000000,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -75.40,
    ath_date: "2021-11-21T14:18:56.538Z",
    atl: 2.8,
    atl_change_percentage: 1173.9,
    atl_date: "2020-12-31T13:15:21.540Z",
    description: "Avalanche is a layer one blockchain that functions as a platform for decentralized applications."
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.523,
    price_change_percentage_24h: 0.78,
    market_cap: 28900000000,
    market_cap_rank: 7,
    total_volume: 980000000,
    high_24h: 0.532,
    low_24h: 0.515,
    circulating_supply: 55300000000,
    total_supply: 99988000000,
    max_supply: 100000000000,
    ath: 3.40,
    ath_change_percentage: -84.62,
    ath_date: "2018-01-07T00:00:00.000Z",
    atl: 0.00268621,
    atl_change_percentage: 19370.5,
    atl_date: "2014-05-22T00:00:00.000Z",
    description: "XRP is the native cryptocurrency of the XRP Ledger, designed for fast, low-cost payments."
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uni.jpg",
    current_price: 9.87,
    price_change_percentage_24h: 4.56,
    market_cap: 5900000000,
    market_cap_rank: 22,
    total_volume: 180000000,
    high_24h: 10.10,
    low_24h: 9.40,
    circulating_supply: 600000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 44.92,
    ath_change_percentage: -78.02,
    ath_date: "2021-05-03T05:25:04.822Z",
    atl: 1.03,
    atl_change_percentage: 858.3,
    atl_date: "2020-09-17T01:20:38.214Z",
    description: "Uniswap is a decentralized exchange protocol built on Ethereum."
  }
];

// Helper to get coin by ID
export function getCoinById(id: string): CatalogCoin | undefined {
  return coinsCatalog.find(coin => coin.id === id);
}

// Helper to get all coins
export function getAllCoins(): CatalogCoin[] {
  return [...coinsCatalog];
}

// Generate mock historical data for a coin
export function generateMockHistoricalData(
  coin: CatalogCoin,
  days: number
): Array<{ timestamp: number; price: number }> {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  const dataPoints: Array<{ timestamp: number; price: number }> = [];
  
  // Generate realistic-looking price data with some volatility
  let price = coin.current_price;
  const volatility = coin.price_change_percentage_24h / 100;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * msPerDay);
    // Add some random variation
    const randomChange = (Math.random() - 0.5) * 2 * Math.abs(volatility) * price;
    price = price + randomChange;
    // Keep price positive
    price = Math.max(price * 0.5, price);
    
    dataPoints.push({
      timestamp,
      price: Number(price.toFixed(price < 1 ? 6 : 2))
    });
  }
  
  // Ensure last point is current price
  dataPoints[dataPoints.length - 1].price = coin.current_price;
  
  return dataPoints;
}

