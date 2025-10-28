import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, RefreshCw, Download, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { generateCreditAgingPDF, downloadPDF } from "@/utils/pdfGenerator";

interface AgingItem {
  invoiceNumber?: string;
  invoice?: string;
  date?: string;
  pur_date?: string;
  total?: number;
  invoice_total?: number;
  balance?: number;
  outstanding?: number;
  daysOverdue?: number;
  days_overdue?: number;
  [key: string]: any;
}

const CreditAging = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { officeid, officecode } = useUserSession();
  const [financialYearId] = useState("2");
  const [customerName, setCustomerName] = useState("Customer");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Create stable API function using useCallback
  const getAgingFunction = useCallback(
    () => {
      if (!customerId) {
        throw new Error("Customer ID is required");
      }
      const params = {
        officecode,
        officeid,
        customerid: customerId,
        financialyearid: financialYearId,
      };
      console.log("📤 Sending parameters to creditagingreport.php:", params);
      return reportsService.getCreditAgingReport(
        officecode,
        officeid,
        customerId,
        financialYearId
      );
    },
    [customerId, officecode, officeid, financialYearId]
  );

  // Fetch aging data from API
  const { data, isLoading, error, execute } = useApi(getAgingFunction);

  // Fetch data on component mount
  useEffect(() => {
    execute();
  }, [execute]);

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("📊 Raw API Response:", data);
      const agingArray = data?.creditage || data?.data || data?.aging || data?.statement || [];
      console.log("📊 Aging data:", agingArray);
      if (agingArray?.[0]) {
        console.log("📊 First aging item:", agingArray[0]);
        console.log("📊 First item keys:", Object.keys(agingArray[0]));
      }
    }
  }, [data]);

  // Extract aging items from API response
  const agingData: AgingItem[] = (data?.creditage || data?.data || data?.aging || data?.statement || []).map((item: any) => ({
    invoiceNumber: item.invoiceNumber || item.invoice || item.invoiceno || item.inv_no || "N/A",
    date: item.date || item.pur_date || item.inv_date || item.invoicedate || "N/A",
    total: Number(item.total || item.totalamt || item.invoice_total || item.amount || 0),
    balance: Number(item.balance || item.netamount || item.outstanding || item.pending || 0),
    daysOverdue: Number(item.daysOverdue || item.days_overdue || item.days || 0),
  }));

  // Calculate total balance
  const totalBalance = agingData.reduce((sum, item) => sum + (item.balance || 0), 0);

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const fileName = `Credit_Aging_Report_${customerName}_${new Date().toISOString().split("T")[0]}.pdf`;
      const summary = {
        "Total Outstanding": totalBalance,
        "Number of Invoices": agingData.length,
      };
      const doc = generateCreditAgingPDF(
        customerName,
        new Date().toLocaleDateString("en-IN"),
        agingData,
        summary,
        fileName
      );
      downloadPDF(doc, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Credit Aging Report...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">Credit Aging Report</h1>
            </div>
          </div>
        </header>
        <div className="px-4 py-8 text-center">
          <p className="text-destructive font-semibold">Error: {error}</p>
          <Button onClick={() => execute()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Credit Aging Report</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => execute()}
              disabled={isLoading}
              className="hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
            </button>
            <Button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF || agingData.length === 0}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? "Generating..." : "Export PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Customer Info */}
      <div className="px-4 py-4 bg-card border-b border-border">
        <h2 className="text-base font-bold text-foreground">{customerName}</h2>
        <p className="text-xs text-muted-foreground uppercase mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
        </p>
      </div>

      {/* Aging Items */}
      <div className="px-4 py-4 space-y-4">
        {agingData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No aging data available</p>
          </div>
        ) : (
          agingData.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-4 shadow-sm border border-border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-foreground mb-1">
                    {item.invoiceNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.date}</p>
                  <p className="text-destructive text-xs font-bold">
                    No. of days <span className="ml-2">{item.daysOverdue}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">Total :</p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹ {(item.total || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance :</p>
                    <p className="text-sm font-bold text-primary">
                      ₹ {(item.balance || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Balance Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-muted border-t border-border">
        <div className="px-4 py-4 flex justify-between items-center">
          <span className="text-base font-bold text-foreground">Balance</span>
          <span className="text-2xl font-bold text-destructive">₹ {totalBalance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditAging;
