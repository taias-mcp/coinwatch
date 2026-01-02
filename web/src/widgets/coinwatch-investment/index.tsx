import { createRoot } from "react-dom/client";
import { useOpenAiGlobal } from "../../hooks/use-openai-global";
import "../../styles/index.css";
import type { ExecuteInvestmentOutput } from "../../types/outputs";
import { ErrorCallout } from "../../components/shared";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Check, CloseBold, Warning, Clock } from "@openai/apps-sdk-ui/components/Icon";

function ReceiptRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-secondary">{label}</span>
      <span className={`text-sm ${highlight ? 'font-semibold text-primary' : 'text-primary'}`}>
        {value}
      </span>
    </div>
  );
}

function InvestmentWidget() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ExecuteInvestmentOutput | null;

  if (!toolOutput) {
    return (
      <div className="p-6 text-center text-secondary">
        <div className="animate-pulse">Processing investment...</div>
      </div>
    );
  }

  if (toolOutput.error) {
    return <ErrorCallout error={toolOutput.error} />;
  }

  const { transaction_id, status, investment, timestamp, disclaimer } = toolOutput;

  if (status === "failed") {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-danger-soft">
            <CloseBold className="size-8 text-danger" />
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">Investment Failed</h2>
          <p className="text-secondary">
            Unable to process the investment. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="bg-surface min-h-screen">
      {/* Success Header */}
      <div className="bg-success-solid p-6 text-success-solid text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-white/20">
          <Check className="size-8" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Investment Confirmed!</h2>
        <p className="opacity-80">Transaction #{transaction_id}</p>
      </div>

      {/* Demo Banner */}
      <div className="bg-warning-soft px-5 py-3 border-b border-warning-outline">
        <div className="flex items-center gap-2 text-warning">
          <Warning className="size-4 shrink-0" />
          <p className="text-sm font-medium">Demo Mode - No Real Investment</p>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="p-5 border-b border-subtle">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-12 rounded-full bg-primary-soft flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {investment.coin_symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-primary">{investment.coin_name}</h3>
            <Badge color="secondary">{investment.coin_symbol}</Badge>
          </div>
        </div>
        
        <div className="bg-success-soft rounded-xl p-4 text-center">
          <span className="text-sm text-secondary block">You purchased</span>
          <span className="text-2xl font-bold text-primary">
            {investment.coins_purchased < 1 
              ? investment.coins_purchased.toFixed(6) 
              : investment.coins_purchased.toFixed(4)
            } {investment.coin_symbol}
          </span>
        </div>
      </div>

      {/* Receipt Details */}
      <div className="p-5 border-b border-subtle">
        <h4 className="font-medium text-primary mb-4">Transaction Details</h4>
        
        <div className="bg-surface-secondary rounded-xl p-4">
          <ReceiptRow 
            label="Investment Amount" 
            value={`$${investment.amount_usd.toLocaleString()}`}
          />
          <div className="border-t border-subtle my-2" />
          <ReceiptRow 
            label="Price at Purchase" 
            value={`$${investment.price_at_purchase.toLocaleString()}`}
          />
          <ReceiptRow 
            label="Transaction Fee (1%)" 
            value={`$${investment.fee_usd.toFixed(2)}`}
          />
          <div className="border-t border-subtle my-2" />
          <ReceiptRow 
            label="Total Charged" 
            value={`$${investment.total_usd.toLocaleString()}`}
            highlight
          />
        </div>
      </div>

      {/* Timestamp */}
      <div className="p-5 border-b border-subtle">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <Clock className="size-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-5">
        <div className="bg-info-surface rounded-xl p-4 border border-info-outline">
          <p className="text-sm text-info">
            <strong>Disclaimer:</strong> {disclaimer}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-surface-secondary px-5 py-4 border-t border-subtle text-center">
        <p className="text-sm text-secondary">
          Thank you for trying CoinWatch! 🚀
        </p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<InvestmentWidget />);

