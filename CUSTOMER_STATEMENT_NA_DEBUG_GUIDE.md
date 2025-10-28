# Customer Statement Showing "N/A" - Debugging Guide

## 🔍 Problem

The Customer Statement page is displaying "N/A" for all transaction fields:
- Transaction ID: N/A
- Date: N/A
- Type: N/A
- Debit/Credit/Balance: 0.00

This indicates that the API response field names don't match what the component expects.

---

## 🛠️ Debugging Steps

### Step 1: Check Console Logs

1. **Open DevTools**: Press `F12`
2. **Go to Console tab**
3. **Navigate to Customer Statement page**
4. **Look for logs starting with "📊"**:
   ```
   📊 Raw API Response: {...}
   📊 Statement data: [...]
   📊 First statement item: {...}
   📊 First item keys: [...]
   ```

### Step 2: Identify Actual Field Names

The console will show you the actual field names in the API response. For example:

**Expected** (what component looks for):
```
id, transactionid, voucherid
date, transactiondate, voucherdate
type, vouchertype, description, narration
debit, credit, balance
```

**Actual** (what API returns - you'll see in console):
```
[actual field names from API response]
```

### Step 3: Check Network Tab

1. **Open DevTools**: Press `F12`
2. **Go to Network tab**
3. **Navigate to Customer Statement page**
4. **Look for request to `customerstatement.php`**
5. **Click on it and check Response tab**
6. **Look at the JSON structure**

---

## 📋 Common Issues & Solutions

### Issue 1: Field Names Don't Match

**Symptom**: Console shows different field names than expected

**Solution**:
1. Note the actual field names from console
2. Update `src/types/api.ts` with correct field names
3. Update field mapping in `src/pages/CustomerStatement.tsx`

### Issue 2: Response Structure Different

**Symptom**: Data is in different structure (e.g., `data.records` instead of `data.statement`)

**Solution**:
1. Check console for actual response structure
2. Update the data extraction logic:
   ```typescript
   // Current
   const transactions = (data?.statement || data?.statements || data?.data || [])
   
   // May need to add more options
   const transactions = (data?.statement || data?.statements || data?.data || data?.records || [])
   ```

### Issue 3: Empty Response

**Symptom**: Console shows empty array `[]`

**Solution**:
1. Check if API is returning data for the date range
2. Try different date range
3. Verify customer ID is correct
4. Check API error message in console

---

## 🔧 How to Fix

### Step 1: Identify Field Names

From console logs, note the actual field names. For example:
```
First item keys: ["vno", "vdate", "vtype", "debit_amt", "credit_amt", "balance_amt"]
```

### Step 2: Update Interface

**File**: `src/types/api.ts`

Add the actual field names to `CustomerStatement` interface:
```typescript
export interface CustomerStatement {
  // Add actual field names from API
  vno?: string;           // instead of id
  vdate?: string;         // instead of date
  vtype?: string;         // instead of type
  debit_amt?: number | string;   // instead of debit
  credit_amt?: number | string;  // instead of credit
  balance_amt?: number | string; // instead of balance
  
  // Keep existing fallbacks
  id?: string;
  date?: string;
  type?: string;
  debit?: number | string;
  credit?: number | string;
  balance?: number | string;
  
  [key: string]: any;
}
```

### Step 3: Update Component Mapping

**File**: `src/pages/CustomerStatement.tsx`

Update the transaction mapping:
```typescript
const transactions: Transaction[] = (data?.statement || data?.statements || data?.data || []).map((stmt: CustomerStatementType) => ({
  id: (stmt.vno || stmt.id || stmt.transactionid || stmt.voucherid || "N/A") as string,
  date: (stmt.vdate || stmt.date || stmt.transactiondate || stmt.voucherdate || "N/A") as string,
  type: (stmt.vtype || stmt.type || stmt.vouchertype || stmt.description || stmt.narration || "N/A") as string,
  debit: Number(stmt.debit_amt || stmt.debit || 0),
  credit: Number(stmt.credit_amt || stmt.credit || 0),
  balance: Number(stmt.balance_amt || stmt.balance || 0),
}));
```

---

## 📊 Example API Response Structures

### Example 1: Standard Structure
```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "id": "INV001",
      "date": "2025-04-05",
      "type": "Invoice",
      "debit": 5000,
      "credit": 0,
      "balance": 5000
    }
  ]
}
```

### Example 2: Different Field Names
```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "vno": "INV001",
      "vdate": "2025-04-05",
      "vtype": "Invoice",
      "debit_amt": 5000,
      "credit_amt": 0,
      "balance_amt": 5000
    }
  ]
}
```

### Example 3: Abbreviated Field Names
```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "vid": "INV001",
      "vdt": "2025-04-05",
      "vdesc": "Invoice",
      "dr": 5000,
      "cr": 0,
      "bal": 5000
    }
  ]
}
```

---

## 🚀 Quick Fix Checklist

- [ ] Open DevTools (F12)
- [ ] Navigate to Customer Statement
- [ ] Check Console for "📊" logs
- [ ] Note actual field names
- [ ] Update `src/types/api.ts`
- [ ] Update `src/pages/CustomerStatement.tsx`
- [ ] Rebuild: `npm run build`
- [ ] Test: Navigate to Customer Statement again
- [ ] Verify data displays correctly

---

## 📞 Need More Help?

1. **Check Console Logs**: Look for "📊" messages
2. **Check Network Tab**: Verify API response structure
3. **Compare Field Names**: Match actual vs expected
4. **Update Interfaces**: Add missing field names
5. **Update Mapping**: Use correct field names in component

---

**Status**: 🔍 DEBUGGING IN PROGRESS
**Last Updated**: 2025-10-23

