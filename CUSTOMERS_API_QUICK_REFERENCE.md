# Customers Page API - Quick Reference Card

## 🎯 At a Glance

| Aspect | Details |
|--------|---------|
| **Endpoint** | `customers.php` |
| **Method** | POST |
| **Status** | ✅ WORKING |
| **Data Flow** | Login → AuthContext → useUserSession → Customers Page → API |
| **Parameters** | officeid, officecode, financialyearid, empid |
| **Response** | {flag, msg, customers} |

---

## 📍 Component Locations

```
Login
  ↓
src/contexts/AuthContext.tsx (stores employee data)
  ↓
src/hooks/useUserSession.ts (retrieves session data)
  ↓
src/pages/Customers.tsx (uses session data for API call)
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
4. Customers page retrieves: officeid, officecode from useUserSession
5. Builds params: {officeid, officecode, financialyearid, empid}
6. Calls: salesService.getCustomers(params)
7. API returns: {flag: true, customers: [...]}
8. Component renders: customer list
```

---

## 🧪 Quick Test

### 1. Check Login Data
```javascript
// In Console:
JSON.parse(localStorage.getItem('auth_user'))
// Should show: {officeid: "1", officecode: "WF01", ...}
```

### 2. Check API Parameters
```
Open DevTools (F12) → Console
Look for: "📤 Sending parameters to customers.php:"
Should show: {officeid: "1", officecode: "WF01", financialyearid: "2", empid: "2"}
```

### 3. Check API Response
```
Look for: "API Response [customers.php]:"
Should show: {flag: true, msg: "Success", customers: [...]}
```

### 4. Check Network Request
```
DevTools → Network tab → customers.php
Request: Form data with all parameters
Response: JSON with customers array
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| No customers display | officeid/officecode empty | Re-login |
| "No data found" error | Wrong empid value | Try different empid |
| No API call made | useEffect not triggering | Check dependencies |
| Infinite loop | useCallback missing deps | Add dependencies |
| Empty localStorage | Not logged in | Login first |

---

## 📊 Console Logs to Check

```javascript
// 1. Login successful
"AuthContext: User data to store: {userid: ..., officeid: ..., officecode: ...}"

// 2. API parameters sent
"📤 Sending parameters to customers.php: {officeid: ..., officecode: ..., ...}"

// 3. API response received
"API Response [customers.php]: {flag: true, msg: ..., customers: [...]}"

// 4. Error occurred
"API Error [customers.php]: No data found"
```

---

## 🔍 Debugging Checklist

- [ ] Logged in successfully
- [ ] officeid in localStorage
- [ ] officecode in localStorage
- [ ] Customers page loads
- [ ] Console shows API parameters
- [ ] Console shows API response
- [ ] Customers display
- [ ] Search works
- [ ] No errors in console

---

## 📝 API Parameters

```json
{
  "officeid": "1",           // From login response
  "officecode": "WF01",      // From login parameter
  "financialyearid": "2",    // Configurable (default: 2)
  "empid": "2"               // Configurable (default: 2)
}
```

---

## 📤 API Request

```
POST /customers.php
Content-Type: application/x-www-form-urlencoded

officeid=1&officecode=WF01&financialyearid=2&empid=2
```

---

## 📥 API Response

```json
{
  "flag": true,
  "msg": "Success",
  "customers": [
    {
      "customerid": "780",
      "customer_name": "ASHIQUE C/O FALIHA",
      "area_name": "OTHERS",
      "amount": "4060.00",
      ...
    },
    ...
  ]
}
```

---

## 🎯 Key Files

| File | What It Does |
|------|--------------|
| `src/pages/Customers.tsx` | Main component, API call |
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

# 4. Open DevTools (F12) and check Console
# Look for: "📤 Sending parameters to customers.php:"
```

---

## 💡 Tips

- **Check console first**: Most issues visible in console logs
- **Check network tab**: Verify API request and response
- **Check localStorage**: Verify employee data stored
- **Try different empid**: If no customers, try empid 1, 2, 3, etc.
- **Re-login**: If data missing, re-login to refresh

---

## 📞 Need Help?

1. Read: `CUSTOMERS_API_DEBUGGING_GUIDE.md`
2. Read: `CUSTOMERS_API_VERIFICATION_REPORT.md`
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

