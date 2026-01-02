import { createRoot } from "react-dom/client";
import { useOpenAiGlobal } from "../../hooks/use-openai-global";
import "../../styles/index.css";
import type { GetSentimentOutput, NewsItem, SentimentScore } from "../../types/outputs";
import { ErrorCallout } from "../../components/shared";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { ArrowUp, ArrowDown, Minus, ExternalLink, Clock } from "@openai/apps-sdk-ui/components/Icon";

function SentimentIndicator({ sentiment, score }: { sentiment: SentimentScore; score: number }) {
  const config = {
    bullish: {
      icon: ArrowUp,
      color: 'success',
      label: 'Bullish',
      bgClass: 'bg-success-soft',
      borderClass: 'border-success-outline',
      textClass: 'text-success'
    },
    bearish: {
      icon: ArrowDown,
      color: 'danger',
      label: 'Bearish',
      bgClass: 'bg-danger-soft',
      borderClass: 'border-danger-outline',
      textClass: 'text-danger'
    },
    neutral: {
      icon: Minus,
      color: 'secondary',
      label: 'Neutral',
      bgClass: 'bg-surface-secondary',
      borderClass: 'border-default',
      textClass: 'text-secondary'
    }
  };
  
  const { icon: Icon, color, label, bgClass, borderClass, textClass } = config[sentiment];
  
  return (
    <div className={`rounded-2xl p-5 ${bgClass} border ${borderClass}`}>
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center size-14 rounded-full ${bgClass} border-2 ${borderClass}`}>
          <Icon className={`size-7 ${textClass}`} />
        </div>
        <div>
          <Badge color={color as "success" | "danger" | "secondary"}>{label}</Badge>
          <p className={`text-2xl font-bold mt-1 ${textClass}`}>
            {Math.round(Math.abs(score) * 100)}% {sentiment}
          </p>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const timeAgo = item.published_date
    ? getTimeAgo(new Date(item.published_date))
    : null;

  return (
    <a 
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl bg-surface-secondary hover:bg-surface border border-subtle hover:border-default transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-primary group-hover:text-info line-clamp-2">
            {item.title}
          </h4>
          <p className="text-sm text-secondary mt-2 line-clamp-2">
            {item.snippet}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-tertiary">
            <span className="font-medium">{item.source}</span>
            {timeAgo && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeAgo}
                </span>
              </>
            )}
          </div>
        </div>
        <ExternalLink className="size-4 text-tertiary group-hover:text-info shrink-0" />
      </div>
    </a>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SentimentWidget() {
  const toolOutput = useOpenAiGlobal("toolOutput") as GetSentimentOutput | null;

  if (!toolOutput) {
    return (
      <div className="p-6 text-center text-secondary">
        <div className="animate-pulse">Analyzing sentiment...</div>
      </div>
    );
  }

  if (toolOutput.error) {
    return <ErrorCallout error={toolOutput.error} />;
  }

  const { coin_name, sentiment, sentiment_score, news_items, summary, powered_by } = toolOutput;

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-subtle">
        <h2 className="text-lg font-semibold text-primary">
          {coin_name} Sentiment Analysis
        </h2>
        <p className="text-sm text-tertiary">
          Based on recent news and social media
        </p>
      </div>

      {/* Sentiment Indicator */}
      <div className="px-5 py-4">
        <SentimentIndicator sentiment={sentiment} score={sentiment_score} />
      </div>

      {/* Summary */}
      <div className="px-5 py-2">
        <p className="text-sm text-secondary bg-surface-secondary rounded-xl p-4">
          {summary}
        </p>
      </div>

      {/* News Feed */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-primary mb-3">
          Recent News ({news_items.length})
        </h3>
        
        <div className="space-y-3">
          {news_items.map((item, idx) => (
            <NewsCard key={idx} item={item} />
          ))}
        </div>
        
        {news_items.length === 0 && (
          <div className="text-center py-8 text-tertiary">
            No recent news found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-surface-secondary border-t border-subtle text-center">
        <p className="text-xs text-tertiary">
          Powered by {powered_by}
        </p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<SentimentWidget />);

