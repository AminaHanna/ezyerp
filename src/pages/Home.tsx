import { useEffect, useState, useCallback, useRef } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserInfoCard } from "@/components/UserInfoCard";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { CollectionSummaryCard } from "@/components/CollectionSummaryCard";
import { RecentCollections } from "@/components/RecentCollections";
import { useUserSession } from "@/hooks/useUserSession";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { DashboardResponse } from "@/types/api";
import { TrendingUp, Receipt, CreditCard, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { convertToApiDateFormat, getDefaultDateRange } from "@/utils/dateFormatter";

const Home = () => {
  const { user, officeid, officecode } = useUserSession();
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Use refs to store current values without triggering re-renders
  const dateRangeRef = useRef(dateRange);
  const officeIdRef = useRef(officeid);
  const officeCodeRef = useRef(officecode);
  const userIdRef = useRef(user?.userid);

  // Update refs when values change
  useEffect(() => {
    dateRangeRef.current = dateRange;
    officeIdRef.current = officeid;
    officeCodeRef.current = officecode;
    userIdRef.current = user?.userid;
  }, [dateRange, officeid, officecode, user?.userid]);



  // Initialize with default date range (only once)
  useEffect(() => {
    if (!hasInitialized) {
      setDateRange(getDefaultDateRange());
      setHasInitialized(true);
    }
  }, []);

  // Create stable API function using useCallback with no dependencies
  // Uses refs to access current values without triggering re-renders
  const fetchDashboardData = useCallback(async () => {
    if (!dateRangeRef.current || !officeIdRef.current || !officeCodeRef.current) {
      return { flag: false, msg: "Missing parameters" } as DashboardResponse;
    }

    // Convert dates from YYYY-MM-DD to DD-MM-YYYY format for API
    const sdate = convertToApiDateFormat(dateRangeRef.current.from);
    const edate = convertToApiDateFormat(dateRangeRef.current.to);

    return reportsService.getUserDashboard(
      officeCodeRef.current,
      officeIdRef.current,
      "2", // financialyearid - default to 2
      userIdRef.current || "2", // empid
      sdate,
      edate
    );
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error, execute } = useApi(
    fetchDashboardData,
    (data) => {
      console.log("📊 Dashboard data loaded:", data);
      console.log("📊 Dashboard summary:", data?.summary || data?.data);
    },
    (error: string) => {
      console.error("❌ Dashboard API Error:", error);
    }
  );

  // Memoize the date range handler to prevent infinite loops
  const handleDateRangeApply = useCallback((fromDate: string, toDate: string) => {
    setDateRange({ from: fromDate, to: toDate });
  }, []);

  // Fetch data when date range changes
  useEffect(() => {
    if (dateRange && hasInitialized) {
      execute();
    }
  }, [dateRange, hasInitialized, execute]);

  // Extract summary data with fallback to 0 if API fails
  // Try multiple possible response structures
  const summaryData =
    dashboardData?.summary ||
    dashboardData?.data ||
    dashboardData?.userdashboard ||
    {};

  // Extract collection amounts
  const totalCollectionAmount = summaryData.collectionamt || 0;
  const receiptAmount = summaryData.collectionrpamt || summaryData.receiptamt || 0;
  const chequeAmount = summaryData.collectioncqamt || 0;
  const pdcAmount = summaryData.pdcamt || 0;

  // Extract recent collections
  const recentCollections = dashboardData?.recentcollection || [];

  // Debug: Log extracted data and full response
  console.log("📊 Full API Response:", dashboardData);
  console.log("📊 Extracted summary data:", {
    totalCollectionAmount,
    receiptAmount,
    chequeAmount,
    pdcAmount,
    recentCollections,
    rawData: summaryData,
  });

  // Debug: Log recent collections details
  if (recentCollections && recentCollections.length > 0) {
    console.log("📊 Recent Collections Details:");
    recentCollections.forEach((collection: any, index: number) => {
      console.log(`  Collection ${index + 1}:`, {
        collectionamt: collection.collectionamt,
        collectiontype: collection.collectiontype,
        collectionstatus: collection.collectionstatus,
        customer_name: collection.customer_name,
        customername: collection.customername,
        collectiondate: collection.collectiondate,
        receiptno: collection.receiptno,
        chequeno: collection.chequeno,
        allFields: collection,
      });
    });
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-primary-foreground/80">
            Welcome back, <span className="font-semibold">{user?.username}</span>!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* User Information Card */}
        <UserInfoCard
          user={user}
          employeeName={user?.employee_name || user?.username}
          officeName={user?.officename}
          location={user?.location || user?.state_name || "Main Office"}
          userType={user?.usertype || "User"}
        />

        {/* Collection Summary Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Collection Summary</h2>

          {/* Date Range Filter */}
          <DateRangeFilter onApply={handleDateRangeApply} isLoading={isLoading} />

          {/* Error State */}
          {error && (
            <Card className="p-4 mb-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Error Loading Data</p>
                  <p className="text-sm text-destructive/80">
                    {error || "Failed to fetch dashboard data"}
                  </p>
                  <p className="text-xs text-destructive/60 mt-2">
                    Please try adjusting the date range or contact support if the issue persists.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CollectionSummaryCard
              icon={TrendingUp}
              label="Total Collection"
              amount={totalCollectionAmount}
              color="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-300"
              isLoading={isLoading}
              subText={[
                `Receipt: ₹ ${(typeof receiptAmount === "string" ? parseFloat(receiptAmount) : receiptAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Cheque: ₹ ${(typeof chequeAmount === "string" ? parseFloat(chequeAmount) : chequeAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              ]}
            />
            <CollectionSummaryCard
              icon={Receipt}
              label="Receipt Amount"
              amount={receiptAmount}
              color="text-green-600"
              bgColor="bg-green-50"
              borderColor="border-green-300"
              isLoading={isLoading}
            />
            <CollectionSummaryCard
              icon={CreditCard}
              label="PDC Amount"
              amount={pdcAmount}
              color="text-purple-600"
              bgColor="bg-purple-50"
              borderColor="border-purple-300"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Recent Collections */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Collections</h2>
          <RecentCollections
            collections={recentCollections}
            isLoading={isLoading}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
