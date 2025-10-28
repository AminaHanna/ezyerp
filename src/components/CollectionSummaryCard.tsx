import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CollectionSummaryCardProps {
  icon: LucideIcon;
  label: string;
  amount: number | string;
  color: string;
  bgColor?: string;
  borderColor?: string;
  isLoading?: boolean;
  subText?: string[];
}

export const CollectionSummaryCard = ({
  icon: Icon,
  label,
  amount,
  color,
  bgColor = "bg-blue-50",
  borderColor = "border-blue-200",
  isLoading = false,
  subText = [],
}: CollectionSummaryCardProps) => {
  // Format amount as currency
  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null) return "₹ 0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "₹ 0.00";
    return `₹ ${numValue.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card className={`p-5 hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} ${bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div>
        {isLoading ? (
          <>
            <div className="h-7 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-24 mb-3" />
            <div className="h-2 bg-muted rounded animate-pulse w-32" />
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-foreground mb-2">
              {formatCurrency(amount)}
            </p>
            <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
            {subText.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                {subText.map((text, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {text}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

