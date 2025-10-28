# Customer Management Endpoints - Quick Reference

## 🚀 Quick Start

### Get Customers List

```typescript
import { salesService } from "@/services/ezyerpService";

const response = await salesService.getCustomers({
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
});

// Access customers
response.customers?.forEach(customer => {
  console.log(customer.name, customer.balance);
});
```

### Get Customer Statement

```typescript
import { reportsService } from "@/services/ezyerpService";

const response = await reportsService.getCustomerStatement(
  "WF01",        // officecode
  "1",           // officeid
  "120",         // customerid
  "2",           // financialyearid
  "2025-04-01",  // start date
  "2025-05-30"   // end date
);

// Access transactions
response.statement?.forEach(transaction => {
  console.log(transaction.date, transaction.debit, transaction.credit);
});
```

## 📊 Response Structure

### Customer List Response

```json
{
  "flag": true,
  "msg": "Success",
  "customers": [
    {
      "id": "1",
      "name": "Customer Name",
      "day": "MONDAY",
      "balance": 5000.0
    }
  ]
}
```

### Customer Statement Response

```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "id": "INV001",
      "date": "2025-04-05",
      "description": "Invoice",
      "debit": 5000.0,
      "credit": 0.0,
      "balance": 5000.0
    }
  ]
}
```

## 🔧 Parameters

### Customer List

| Parameter | Value | Example |
|-----------|-------|---------|
| officeid | string | "1" |
| officecode | string | "WF01" |
| financialyearid | string | "2" |
| empid | string | "2" |

### Customer Statement

| Parameter | Value | Example |
|-----------|-------|---------|
| officecode | string | "WF01" |
| officeid | string | "1" |
| customerid | string | "120" |
| financialyearid | string | "2" |
| sdate | string | "2025-04-01" |
| edate | string | "2025-05-30" |

## 💡 Usage in Components

### React Hook Example

```typescript
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const MyComponent = () => {
  const { officeid, officecode } = useUserSession();
  
  const { data, isLoading, error, execute } = useApi(
    () => salesService.getCustomers({
      officeid,
      officecode,
      financialyearid: "2",
      empid: "2"
    })
  );

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data?.customers?.map(c => (
        <div key={c.id}>{c.name}</div>
      ))}
    </div>
  );
};
```

## ✅ Error Handling

```typescript
try {
  const response = await salesService.getCustomers({...});
  if (response.flag) {
    // Success
    console.log(response.customers);
  } else {
    // API returned error
    console.error(response.msg);
  }
} catch (error) {
  // Network or parsing error
  console.error(error);
}
```

## 📋 Type Definitions

```typescript
// Customer
interface Customer {
  id: string;
  name: string;
  day?: string;
  balance: number;
  officeid?: string;
  officecode?: string;
}

// Customer Statement
interface CustomerStatement {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
```

## 🧪 Testing

```bash
# Start dev server
npm run dev

# Open browser console (F12)
# Navigate to customers page
# Check console for logs:
# API Response [customers.php]: {...}
```

## 📌 Important Notes

- ✅ Both endpoints are already implemented
- ✅ Type definitions updated to match API structure
- ✅ API client handles `flag` field correctly
- ✅ Errors are automatically thrown and caught
- ✅ Token is automatically included in requests

## 🔗 Related Files

- `src/services/ezyerpService.ts` - Service methods
- `src/types/api.ts` - Type definitions
- `src/services/api.ts` - API client
- `src/hooks/useApi.ts` - Custom hook for API calls

---

**Last Updated**: 2025-10-23

