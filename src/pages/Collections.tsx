import { useState, useEffect, useCallback, useRef } from "react";
import {
  Receipt,
  AlertCircle,
  Loader,
  CreditCard,
  Banknote,
  DollarSign,
  CheckCircle,
  Calendar,
  Trash2,
} from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { collectionsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { Collection } from "@/types/api";
import { formatDateForDisplay } from "@/utils/dateFormatter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Collections = () => {
  const { officeid, officecode, empid } = useUserSession();
  const [financialYearId] = useState("2");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isInitializedRef = useRef(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Set default dates (current month)
  useEffect(() => {
    if (!isInitializedRef.current) {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setStartDate(firstDay.toISOString().split("T")[0]);
      setEndDate(lastDay.toISOString().split("T")[0]);
      isInitializedRef.current = true;
    }
  }, []);

  // Create stable API function
  const getCollectionsFunction = useCallback(() => {
    if (!startDate || !endDate) {
      return Promise.resolve({ flag: false, msg: "Please select date range", collections: [] });
    }

    const params = {
      officeid: officeid || "1",
      empid: empid || "4",
      financialyearid: financialYearId,
      officecode: officecode || "WF01",
      sdate: startDate,
      edate: endDate,
    };

    console.log("📤 Fetching collections with params:", params);
    return collectionsService.getCollections(params as any);
  }, [officeid, officecode, empid, financialYearId, startDate, endDate]);

  // Fetch collections
  const { data, isLoading, error, execute } = useApi(getCollectionsFunction);

  // Auto-fetch when dates change
  useEffect(() => {
    if (startDate && endDate) {
      execute();
    }
  }, [startDate, endDate, execute]);

  const collections = data?.collections || [];

  // Calculate total amount
  const totalAmount = collections.reduce((sum, collection) => {
    const amount = parseFloat(String(collection.amount || 0));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Get payment icon based on payment type
  const getPaymentIcon = (paymentType?: string) => {
    const type = (paymentType || "").toUpperCase();
    if (type.includes("CASH")) return <Banknote className="w-5 h-5 text-green-600" />;
    if (type.includes("CHEQUE") || type.includes("CHQ")) return <CreditCard className="w-5 h-5 text-blue-600" />;
    if (type.includes("NEFT") || type.includes("TRANSFER")) return <DollarSign className="w-5 h-5 text-purple-600" />;
    return <CheckCircle className="w-5 h-5 text-gray-600" />;
  };

  // Get payment type label
  const getPaymentLabel = (paymentType?: string) => {
    const type = (paymentType || "").toUpperCase();
    if (type.includes("CASH")) return "Cash";
    if (type.includes("CHEQUE") || type.includes("CHQ")) return "Cheque";
    if (type.includes("NEFT") || type.includes("TRANSFER")) return "NEFT";
    return paymentType || "Other";
  };

  // Handle delete collection
  const handleDeleteClick = (collection: Collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete?.receiptid) {
      toast({
        title: "Error",
        description: "Collection ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await collectionsService.deleteCollection(collectionToDelete.receiptid);

      if (response.flag) {
        toast({
          title: "Success",
          description: "Collection deleted successfully",
        });
        // Refresh the collections list
        execute();
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to delete collection",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-sm text-primary-foreground/80 mt-1">
            {isLoading ? "Loading..." : `${collections.length} collections`}
          </p>
        </div>
      </header>

      {/* Date Range Filter */}
      <div className="px-4 py-4 bg-card border-b border-border">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">From Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">To Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Loader className="w-12 h-12 text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading collections...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Error Loading Collections</h2>
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && collections.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Receipt className="w-20 h-20 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Collections Found</h2>
          <p className="text-center text-muted-foreground">
            No collections available for the selected date range
          </p>
        </div>
      )}

      {/* Collections List */}
      {!isLoading && !error && collections.length > 0 && (
        <div className="px-4 py-6 space-y-3">
          {collections.map((collection, index) => (
            <Card
              key={collection.receiptid || index}
              className="p-4 border-l-4 border-l-primary hover:shadow-md transition-shadow"
            >
              {/* Header: Customer Name, Amount, and Delete Button */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                    {collection.customer_name || "N/A"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">
                      ₹ {parseFloat(String(collection.amount || 0)).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(collection)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Date and Payment Type */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {collection.rdate ? formatDateForDisplay(collection.rdate) : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(collection.payment)}
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="text-sm font-medium text-foreground">
                      {getPaymentLabel(collection.payment)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cheque Details (if applicable) */}
              {collection.chequeno && (
                <div className="bg-background rounded p-2 mb-3">
                  <p className="text-xs text-muted-foreground">Cheque No.</p>
                  <p className="text-sm font-medium text-foreground">{collection.chequeno}</p>
                  {collection.chequedate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Date: {formatDateForDisplay(collection.chequedate)}
                    </p>
                  )}
                </div>
              )}

              {/* Remarks */}
              {collection.remarks && (
                <div className="bg-background rounded p-2">
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <p className="text-sm text-foreground line-clamp-2">{collection.remarks}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Total Amount Footer */}
      {!isLoading && !error && collections.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Collections</p>
              <p className="text-sm font-semibold text-foreground">{collections.length} items</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹ {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection?
              {collectionToDelete && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="font-semibold text-foreground">
                    {collectionToDelete.customer_name || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: ₹ {parseFloat(String(collectionToDelete.amount || 0)).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Date: {collectionToDelete.rdate ? formatDateForDisplay(collectionToDelete.rdate) : "N/A"}
                  </p>
                </div>
              )}
              <p className="mt-2 text-destructive font-medium">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Collections;

