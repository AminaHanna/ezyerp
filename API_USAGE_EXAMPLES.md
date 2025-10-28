# API Usage Examples

This document provides practical examples of how to use the EzyERP API integration in your components.

## Basic Setup

All components that use the API should be wrapped with the `AuthProvider` (already done in App.tsx).

## Example 1: Using the useApi Hook

```typescript
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { useUserSession } from "@/hooks/useUserSession";
import { salesService } from "@/services/ezyerpService";

const CustomersList = () => {
  const { officeid, officecode } = useUserSession();
  
  const { data: customers, isLoading, error, execute } = useApi(
    () => salesService.getCustomers({
      officeid,
      officecode,
      financialyearid: "2",
      empid: "2"
    }),
    (data) => console.log("Customers loaded:", data),
    (error) => console.error("Failed to load customers:", error)
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {customers?.data?.map((customer) => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  );
};
```

## Example 2: Direct Service Call

```typescript
import { useState } from "react";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const SalesItemsComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { officeid, officecode } = useUserSession();

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesService.getSalesItems(
        officeid,
        officecode,
        "1",
        "0",
        ""
      );
      setItems(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={loadItems} disabled={loading}>
        {loading ? "Loading..." : "Load Items"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.productname} - ₹{item.price}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Example 3: Login Form

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    officecode: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password, formData.officecode);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Office Code"
        value={formData.officecode}
        onChange={(e) => setFormData({ ...formData, officecode: e.target.value })}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};
```

## Example 4: Customer Statement Report

```typescript
import { useEffect, useState } from "react";
import { reportsService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const CustomerStatementReport = ({ customerId }: { customerId: string }) => {
  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const { officecode, officeid } = useUserSession();

  useEffect(() => {
    const loadStatement = async () => {
      setLoading(true);
      try {
        const response = await reportsService.getCustomerStatement(
          officecode,
          officeid,
          customerId,
          "2",
          "2025-04-01",
          "2025-05-30"
        );
        setStatement(response.data || []);
      } catch (err) {
        console.error("Failed to load statement:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStatement();
  }, [customerId, officecode, officeid]);

  if (loading) return <div>Loading statement...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {statement.map((row) => (
          <tr key={row.id}>
            <td>{row.date}</td>
            <td>{row.description}</td>
            <td>{row.debit}</td>
            <td>{row.credit}</td>
            <td>{row.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Example 5: Creating a New Sale

```typescript
import { useState } from "react";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";

const CreateSaleForm = () => {
  const { officecode, officeid } = useUserSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateSale = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await salesService.createNewSale({
        officecode,
        officeid,
        financialyearid: "1",
        gstck: "1",
        billtype: "GST",
        items: [
          { productId: "1", productname: "Pen", price: "100.00" }
        ]
      });

      if (response.success) {
        setSuccess(true);
        console.log("Sale created:", response.data);
      } else {
        setError(response.message || "Failed to create sale");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Sale created successfully!</p>}
      <button onClick={handleCreateSale} disabled={loading}>
        {loading ? "Creating..." : "Create Sale"}
      </button>
    </div>
  );
};
```

## Example 6: Accessing User Session

```typescript
import { useUserSession } from "@/hooks/useUserSession";

const UserInfo = () => {
  const { user, username, officeid, officecode, logout } = useUserSession();

  return (
    <div>
      <p>Username: {username}</p>
      <p>Office ID: {officeid}</p>
      <p>Office Code: {officecode}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Example 7: Protected Component

```typescript
import { useAuth } from "@/contexts/AuthContext";

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to access this page</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.username}</p>
    </div>
  );
};
```

## Example 8: Error Handling

```typescript
import { useState } from "react";
import { salesService } from "@/services/ezyerpService";

const ErrorHandlingExample = () => {
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    try {
      const response = await salesService.getCustomers({
        officeid: "1",
        officecode: "WF01",
        financialyearid: "2",
        empid: "2"
      });

      if (!response.success) {
        throw new Error(response.message || "API returned an error");
      }

      console.log("Success:", response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("API Error:", errorMessage);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#fee", 
          color: "#c00",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  );
};
```

## Common Patterns

### Pattern 1: Load Data on Component Mount
```typescript
useEffect(() => {
  execute();
}, [execute]);
```

### Pattern 2: Conditional Rendering Based on State
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

### Pattern 3: Form Submission with API Call
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await apiFunction(formData);
    // Success handling
  } catch (err) {
    // Error handling
  }
};
```

## Tips and Best Practices

1. **Always use useUserSession** to get user context data
2. **Handle loading states** to provide good UX
3. **Display error messages** to users
4. **Use try-catch** for error handling
5. **Validate form data** before API calls
6. **Use TypeScript** for type safety
7. **Keep API calls in services** for reusability
8. **Use custom hooks** to encapsulate API logic
9. **Test API calls** with demo credentials
10. **Check browser console** for debugging

## Debugging

Enable logging in the API client:
```typescript
// In src/services/api.ts
console.log(`API Error [${endpoint}]:`, error);
```

Check network requests in browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Make API call
4. Check request/response details

## Common Issues

### Issue: "useAuth must be used within an AuthProvider"
**Solution**: Ensure AuthProvider wraps your app in App.tsx

### Issue: API returns 401 Unauthorized
**Solution**: User session expired, need to login again

### Issue: CORS errors
**Solution**: API must support CORS or use a proxy

### Issue: FormData not being sent correctly
**Solution**: Check that all required fields are included in the request

