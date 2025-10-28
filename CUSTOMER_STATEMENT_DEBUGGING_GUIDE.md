# Customer Statement API - Debugging Guide

## 🔍 Quick Debugging Steps

### Issue 1: Statement Not Displaying

**Symptoms**:
- Customer Statement page shows "No transactions available"
- No error message displayed

**Debugging Steps**:

1. **Check Console Logs**
   ```
   Open DevTools (F12) → Console tab
   Look for: "📤 Sending parameters to customerstatement.php:"
   ```

2. **Verify Parameters**
   ```javascript
   // You should see something like:
   {
     officecode: "WF01",
     officeid: "1",
     customerid: "780",
     financialyearid: "2",
     sdate: "2025-04-01",
     edate: "2025-10-30"
   }
   ```

3. **Check if customerid is present**
   ```javascript
   // In Console, run:
   window.location.pathname
   // Should show: /customer-statement/780
   ```

4. **Check API Response**
   ```
   Look for: "API Response [customerstatement.php]:"
   Should show: {flag: true, statement: [...]}
   ```

5. **Check Network Tab**
   ```
   DevTools → Network tab
   Look for: customerstatement.php request
   Check Request tab: Verify parameters
   Check Response tab: Verify data structure
   ```

**Solutions**:
- If customerid missing: Check URL routing
- If API returns empty array: Try different date range
- If API returns error: Check error message in console

---

### Issue 2: Error Message Displayed

**Symptoms**:
- Red error box shows error message
- Statement not displaying

**Debugging Steps**:

1. **Read Error Message**
   ```
   Error message should tell you what's wrong
   Common errors:
   - "No data found" → No transactions for this date range
   - "Invalid parameters" → Check parameter values
   - "Unauthorized" → Re-login
   ```

2. **Check Console for Details**
   ```
   Look for: "API Error [customerstatement.php]:"
   This shows the full error response
   ```

3. **Try Different Date Range**
   ```
   1. Change start date to earlier date
   2. Change end date to later date
   3. Verify API is called with new dates
   4. Check if data appears
   ```

4. **Check Network Response**
   ```
   DevTools → Network tab → customerstatement.php
   Response tab should show:
   {flag: false, msg: "No data found"}
   or
   {flag: false, msg: "error message"}
   ```

**Solutions**:
- If "No data found": Try different date range
- If "Invalid parameters": Check parameter values in console
- If "Unauthorized": Re-login and try again

---

### Issue 3: Page Loads But No Data

**Symptoms**:
- No loading indicator
- No error message
- No transactions displayed
- Console shows no logs

**Debugging Steps**:

1. **Check if Component Mounted**
   ```javascript
   // In Console, run:
   document.querySelector('h1')?.textContent
   // Should show: "Customer Statement"
   ```

2. **Check if useUserSession Works**
   ```javascript
   // Add temporary console.log in CustomerStatement.tsx:
   console.log("useUserSession:", { officeid, officecode });
   ```

3. **Check if customerId Present**
   ```javascript
   // In Console, run:
   window.location.pathname.split('/').pop()
   // Should show: customer ID (e.g., "780")
   ```

4. **Check if API Function Called**
   ```
   Look for: "📤 Sending parameters to customerstatement.php:"
   If not present: useEffect not triggering
   ```

5. **Check useApi Hook**
   ```javascript
   // Add temporary console.log:
   console.log("useApi state:", { data, isLoading, error });
   ```

**Solutions**:
- If no logs: Component not mounting (check routing)
- If useUserSession empty: Not logged in (re-login)
- If customerId missing: Check URL routing
- If API not called: Check useEffect dependencies
- If useApi not updating: Check API response format

---

### Issue 4: Infinite Loop / Maximum Update Depth

**Symptoms**:
- Console shows "Maximum update depth exceeded"
- Page crashes or becomes unresponsive

**Debugging Steps**:

1. **Check useCallback Dependencies**
   ```typescript
   // In CustomerStatement.tsx, verify:
   const getStatementFunction = useCallback(
     () => { ... },
     [customerId, officecode, officeid, financialYearId, startDate, endDate]
     // ↑ Check these
   );
   ```

2. **Check useEffect Dependencies**
   ```typescript
   // Should be:
   useEffect(() => {
     if (customerId) {
       execute();
     }
   }, [execute, customerId]);  // ← Only these
   ```

