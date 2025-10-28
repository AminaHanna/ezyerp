# EzyERP API Integration Guide

## Overview

This document describes the integration of the EzyERP API with the Gorgeous Grid Builder application. The integration provides a complete authentication system and API client for accessing EzyERP endpoints.

## Architecture

### File Structure

```
src/
├── types/
│   └── api.ts                 # TypeScript interfaces for API responses
├── services/
│   ├── api.ts                 # HTTP client and API configuration
│   └── ezyerpService.ts       # Service functions for all endpoints
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── components/
│   └── ProtectedRoute.tsx     # Route protection component
├── hooks/
│   ├── useApi.ts              # Custom hook for API calls
│   └── useUserSession.ts      # Custom hook for user session data
└── pages/
    └── Login.tsx              # Login page component
```

## Key Components

### 1. API Client (`src/services/api.ts`)

The `ApiClient` class handles all HTTP requests to the EzyERP API.

**Features:**
- Automatic FormData conversion for form-based API
- Token management (localStorage)
- Error handling
- Base URL configuration

**Usage:**
```typescript
import { apiClient } from "@/services/api";

// Make a POST request
const response = await apiClient.post("endpoint.php", {
  key: "value"
});
```

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

Manages user authentication state globally across the application.

**Features:**
- User login/logout
- Token persistence
- Loading states
- Error handling

**Usage:**
```typescript
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();
```

### 3. Service Layer (`src/services/ezyerpService.ts`)

Organized service functions for different API modules:

- **authService**: Login and password management
- **salesService**: Customer and sales data
- **collectionsService**: Collection management
- **receiptsService**: Receipt management
- **masterService**: Master data (financial years, areas, employees)
- **reportsService**: Reports (customer statement, credit aging, etc.)

**Usage:**
```typescript
import { salesService } from "@/services/ezyerpService";

const customers = await salesService.getCustomers({
  officeid: "1",
  officecode: "WF01",
  financialyearid: "2",
  empid: "2"
});
```

### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)

Wraps routes to ensure only authenticated users can access them.

**Usage:**
```typescript
<Route
  path="/customers"
  element={
    <ProtectedRoute>
      <Customers />
    </ProtectedRoute>
  }
/>
```

### 5. Custom Hooks

#### `useApi` Hook
For making API calls with automatic loading and error states.

```typescript
import { useApi } from "@/hooks/useApi";

const { data, isLoading, error, execute } = useApi(
  () => salesService.getCustomers(params),
  (data) => console.log("Success:", data),
  (error) => console.log("Error:", error)
);

// Call the API
await execute();
```

#### `useUserSession` Hook
For accessing current user information.

```typescript
import { useUserSession } from "@/hooks/useUserSession";

const { user, officeid, officecode, logout } = useUserSession();
```

## API Endpoints

### Authentication
- **Login**: `POST /login.php`
  - Parameters: `username`, `password`, `officecode`
  - Returns: User info and optional token

### Sales
- **Get Customers**: `POST /customers.php`
- **Get Sales Items**: `POST /salesitems.php`
- **Get Customer Brand Discount**: `POST /customerbranddiscount.php`
- **Get Sales Accounts**: `POST /salesaccounts.php`
- **Get Price Types**: `POST /PriceType.php`
- **Create New Sale**: `POST /newsales.php`

### Collections
- **Get Collections**: `POST /collections.php`
- **Create New Collection**: `POST /newcollection.php`

### Receipts
- **Get Receipts**: `POST /receipts.php`
- **Create New Receipt**: `POST /newreceipt.php`

### Master Data
- **Get Financial Years**: `POST /financialyears.php`
- **Get Areas**: `POST /areas.php`
- **Get Employees**: `POST /salesman.php`
- **Get Counter List**: `POST /counterlist.php`
- **Get Common Privileges**: `POST /commonprivileges.php`

### Reports
- **Get Customer Statement**: `POST /customerstatement.php`
- **Get Credit Aging Report**: `POST /creditagingreport.php`
- **Get Stocks**: `POST /stocks.php`
- **Get User Dashboard**: `POST /userdashbord.php`

## Configuration

### Base URL
The API base URL is configured in `src/services/api.ts`:
```typescript
const API_BASE_URL = "https://ezyerp.ezyplus.in";
```

To change it, modify the constant or use environment variables:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://ezyerp.ezyplus.in";
```

### Demo Credentials
- **Username**: admin
- **Password**: 1234
- **Office Code**: WF01

## Login Flow

1. User navigates to `/login`
2. Enters credentials (username, password, office code)
3. Form validates input
4. `AuthContext.login()` is called
5. API request sent to `login.php`
6. On success:
   - User data stored in localStorage
   - Token stored (if provided)
   - User redirected to home page
7. On error:
   - Error message displayed
   - User remains on login page

## Protected Routes

All routes except `/login` are protected by the `ProtectedRoute` component:
- If user is not authenticated, redirected to `/login`
- If user is loading, shows loading spinner
- If user is authenticated, renders the component

## Error Handling

### API Errors
- Network errors are caught and displayed
- 401 Unauthorized errors trigger logout
- Error messages are shown to the user

### Form Validation
- Username, password, and office code are required
- Real-time validation feedback
- Error messages displayed below each field

## State Management

### Authentication State
- Stored in React Context
- Persisted in localStorage
- Automatically restored on app load

### User Session
- User info available via `useAuth()` hook
- Session data includes: userid, username, officeid, officecode, token

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage (consider using httpOnly cookies for production)
2. **HTTPS**: API uses HTTPS for secure communication
3. **Form Data**: Sensitive data (passwords) are sent via FormData
4. **Logout**: Clears all stored user data and tokens

## Testing

### Manual Testing
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:8081/login`
3. Enter demo credentials
4. Verify login success and redirect to home page
5. Test protected routes
6. Test logout functionality

### Demo Credentials
```
Username: admin
Password: 1234
Office Code: WF01
```

## Troubleshooting

### Login Fails
- Verify credentials are correct
- Check API base URL is accessible
- Check browser console for error messages
- Verify office code is valid

### Protected Routes Not Working
- Ensure `AuthProvider` wraps the app
- Check `ProtectedRoute` component is used correctly
- Verify user is authenticated

### API Calls Fail
- Check network tab in browser DevTools
- Verify API endpoint URL is correct
- Check request parameters
- Verify authentication token is valid

## Future Enhancements

1. Add refresh token mechanism
2. Implement role-based access control (RBAC)
3. Add request/response interceptors
4. Implement offline support with service workers
5. Add API request caching
6. Implement real-time notifications
7. Add comprehensive error logging
8. Implement API rate limiting

## Support

For issues or questions about the API integration, refer to:
- EzyERP API Documentation
- Postman Collection: `EzyERP.postman_collection.json`
- Application logs in browser console

