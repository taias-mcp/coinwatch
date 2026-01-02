import { createRoot } from "react-dom/client";
import { useOpenAiGlobal } from "../../hooks/use-openai-global";
import "../../styles/index.css";
import type { GetPriceOutput } from "../../types/outputs";
import { ErrorCallout, PriceChange, PriceDisplay, MarketCapDisplay } from "../../components/shared";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { ArrowUp, ArrowDown, Chart } from "@openai/apps-sdk-ui/components/Icon";

function MetricRow({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-subtle last:border-0">
      <span className="text-sm text-secondary">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-primary">{value}</span>
        {subValue && (
          <span className="text-xs text-tertiary block">{subValue}</span>
        )}
      </div>
    </div>
  );
}

function PriceRangeBar({ low, high, current }: { low: number; high: number; current: number }) {
  const range = high - low;
  const position = range > 0 ? ((current - low) / range) * 100 : 50;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-tertiary">
        <span>24h Low: ${low.toLocaleString()}</span>
        <span>24h High: ${high.toLocaleString()}</span>
      </div>
      <div className="relative h-2 bg-surface-secondary rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-danger via-warning to-success rounded-full"
          style={{ width: '100%' }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-solid rounded-full border-2 border-surface shadow-md"
          style={{ left: `${Math.min(Math.max(position, 5), 95)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}

function PriceWidget() {
  const toolOutput = useOpenAiGlobal("toolOutput") as GetPriceOutput | null;

  if (!toolOutput) {
    return (
      <div className="p-6 text-center text-secondary">
        <div className="animate-pulse">Loading price data...</div>
      </div>
    );
  }

  if (toolOutput.error) {
    return <ErrorCallout error={toolOutput.error} />;
  }

  const { name, symbol, image, metrics } = toolOutput;
  const isPositive = metrics.price_change_percentage_24h >= 0;

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-subtle">
        <div className="flex items-center gap-4">
          <img src={image} alt={name} className="size-12 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-primary">{name}</h2>
              <Badge color="secondary">{symbol.toUpperCase()}</Badge>
            </div>
            <span className="text-sm text-tertiary">Rank #{metrics.market_cap_rank}</span>
          </div>
        </div>
      </div>

      {/* Main Price */}
      <div className={`px-5 py-6 ${isPositive ? 'bg-success-surface' : 'bg-danger-surface'}`}>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-secondary block mb-1">Current Price</span>
            <PriceDisplay price={metrics.current_price} size="xl" />
          </div>
          <div className="text-right">
            <PriceChange value={metrics.price_change_percentage_24h} size="lg" />
            <span className="text-sm text-secondary block mt-1">
              {isPositive ? '+' : ''}${metrics.price_change_24h.toFixed(2)} today
            </span>
          </div>
        </div>
      </div>

      {/* 24h Range */}
      <div className="px-5 py-4 border-b border-subtle">
        <PriceRangeBar 
          low={metrics.low_24h} 
          high={metrics.high_24h} 
          current={metrics.current_price} 
        />
      </div>

      {/* Key Metrics */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <Chart className="size-4" />
          Key Metrics
        </h3>
        
        <div className="bg-surface-secondary rounded-xl p-4">
          <MetricRow 
            label="Market Cap" 
            value={`$${(metrics.market_cap / 1e9).toFixed(2)}B`}
          />
          <MetricRow 
            label="24h Volume" 
            value={`$${(metrics.total_volume / 1e9).toFixed(2)}B`}
          />
          <MetricRow 
            label="Circulating Supply" 
            value={`${(metrics.circulating_supply / 1e6).toFixed(2)}M`}
            subValue={metrics.max_supply ? `Max: ${(metrics.max_supply / 1e6).toFixed(2)}M` : undefined}
          />
          <MetricRow 
            label="All-Time High" 
            value={`$${metrics.ath.toLocaleString()}`}
            subValue={`${metrics.ath_change_percentage.toFixed(1)}% from ATH`}
          />
          <MetricRow 
            label="All-Time Low" 
            value={`$${metrics.atl.toLocaleString()}`}
            subValue={`+${metrics.atl_change_percentage.toFixed(0)}% from ATL`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-surface-secondary border-t border-subtle text-center">
        <p className="text-xs text-tertiary">
          Data powered by CoinGecko · Updated {new Date(toolOutput.last_updated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<PriceWidget />);

