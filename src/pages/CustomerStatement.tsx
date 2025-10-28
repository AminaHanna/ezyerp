import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Calendar as CalendarIcon, Download, Loader, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { CustomerStatement as CustomerStatementType } from "@/types/api";
import { generateCustomerStatementPDF, generateTransactionPDF, downloadPDF } from "@/utils/pdfGenerator";

interface Transaction {
  id: string;
  date: string;
  type: string;
  debit: number;
  credit: number;
  balance: number;
}

const CustomerStatement = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { officeid, officecode } = useUserSession();

  // Date range state
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-10-30");
  const [financialYearId, setFinancialYearId] = useState("2");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingTransactionPDF, setIsGeneratingTransactionPDF] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Customer");

  // Format date range for display
  const formatDateRange = (start: string, end: string) => {
    try {
      const startObj = new Date(start);
      const endObj = new Date(end);
      const startStr = startObj.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
      const endStr = endObj.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
      return `${startStr} - ${endStr}`;
    } catch {
      return `${start} - ${end}`;
    }
  };

  const dateRange = formatDateRange(startDate, endDate);

  // Create stable API function using useCallback
  const getStatementFunction = useCallback(
    () => {
      if (!customerId) {
        throw new Error("Customer ID is required");
      }
      const params = {
        officecode,
        officeid,
        customerid: customerId,
        financialyearid: financialYearId,
        sdate: startDate,
        edate: endDate,
      };
      console.log("📤 Sending parameters to customerstatement.php:", params);
      return reportsService.getCustomerStatement(
        officecode,
        officeid,
        customerId,
        financialYearId,
        startDate,
        endDate
      );
    },
    [customerId, officecode, officeid, financialYearId, startDate, endDate]
  );

  // Fetch statement from API
  const { data, isLoading, error, execute } = useApi(getStatementFunction);

  // Fetch statement on component mount or when parameters change
  useEffect(() => {
    if (customerId) {
      execute();
    }
  }, [execute, customerId]);

  // Debug: Log the raw API response
  useEffect(() => {
    if (data) {
      console.log("📊 Raw API Response:", data);
      console.log("📊 Statement data:", data?.statement || data?.statements || data?.data);
      if ((data?.statement || data?.statements || data?.data)?.[0]) {
        console.log("📊 First statement item:", (data?.statement || data?.statements || data?.data)[0]);
        console.log("📊 First item keys:", Object.keys((data?.statement || data?.statements || data?.data)[0]));
      }
    }
  }, [data]);

  // Convert API response to transaction format
  const transactions: Transaction[] = (data?.statement || data?.statements || data?.data || []).map((stmt: CustomerStatementType) => ({
    // ID: Try actual API field names first, then fallback to old names
    id: (stmt.expincId || stmt.id || stmt.transactionid || stmt.voucherid || "N/A") as string,

    // Date: Try actual API field names first, then fallback to old names
    date: (stmt.pur_date || stmt.date || stmt.transactiondate || stmt.voucherdate || "N/A") as string,

    // Type: Try actual API field names first, then fallback to old names
    type: (stmt.alltype || stmt.alltypes || stmt.pinvtype || stmt.type || stmt.vouchertype || stmt.description || stmt.narration || "N/A") as string,

    // Debit: Try actual API field names first (incout, incout1, expout), then fallback
    debit: Number(stmt.incout || stmt.incout1 || stmt.expout || stmt.debit || 0),

    // Credit: Try actual API field names first (expin, incin1), then fallback
    credit: Number(stmt.expin || stmt.incin1 || stmt.credit || 0),

    // Balance: Try actual API field names first (ob), then fallback
    balance: Number(stmt.ob || stmt.balance || 0),
  }));

  // Calculate totals
  const totalReceived = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalReceivable = transactions.reduce((sum, t) => sum + t.credit, 0);
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  // Handle PDF export for full statement
  const handleExportPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const fileName = `Customer_Statement_${customerName || "Statement"}_${new Date().toISOString().split("T")[0]}.pdf`;
      const summary = {
        "Total Debit": totalReceived,
        "Total Credit": totalReceivable,
        "Closing Balance": finalBalance,
      };
      const doc = generateCustomerStatementPDF(
        customerName || "Customer",
        dateRange,
        transactions,
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

  // Handle PDF export for individual transaction
  const handleExportTransactionPDF = async (transaction: Transaction) => {
    try {
      setIsGeneratingTransactionPDF(transaction.id);
      const fileName = `Transaction_${transaction.id}_${new Date().toISOString().split("T")[0]}.pdf`;
      const doc = generateTransactionPDF(
        transaction.id,
        customerName || "Customer",
        transaction,
        fileName
      );
      downloadPDF(doc, fileName);
    } catch (error) {
      console.error("Error generating transaction PDF:", error);
    } finally {
      setIsGeneratingTransactionPDF(null);
    }
  };

  // Handle navigation to Credit Aging Report
  const handleNavigateToCreditAging = () => {
    navigate(`/credit-aging/${customerId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Customer Statement</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleNavigateToCreditAging}
              size="sm"
              variant="outline"
              className="gap-2"
              title="View Credit Aging Report"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Aging</span>
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF || transactions.length === 0}
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

      {/* Date Range and Customer Info */}
      <div className="px-4 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground font-medium">{dateRange}</span>
          <Button variant="ghost" size="icon" className="text-primary">
            <CalendarIcon className="w-5 h-5" />
          </Button>
        </div>
        <h2 className="text-base font-bold text-foreground">{customerId || "Customer"}</h2>
        <p className="text-xs text-muted-foreground uppercase mt-1">Customer ID: {customerId}</p>
      </div>

      {/* Date Range Configuration */}
      <div className="px-4 py-4 bg-muted/50 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Date Range</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading statement...</p>
        </div>
      )}

      {/* Error State */}
      {error && !error.includes("No data found") && (
        <div className="px-4 py-4 bg-destructive/10 border border-destructive rounded-lg mx-4 mt-4">
          <p className="text-destructive text-sm">Error: {error}</p>
        </div>
      )}

      {/* Transactions List */}
      {!isLoading && (
        <div className="px-4 py-4 space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-4 shadow-sm border border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground mb-1">{transaction.id}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{transaction.date}</p>
                    <p className="text-xs text-foreground">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    {transaction.debit > 0 && (
                      <div className="text-success text-sm font-semibold mb-1">
                        ₹ {transaction.debit.toFixed(2)}
                      </div>
                    )}
                    {transaction.credit > 0 && (
                      <div className="text-primary text-sm font-semibold mb-1">
                        ₹ {transaction.credit.toFixed(2)}
                      </div>
                    )}
                    <div className="text-destructive text-sm font-semibold">
                      ₹ {transaction.balance.toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* Download PDF Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleExportTransactionPDF(transaction)}
                    disabled={isGeneratingTransactionPDF === transaction.id}
                    size="sm"
                    variant="ghost"
                    className="gap-2 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    {isGeneratingTransactionPDF === transaction.id ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {error?.includes("No data found")
                  ? "No statement data available for the selected date range."
                  : "No transactions available."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Footer */}
      {transactions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-muted border-t border-border">
          <div className="px-4 py-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Received</p>
                <p className="text-sm font-bold text-success">₹ {totalReceived.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-foreground mb-1">Balance</p>
                <p className="text-xl font-bold text-destructive">₹ {finalBalance.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Receivable</p>
              <p className="text-sm font-bold text-primary">₹ {totalReceivable.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerStatement;
