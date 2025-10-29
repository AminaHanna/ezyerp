import { RecentCollection } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, CreditCard, AlertCircle } from "lucide-react";
import { formatDateForDisplay } from "@/utils/dateFormatter";

interface RecentCollectionsProps {
  collections: RecentCollection[];
  isLoading?: boolean;
}

export const RecentCollections = ({
  collections,
  isLoading = false,
}: RecentCollectionsProps) => {
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

  // Get status badge color and text
  const getStatusBadge = (collection: RecentCollection) => {
    const collectionType = collection.collectiontype?.toLowerCase() || "";
    const status = collection.collectionstatus?.toLowerCase() || "";

    if (collectionType === "cheque") {
      return {
        text: "Pending",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      };
    }

    if (status === "completed" || status === "success") {
      return {
        text: "Completed",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      };
    }

    if (status === "pending") {
      return {
        text: "Pending",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      };
    }

    if (status === "failed" || status === "rejected") {
      return {
        text: "Failed",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      };
    }

    // Return "Active" instead of "Unknown" for empty status
    return {
      text: status || "Active",
      variant: "secondary" as const,
      color: "bg-green-100 text-green-800",
    };
  };

  // Get collection type icon
  const getCollectionTypeIcon = (collectionType: string | undefined) => {
    const type = collectionType?.toLowerCase() || "";
    if (type === "cheque") {
      return <CreditCard className="w-4 h-4" />;
    }
    return <Receipt className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No recent collections found</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your date range
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {collections.map((collection, index) => {
        const statusBadge = getStatusBadge(collection);
        const collectionType = collection.collectiontype || collection.payment || "";
        // Use 'amount' field first (from API), fallback to 'collectionamt'
        const amount = collection.amount || collection.collectionamt;
        // Use 'collection_date' field first (from API), fallback to 'collectiondate'
        const date = collection.collection_date || collection.collectiondate
          ? formatDateForDisplay(collection.collection_date || collection.collectiondate || "")
          : "N/A";
        const refNo =
          collection.chequeno || collection.receiptno || `#${index + 1}`;
        // Get customer name from either customer_name or customername field
        const customerName = collection.customer_name || collection.customername || "N/A";

        return (
          <Card
            key={collection.collectionid || index}
            className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-primary"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: Icon and Details */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  {getCollectionTypeIcon(collectionType)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Amount and Type */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground text-lg">
                      {formatCurrency(amount)}
                    </p>
                    {collectionType && (
                      <Badge variant="outline" className="text-xs flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                        {collectionType}
                      </Badge>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="text-sm text-foreground font-medium mb-1 truncate">
                    {customerName}
                  </div>

                  {/* Reference Number and Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{refNo}</span>
                    <span>•</span>
                    <span>{date}</span>
                  </div>
                </div>
              </div>

              {/* Right: Status Badge */}
              <div className="flex-shrink-0">
                <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.color}`}>
                  {statusBadge.text}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

