import { createRoot } from "react-dom/client";
import { useOpenAiGlobal } from "../../hooks/use-openai-global";
import "../../styles/index.css";
import type { ListCoinsOutput, CoinCard } from "../../types/outputs";
import { ErrorCallout, PriceChange, PriceDisplay, MarketCapDisplay } from "../../components/shared";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function CoinCardComponent({ coin, rank }: { coin: CoinCard; rank: number }) {
  return (
    <div className="bg-surface rounded-xl border border-subtle overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with rank and logo */}
      <div className="flex items-center gap-3 p-4 border-b border-subtle">
        <Badge color="secondary">#{rank}</Badge>
        <img
          src={coin.image}
          alt={coin.name}
          className="size-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">{coin.name}</h3>
          <span className="text-sm text-tertiary uppercase">{coin.symbol}</span>
        </div>
      </div>

      {/* Price info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <PriceDisplay price={coin.current_price} size="lg" />
          <PriceChange value={coin.price_change_percentage_24h} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-subtle">
          <div>
            <span className="text-xs text-tertiary block">Market Cap</span>
            <MarketCapDisplay value={coin.market_cap} size="sm" />
          </div>
          <div>
            <span className="text-xs text-tertiary block">Volume 24h</span>
            <MarketCapDisplay value={coin.total_volume} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListWidget() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ListCoinsOutput | null;

  if (!toolOutput) {
    return (
      <div className="p-6 text-center text-secondary">
        <div className="animate-pulse">Loading cryptocurrencies...</div>
      </div>
    );
  }

  if (toolOutput.error) {
    return <ErrorCallout error={toolOutput.error} />;
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-subtle px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Top Cryptocurrencies
            </h2>
            <p className="text-sm text-tertiary">
              {toolOutput.total_count} coins · By market cap
            </p>
          </div>
          <Badge color="info">Live Data</Badge>
        </div>
      </div>

      {/* Coin cards grid */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolOutput.coins.map((coin, idx) => (
            <CoinCardComponent
              key={coin.id}
              coin={coin}
              rank={coin.market_cap_rank || idx + 1}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-surface-secondary border-t border-subtle text-center">
        <p className="text-xs text-tertiary">
          Data powered by CoinGecko
        </p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<ListWidget />);

