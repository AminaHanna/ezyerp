import { useState, useEffect, useCallback, useMemo } from "react";
import { Package, AlertCircle, Loader, Search, X } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Stocks = () => {
  const [financialYearId] = useState("2");
  const { officeid, officecode } = useUserSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Create stable API function using useCallback
  const getStocksFunction = useCallback(
    () => {
      const params = {
        officeid,
        officecode,
        financialyearid: financialYearId,
      };
      console.log("📤 Sending parameters to stocks.php:", params);
      return reportsService.getStocks(params);
    },
    [officeid, officecode, financialYearId]
  );

  // Fetch stocks from API
  const { data, isLoading, error, execute } = useApi(getStocksFunction);

  // Fetch stocks on component mount
  useEffect(() => {
    execute();
  }, [execute]);

  // Debug: Log stocks data
  useEffect(() => {
    console.log("📊 Stocks Loading State:", isLoading);
    console.log("📊 Stocks API Response:", data);
    if (data?.stocks) {
      console.log("📊 Number of stocks:", data.stocks.length);
      console.log("📊 First stock:", data.stocks[0]);
      if (data.stocks[0]) {
        console.log("📊 Stock fields available:", Object.keys(data.stocks[0]));
      }
    }
    if (error) {
      console.error("❌ Stocks API Error:", error);
    }
  }, [data, isLoading, error]);

  const stocks = data?.stocks || [];

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;

    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (stock) =>
        (stock.productname || "").toLowerCase().includes(query) ||
        (stock.brand || "").toLowerCase().includes(query) ||
        (stock.category || "").toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  // Get stock status badge
  const getStockStatus = (quantity: number | undefined) => {
    const qty = quantity || 0;
    if (qty === 0) return { label: "Out of Stock", color: "destructive" };
    if (qty < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "default" };
  };

  // Get stock status icon color
  const getStatusColor = (quantity: number | undefined) => {
    const qty = quantity || 0;
    if (qty === 0) return "text-red-600";
    if (qty < 10) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Stocks</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">
            {isLoading ? "Loading..." : `${filteredStocks.length} of ${stocks.length} items`}
          </p>
        </div>
      </header>

      {/* Search Box */}
      {!isLoading && !error && stocks.length > 0 && (
        <div className="px-4 py-3 bg-card border-b border-border sticky top-16 z-30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by product name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Loader className="w-12 h-12 text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading stocks...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Error Loading Stocks</h2>
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && stocks.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Package className="w-20 h-20 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Stocks Found</h2>
          <p className="text-center text-muted-foreground">
            No stock items available for the selected period
          </p>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && !error && stocks.length > 0 && filteredStocks.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Package className="w-20 h-20 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Results Found</h2>
          <p className="text-center text-muted-foreground">
            No stocks match your search query
          </p>
        </div>
      )}

      {/* Stocks List */}
      {!isLoading && !error && filteredStocks.length > 0 && (
        <div className="px-4 py-6 space-y-3">
          {filteredStocks.map((stock, index) => {
            const status = getStockStatus(stock.quantity);
            const statusColor = getStatusColor(stock.quantity);

            return (
              <Card
                key={index}
                className="p-4 border-l-4 border-l-primary hover:shadow-md transition-shadow"
              >
                {/* Product Header with Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base mb-2 line-clamp-2">
                      {stock.productname || "N/A"}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {stock.brand && (
                        <Badge variant="secondary" className="text-xs">
                          {stock.brand}
                        </Badge>
                      )}
                      {stock.category && (
                        <Badge variant="outline" className="text-xs">
                          {stock.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* ,,,,,,,,,,,,,,,,, */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-2 py-1">
                    <p className="text-xs text-muted-foreground mb-1">Available Quantity</p>
                    <span className={`font-bold text-2xl mr-1 ${statusColor}`}>
                      {stock.quantity || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">units in stock</span>
                  </div>
                  {/* ........... */}
                  <div className="text-right">
                    <Badge
                      variant={status.color as any}
                      className={`text-xs ${statusColor}`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>

                {/* Quantity Display */}
                {/* <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-3 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Available Quantity</p>
                  <p className={`font-bold text-2xl ${statusColor}`}>
                    {stock.quantity || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">units in stock</p>
                </div> */}
              </Card>
            );
          })}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Stocks;
