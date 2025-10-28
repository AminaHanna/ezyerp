# Quick Start Guide - EzyERP Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Development Server
```bash
npm run dev
```

The application will start at `http://localhost:8081`

### Step 2: Navigate to Login
Open your browser and go to:
```
http://localhost:8081/login
```

### Step 3: Enter Demo Credentials
```
Username: admin
Password: 1234
Office Code: WF01
```

### Step 4: Click "Sign In"
You'll be redirected to the home page showing your dashboard.

### Step 5: Explore the App
- **Home**: Dashboard with stats
- **Customers**: View customer list
- **Stocks**: View inventory
- **Receipts**: View receipts
- **More**: Settings and logout

## 📱 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | Authentication page |
| Home | `/` | Dashboard |
| Customers | `/customers` | Customer list |
| Stocks | `/stocks` | Inventory |
| Receipts | `/receipts` | Receipts |
| More | `/more` | Settings & logout |

## 🔑 Demo Credentials

```
Username: admin
Password: 1234
Office Code: WF01
```

## 📚 Documentation

- **API_INTEGRATION_GUIDE.md** - Complete integration documentation
- **API_USAGE_EXAMPLES.md** - Code examples for developers
- **INTEGRATION_SUMMARY.md** - Project summary and features

## 💻 Using the API in Your Code

### Example 1: Get Customers
```typescript
import { useApi } from "@/hooks/useApi";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const MyComponent = () => {
  const { officeid, officecode } = useUserSession();
  
  const { data, isLoading, error, execute } = useApi(
    () => salesService.getCustomers({
      officeid,
      officecode,
      financialyearid: "2",
      empid: "2"
    })
  );

  return (
    <div>
      <button onClick={execute}>Load Customers</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Found {data.data?.length} customers</p>}
    </div>
  );
};
```

### Example 2: Access User Info
```typescript
import { useUserSession } from "@/hooks/useUserSession";

const MyComponent = () => {
  const { user, username, officeid, officecode } = useUserSession();

  return (
    <div>
      <p>Welcome, {username}!</p>
      <p>Office: {officecode}</p>
    </div>
  );
};
```

### Example 3: Logout
```typescript
import { useUserSession } from "@/hooks/useUserSession";
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();
  const { logout } = useUserSession();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## 🛠️ Available Services

### Sales Service
```typescript
import { salesService } from "@/services/ezyerpService";

// Get customers
await salesService.getCustomers(request);

// Get sales items
await salesService.getSalesItems(officeid, officecode, financialyearid, column, barcode);

// Get customer brand discount
await salesService.getCustomerBrandDiscount(officeid, officecode, customerid, brandid);

// Create new sale
await salesService.createNewSale(data);
```

### Collections Service
```typescript
import { collectionsService } from "@/services/ezyerpService";

// Get collections
await collectionsService.getCollections(request);

// Create new collection
await collectionsService.createNewCollection(data);
```

### Receipts Service
```typescript
import { receiptsService } from "@/services/ezyerpService";

// Get receipts
await receiptsService.getReceipts(request);

// Create new receipt
await receiptsService.createNewReceipt(data);
```

### Master Service
```typescript
import { masterService } from "@/services/ezyerpService";

// Get financial years
await masterService.getFinancialYears(officecode, officeid, employeeid, usertypeid);

// Get areas
await masterService.getAreas(officecode, officeid);

// Get employees
await masterService.getEmployees(officecode, officeid, financialyearid);
```

### Reports Service
```typescript
import { reportsService } from "@/services/ezyerpService";

// Get customer statement
await reportsService.getCustomerStatement(officecode, officeid, customerid, financialyearid, sdate, edate);

// Get credit aging report
await reportsService.getCreditAgingReport(officecode, officeid, customerid, financialyearid, noofdays, condition);

// Get stocks
await reportsService.getStocks(request);

// Get user dashboard
await reportsService.getUserDashboard(officecode, officeid, financialyearid, empid, sdate, edate);
```

## 🔍 Debugging

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make API calls
4. Check request/response details

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages

### Check Local Storage
1. Open DevTools (F12)
2. Go to Application tab
3. Check Local Storage for:
   - `auth_user` - User info
   - `auth_token` - Auth token

## ⚙️ Configuration

### Change API Base URL
Edit `src/services/api.ts`:
```typescript
const API_BASE_URL = "https://your-api-url.com";
```

### Change Demo Credentials
Edit `src/pages/Login.tsx` to update the demo credentials display.

## 🚨 Common Issues

### Issue: "Cannot find module"
**Solution**: Run `npm install` to install dependencies

### Issue: Port 8081 already in use
**Solution**: The app will automatically try another port

### Issue: Login fails
**Solution**: 
- Verify credentials are correct
- Check API is accessible
- Check browser console for errors

### Issue: Protected routes not working
**Solution**:
- Ensure you're logged in
- Check AuthProvider is in App.tsx
- Check ProtectedRoute component is used

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 📝 Project Structure

```
src/
├── types/api.ts              # Type definitions
├── services/
│   ├── api.ts                # HTTP client
│   └── ezyerpService.ts      # API services
├── contexts/AuthContext.tsx  # Auth state
├── components/
│   └── ProtectedRoute.tsx    # Route protection
├── hooks/
│   ├── useApi.ts             # API hook
│   └── useUserSession.ts     # Session hook
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Home.tsx              # Dashboard
│   ├── Customers.tsx         # Customers
│   ├── Stocks.tsx            # Stocks
│   ├── Receipts.tsx          # Receipts
│   └── More.tsx              # More options
└── App.tsx                   # Main app
```

## 🎯 Next Steps

1. **Explore the Code**: Check out the service functions and hooks
2. **Read Documentation**: Review API_INTEGRATION_GUIDE.md
3. **Try Examples**: Follow the examples in API_USAGE_EXAMPLES.md
4. **Build Features**: Start building your features using the API
5. **Test**: Test your features with the demo credentials

## 📞 Need Help?

1. Check the documentation files
2. Review code examples
3. Check browser console for errors
4. Verify API endpoint in Postman collection
5. Check network requests in DevTools

## ✅ Checklist

- [ ] Started dev server
- [ ] Logged in with demo credentials
- [ ] Viewed home page
- [ ] Explored all pages
- [ ] Tested logout
- [ ] Read documentation
- [ ] Reviewed code examples
- [ ] Ready to build features!

---

**Happy coding! 🚀**

