# Customer Management Endpoints - Implementation Guide

## 📋 Overview

This document describes the implementation of two customer management endpoints:
1. **Customer List** - Fetch all customers
2. **Customer Statement** - Fetch customer transaction history

## 🔗 Endpoints

### 1. Customer List Endpoint

**URL**: `{{base_url}}customers.php`
**Method**: POST
**Purpose**: Fetch list of all customers for a specific office and financial year

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `officeid` | string | Yes | Office ID (e.g., "1") |
| `officecode` | string | Yes | Office code (e.g., "WF01") |
| `financialyearid` | string | Yes | Financial year ID (e.g., "2") |
| `empid` | string | Yes | Employee ID (e.g., "2") |

#### Request Example

```typescript
import { salesService } from "@/services/ezyerpService";

const customers = await salesService.getCustomers({
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
});
```

#### Response Structure

```json
{
  "flag": true,
  "msg": "Success",
  "customers": [
    {
      "id": "1",
      "name": "3 STAR ELECTRICAL & PLUMBING",
      "day": "THURSDAY",
      "balance": 33888.0,
      "officeid": "1",
      "officecode": "WF01"
    },
    {
      "id": "2",
      "name": "A B S HARDWARE",
      "day": "OTHERS",
      "balance": 0.0,
      "officeid": "1",
      "officecode": "WF01"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `flag` | boolean | Success indicator (true/false) |
| `msg` | string | Response message |
| `customers` | array | Array of customer objects |
| `customers[].id` | string | Customer ID |
| `customers[].name` | string | Customer name |
| `customers[].day` | string | Customer visit day |
| `customers[].balance` | number | Customer account balance |
| `customers[].officeid` | string | Office ID |
| `customers[].officecode` | string | Office code |

---

### 2. Customer Statement Endpoint

**URL**: `{{base_url}}customerstatement.php`
**Method**: POST
**Purpose**: Fetch transaction history/statement for a specific customer

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `officecode` | string | Yes | Office code (e.g., "WF01") |
| `officeid` | string | Yes | Office ID (e.g., "1") |
| `customerid` | string | Yes | Customer ID (e.g., "120") |
| `financialyearid` | string | Yes | Financial year ID (e.g., "2") |
| `sdate` | string | Yes | Start date (e.g., "2025-04-01") |
| `edate` | string | Yes | End date (e.g., "2025-05-30") |

#### Request Example

```typescript
import { reportsService } from "@/services/ezyerpService";

const statement = await reportsService.getCustomerStatement(
  "WF01",      // officecode
  "1",         // officeid
  "120",       // customerid
  "2",         // financialyearid
  "2025-04-01", // sdate
  "2025-05-30"  // edate
);
```

#### Response Structure

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
    },
    {
      "id": "REC001",
      "date": "2025-04-10",
      "description": "Receipt",
      "debit": 0.0,
      "credit": 2000.0,
      "balance": 3000.0
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `flag` | boolean | Success indicator (true/false) |
| `msg` | string | Response message |
| `statement` | array | Array of transaction objects |
| `statement[].id` | string | Transaction ID |
| `statement[].date` | string | Transaction date (YYYY-MM-DD) |
| `statement[].description` | string | Transaction description |
| `statement[].debit` | number | Debit amount (sales/invoices) |
| `statement[].credit` | number | Credit amount (payments/receipts) |
| `statement[].balance` | number | Running balance |

---

## 🔧 Implementation Details

### Type Definitions

**File**: `src/types/api.ts`

```typescript
// Customer List Response
export interface CustomersResponse {
  flag: boolean;
  msg: string;
  customers?: Customer[];
  error?: string;
}

export interface Customer {
  id: string;
  name: string;
  day?: string;
  balance: number;
  officeid?: string;
  officecode?: string;
}

// Customer Statement Response
export interface CustomerStatementResponse {
  flag: boolean;
  msg: string;
  statement?: CustomerStatement[];
  error?: string;
}

export interface CustomerStatement {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}
```

### Service Methods

**File**: `src/services/ezyerpService.ts`

```typescript
// Get customers
export const salesService = {
  async getCustomers(request: CustomersRequest): Promise<CustomersResponse> {
    return apiClient.post<CustomersResponse>("customers.php", request);
  }
};

// Get customer statement
export const reportsService = {
  async getCustomerStatement(
    officecode: string,
    officeid: string,
    customerid: string,
    financialyearid: string,
    sdate: string,
    edate: string
  ): Promise<CustomerStatementResponse> {
    return apiClient.post<CustomerStatementResponse>("customerstatement.php", {
      officecode,
      officeid,
      customerid,
      financialyearid,
      sdate,
      edate,
    });
  }
};
```

---

## 💻 Usage Examples

### Example 1: Load Customers List

```typescript
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const CustomersList = () => {
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

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.customers?.map((customer) => (
        <div key={customer.id}>
          <h3>{customer.name}</h3>
          <p>Balance: ₹{customer.balance}</p>
          <p>Day: {customer.day}</p>
        </div>
      ))}
    </div>
  );
};
```

### Example 2: Load Customer Statement

```typescript
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const CustomerStatementView = ({ customerId }: { customerId: string }) => {
  const { officeid, officecode } = useUserSession();
  
  const { data, isLoading, error, execute } = useApi(
    () => reportsService.getCustomerStatement(
      officecode,
      officeid,
      customerId,
      "2",
      "2025-04-01",
      "2025-05-30"
    )
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <div>Loading statement...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.statement?.map((transaction) => (
        <div key={transaction.id}>
          <p>{transaction.date} - {transaction.description}</p>
          <p>Debit: ₹{transaction.debit}</p>
          <p>Credit: ₹{transaction.credit}</p>
          <p>Balance: ₹{transaction.balance}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## ✅ API Response Handling

The API client automatically handles the response structure:

1. **Success Response** (`flag: true`):
   - Returns the response data
   - Data is accessible via `response.customers` or `response.statement`

2. **Error Response** (`flag: false`):
   - Throws an error with the message from `msg` field
   - Error is caught and displayed to the user

3. **HTTP Errors**:
   - Non-200 status codes throw HTTP errors
   - Caught and displayed as error messages

---

## 🧪 Testing

### Test Customer List

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to Customers page
# http://localhost:8081/customers

# 3. Check console for API response
# Should see: API Response [customers.php]: { flag: true, msg: "...", customers: [...] }

# 4. Verify customers are displayed
```

### Test Customer Statement

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to Customer Statement page
# http://localhost:8081/customers/120/statement

# 3. Check console for API response
# Should see: API Response [customerstatement.php]: { flag: true, msg: "...", statement: [...] }

# 4. Verify transactions are displayed
```

---

## 📊 Build Status

✅ **SUCCESSFUL**
- No TypeScript errors
- No compilation warnings
- Output: 373.07 kB JS, 61.31 kB CSS
- Build time: 6.66s
- 1726 modules transformed

---

## 🔐 Security

✅ All endpoints require authentication
✅ Token is automatically included in requests
✅ Office code and ID are validated
✅ Customer data is filtered by office

---

## 📝 Notes

- Both endpoints use FormData for request body
- Dates should be in YYYY-MM-DD format
- All parameters are required
- API returns HTTP 200 for both success and failure
- Check `flag` field to determine success/failure

---

**Last Updated**: 2025-10-23
**Status**: ✅ COMPLETE

