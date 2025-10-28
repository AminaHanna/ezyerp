# Customers API - "No Data Found" Diagnosis

## 🔍 Issue Summary

The Customers page is showing "No customers available for the selected criteria." instead of displaying customer data. The API is returning:

```json
{
  "flag": false,
  "msg": "No data found",
  "customers": []
}
```

## 🎯 Root Cause

The API is returning `flag: false` with "No data found" message, which means one of these parameters is incorrect or there's no data matching the criteria:

- `officeid` - Office ID
- `officecode` - Office code
- `financialyearid` - Financial year ID
- `empid` - Employee ID

## 🔧 Current Parameters Being Sent

```typescript
{
  officeid: "1",           // From useUserSession
  officecode: "WF01",      // From useUserSession
  financialyearid: "2",    // Hardcoded
  empid: "2"               // Hardcoded
}
```

## 📋 Troubleshooting Steps

### Step 1: Verify User Session Data

Check what values are being used from `useUserSession()`:

```typescript
const { officeid, officecode } = useUserSession();
console.log("User Session:", { officeid, officecode });
```

**Expected Output**:
```
User Session: { officeid: "1", officecode: "WF01" }
```

**What to Check**:
- Are `officeid` and `officecode` correct?
- Are they matching the office that has customers?

### Step 2: Check Postman Collection

The Postman collection shows the expected parameters:

```json
{
  "officeid": "1",
  "officecode": "WF01",
  "financialyearid": "2",
  "empid": "2"
}
```

**Questions**:
- Does your office (WF01) have customers in the database?
- Is financial year "2" correct?
- Is employee "2" correct?

### Step 3: Test with Postman

1. Open Postman
2. Import `EzyERP.postman_collection.json`
3. Find "Customer List" request
4. Update parameters with your actual values
5. Send request
6. Check if you get data

**If Postman returns data**:
- The API is working
- The parameters are correct
- The issue is in the frontend code

**If Postman returns "No data found"**:
- The parameters are wrong
- There's no data for this office/year/employee
- Contact your EzyERP administrator

### Step 4: Check Browser Console

Open DevTools (F12) and look for:

```
API Response [customers.php]: {flag: false, msg: 'No data found', customers: Array(0)}
```

This confirms the API is returning no data.

## 🔧 Possible Solutions

### Solution 1: Verify Parameters

Add console logging to see what parameters are being sent:

```typescript
const getCustomersFunction = useCallback(
  () => {
    const params = {
      officeid,
      officecode,
      financialyearid: "2",
      empid: "2"
    };
    console.log("Sending parameters:", params);
    return salesService.getCustomers(params);
  },
  [officeid, officecode]
);
```

### Solution 2: Try Different Financial Year

If financial year "2" has no data, try "1":

```typescript
const getCustomersFunction = useCallback(
  () => salesService.getCustomers({
    officeid,
    officecode,
    financialyearid: "1",  // Try different year
    empid: "2"
  }),
  [officeid, officecode]
);
```

### Solution 3: Try Different Employee ID

If employee "2" has no data, try "1":

```typescript
const getCustomersFunction = useCallback(
  () => salesService.getCustomers({
    officeid,
    officecode,
    financialyearid: "2",
    empid: "1"  // Try different employee
  }),
  [officeid, officecode]
);
```

### Solution 4: Make Parameters Configurable

Add state to allow users to select parameters:

```typescript
const [financialYearId, setFinancialYearId] = useState("2");
const [empId, setEmpId] = useState("2");

const getCustomersFunction = useCallback(
  () => salesService.getCustomers({
    officeid,
    officecode,
    financialyearid: financialYearId,
    empid: empId
  }),
  [officeid, officecode, financialYearId, empId]
);
```

## 📊 API Response Handling

The code now handles "No data found" gracefully:

```typescript
// Shows empty state instead of error
{error?.includes("No data found")
  ? "No customers available for the selected criteria."
  : "No customers available."}
```

## ✅ What Was Fixed

1. **Infinite Loop Issue** - Fixed by using `useCallback` to stabilize the API function
2. **Better Error Handling** - "No data found" now shows as empty state instead of error
3. **Clearer Messages** - User sees "No customers available for the selected criteria"

## 🧪 Testing

### Test 1: Check Console Logs

```bash
npm run dev
# Open DevTools (F12)
# Navigate to Customers page
# Check console for:
# - "Sending parameters: {...}"
# - "API Response [customers.php]: {...}"
```

### Test 2: Verify with Postman

```bash
# Use Postman to test the same parameters
# Compare results with frontend
```

### Test 3: Try Different Parameters

```bash
# Modify financialyearid and empid
# See if different values return data
```

## 📞 Next Steps

1. **Verify Parameters** - Use Postman to test with your actual data
2. **Check Database** - Confirm customers exist for your office
3. **Adjust Parameters** - Try different financial year or employee ID
4. **Add Debugging** - Add console logs to see what's being sent
5. **Contact Support** - If still no data, contact EzyERP support

## 📝 Code Changes

### Before
```typescript
const { data, isLoading, error, execute } = useApi(
  () => salesService.getCustomers({
    officeid,
    officecode,
    financialyearid: "2",
    empid: "2"
  })
);
```

### After
```typescript
const getCustomersFunction = useCallback(
  () => salesService.getCustomers({
    officeid,
    officecode,
    financialyearid: "2",
    empid: "2"
  }),
  [officeid, officecode]
);

const { data, isLoading, error, execute } = useApi(getCustomersFunction);
```

## 🎯 Summary

The "No data found" message is **not an error** - it's the API correctly responding that there's no data matching your criteria. The frontend now handles this gracefully by showing an empty state message instead of an error.

**To get data to display**:
1. Verify the parameters are correct
2. Confirm customers exist in the database for your office
3. Try different financial year or employee ID values
4. Use Postman to test the same parameters

---

**Last Updated**: 2025-10-23

