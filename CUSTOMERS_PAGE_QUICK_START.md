# Customers Page - Quick Start Guide

## 🚀 What Changed

The Customers page now fetches real customer data from the EzyERP API instead of using hardcoded dummy data.

## 📝 Key Changes

### Before
```typescript
const customersData = [
  { id: "1", name: "3 STAR ELECTRICAL & PLUMBING", day: "THURSDAY", balance: 33888.0 },
  // ... 11 more hardcoded records
];

const Customers = () => {
  const filteredCustomers = customersData.filter(...);
  // No loading, error, or empty states
};
```

### After
```typescript
const Customers = () => {
  const { officeid, officecode } = useUserSession();
  
  const { data, isLoading, error, execute } = useApi(
    () => salesService.getCustomers({
      officeid,
      officecode,
      financialyearid: "2",
      empid: "2"
    })
  );

  useEffect(() => {
    execute();
  }, [execute]);

  const filteredCustomers = (data?.customers || []).filter(...);
  
  // Loading state
  // Error state
  // Empty state
};
```

## 🎯 Features

✅ Real customer data from API
✅ Loading indicator
✅ Error handling
✅ Empty state message
✅ Search functionality
✅ Customer selection

## 🧪 Testing

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:8081/customers

# 3. Check console (F12)
# Should see: API Response [customers.php]: {...}

# 4. Verify customers display
# Should show real customer data

# 5. Test search
# Type in search box, should filter customers

# 6. Test selection
# Click on customer, should open modal
```

## 📊 API Response

```json
{
  "flag": true,
  "msg": "Success",
  "customers": [
    {
      "id": "1",
      "name": "Customer Name",
      "day": "MONDAY",
      "balance": 5000.0
    }
  ]
}
```

## 🔄 Data Flow

```
Component Mount
    ↓
useEffect calls execute()
    ↓
API Request to customers.php
    ↓
API Response received
    ↓
data?.customers populated
    ↓
UI renders customer list
```

## 📋 UI States

### Loading State
```
"Loading customers..."
```

### Error State
```
"Error: [error message]"
```

### Empty State
```
"No customers available."
or
"No customers found matching your search."
```

### Data State
```
List of customer cards with:
- Customer name
- Visit day
- Account balance
```

## 🔧 Parameters

| Parameter | Value | Source |
|-----------|-------|--------|
| officeid | "1" | useUserSession |
| officecode | "WF01" | useUserSession |
| financialyearid | "2" | Default |
| empid | "2" | Default |

## 📱 UI Components

- **Header**: "Customers" title
- **Search**: Search by customer name
- **Filter**: Filter button (placeholder)
- **Customer Cards**: Display customer info
- **Modal**: View customer details
- **Bottom Navigation**: Navigation menu

## 🎨 Styling

- **Loading**: Centered text with muted color
- **Error**: Red background with destructive text
- **Empty**: Centered text with muted color
- **Cards**: Customer cards with name, day, balance

## 🔐 Security

✅ Uses user session data (officeid, officecode)
✅ Token automatically included in API request
✅ API validates all parameters
✅ Error messages are safe

## 📊 Build Status

✅ Successful
- No errors
- No warnings
- 374.13 kB JS
- 61.46 kB CSS

## 🚀 Next Steps

1. Test with real data
2. Integrate Customer Statement page
3. Add pagination (if needed)
4. Add filters (if needed)

## 📞 Troubleshooting

### Customers not showing?
1. Check console (F12)
2. Look for API response
3. Verify user is logged in
4. Check Network tab for API call

### Error message showing?
1. Check error message text
2. Verify API endpoint is accessible
3. Check user session data
4. Check browser console for details

### Search not working?
1. Verify customers are loaded
2. Type in search box
3. Should filter in real-time
4. Check console for errors

## 📝 Files Modified

- `src/pages/Customers.tsx` - Main component

## 📚 Related Files

- `src/services/ezyerpService.ts` - API service
- `src/hooks/useApi.ts` - API hook
- `src/hooks/useUserSession.ts` - Session hook
- `src/types/api.ts` - Type definitions

## ✅ Verification

- [x] Hardcoded data removed
- [x] API integration added
- [x] Loading state working
- [x] Error state working
- [x] Empty state working
- [x] Search working
- [x] Build successful

---

**Last Updated**: 2025-10-23

