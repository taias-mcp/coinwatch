import { ArrowUp, ArrowDown } from '@openai/apps-sdk-ui/components/Icon';

interface PriceChangeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  prefix?: string;
}

export function PriceChange({ 
  value, 
  size = 'md', 
  showIcon = true,
  prefix = ''
}: PriceChangeProps) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-success' : 'text-danger';
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5'
  };

  const formattedValue = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${colorClass} ${sizeClasses[size]}`}>
      {showIcon && (
        isPositive 
          ? <ArrowUp className={iconSizes[size]} />
          : <ArrowDown className={iconSizes[size]} />
      )}
      {prefix}{formattedValue}
    </span>
  );
}

interface PriceDisplayProps {
  price: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function PriceDisplay({ price, currency = '$', size = 'md' }: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl'
  };

  // Format price based on value
  let formattedPrice: string;
  if (price >= 1000) {
    formattedPrice = price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } else if (price >= 1) {
    formattedPrice = price.toFixed(2);
  } else if (price >= 0.0001) {
    formattedPrice = price.toFixed(4);
  } else {
    formattedPrice = price.toFixed(6);
  }

  return (
    <span className={`font-semibold text-primary ${sizeClasses[size]}`}>
      {currency}{formattedPrice}
    </span>
  );
}

interface MarketCapDisplayProps {
  value: number;
  size?: 'sm' | 'md';
}

export function MarketCapDisplay({ value, size = 'md' }: MarketCapDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  // Format large numbers
  let formatted: string;
  if (value >= 1e12) {
    formatted = `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    formatted = `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    formatted = `$${(value / 1e6).toFixed(2)}M`;
  } else {
    formatted = `$${value.toLocaleString()}`;
  }

  return (
    <span className={`text-secondary ${sizeClasses[size]}`}>
      {formatted}
    </span>
  );
}

