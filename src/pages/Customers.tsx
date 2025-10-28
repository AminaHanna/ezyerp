import { useState, useEffect, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { CustomerCard } from "@/components/CustomerCard";
import { CustomerModal } from "@/components/CustomerModal";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useApi } from "@/hooks/useApi";
import { salesService, masterService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; id: string } | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [financialYearId] = useState("2");
  const [empId] = useState("2");
  const { officeid, officecode } = useUserSession();

  // Create stable API function using useCallback
  const getCustomersFunction = useCallback(
    () => {
      const params = {
        officeid,
        officecode,
        financialyearid: financialYearId,
        empid: empId
      };
      console.log("📤 Sending parameters to customers.php:", params);
      return salesService.getCustomers(params);
    },
    [officeid, officecode, financialYearId, empId]
  );

  // Create stable API function for fetching areas
  const getAreasFunction = useCallback(
    () => {
      console.log("📤 Sending parameters to areas.php:", { officecode, officeid });
      return masterService.getAreas(officecode, officeid);
    },
    [officecode, officeid]
  );

  // Fetch customers from API
  const { data, isLoading, error, execute } = useApi(getCustomersFunction);

  // Fetch areas from API
  const { data: areasData, isLoading: areasLoading, execute: executeAreas } = useApi(getAreasFunction);

  // Fetch customers on component mount
  useEffect(() => {
    execute();
  }, [execute]);

  // Fetch areas on component mount
  useEffect(() => {
    executeAreas();
  }, [executeAreas]);

  // Debug: Log areas data and loading state
  useEffect(() => {
    console.log("📊 Areas Loading State:", areasLoading);
    console.log("📊 Areas Data:", areasData);
    if (areasData?.areas) {
      console.log("📊 Number of areas:", areasData.areas.length);
      console.log("📊 First area:", areasData.areas[0]);
      console.log("📊 All areas:", areasData.areas);
    }
    if (areasData?.error) {
      console.error("❌ Areas API Error:", areasData.error);
    }
  }, [areasData, areasLoading]);

  // Filter customers based on search query and selected area
  const filteredCustomers = (data?.customers || []).filter((customer) => {
    // Search filter
    const matchesSearch = (customer.customer_name || customer.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Area filter
    const matchesArea = selectedArea === "all" || customer.area_name === selectedArea;

    return matchesSearch && matchesArea;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full border-2 bg-card"
            />
          </div>
          {/* Area Filter Dropdown */}
          <Select value={selectedArea} onValueChange={setSelectedArea} disabled={areasLoading}>
            <SelectTrigger className="w-12 h-12 rounded-full border-2 border-border bg-card p-0 flex items-center justify-center hover:bg-accent transition-colors">
              <Filter className="w-5 h-5 text-foreground" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areasData?.areas && areasData.areas.length > 0 ? (
                areasData.areas.map((area) => {
                  // Handle field name variations from API
                  const areaId = area.id || area.areaid || area.area_id || String(Math.random());
                  const areaName = area.name || area.areaname || area.area_name || "Unknown Area";

                  return (
                    <SelectItem key={areaId} value={areaName}>
                      {areaName}
                    </SelectItem>
                  );
                })
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {areasLoading ? "Loading areas..." : "No areas available"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Debug: Parameter Selection */}
        {/* <div className="bg-muted/50 p-3 rounded-lg border border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Debug: API Parameters</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Financial Year ID</label>
              <Input
                type="text"
                value={financialYearId}
                onChange={(e) => setFinancialYearId(e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g., 1, 2, 3"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Employee ID</label>
              <Input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g., 1, 2, 3"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Office: {officeid} ({officecode})
          </p>
        </div> */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      )}

      {/* Error State - Only show if it's not "No data found" */}
      {error && !error.includes("No data found") && (
        <div className="px-4 py-4 bg-destructive/10 border border-destructive rounded-lg mx-4">
          <p className="text-destructive text-sm">Error: {error}</p>
        </div>
      )}

      {/* Customer List */}
      {!isLoading && (
        <div className="px-4 space-y-3">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => {
              // Create a unique key using multiple fields to avoid duplicates
              // Use customerid + account_id + index as fallback
              const uniqueKey = customer.customeraccountid
                ? `${customer.customerid}-${customer.account_id}-${customer.customeraccountid}`
                : customer.cust_balid
                ? `${customer.customerid}-${customer.cust_balid}`
                : `${customer.customerid}-${index}`;

              return (
                <CustomerCard
                  key={uniqueKey}
                  name={customer.customer_name || customer.name || "N/A"}
                  day={customer.area_name || customer.day || "N/A"}
                  balance={Number(customer.amount || customer.balance || 0)}
                  mobileno={customer.mobileno}
                  whatsappno={customer.whatsappno}
                  onClick={() => setSelectedCustomer({
                    name: customer.customer_name || customer.name || "N/A",
                    id: customer.customerid || customer.id || ""
                  })}
                />
              );
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery || selectedArea !== "all"
                  ? "No customers found matching your filters."
                  : error?.includes("No data found")
                  ? "No customers available for the selected criteria."
                  : "No customers available."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Customer Modal */}
      {selectedCustomer && (
        <CustomerModal
          open={!!selectedCustomer}
          onOpenChange={(open) => !open && setSelectedCustomer(null)}
          customerName={selectedCustomer.name}
          customerId={selectedCustomer.id}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Customers;
