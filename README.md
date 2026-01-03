# CoinWatch - ChatGPT Cryptocurrency Tracking Assistant

A ChatGPT App / MCP server for cryptocurrency price tracking and simulated investments.

## Features

- **Real-time Prices**: Live cryptocurrency data from CoinGecko
- **Historical Charts**: Price history visualization (7/30/90 days)
- **Sentiment Analysis**: News-based sentiment from Tavily web search
- **Simulated Investments**: Demo trading functionality (no real money)
- **Beautiful Widgets**: OpenAI Apps SDK UI components

## Quick Start

### Prerequisites

- Node.js 18+
- ngrok installed (`brew install ngrok` or [download](https://ngrok.com/download))
- ngrok account (free tier works)

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Web widgets
cd ../web && npm install
```

### 2. Build Everything

```bash
# Build server
cd server && npm run build

# Build widgets (self-contained HTML with inlined JS/CSS)
cd ../web && npm run build
```

### 3. Set Environment Variables

Copy the example env file and add your API key:

```bash
cd server
cp .env.example .env
# Edit .env and add your TAVILY_API_KEY
```

### 4. Start the Server

**Option A: Use the demo script (recommended)**

```bash
./demo.sh
```

This starts the MCP server and ngrok tunnel, then prints the ChatGPT App URL.

**Option B: Manual startup**

```bash
# Terminal 1: Start MCP server
cd server && npm run start:http

# Terminal 2: Start ngrok
ngrok http 3001
```

Note the public URL (e.g., `https://abc123.ngrok-free.app`).

### 5. Connect to ChatGPT

1. Go to ChatGPT → Settings → Apps
2. Click **"Create App"**
3. Enter the **MCP tunnel URL** with `/mcp` path:
   ```
   https://<ngrok-id>.ngrok-free.app/mcp
   ```
4. Name it "CoinWatch"
5. Start a new chat and select the CoinWatch app

### 6. Test It!

Try these prompts:
- *"What cryptocurrencies can I track?"*
- *"What's the current price of Bitcoin?"*
- *"Show me Ethereum's price history for the last 30 days"*
- *"What are people saying about Solana?"*
- *"I want to invest $500 in Bitcoin"*

---

## Tools & Widgets

| Tool | Widget | Description |
|------|--------|-------------|
| `list_coins` | `coinwatch-list` | List top cryptocurrencies by market cap |
| `get_price` | `coinwatch-price` | Detailed price and market metrics |
| `get_history` | `coinwatch-history` | Historical price chart |
| `get_sentiment` | `coinwatch-sentiment` | News and sentiment analysis |
| `execute_investment` | `coinwatch-investment` | Simulated investment confirmation |

---

## API Keys

### Tavily (Required for Sentiment)

The `get_sentiment` tool uses Tavily for web search. Without a key, it falls back to mock data.

1. Sign up at [tavily.com](https://tavily.com)
2. Get your API key
3. Add it to your `server/.env` file

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TAVILY_API_KEY` | For sentiment | Enables real web search for sentiment analysis |
| `PORT` | No | Server port (default: 3001) |

---

## Development

### Project Structure

```
coinwatch/
├── server/                    # MCP Server
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── server.ts          # Tool/resource registration
│   │   ├── transports/http.ts # HTTP transport
│   │   ├── tools/             # Tool handlers
│   │   │   ├── list-coins.ts
│   │   │   ├── get-price.ts
│   │   │   ├── get-history.ts
│   │   │   ├── get-sentiment.ts
│   │   │   └── execute-investment.ts
│   │   ├── lib/               # API clients
│   │   │   ├── coingecko.ts
│   │   │   ├── tavily.ts
│   │   │   └── types.ts
│   │   └── data/              # Mock data (fallback)
│   └── package.json
│
└── web/                       # Widget Frontend
    ├── src/
    │   ├── widgets/           # 5 widget entry points
    │   │   ├── coinwatch-list/
    │   │   ├── coinwatch-price/
    │   │   ├── coinwatch-history/
    │   │   ├── coinwatch-sentiment/
    │   │   └── coinwatch-investment/
    │   ├── components/        # Shared React components
    │   ├── hooks/             # window.openai hooks
    │   └── types/             # TypeScript definitions
    ├── assets/                # Build output (gitignored)
    ├── build.mts              # Widget build script
    └── package.json
```

### Supported Cryptocurrencies

The server can fetch data for any cryptocurrency supported by CoinGecko. Popular IDs include:

- `bitcoin`, `ethereum`, `solana`
- `cardano`, `dogecoin`, `polkadot`
- `chainlink`, `avalanche-2`, `ripple`
- `uniswap`, `litecoin`, `polygon`

---

## Troubleshooting

### Widget shows "Loading..." forever

**Problem:** MCP server not running or ngrok not connected.

**Debug:**
1. Check server: `curl http://localhost:3001/health`
2. Check ngrok: Visit your ngrok URL in browser

### Sentiment shows demo data

**Problem:** `TAVILY_API_KEY` not set.

**Solution:** Add your Tavily API key to `server/.env`.

---

## License

MIT
