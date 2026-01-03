#!/bin/bash
# CoinWatch Demo Startup Script
# Usage: ./demo.sh
#
# This script:
# 1. Starts the MCP server (port 3001)
# 2. Starts ngrok tunnel
# 3. Prints the URL for ChatGPT App

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║               CoinWatch Demo Startup                      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check for ngrok
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}Error: ngrok is not installed${NC}"
    echo "Install with: brew install ngrok"
    exit 1
fi

# Kill any existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
pkill -f "node dist/index.js" 2>/dev/null || true
pkill ngrok 2>/dev/null || true
sleep 1

# Start MCP server
echo -e "${GREEN}Starting MCP server on port 3001...${NC}"
cd "$SCRIPT_DIR/server"
node dist/index.js --http > /dev/null 2>&1 &
MCP_PID=$!
cd "$SCRIPT_DIR"

sleep 2

# Verify server is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${RED}Error: MCP server failed to start${NC}"
    echo "Try: cd server && npm run build && npm run start:http"
    exit 1
fi

echo -e "${GREEN}✓ MCP server running${NC}"
echo ""

# Start ngrok
echo -e "${GREEN}Starting ngrok tunnel...${NC}"
ngrok http 3001 --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to initialize
sleep 3

# Get tunnel URL from ngrok API
echo -e "${YELLOW}Fetching tunnel URL...${NC}"
TUNNELS=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)

if [ -z "$TUNNELS" ]; then
    echo -e "${RED}Error: Could not get ngrok tunnel info${NC}"
    echo "Check ngrok status at http://localhost:4040"
    exit 1
fi

# Parse URL (works with jq if available, fallback to grep)
if command -v jq &> /dev/null; then
    MCP_URL=$(echo "$TUNNELS" | jq -r '.tunnels[0].public_url')
else
    MCP_URL=$(echo "$TUNNELS" | grep -o '"public_url":"[^"]*' | head -1 | cut -d'"' -f4)
fi

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Demo Ready!                            ║${NC}"
echo -e "${BLUE}╠═══════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  ${GREEN}ChatGPT App URL:${NC}"
echo -e "${BLUE}║${NC}    ${MCP_URL}/mcp"
echo -e "${BLUE}║${NC}"
echo -e "${BLUE}╠═══════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  ${YELLOW}ngrok dashboard:${NC} http://localhost:4040"
echo -e "${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  ${RED}Press Ctrl+C to stop all services${NC}"
echo -e "${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $MCP_PID 2>/dev/null || true
    kill $NGROK_PID 2>/dev/null || true
    pkill ngrok 2>/dev/null || true
    echo -e "${GREEN}Done${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
