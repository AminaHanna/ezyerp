import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  onApply: (fromDate: string, toDate: string) => void;
  isLoading?: boolean;
}

export const DateRangeFilter = ({ onApply, isLoading = false }: DateRangeFilterProps) => {
  // Get today's date and 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState(formatDateForInput(thirtyDaysAgo));
  const [toDate, setToDate] = useState(formatDateForInput(today));
  const isInitializedRef = useRef(false);

  // Auto-apply when dates change (but skip initial render)
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    onApply(fromDate, toDate);
  }, [fromDate, toDate]);

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* From Date */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            From Date
          </label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* To Date */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            To Date
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