3. **Check useApi Hook**
   ```typescript
   // In useApi.ts, verify useCallback has dependencies:
   const execute = useCallback(async () => {
     // ...
   }, [apiFunction, onSuccess, onError, logout]);
   ```

**Solutions**:
- If useCallback missing dependencies: Add them
- If useEffect has wrong dependencies: Fix to [execute, customerId]
- If useApi hook broken: Check implementation

---

## 🧪 Manual Testing

### Test 1: Verify Login Data

```javascript
// After login, in Console:
const user = JSON.parse(localStorage.getItem('auth_user'));
console.log('User Data:', user);
console.log('Office ID:', user.officeid);
console.log('Office Code:', user.officecode);
```

**Expected Output**:
```
User Data: {userid: "...", officeid: "1", officecode: "WF01", ...}
Office ID: 1
Office Code: WF01
```

---

### Test 2: Verify API Parameters

```javascript
// In CustomerStatement page, add temporary log:
console.log('API Parameters:', {
  officecode,
  officeid,
  customerid: customerId,
  financialyearid: financialYearId,
  sdate: startDate,
  edate: endDate
});
```

**Expected Output**:
```
API Parameters: {
  officecode: "WF01",
  officeid: "1",
  customerid: "780",
  financialyearid: "2",
  sdate: "2025-04-01",
  edate: "2025-10-30"
}
```

---

### Test 3: Test Different Date Ranges

1. Navigate to Customer Statement page
2. Change start date to: 2025-04-01
3. Change end date to: 2025-10-30
4. Check if transactions appear
5. Try different date ranges

**Note**: The date range affects which transactions are returned.

---

### Test 4: Check Network Request

1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to Customer Statement page
4. Look for `customerstatement.php` request
5. Click on it
6. Check "Request" tab:
   ```
   Form Data:
   officecode: WF01
   officeid: 1
   customerid: 780
   financialyearid: 2
   sdate: 2025-04-01
   edate: 2025-10-30
   ```
7. Check "Response" tab:
   ```json
   {
     "flag": true,
     "msg": "Success",
     "statement": [...]
   }
   ```

---

## 🛠️ Common Fixes

### Fix 1: Re-login
```
1. Click logout (if available)
2. Go to login page
3. Enter credentials again
4. Navigate to Customers page
5. Click on a customer
```

### Fix 2: Clear Cache
```javascript
// In Console:
localStorage.clear();
location.reload();
```

### Fix 3: Check Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Read the error message carefully
```

### Fix 4: Check Network Errors
```
1. Open DevTools (F12)
2. Go to Network tab
3. Look for red requests (failed)
4. Click on failed request
5. Check Response tab for error details
```

### Fix 5: Try Different Date Range
```
1. Open Customer Statement page
2. Change start date to: 2025-01-01
3. Change end date to: 2025-12-31
4. Check if transactions appear
```

---

## 📊 Expected Console Output

### Successful Flow

```
AuthContext: Login response received: {flag: true, employee: {...}}
AuthContext: User data to store: {userid: "...", officeid: "1", officecode: "WF01", ...}
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
  statement: [...]
}
```

### Error Flow

```
AuthContext: Login response received: {flag: true, employee: {...}}
AuthContext: User data to store: {userid: "...", officeid: "1", officecode: "WF01", ...}
📤 Sending parameters to customerstatement.php: {
  officecode: "WF01",
  officeid: "1",
  customerid: "780",
  financialyearid: "2",
  sdate: "2025-04-01",
  edate: "2025-10-30"
}
API Error [customerstatement.php]: No data found
```

---

## 🎯 Quick Checklist

- [ ] Logged in successfully
- [ ] officeid and officecode stored in localStorage
- [ ] Navigated to customer statement page
- [ ] URL shows customer ID: /customer-statement/{id}
- [ ] Console shows API parameters
- [ ] Console shows API response
- [ ] Transactions display in list
- [ ] Date range is configurable
- [ ] Summary shows totals
- [ ] No errors in console

---

## 📞 Need More Help?

1. **Check the verification report**: `CUSTOMER_STATEMENT_VERIFICATION_REPORT.md`
2. **Check the implementation**: `src/pages/CustomerStatement.tsx`
3. **Check the service**: `src/services/ezyerpService.ts`
4. **Check the types**: `src/types/api.ts`
5. **Check the auth context**: `src/contexts/AuthContext.tsx`

---

**Last Updated**: 2025-10-23
**Status**: ✅ READY FOR DEBUGGING

