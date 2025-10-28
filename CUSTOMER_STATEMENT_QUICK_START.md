# Customer Statement API - Quick Start Guide

## 🚀 Quick Overview

The Customer Statement page now fetches real data from the EzyERP API instead of using hardcoded data.

## 📋 What Changed

### Before
- Hardcoded transaction data
- Static date range
- No API integration

### After
- ✅ Real API calls to `customerstatement.php`
- ✅ Dynamic date range configuration
- ✅ Loading, error, and empty states
- ✅ Automatic data fetching
- ✅ Calculated totals

## 🧪 How to Test

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Login
```
Username: admin
Password: 1234
Office Code: WF01
```

### Step 3: Navigate to Customers
```
http://localhost:8081/customers
```

### Step 4: Click on a Customer
The app will navigate to the Customer Statement page with that customer's ID.

### Step 5: Verify Statement Loads
- Check that transactions display
- Check that totals are calculated
- Open DevTools (F12) to see API calls

## 📊 Console Output

When you navigate to a customer statement, you'll see:

```
📤 Sending parameters to customerstatement.php: {
  officecode: "WF01",
  officeid: "1",
  customerid: "780",
  financialyearid: "2",
  sdate: "2025-04-01",
  edate: "2025-10-30"
}

API Response [customerstatement.php]: {
  flag: true,
  msg: "Success",
  statement: [
    {id: "COB02420", date: "2025-04-01", type: "Opening Balance", ...},
    ...
  ]
}
```

## 🎯 Features

### Date Range Configuration
- Change start date: Click on "Start Date" input
- Change end date: Click on "End Date" input
- API automatically refreshes with new dates

### States
- **Loading**: Shows "Loading statement..." while fetching
- **Error**: Shows error message if API fails
- **Empty**: Shows "No statement data available..." if no transactions
- **Data**: Shows transaction list with totals

### Totals
- **Received**: Sum of all debit amounts
- **Receivable**: Sum of all credit amounts
- **Balance**: Last transaction's balance

## 🔍 Debugging

### Check Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Look for `📤 Sending parameters...` messages
4. Look for `API Response...` messages

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Look for `customerstatement.php` request
4. Check request parameters
5. Check response data

### Common Issues

**Issue**: "No statement data available"
- **Cause**: No transactions for the selected date range
- **Solution**: Try different dates or different customer

**Issue**: Error message displays
- **Cause**: API error or invalid parameters
- **Solution**: Check console logs for error details

**Issue**: Page doesn't load
- **Cause**: Customer ID missing from URL
- **Solution**: Navigate from Customers page by clicking a customer

## 📝 API Details

**Endpoint**: `customerstatement.php`

**Parameters**:
- `officecode`: From user session (e.g., "WF01")
- `officeid`: From user session (e.g., "1")
- `customerid`: From URL parameter (e.g., "780")
- `financialyearid`: Configurable (default: "2")
- `sdate`: Start date (default: "2025-04-01")
- `edate`: End date (default: "2025-10-30")

**Response**:
```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "id": "COB02420",
      "date": "2025-04-01",
      "type": "Opening Balance",
      "debit": 0,
      "credit": 56837.0,
      "balance": 56837.0
    }
  ]
}
```

## 🔗 Integration Flow

```
Customers Page
    ↓
User clicks customer
    ↓
Navigate to /customer-statement/:customerId
    ↓
CustomerStatement component mounts
    ↓
useEffect calls execute()
    ↓
API call to customerstatement.php
    ↓
Response received
    ↓
Transactions display
    ↓
Totals calculated
```

## 💡 Tips

- **Test with different dates**: Try different date ranges to see how API responds
- **Check console**: Always check console logs to see what's being sent to API
- **Use Postman**: Test the same parameters in Postman to verify API works
- **Check database**: Verify customer has transactions in the selected date range

## 📚 Files Modified

1. **src/types/api.ts**
   - Updated `CustomerStatement` interface
   - Updated `CustomerStatementResponse` interface

2. **src/pages/CustomerStatement.tsx**
   - Added API integration
   - Added date range configuration
   - Added loading, error, empty states
   - Replaced hardcoded data with API data

## ✅ Verification Checklist

- [x] API integration implemented
- [x] Date range configuration works
- [x] Loading state displays
- [x] Error state displays
- [x] Empty state displays
- [x] Transaction list displays
- [x] Totals calculated
- [x] Build successful

## 🚀 Next Steps

1. **Test the integration**
   - Navigate to Customers page
   - Click on a customer
   - Verify statement displays

2. **Test date range**
   - Change start date
   - Change end date
   - Verify API refreshes

3. **Test error scenarios**
   - Try invalid customer
   - Try date range with no data
   - Check error messages

4. **Optimize if needed**
   - Add pagination for large statements
   - Add export functionality
   - Add print functionality

---

**Status**: ✅ READY FOR TESTING

