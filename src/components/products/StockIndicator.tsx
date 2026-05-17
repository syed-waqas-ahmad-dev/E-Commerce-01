import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  stockQuantity: number;
  showQuantity?: boolean;
}

export function StockIndicator({ stockQuantity, showQuantity = false }: StockIndicatorProps) {
  if (stockQuantity === 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Out of Stock
      </Badge>
    );
  }

  if (stockQuantity < 10) {
    return (
      <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning border-warning/20">
        <AlertCircle className="h-3 w-3" />
        {showQuantity ? `Only ${stockQuantity} left` : 'Low Stock'}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-success/20">
      <CheckCircle2 className="h-3 w-3" />
      In Stock
    </Badge>
  );
}
