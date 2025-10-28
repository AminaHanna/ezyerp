# Collections & Stocks - Code Snippets 📝

## Collections Page - Key Functions

### Payment Icon Mapping
```typescript
const getPaymentIcon = (paymentType?: string) => {
  const type = (paymentType || "").toUpperCase();
  if (type.includes("CASH")) return <Banknote className="w-5 h-5 text-green-600" />;
  if (type.includes("CHEQUE") || type.includes("CHQ")) return <CreditCard className="w-5 h-5 text-blue-600" />;
  if (type.includes("NEFT") || type.includes("TRANSFER")) return <DollarSign className="w-5 h-5 text-purple-600" />;
  return <CheckCircle className="w-5 h-5 text-gray-600" />;
};

const getPaymentLabel = (paymentType?: string) => {
  const type = (paymentType || "").toUpperCase();
  if (type.includes("CASH")) return "Cash";
  if (type.includes("CHEQUE") || type.includes("CHQ")) return "Cheque";
  if (type.includes("NEFT") || type.includes("TRANSFER")) return "NEFT";
  return paymentType || "Other";
};
```

### Date Range Filter
```typescript
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const isInitializedRef = useRef(false);

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
```

### Total Amount Calculation
```typescript
const totalAmount = collections.reduce((sum, collection) => {
  const amount = parseFloat(String(collection.amount || 0));
  return sum + (isNaN(amount) ? 0 : amount);
}, 0);
```

### API Call
```typescript
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

  return collectionsService.getCollections(params as any);
}, [officeid, officecode, empid, financialYearId, startDate, endDate]);
```

---

## Stocks Page - Key Functions

### Search Filtering
```typescript
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
```

### Stock Status Badge
```typescript
const getStockStatus = (quantity: number | undefined) => {
  const qty = quantity || 0;
  if (qty === 0) return { label: "Out of Stock", color: "destructive" };
  if (qty < 10) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "default" };
};

const getStatusColor = (quantity: number | undefined) => {
  const qty = quantity || 0;
  if (qty === 0) return "text-red-600";
  if (qty < 10) return "text-yellow-600";
  return "text-green-600";
};
```

### Stock Card Rendering
```typescript
{filteredStocks.map((stock, index) => {
  const status = getStockStatus(stock.quantity);
  const statusColor = getStatusColor(stock.quantity);

  return (
    <Card key={index} className="p-4 border-l-4 border-l-primary">
      {/* Product Header with Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-2">
            {stock.productname || "N/A"}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {stock.brand && <Badge variant="secondary">{stock.brand}</Badge>}
            {stock.category && <Badge variant="outline">{stock.category}</Badge>}
          </div>
        </div>
        <Badge variant={status.color as any}>{status.label}</Badge>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-background rounded p-2">
          <p className="text-xs text-muted-foreground">Quantity</p>
          <p className={`font-semibold text-sm ${statusColor}`}>
            {stock.quantity || 0} units
          </p>
        </div>
        {/* More fields... */}
      </div>

      {/* Total Value */}
      <div className="bg-primary/10 rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">Total Stock Value</p>
        <p className="font-bold text-primary">
          ₹ {((stock.quantity || 0) * parseFloat(String(stock.price || 0))).toFixed(2)}
        </p>
      </div>
    </Card>
  );
})}
```

---

## Type Definitions

### Collection Interface
```typescript
export interface Collection {
  receiptid?: string;
  rdate?: string;
  customer_id?: string;
  project_id?: string | null;
  daccount_id?: string;
  caccount_id?: string;
  amount?: string | number;
  payment?: string;
  chequeno?: string;
  chequedate?: string;
  voucher_typeid?: string;
  remarks?: string;
  account_name?: string;
  acc_name?: string;
  customer_name?: string;
  mobileno?: string;
  whatsappno?: string;
  msg?: string;
  flag?: boolean;
  id?: string;
  date?: string;
  customerid?: string;
  customername?: string;
}
```

### Stock Interface
```typescript
export interface Stock {
  id: string;
  productname: string;
  quantity: number;
  price: number;
  mrp?: number;
  rate?: number;
  brand?: string;
  category?: string;
  status?: string;
}
```

---

## UI Components Used

### Collections Page
```typescript
import {
  Receipt,
  AlertCircle,
  Loader,
  CreditCard,
  Banknote,
  DollarSign,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
```

### Stocks Page
```typescript
import {
  Package,
  AlertCircle,
  Loader,
  Search,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
```

---

**Status**: ✅ **ALL CODE SNIPPETS PROVIDED**

