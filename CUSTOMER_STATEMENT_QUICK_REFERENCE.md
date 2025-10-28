# Customer Statement API - Quick Reference Card

## 🎯 At a Glance

| Aspect | Details |
|--------|---------|
| **Endpoint** | `customerstatement.php` |
| **Method** | POST |
| **Status** | ✅ WORKING |
| **Data Flow** | Customers Page → Click Customer → Route to Statement → API Call |
| **Parameters** | officecode, officeid, customerid, financialyearid, sdate, edate |
| **Response** | {flag, msg, statement} |

---

## 📍 Component Locations

```
Customers Page
  ↓
User clicks customer
  ↓
Navigate to: /customer-statement/:customerId
  ↓
src/pages/CustomerStatement.tsx (uses session data + route param)
  ↓
src/services/ezyerpService.ts (makes API call)
  ↓
src/types/api.ts (defines types)
```

---

## 🔄 Data Flow

```
1. User logs in with: username, password, officecode
2. AuthContext extracts: officeid, officecode from response
3. Stores in: localStorage + auth state
4. User navigates to Customers page
5. User clicks on a customer
6. Navigate to: /customer-statement/{customerId}
7. CustomerStatement component mounts
8. useUserSession() retrieves: officeid, officecode
9. useParams() retrieves: customerId
10. Build params: {officecode, officeid, customerid, financialyearid, sdate, edate}
11. Calls: reportsService.getCustomerStatement(...)
12. API returns: {flag: true, statement: [...]}
13. Component renders: transaction list
```

---

## 🧪 Quick Test

### 1. Check Login Data
```javascript
// In Console:
JSON.parse(localStorage.getItem('auth_user'))
// Should show: {officeid: "1", officecode: "WF01", ...}
```

### 2. Navigate to Customer Statement
```
1. Go to Customers page
2. Click on any customer
3. Should navigate to: /customer-statement/{customerId}
```

### 3. Check API Parameters
```
Open DevTools (F12) → Console
Look for: "📤 Sending parameters to customerstatement.php:"
Should show: {officecode: "WF01", officeid: "1", customerid: "...", ...}
```

### 4. Check API Response
```
Look for: "API Response [customerstatement.php]:"
Should show: {flag: true, msg: "Success", statement: [...]}
```

### 5. Check Network Request
```
DevTools → Network tab → customerstatement.php
Request: Form data with all parameters
Response: JSON with statement array
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| No transactions display | Wrong date range | Try different dates |
| "No data found" error | No transactions for date range | Expand date range |
| No API call made | customerId missing | Check URL routing |
| Infinite loop | useCallback missing deps | Check dependencies |
| Empty localStorage | Not logged in | Login first |
| Page not loading | Route not configured | Check routing setup |

---

## 📊 Console Logs to Check

```javascript
// 1. Login successful
"AuthContext: User data to store: {userid: ..., officeid: ..., officecode: ...}"

// 2. API parameters sent
"📤 Sending parameters to customerstatement.php: {officecode: ..., officeid: ..., customerid: ..., ...}"

// 3. API response received
"API Response [customerstatement.php]: {flag: true, msg: ..., statement: [...]}"

// 4. Error occurred
"API Error [customerstatement.php]: No data found"
```

---

## 🔍 Debugging Checklist

- [ ] Logged in successfully
- [ ] officeid in localStorage
- [ ] officecode in localStorage
- [ ] Customers page loads
- [ ] Can click on customer
- [ ] Navigates to statement page
- [ ] URL shows customer ID
- [ ] Console shows API parameters
- [ ] Console shows API response
- [ ] Transactions display
- [ ] Date range is configurable
- [ ] Summary shows totals
- [ ] No errors in console

---

## 📝 API Parameters

```json
{
  "officecode": "WF01",      // From login response
  "officeid": "1",           // From login response
  "customerid": "780",       // From URL route parameter
  "financialyearid": "2",    // Configurable (default: 2)
  "sdate": "2025-04-01",     // Configurable (default: 2025-04-01)
  "edate": "2025-10-30"      // Configurable (default: 2025-10-30)
}
```

---

## 📤 API Request

```
POST /customerstatement.php
Content-Type: application/x-www-form-urlencoded

officecode=WF01&officeid=1&customerid=780&financialyearid=2&sdate=2025-04-01&edate=2025-10-30
```

---

## 📥 API Response

```json
{
  "flag": true,
  "msg": "Success",
  "statement": [
    {
      "id": "1001",
      "date": "2025-04-15",
      "type": "Invoice",
      "debit": 5000,
      "credit": 0,
      "balance": 5000
    },
    {
      "id": "1002",
      "date": "2025-05-10",
      "type": "Payment",
      "debit": 0,
      "credit": 2000,
      "balance": 3000
    }
  ]
}
```

---

## 🎯 Key Files

| File | What It Does |
|------|--------------|
| `src/pages/CustomerStatement.tsx` | Main component, API call |
| `src/services/ezyerpService.ts` | API service method |
| `src/types/api.ts` | Type definitions |
| `src/contexts/AuthContext.tsx` | Stores employee data |
| `src/hooks/useUserSession.ts` | Retrieves session data |

---

## 🚀 Quick Start

```bash
# 1. Start dev server
npm run dev

# 2. Login
# URL: http://localhost:8081/login
# Username: admin
# Password: 1234
# Office Code: WF01

# 3. Navigate to Customers
# URL: http://localhost:8081/customers

# 4. Click on a customer
# Should navigate to: /customer-statement/{customerId}

# 5. Open DevTools (F12) and check Console
# Look for: "📤 Sending parameters to customerstatement.php:"
```

---

## 💡 Tips

- **Check console first**: Most issues visible in console logs
- **Check network tab**: Verify API request and response
- **Check localStorage**: Verify employee data stored
- **Try different dates**: If no transactions, try wider date range
- **Re-login**: If data missing, re-login to refresh

---

## 📞 Need Help?

1. Read: `CUSTOMER_STATEMENT_DEBUGGING_GUIDE.md`
2. Read: `CUSTOMER_STATEMENT_VERIFICATION_REPORT.md`
3. Check: Console logs (F12)
4. Check: Network tab (F12)
5. Check: localStorage (F12 → Application)

---

## ✅ Verification Status

- [x] API endpoint verified
- [x] Parameters verified
- [x] Implementation verified
- [x] Data flow verified
- [x] Response structure verified
- [x] All components working
- [x] No errors or warnings
- [x] Ready for production

---

**Status**: ✅ WORKING CORRECTLY
**Last Updated**: 2025-10-23
**Confidence**: 🟢 HIGH

