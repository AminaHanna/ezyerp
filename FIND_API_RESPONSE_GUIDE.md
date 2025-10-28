# How to Find the Actual API Response - Step by Step Guide

## 🎯 Goal

Find the actual API response from `customerstatement.php` to identify the correct field names.

---

## 📍 Step 1: Open DevTools Network Tab

1. **Press F12** to open DevTools
2. **Click on "Network" tab**
3. **Clear existing logs** (click the trash icon)
4. **Make sure "Preserve log" is checked** (checkbox at top)

---

## 📍 Step 2: Navigate to Customer Statement

1. **Go back to Customers page**
2. **Click on a customer** to open the modal
3. **Click "Customer Statement"** to navigate to the statement page
4. **Wait for the page to load**

---

## 📍 Step 3: Find the API Request

In the Network tab, look for a request to **`customerstatement.php`**

**What to look for**:
- Request URL should contain: `customerstatement.php`
- Request Method: `POST`
- Status: `200` (success)

**Example**:
```
POST http://localhost:8080/api/customerstatement.php
Status: 200 OK
```

---

## 📍 Step 4: Check the Response

1. **Click on the `customerstatement.php` request**
2. **Click on "Response" tab**
3. **You'll see the JSON response**

**Example Response**:
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

---

## 📍 Step 5: Check Console Logs

1. **Click on "Console" tab**
2. **Look for logs starting with "📊"**
3. **You'll see**:
   - `📊 Raw API Response: {...}`
   - `📊 Statement data: [...]`
   - `📊 First statement item: {...}`
   - `📊 First item keys: [...]`

**Example Console Output**:
```
📊 Raw API Response: {flag: true, msg: "Success", statement: Array(3)}
📊 Statement data: (3) [{…}, {…}, {…}]
📊 First statement item: {vno: "INV001", vdate: "2025-04-05", vtype: "Invoice", debit_amt: 5000, credit_amt: 0, balance_amt: 5000}
📊 First item keys: ["vno", "vdate", "vtype", "debit_amt", "credit_amt", "balance_amt"]
```

---

## 🔍 What to Look For

### In Network Tab Response:

Look at the first transaction object and note ALL the field names:

```json
{
  "vno": "...",           // ← Note this field name
  "vdate": "...",         // ← Note this field name
  "vtype": "...",         // ← Note this field name
  "debit_amt": ...,       // ← Note this field name
  "credit_amt": ...,      // ← Note this field name
  "balance_amt": ...,     // ← Note this field name
  "other_field": "..."    // ← Note any other fields
}
```

### In Console Logs:

Look for the "First item keys" line:

```
📊 First item keys: ["vno", "vdate", "vtype", "debit_amt", "credit_amt", "balance_amt"]
```

---

## 📋 Common Scenarios

### Scenario 1: Standard Field Names
```json
{
  "id": "INV001",
  "date": "2025-04-05",
  "type": "Invoice",
  "debit": 5000,
  "credit": 0,
  "balance": 5000
}
```
✅ **Already works** - No changes needed

### Scenario 2: Abbreviated Field Names
```json
{
  "vno": "INV001",
  "vdate": "2025-04-05",
  "vtype": "Invoice",
  "debit_amt": 5000,
  "credit_amt": 0,
  "balance_amt": 5000
}
```
❌ **Currently shows N/A** - Need to add these field names

### Scenario 3: Mixed Field Names
```json
{
  "vno": "INV001",
  "date": "2025-04-05",
  "description": "Invoice",
  "dr": 5000,
  "cr": 0,
  "bal": 5000
}
```
❌ **Currently shows N/A** - Need to add these field names

---

## 🎯 What to Share

Once you find the API response, share:

1. **The complete first transaction object** from the Network tab Response
2. **OR the "First item keys" from the Console logs**

**Example**:
```
The API returns these field names:
["vno", "vdate", "vtype", "debit_amt", "credit_amt", "balance_amt"]

First transaction:
{
  "vno": "INV001",
  "vdate": "2025-04-05",
  "vtype": "Invoice",
  "debit_amt": 5000,
  "credit_amt": 0,
  "balance_amt": 5000
}
```

---

## 🚀 Quick Checklist

- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Clear logs (trash icon)
- [ ] Check "Preserve log"
- [ ] Navigate to Customer Statement
- [ ] Find `customerstatement.php` request
- [ ] Click on it
- [ ] Check Response tab
- [ ] Note the field names
- [ ] Check Console tab
- [ ] Look for "📊 First item keys"
- [ ] Share the field names with me

---

## 💡 Tips

1. **If you don't see the request**:
   - Make sure you cleared the logs before navigating
   - Make sure "Preserve log" is checked
   - Try refreshing the page

2. **If the response is empty**:
   - Check if there's an error in the Response
   - Check the Console tab for error messages
   - Verify the customer ID is correct

3. **If you see multiple requests**:
   - Look for the one with Status 200
   - Look for the one with the largest size
   - That's usually the one with the data

---

## 📞 Need Help?

1. **Can't find the request?** - Make sure you're looking in the Network tab
2. **Can't find the response?** - Click on the request and look for "Response" tab
3. **Still stuck?** - Share a screenshot of the Network tab

---

**Status**: 📍 READY TO FIND API RESPONSE
**Last Updated**: 2025-10-23

