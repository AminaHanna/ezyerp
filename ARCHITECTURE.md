# EzyERP API Integration - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Application                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    App.tsx                               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         AuthProvider (Context)                     │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │  Routes                                      │  │  │   │
│  │  │  │  ├─ /login → Login Page                      │  │  │   │
│  │  │  │  ├─ / → ProtectedRoute → Home               │  │  │   │
│  │  │  │  ├─ /customers → ProtectedRoute → Customers │  │  │   │
│  │  │  │  ├─ /stocks → ProtectedRoute → Stocks       │  │  │   │
│  │  │  │  ├─ /receipts → ProtectedRoute → Receipts   │  │  │   │
│  │  │  │  └─ /more → ProtectedRoute → More           │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    State Management Layer                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AuthContext (src/contexts/AuthContext.tsx)             │   │
│  │  ├─ user: AuthUser | null                               │   │
│  │  ├─ isAuthenticated: boolean                            │   │
│  │  ├─ isLoading: boolean                                  │   │
│  │  ├─ error: string | null                                │   │
│  │  ├─ login(username, password, officecode)              │   │
│  │  └─ logout()                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Custom Hooks                                            │   │
│  │  ├─ useAuth() → AuthContextType                         │   │
│  │  ├─ useApi() → API call management                      │   │
│  │  └─ useUserSession() → User session data               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ezyerpService.ts                                        │   │
│  │  ├─ authService                                          │   │
│  │  │  └─ login()                                           │   │
│  │  ├─ salesService                                         │   │
│  │  │  ├─ getCustomers()                                    │   │
│  │  │  ├─ getSalesItems()                                   │   │
│  │  │  ├─ getCustomerBrandDiscount()                        │   │
│  │  │  ├─ getSalesAccounts()                                │   │
│  │  │  ├─ getPriceTypes()                                   │   │
│  │  │  └─ createNewSale()                                   │   │
│  │  ├─ collectionsService                                   │   │
│  │  │  ├─ getCollections()                                  │   │
│  │  │  └─ createNewCollection()                             │   │
│  │  ├─ receiptsService                                      │   │
│  │  │  ├─ getReceipts()                                     │   │
│  │  │  └─ createNewReceipt()                                │   │
│  │  ├─ masterService                                        │   │
│  │  │  ├─ getFinancialYears()                               │   │
│  │  │  ├─ getAreas()                                        │   │
│  │  │  ├─ getEmployees()                                    │   │
│  │  │  ├─ getCounterList()                                  │   │
│  │  │  ├─ getCommonPrivileges()                             │   │
│  │  │  └─ getNewUnit()                                      │   │
│  │  └─ reportsService                                       │   │
│  │     ├─ getCustomerStatement()                            │   │
│  │     ├─ getCreditAgingReport()                            │   │
│  │     ├─ getStocks()                                       │   │
│  │     └─ getUserDashboard()                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Client Layer                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ApiClient (src/services/api.ts)                         │   │
│  │  ├─ baseUrl: string                                      │   │
│  │  ├─ token: string | null                                 │   │
│  │  ├─ setToken(token)                                      │   │
│  │  ├─ getToken()                                           │   │
│  │  ├─ request<T>(endpoint, options)                        │   │
│  │  ├─ get<T>(endpoint, options)                            │   │
│  │  └─ post<T>(endpoint, body, options)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Features:                                                       │
│  ├─ Automatic FormData conversion                               │
│  ├─ Token management (localStorage)                             │
│  ├─ Error handling                                              │
│  └─ Base URL configuration                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP Layer (Fetch API)                        │
│                                                                   │
│  ├─ POST requests with FormData                                 │
│  ├─ JSON response parsing                                       │
│  ├─ Error handling                                              │
│  └─ Status code checking                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EzyERP API Server                             │
│                                                                   │
│  Base URL: https://ezyerp.ezyplus.in                            │
│                                                                   │
│  Endpoints:                                                      │
│  ├─ /login.php                                                  │
│  ├─ /customers.php                                              │
│  ├─ /salesitems.php                                             │
│  ├─ /collections.php                                            │
│  ├─ /receipts.php                                               │
│  ├─ /stocks.php                                                 │
│  ├─ /financialyears.php                                         │
│  ├─ /areas.php                                                  │
│  ├─ /salesman.php                                               │
│  ├─ /customerstatement.php                                      │
│  ├─ /creditagingreport.php                                      │
│  └─ ... and more                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Login Flow
```
User Input (Login Form)
        │
        ▼
Form Validation
        │
        ▼
useAuth().login()
        │
        ▼
authService.login()
        │
        ▼
apiClient.post("login.php")
        │
        ▼
HTTP POST Request
        │
        ▼
EzyERP API
        │
        ▼
Response (JSON)
        │
        ▼
Parse Response
        │
        ▼
Store User Data (localStorage)
        │
        ▼
Store Token (localStorage)
        │
        ▼
Update AuthContext
        │
        ▼
Redirect to Home
```

