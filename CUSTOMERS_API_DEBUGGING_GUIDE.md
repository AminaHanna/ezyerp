# Customers Page API - Debugging Guide

## 🔍 Quick Debugging Steps

### Issue 1: Customers Not Displaying

**Symptoms**:
- Customers page shows "No customers available"
- No error message displayed

**Debugging Steps**:

1. **Check Console Logs**
   ```
   Open DevTools (F12) → Console tab
   Look for: "📤 Sending parameters to customers.php:"
   ```

2. **Verify Parameters**
   ```javascript
   // You should see something like:
   {
     officeid: "1",
     officecode: "WF01",
     financialyearid: "2",
     empid: "2"
   }
   ```

3. **Check if officeid/officecode are empty**
   ```javascript
   // In Console, run:
   JSON.parse(localStorage.getItem('auth_user'))
   
   // Should show:
   {
     userid: "...",
     username: "...",
     officeid: "1",      // Should NOT be empty
     officecode: "WF01", // Should NOT be empty
     token: "...",
     sessionid: "..."
   }
   ```

4. **Check API Response**
   ```
   Look for: "API Response [customers.php]:"
   Should show: {flag: true, customers: [...]}
   ```

5. **Check Network Tab**
   ```
   DevTools → Network tab
   Look for: customers.php request
   Check Request tab: Verify parameters
   Check Response tab: Verify data structure
   ```

**Solutions**:
- If officeid/officecode are empty: Re-login
- If API returns empty array: Try different empid value
- If API returns error: Check error message in console

---

### Issue 2: Error Message Displayed

**Symptoms**:
- Red error box shows error message
- Customers not displaying

**Debugging Steps**:

1. **Read Error Message**
   ```
   Error message should tell you what's wrong
   Common errors:
   - "No data found" → No customers for this empid
   - "Invalid parameters" → Check parameter values
   - "Unauthorized" → Re-login
   ```

2. **Check Console for Details**
   ```
   Look for: "API Error [customers.php]:"
   This shows the full error response
   ```

3. **Try Different empid**
   ```
   The debug panel in Customers page allows testing:
   - Change "Employee ID" field
   - Try values: 1, 2, 3, etc.
   - See which one returns data
   ```

4. **Check Network Response**
   ```
   DevTools → Network tab → customers.php
   Response tab should show:
   {flag: false, msg: "No data found"}
   or
   {flag: false, msg: "error message"}
   ```

**Solutions**:
- If "No data found": Try different empid or financialyearid
- If "Invalid parameters": Check parameter values in console
- If "Unauthorized": Re-login and try again

---

### Issue 3: Page Loads But No Data

**Symptoms**:
- No loading indicator
- No error message
- No customers displayed
- Console shows no logs

**Debugging Steps**:

1. **Check if Component Mounted**
   ```javascript
   // In Console, run:
   document.querySelector('h1')?.textContent
   // Should show: "Customers"
   ```

2. **Check if useUserSession Works**
   ```javascript
   // Add temporary console.log in Customers.tsx:
   console.log("useUserSession:", { officeid, officecode });
   ```

3. **Check if API Function Called**
   ```
   Look for: "📤 Sending parameters to customers.php:"
   If not present: useEffect not triggering
   ```

4. **Check useApi Hook**
   ```javascript
   // Add temporary console.log:
   console.log("useApi state:", { data, isLoading, error });
   ```

**Solutions**:
- If no logs: Component not mounting (check routing)
- If useUserSession empty: Not logged in (re-login)
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
   // In Customers.tsx, verify:
   const getCustomersFunction = useCallback(
     () => { ... },
     [officeid, officecode, financialYearId, empId]  // ← Check these
   );
   ```

2. **Check useEffect Dependencies**
   ```typescript
   // Should be:
   useEffect(() => {
     execute();
   }, [execute]);  // ← Only execute
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
- If useEffect has wrong dependencies: Fix to [execute]
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
// In Customers page, add temporary log:
console.log('API Parameters:', {
  officeid,
  officecode,
  financialyearid: financialYearId,
  empid: empId
});
```

**Expected Output**:
```
API Parameters: {
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
}
```

---

### Test 3: Test Different empid Values

1. Open Customers page
2. Look for debug panel (if visible)
3. Change "Employee ID" field
4. Try values: 1, 2, 3, 4, 5
5. Check which one returns customers

**Note**: The debug panel is commented out in the current version. To enable it:
1. Open `src/pages/Customers.tsx`
2. Find the debug panel section (around line 74)
3. Uncomment it (remove `{/* */}`)

---

### Test 4: Check Network Request

1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to Customers page
4. Look for `customers.php` request
5. Click on it
6. Check "Request" tab:
   ```
   Form Data:
   officeid: 1
   officecode: WF01
   financialyearid: 2
   empid: 2
   ```
7. Check "Response" tab:
   ```json
   {
     "flag": true,
     "msg": "Success",
     "customers": [...]
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

---

## 📊 Expected Console Output

### Successful Flow

```
AuthContext: Login response received: {flag: true, employee: {...}}
AuthContext: User data to store: {userid: "...", officeid: "1", officecode: "WF01", ...}
📤 Sending parameters to customers.php: {officeid: "1", officecode: "WF01", financialyearid: "2", empid: "2"}
API Response [customers.php]: {flag: true, msg: "Success", customers: [{...}, {...}, ...]}
```

### Error Flow

```
AuthContext: Login response received: {flag: true, employee: {...}}
AuthContext: User data to store: {userid: "...", officeid: "1", officecode: "WF01", ...}
📤 Sending parameters to customers.php: {officeid: "1", officecode: "WF01", financialyearid: "2", empid: "2"}
API Error [customers.php]: No data found
```

---

## 🎯 Quick Checklist

- [ ] Logged in successfully
- [ ] officeid and officecode stored in localStorage
- [ ] Customers page loads
- [ ] Console shows API parameters
- [ ] Console shows API response
- [ ] Customers display in list
- [ ] Search works
- [ ] Click on customer works

---

## 📞 Need More Help?

1. **Check the verification report**: `CUSTOMERS_API_VERIFICATION_REPORT.md`
2. **Check the implementation**: `src/pages/Customers.tsx`
3. **Check the service**: `src/services/ezyerpService.ts`
4. **Check the types**: `src/types/api.ts`
5. **Check the auth context**: `src/contexts/AuthContext.tsx`

---

**Last Updated**: 2025-10-23
**Status**: ✅ READY FOR DEBUGGING

