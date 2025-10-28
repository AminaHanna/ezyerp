import { useState, useEffect, useCallback } from "react";
import { Package, AlertCircle, Loader } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const Stocks = () => {
  const [financialYearId] = useState("2");
  const { officeid, officecode } = useUserSession();

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Stocks</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">
            {isLoading ? "Loading..." : `${stocks.length} items`}
          </p>
        </div>
      </header>

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

      {/* Stocks List */}
      {!isLoading && !error && stocks.length > 0 && (
        <div className="px-4 py-6 space-y-3">
          {stocks.map((stock, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              {/* Product Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                  {stock.productname || "N/A"}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {stock.brand && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {stock.brand}
                    </span>
                  )}
                  {stock.category && (
                    <span className="inline-block bg-secondary/10 text-secondary text-xs px-2 py-1 rounded">
                      {stock.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Quantity */}
                <div className="bg-background rounded p-2">
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-semibold text-foreground text-sm">{stock.quantity || 0}</p>
                </div>

                {/* Price */}
                <div className="bg-background rounded p-2">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold text-foreground text-sm">₹ {stock.price || 0}</p>
                </div>

                {/* Rate */}
                {stock.rate && (
                  <div className="bg-background rounded p-2">
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="font-semibold text-foreground text-sm">₹ {stock.rate}</p>
                  </div>
                )}

                {/* MRP */}
                {stock.mrp && (
                  <div className="bg-background rounded p-2">
                    <p className="text-xs text-muted-foreground">MRP</p>
                    <p className="font-semibold text-foreground text-sm">₹ {stock.mrp}</p>
                  </div>
                )}
              </div>

              {/* Total Value */}
              <div className="bg-primary/10 rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="font-bold text-primary">
                  ₹ {((stock.quantity || 0) * (stock.price || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Stocks;
