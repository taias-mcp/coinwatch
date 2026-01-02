import { createRoot } from "react-dom/client";
import { useOpenAiGlobal } from "../../hooks/use-openai-global";
import "../../styles/index.css";
import type { GetHistoryOutput, PricePoint } from "../../types/outputs";
import { ErrorCallout, PriceChange, PriceDisplay } from "../../components/shared";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { ArrowUp, ArrowDown } from "@openai/apps-sdk-ui/components/Icon";

// Simple SVG line chart component
function PriceChart({ prices, isPositive }: { prices: PricePoint[]; isPositive: boolean }) {
  if (prices.length < 2) return null;
  
  const priceValues = prices.map(p => p.price);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const range = maxPrice - minPrice || 1;
  
  const width = 100;
  const height = 40;
  const padding = 2;
  
  // Generate SVG path
  const points = prices.map((p, i) => {
    const x = padding + ((width - padding * 2) * i) / (prices.length - 1);
    const y = height - padding - ((p.price - minPrice) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  
  const pathData = `M ${points.join(' L ')}`;
  
  // Create gradient fill area
  const areaPath = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
  
  const strokeColor = isPositive ? '#22c55e' : '#ef4444';
  const gradientId = `gradient-${isPositive ? 'up' : 'down'}`;
  
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-32"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path 
        d={areaPath} 
        fill={`url(#${gradientId})`}
      />
      <path 
        d={pathData} 
        fill="none" 
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="bg-surface-secondary rounded-xl p-3 text-center">
      <span className="text-xs text-tertiary block mb-1">{label}</span>
      <span className="text-sm font-semibold text-primary">{value}</span>
      {subValue && (
        <span className="text-xs text-secondary block">{subValue}</span>
      )}
    </div>
  );
}

function HistoryWidget() {
  const toolOutput = useOpenAiGlobal("toolOutput") as GetHistoryOutput | null;

  if (!toolOutput) {
    return (
      <div className="p-6 text-center text-secondary">
        <div className="animate-pulse">Loading price history...</div>
      </div>
    );
  }

  if (toolOutput.error) {
    return <ErrorCallout error={toolOutput.error} />;
  }

  const { name, symbol, days, prices, price_change_percentage, high, low } = toolOutput;
  const isPositive = price_change_percentage >= 0;
  
  // Get first and last prices for display
  const startPrice = prices[0]?.price || 0;
  const endPrice = prices[prices.length - 1]?.price || 0;
  
  // Format dates
  const startDate = prices[0]?.timestamp 
    ? new Date(prices[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';
  const endDate = prices[prices.length - 1]?.timestamp
    ? new Date(prices[prices.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              {name} Price History
            </h2>
            <span className="text-sm text-tertiary">{symbol.toUpperCase()} · Last {days} days</span>
          </div>
          <PriceChange value={price_change_percentage} size="lg" />
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 py-4 border-b border-subtle">
        <div className={`rounded-xl p-4 ${isPositive ? 'bg-success-surface' : 'bg-danger-surface'}`}>
          <PriceChart prices={prices} isPositive={isPositive} />
          
          {/* Date labels */}
          <div className="flex justify-between mt-2 text-xs text-tertiary">
            <span>{startDate}</span>
            <span>{endDate}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-primary mb-3">
          {days}-Day Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            label="Starting Price"
            value={`$${startPrice.toLocaleString()}`}
            subValue={startDate}
          />
          <StatCard 
            label="Current Price"
            value={`$${endPrice.toLocaleString()}`}
            subValue={endDate}
          />
          <StatCard 
            label="Period High"
            value={`$${high.toLocaleString()}`}
          />
          <StatCard 
            label="Period Low"
            value={`$${low.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-4">
        <div className={`rounded-xl p-4 ${isPositive ? 'bg-success-soft' : 'bg-danger-soft'} border ${isPositive ? 'border-success-outline' : 'border-danger-outline'}`}>
          <div className="flex items-center gap-3">
            {isPositive ? (
              <ArrowUp className="size-6 text-success" />
            ) : (
              <ArrowDown className="size-6 text-danger" />
            )}
            <div>
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? 'Upward Trend' : 'Downward Trend'}
              </span>
              <p className="text-sm text-secondary mt-1">
                {name} has {isPositive ? 'gained' : 'lost'} {Math.abs(price_change_percentage).toFixed(2)}% over the last {days} days
              </p>
            </div>
          </div>
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
root.render(<HistoryWidget />);

