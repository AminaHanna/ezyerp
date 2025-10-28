# Customer Statement - Debugging Steps ✅

## 🎯 Goal
Identify the actual API response field names so we can fix the "N/A" issue.

---

## 📋 Step-by-Step Debugging Guide

### Step 1: Open DevTools (1 minute)
```
1. Press F12 to open Developer Tools
2. Click on "Console" tab
3. You should see a blank console
```

### Step 2: Navigate to Customer Statement (2 minutes)
```
1. Go back to Customers page
2. Click on any customer
3. Click "Customer Statement" button
4. Wait for page to load (should see loading message)
```

### Step 3: Check Console Logs (2 minutes)
Look for logs starting with **📊** (emoji):

```
📤 Sending parameters to customerstatement.php: {
  officecode: "WF01",
  officeid: "1",
  customerid: "120",
  financialyearid: "2",
  sdate: "2025-04-01",
  edate: "2025-05-30"
}

📊 Raw API Response: {
  flag: true,
  msg: "Success",
  statement: [
    { ... },
    { ... }
  ]
}

📊 Statement data: [
  { ... },
  { ... }
]

📊 First statement item: {
  id: "123",
  date: "2025-04-15",
  type: "Invoice",
  debit: 1000,
  credit: 0,
  balance: 1000
}

📊 First item keys: [
  "id",
  "date",
  "type",
  "debit",
  "credit",
  "balance"
]
```

---

## 🔍 What to Look For

### Expected Scenarios

#### Scenario 1: Perfect Match ✅
```
First item keys: ["id", "date", "type", "debit", "credit", "balance"]
```
**Action**: No changes needed, field mapping is correct

#### Scenario 2: Different Field Names ⚠️
```
First item keys: ["trans_id", "trans_date", "trans_type", "dr_amount", "cr_amount", "balance"]
```
**Action**: Update field mapping to use these names

#### Scenario 3: Nested Data ⚠️
```
📊 Raw API Response: {
  flag: true,
  msg: "Success",
  data: {
    transactions: [
      { ... }
    ]
  }
}
```
**Action**: Update response structure handling

#### Scenario 4: Empty Response ⚠️
```
📊 Statement data: undefined
```
**Action**: Check if API returned error or empty array

---

## 📝 What to Share

Once you see the console logs, share:

1. **The "First item keys" array**
   ```
   Example: ["id", "date", "type", "debit", "credit", "balance"]
   ```

2. **The "First statement item" object**
   ```
   Example: {id: "123", date: "2025-04-15", type: "Invoice", ...}
   ```

3. **Any error messages** (if present)
   ```
   Example: "❌ Error: Invalid customer ID"
   ```

4. **Screenshot of console** (optional but helpful)

---

## 🛠️ Common Issues & Solutions

### Issue 1: No Console Logs Appear
**Possible Causes**:
- Page not loading (check Network tab)
- Component not mounted (check URL)
- API not called (check if execute() is called)

**Solution**:
1. Check Network tab for API request
2. Verify URL is correct
3. Check if there are any JavaScript errors

### Issue 2: API Returns Error
**Console shows**:
```
❌ Error: "Invalid customer ID"
```

**Solution**:
1. Check if customer ID is valid
2. Verify date range is correct
3. Check if user has permission

### Issue 3: Empty Array
**Console shows**:
```
📊 Statement data: []
```

**Solution**:
1. Check if customer has any transactions
2. Try different date range
3. Verify customer ID is correct

### Issue 4: Different Field Names
**Console shows**:
```
First item keys: ["trans_id", "trans_date", "trans_type", ...]
```

**Solution**:
1. Note down the actual field names
2. Share with me
3. I'll update the code to use correct names

---

## 📊 Field Name Mapping Reference

### Current Expected Names (in code)
```typescript
id: stmt.id || stmt.transactionid || stmt.voucherid
date: stmt.date || stmt.transactiondate || stmt.voucherdate
type: stmt.type || stmt.vouchertype || stmt.description || stmt.narration
debit: stmt.debit
credit: stmt.credit
balance: stmt.balance
```

### Possible Actual Names (from API)
- **ID**: `id`, `trans_id`, `transaction_id`, `voucherid`, `voucher_id`, `refno`
- **Date**: `date`, `trans_date`, `transaction_date`, `voucherdate`, `voucher_date`, `tdate`
- **Type**: `type`, `trans_type`, `transaction_type`, `vouchertype`, `voucher_type`, `description`, `narration`
- **Debit**: `debit`, `dr`, `dr_amount`, `debit_amount`, `amount_dr`
- **Credit**: `credit`, `cr`, `cr_amount`, `credit_amount`, `amount_cr`
- **Balance**: `balance`, `bal`, `running_balance`, `balance_amount`

---

## ✅ Checklist

- [ ] Opened DevTools (F12)
- [ ] Navigated to Customer Statement page
- [ ] Waited for page to load
- [ ] Found console logs starting with 📊
- [ ] Noted down "First item keys" array
- [ ] Noted down "First statement item" object
- [ ] Checked for any error messages
- [ ] Ready to share findings

---

## 🚀 Next Steps

1. **Follow steps above** to get console logs
2. **Share the "First item keys" array** with me
3. **Share the "First statement item" object** with me
4. **I'll update the code** to use correct field names
5. **Rebuild and test** to verify fix

---

## 💡 Tips

- **Keep DevTools open** while navigating
- **Don't refresh page** after seeing logs (they'll disappear)
- **Copy-paste the logs** to share with me
- **Check Network tab** if API request fails
- **Look for red errors** in console (they indicate problems)

---

**Status**: ⏳ AWAITING YOUR CONSOLE LOGS
**Build**: ✅ READY
**Next Action**: Run through debugging steps and share findings

