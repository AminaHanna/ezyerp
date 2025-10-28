# Customers Page - Debug Guide

## 🎯 What Changed

The Customers page now has a **Debug Panel** that allows you to test different parameter values to find which ones return customer data.

## 🔍 Debug Panel Features

The debug panel shows:
- **Financial Year ID** - Editable input field
- **Employee ID** - Editable input field
- **Office Info** - Shows your current office ID and code

## 🧪 How to Use the Debug Panel

### Step 1: Open the Customers Page
```
http://localhost:8081/customers
```

### Step 2: Locate the Debug Panel
Look for the gray box labeled "Debug: API Parameters" below the search bar.

### Step 3: Try Different Financial Year IDs
The debug panel shows:
```
Financial Year ID: [2]
```

Try changing this value:
- Try: `1`
- Try: `2`
- Try: `3`
- Try: `4`

After each change, the API will automatically be called with the new parameter.

### Step 4: Try Different Employee IDs
The debug panel shows:
```
Employee ID: [2]
```

Try changing this value:
- Try: `1`
- Try: `2`
- Try: `3`
- Try: `4`

After each change, the API will automatically be called with the new parameter.

### Step 5: Check Console Logs
Open DevTools (F12) and look for:
```
📤 Sending parameters to customers.php: {
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
}
```

This shows exactly what parameters are being sent.

### Step 6: Look for Success
When you find the right combination, you'll see:
```
API Response [customers.php]: {
  flag: true,
  msg: "Success",
  customers: [...]
}
```

And the customer list will display on the page.

## 📊 Example Scenarios

### Scenario 1: No Data with Current Parameters
```
Current: financialyearid: "2", empid: "2"
Result: "No customers available for the selected criteria."
```

**Solution**: Try different values:
1. Change financialyearid to "1"
2. Check console for API response
3. If still no data, try empid "1"

### Scenario 2: Data Found!
```
Current: financialyearid: "1", empid: "1"
Result: Customer list displays with 5 customers
```

**Next Step**: Note these values for production use.

## 🔧 Finding the Right Parameters

### Method 1: Trial and Error (Fastest)
1. Try financialyearid: 1, 2, 3, 4
2. For each, try empid: 1, 2, 3, 4
3. Watch console for success response

### Method 2: Use Postman (Most Reliable)
1. Open Postman
2. Import `EzyERP.postman_collection.json`
3. Find "Customer List" request
4. Try different parameter values
5. Note which combination returns data

### Method 3: Check Database Directly
1. Ask your EzyERP administrator
2. Which financial years have data?
3. Which employees have customer assignments?
4. Which offices have customers?

## 📝 Console Output Examples

### Success Response
```
📤 Sending parameters to customers.php: {
  officeid: "1",
  officecode: "WF01",
  financialyearid: "1",
  empid: "1"
}

API Response [customers.php]: {
  flag: true,
  msg: "Success",
  customers: [
    {id: "1", name: "ABC Company", day: "MONDAY", balance: 5000},
    {id: "2", name: "XYZ Corp", day: "TUESDAY", balance: 3000}
  ]
}
```

### No Data Response
```
📤 Sending parameters to customers.php: {
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
}

API Response [customers.php]: {
  flag: false,
  msg: "No data found",
  customers: []
}
```

## 🎯 What to Look For

### ✅ Success Indicators
- `flag: true` in API response
- `msg: "Success"` in API response
- `customers` array has items
- Customer list displays on page

### ❌ Failure Indicators
- `flag: false` in API response
- `msg: "No data found"` in API response
- `customers` array is empty
- "No customers available for the selected criteria." message

## 📋 Parameter Reference

### Financial Year ID
- Typically: 1, 2, 3, 4
- Represents fiscal years in the system
- Example: 1 = FY 2024-25, 2 = FY 2025-26

### Employee ID
- Typically: 1, 2, 3, 4, etc.
- Represents employees in the system
- Different employees may have different customers assigned

### Office ID & Code
- From your user session
- Example: officeid: "1", officecode: "WF01"
- These are automatically filled from your login

## 🔄 How It Works

1. You change a parameter in the debug panel
2. Component detects the change
3. `useCallback` creates new API function with new parameters
4. `useEffect` calls the new API function
5. API request is sent with new parameters
6. Console logs show what was sent
7. API response is logged
8. UI updates with results

## 🚀 Once You Find the Right Parameters

Once you find the correct parameter values:

1. **Note the values**
   - Financial Year ID: ___
   - Employee ID: ___

2. **Update the code** (remove debug panel)
   ```typescript
   const [financialYearId, setFinancialYearId] = useState("1");  // Update to correct value
   const [empId, setEmpId] = useState("1");  // Update to correct value
   ```

3. **Remove the debug panel** from the UI

4. **Test in production**

## 📊 Build Status

✅ **SUCCESSFUL**
- No TypeScript errors
- No compilation warnings
- Output: 375.20 kB JS, 61.46 kB CSS
- Build time: 6.38s
- 1727 modules transformed

## 🧪 Testing Steps

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Navigate to Customers page**
   ```
   http://localhost:8081/customers
   ```

3. **Open DevTools**
   ```
   F12 → Console tab
   ```

4. **Try different parameters**
   - Change Financial Year ID
   - Change Employee ID
   - Watch console for responses

5. **Find the right combination**
   - Look for `flag: true` response
   - Verify customers display

## 💡 Tips

- **Start with 1**: Try financialyearid: "1" and empid: "1" first
- **Check console**: Always check console logs to see what's being sent
- **Use Postman**: If stuck, test the same parameters in Postman
- **Ask admin**: If still stuck, ask your EzyERP administrator for correct values

## 📞 Support

If you can't find the right parameters:
1. Check console logs (F12)
2. Test with Postman
3. Ask your EzyERP administrator
4. Verify database has customer data

---

**Last Updated**: 2025-10-23
**Status**: ✅ DEBUG PANEL ADDED

