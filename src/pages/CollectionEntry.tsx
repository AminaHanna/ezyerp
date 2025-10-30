import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader, Calendar, CreditCard, Banknote, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { collectionsService, salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { useApi } from "@/hooks/useApi";
import { Customer } from "@/types/api";

const CollectionEntry = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { toast } = useToast();
  const { officeid, officecode, userid } = useUserSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Get customer name from navigation state or use customerId
  const customerName = (window.history.state?.usr?.customerName as string) || `Customer #${customerId}`;

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    rdate: getTodayDate(),
    payment: "Cash",
    amount: "",
    chequeno: "",
    chequedate: "",
    remarks: "",
    custledger: "",
  });

  // Create stable API function using useCallback
  const getCustomersFunction = useCallback(
    () => {
      const params = {
        officeid,
        officecode,
        financialyearid: "2",
        empid: "2"
      };
      return salesService.getCustomers(params);
    },
    [officeid, officecode]
  );

  // Fetch customers from API
  const { data, execute } = useApi(getCustomersFunction);

  // Fetch customers on mount
  useEffect(() => {
    execute();
  }, [execute]);

  // Find the specific customer and populate custledger when data is loaded
  useEffect(() => {
    if (data?.customers && customerId) {
      // Find customer by customerid (primary field)
      const foundCustomer = data.customers.find(
        (c) => String(c.customerid) === String(customerId)
      );

      if (foundCustomer) {
        setCustomer(foundCustomer);

        // Auto-populate custledger with account_id
        if (foundCustomer.account_id) {
          setFormData((prev) => ({
            ...prev,
            custledger: foundCustomer.account_id,
          }));
        }
      }
    }
  }, [data, customerId]);

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (formData.payment === "Cheque" && !formData.chequeno) {
      toast({
        title: "Validation Error",
        description: "Please enter cheque number for cheque payment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        officecode: officecode || "WF01",
        officeid: officeid || "1",
        financialyearid: "2",
        rdate: formData.rdate,
        empid: userid || "4",
        empidc: userid || "4",
        payment: formData.payment,
        amount: formData.amount,
        customerid: customerId || "",
        chequeno: formData.chequeno || "",
        chequedate: formData.chequedate || "",
        remarks: formData.remarks || "",
        custledger: formData.custledger || "",
      };

      console.log("📤 Submitting receipt data:", requestData);

      const response = await collectionsService.createReceipt(requestData);

      console.log("📥 Receipt response:", response);

      if (response.flag) {
        toast({
          title: "Success",
          description: "Receipt created successfully",
        });

        // Navigate back to customers page
        navigate("/customers");
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create receipt",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Receipt creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">New Receipt</h1>
            <p className="text-sm text-primary-foreground/80">{customerName}</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="px-4 py-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Receipt Date */}
            <div className="space-y-2">
              <Label htmlFor="rdate" className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Receipt Date
              </Label>
              <Input
                id="rdate"
                type="date"
                value={formData.rdate}
                onChange={(e) => handleChange("rdate", e.target.value)}
                required
                className="text-base"
              />
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="payment" className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4" />
                Payment Type
              </Label>
              <Select
                value={formData.payment}
                onValueChange={(value) => handleChange("payment", value)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="Cheque">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Cheque
                    </div>
                  </SelectItem>
                  <SelectItem value="NEFT">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      NEFT/Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
                className="text-lg font-semibold"
              />
            </div>

            {/* Cheque Details (conditional) */}
            {formData.payment === "Cheque" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="chequeno" className="text-base">
                    Cheque Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="chequeno"
                    type="text"
                    placeholder="Enter cheque number"
                    value={formData.chequeno}
                    onChange={(e) => handleChange("chequeno", e.target.value)}
                    required={formData.payment === "Cheque"}
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chequedate" className="text-base">
                    Cheque Date
                  </Label>
                  <Input
                    id="chequedate"
                    type="date"
                    value={formData.chequedate}
                    onChange={(e) => handleChange("chequedate", e.target.value)}
                    className="text-base"
                  />
                </div>
              </>
            )}

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-base">
                Remarks
              </Label>
              <Input
                id="remarks"
                type="text"
                placeholder="Enter remarks (optional)"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                className="text-base"
              />
            </div>

            {/* Customer Ledger */}
            <div className="space-y-2">
              <Label htmlFor="custledger" className="text-base">
                Customer Ledger
              </Label>
              <Input
                id="custledger"
                type="text"
                placeholder="Enter customer ledger (optional)"
                value={formData.custledger}
                onChange={(e) => handleChange("custledger", e.target.value)}
                className="text-base"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Receipt"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CollectionEntry;

