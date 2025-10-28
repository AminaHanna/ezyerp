# Home Page Redesign - Detailed Code Changes 📝

## File 1: `src/types/api.ts`

### Changes Made
Added two new interfaces for dashboard data

### Code Added (after line 258)
```typescript
// Dashboard Summary Types
export interface DashboardSummary {
  totalcollected?: number | string;
  receiptamount?: number | string;
  chequeamount?: number | string;
  [key: string]: any;
}

export interface DashboardResponse {
  flag: boolean;
  msg: string;
  summary?: DashboardSummary;
  data?: DashboardSummary;
  error?: string;
}
```

---

## File 2: `src/components/UserInfoCard.tsx` (NEW)

### Purpose
Display user information in a card format with avatar, username, ID, and office details

### Complete File
```typescript
import { User, Badge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AuthUser } from "@/types/api";

interface UserInfoCardProps {
  user: AuthUser | null;
}

export const UserInfoCard = ({ user }: UserInfoCardProps) => {
  if (!user) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* User Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground truncate">
              {user.username || "User"}
            </h3>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {user.userid || "N/A"}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Office:</span> {user.officecode || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Office ID:</span> {user.officeid || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
```

---

## File 3: `src/components/DateRangeFilter.tsx` (NEW)

### Purpose
Provide date range picker with default values (last 30 days)

### Key Features
- Default date range: last 30 days
- From Date and To Date inputs
- Apply button to trigger callback
- Loading state support
- Responsive layout

### Complete File
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar, Search } from "lucide-react";

interface DateRangeFilterProps {
  onApply: (fromDate: string, toDate: string) => void;
  isLoading?: boolean;
}

export const DateRangeFilter = ({ onApply, isLoading = false }: DateRangeFilterProps) => {
  // Get today's date and 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState(formatDateForInput(thirtyDaysAgo));
  const [toDate, setToDate] = useState(formatDateForInput(today));

  const handleApply = () => {
    onApply(fromDate, toDate);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        {/* From Date */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* To Date */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Apply Button */}
        <Button
          onClick={handleApply}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? "Loading..." : "Apply"}
        </Button>
      </div>
    </Card>
  );
};
```

---

## File 4: `src/components/CollectionSummaryCard.tsx` (NEW)

### Purpose
Display collection summary statistics with currency formatting

### Key Features
- Icon display with color customization
- Currency formatting (₹ format)
- Loading skeleton animation
- Responsive design

### Complete File
```typescript
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CollectionSummaryCardProps {
  icon: LucideIcon;
  label: string;
  amount: number | string;
  color: string;
  isLoading?: boolean;
}

export const CollectionSummaryCard = ({
  icon: Icon,
  label,
  amount,
  color,
  isLoading = false,
}: CollectionSummaryCardProps) => {
  // Format amount as currency
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "₹ 0.00";
    return `₹ ${numValue.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        {isLoading ? (
          <>
            <div className="h-6 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-20" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-foreground mb-1">
              {formatCurrency(amount)}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </>
        )}
      </div>
    </Card>
  );
};
```

---

## File 5: `src/pages/Home.tsx`

### Changes Made
Complete redesign with new components and API integration

### Key Changes
1. Added imports for new components
2. Added useApi hook for API calls
3. Added state management for date range
4. Implemented getUserDashboard API integration
5. Added error handling
6. Redesigned layout with new sections

### Imports Added
```typescript
import { useEffect, useState } from "react";
import { UserInfoCard } from "@/components/UserInfoCard";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { CollectionSummaryCard } from "@/components/CollectionSummaryCard";
import { useApi } from "@/hooks/useApi";
import { reportsService } from "@/services/ezyerpService";
import { DashboardResponse } from "@/types/api";
import { TrendingUp, Receipt, CreditCard, AlertCircle } from "lucide-react";
```

### Key Functions
```typescript
// Get default date range (last 30 days)
const getDefaultDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  // ... format and return dates
};

// Handle date range apply
const handleDateRangeApply = (fromDate: string, toDate: string) => {
  setDateRange({ from: fromDate, to: toDate });
};
```

### API Call
```typescript
const { data: dashboardData, isLoading, error, execute } = useApi(
  () => {
    if (!dateRange || !officeid || !officecode) {
      return Promise.resolve({ flag: false, msg: "Missing parameters" });
    }

    return reportsService.getUserDashboard(
      officecode,
      officeid,
      "2",
      user?.userid || "2",
      dateRange.from,
      dateRange.to
    );
  },
  // ... callbacks
);
```

---

## Summary of Changes

| File | Type | Changes |
|------|------|---------|
| `src/types/api.ts` | Modified | Added DashboardSummary and DashboardResponse |
| `src/components/UserInfoCard.tsx` | Created | New component for user info display |
| `src/components/DateRangeFilter.tsx` | Created | New component for date range picker |
| `src/components/CollectionSummaryCard.tsx` | Created | New component for summary cards |
| `src/pages/Home.tsx` | Modified | Complete redesign with new components |

---

## Build Status

```
✓ 2123 modules transformed
✓ Built in 15.88s
✓ No errors
```

---

**Status**: ✅ **COMPLETE**