### API Call Flow
```
Component
        │
        ▼
useApi() Hook
        │
        ▼
Service Function (e.g., salesService.getCustomers())
        │
        ▼
apiClient.post()
        │
        ▼
Convert to FormData
        │
        ▼
Add Headers
        │
        ▼
HTTP POST Request
        │
        ▼
EzyERP API
        │
        ▼
Response (JSON)
        │
        ▼
Parse Response
        │
        ▼
Return Typed Data
        │
        ▼
Update Component State
        │
        ▼
Render UI
```

## Component Hierarchy

```
App
├── AuthProvider
│   ├── BrowserRouter
│   │   └── Routes
│   │       ├── Route /login
│   │       │   └── Login
│   │       ├── Route /
│   │       │   └── ProtectedRoute
│   │       │       └── Index
│   │       │           └── Home
│   │       ├── Route /customers
│   │       │   └── ProtectedRoute
│   │       │       └── Customers
│   │       ├── Route /stocks
│   │       │   └── ProtectedRoute
│   │       │       └── Stocks
│   │       ├── Route /receipts
│   │       │   └── ProtectedRoute
│   │       │       └── Receipts
│   │       ├── Route /more
│   │       │   └── ProtectedRoute
│   │       │       └── More
│   │       └── Route *
│   │           └── NotFound
│   ├── TooltipProvider
│   ├── Toaster
│   └── Sonner
└── QueryClientProvider
```

## Type System

```
API Types (src/types/api.ts)
├── Response Types
│   ├── LoginResponse
│   ├── CustomersResponse
│   ├── SalesItemsResponse
│   ├── CollectionsResponse
│   ├── ReceiptsResponse
│   ├── StocksResponse
│   ├── FinancialYearsResponse
│   ├── AreasResponse
│   ├── EmployeesResponse
│   ├── CustomerStatementResponse
│   └── CreditAgingResponse
├── Entity Types
│   ├── Customer
│   ├── SalesItem
│   ├── Collection
│   ├── Stock
│   ├── Receipt
│   ├── FinancialYear
│   ├── Area
│   ├── Employee
│   ├── CustomerStatement
│   └── CreditAgingReport
├── Request Types
│   ├── LoginRequest
│   ├── CustomersRequest
│   ├── CollectionsRequest
│   ├── StocksRequest
│   └── ReceiptsRequest
├── Auth Types
│   ├── AuthUser
│   └── AuthContextType
```

## Storage Architecture

```
Browser Storage
├── localStorage
│   ├── auth_user (JSON)
│   │   ├── userid
│   │   ├── username
│   │   ├── officeid
│   │   ├── officecode
│   │   ├── token
│   │   └── sessionid
│   └── auth_token (string)
└── sessionStorage (optional)
```

## Error Handling Flow

```
API Call
    │
    ├─ Success (200)
    │   └─ Parse Response
    │       ├─ success: true
    │       │   └─ Return Data
    │       └─ success: false
    │           └─ Throw Error
    │
    ├─ 401 Unauthorized
    │   ├─ Clear Auth
    │   ├─ Redirect to Login
    │   └─ Throw Error
    │
    ├─ Network Error
    │   ├─ Log Error
    │   └─ Throw Error
    │
    └─ Other Error
        ├─ Log Error
        └─ Throw Error
```

## Security Architecture

```
Security Layers
├── HTTPS Communication
│   └─ All API calls use HTTPS
├── Authentication
│   ├─ Username/Password validation
│   ├─ Office code validation
│   └─ Token-based auth
├── Session Management
│   ├─ Token storage (localStorage)
│   ├─ Auto-logout on 401
│   └─ Manual logout
├── Route Protection
│   ├─ ProtectedRoute component
│   ├─ Auth check before render
│   └─ Redirect to login
└── Input Validation
    ├─ Form validation
    ├─ Type checking
    └─ Error handling
```

## Deployment Architecture

```
Development
├─ npm run dev
├─ http://localhost:8081
└─ Hot reload enabled

Production
├─ npm run build
├─ dist/ folder
├─ Static hosting
└─ API calls to https://ezyerp.ezyplus.in
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety
- ✅ Error handling
- ✅ Security
- ✅ Scalability
- ✅ Maintainability

