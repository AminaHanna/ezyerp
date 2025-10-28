# Area-Based Filtering Implementation Plan

## 🎯 Overview

Implement area-based filtering functionality on the Customers page to allow users to filter customers by area/region.

---

## 📋 Requirements Summary

1. **API Integration**: Fetch areas from `areas.php` endpoint
2. **UI Component**: Add dropdown/select near search bar
3. **Filtering Logic**: Filter customers by selected area
4. **Combined Filtering**: Work with existing search functionality
5. **Data Mapping**: Use `area_name` field from Customer interface

---

## 🔍 Current State Analysis

### Existing Code
- ✅ **Areas API Service**: `masterService.getAreas()` already exists
- ✅ **Area Type**: `Area` interface defined with `id`, `name`, `code`
- ✅ **Customer Area Field**: `area_name` field exists in Customer interface
- ✅ **UI Components**: `Select` component available from shadcn/ui
- ✅ **Search Filter**: Already implemented in Customers.tsx

### API Endpoint
```
POST /areas.php
Parameters: officecode, officeid
Response: { flag: true, msg: "...", areas: [...] }
```

### Area Interface
```typescript
interface Area {
  id: string;
  name: string;
  code: string;
}
```

---

## 🛠️ Implementation Steps

### Step 1: Add State for Area Filter
**File**: `src/pages/Customers.tsx`

```typescript
const [selectedArea, setSelectedArea] = useState<string>("all");
```

### Step 2: Fetch Areas on Component Mount
**File**: `src/pages/Customers.tsx`

```typescript
const { data: areasData, isLoading: areasLoading } = useApi(
  () => masterService.getAreas(officecode, officeid),
  { skip: !officecode || !officeid }
);

useEffect(() => {
  if (officecode && officeid) {
    // Fetch areas
  }
}, [officecode, officeid]);
```

### Step 3: Add Area Filter UI
**File**: `src/pages/Customers.tsx`

Replace the filter button with a Select component:

```typescript
<Select value={selectedArea} onValueChange={setSelectedArea}>
  <SelectTrigger className="w-12 h-12 rounded-full">
    <Filter className="w-5 h-5" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Areas</SelectItem>
    {areasData?.areas?.map((area) => (
      <SelectItem key={area.id} value={area.id}>
        {area.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### Step 4: Update Filtering Logic
**File**: `src/pages/Customers.tsx`

```typescript
const filteredCustomers = (data?.customers || [])
  .filter((customer) => {
    // Search filter
    const matchesSearch = (customer.customer_name || customer.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Area filter
    const matchesArea = selectedArea === "all" || 
      customer.area_name === selectedArea;
    
    return matchesSearch && matchesArea;
  });
```

### Step 5: Handle Loading States
- Show loading indicator while fetching areas
- Disable area filter while loading
- Handle errors gracefully

---

## 📊 Data Flow

```
Component Mount
    ↓
Fetch Areas from API
    ↓
Store areas in state
    ↓
Render area dropdown
    ↓
User selects area
    ↓
Update selectedArea state
    ↓
Filter customers by area + search
    ↓
Update UI with filtered results
```

---

## 🔄 Filter Combination Logic

### Current Search Filter
```typescript
customer.customer_name.includes(searchQuery)
```

### New Area Filter
```typescript
customer.area_name === selectedArea
```

### Combined Filter
```typescript
matchesSearch && matchesArea
```

---

## 🎨 UI Layout

### Before
```
[Search Input] [Filter Button]
```

### After
```
[Search Input] [Area Dropdown]
```

---

## 📝 Code Changes Summary

| File | Changes | Lines |
|------|---------|-------|
| `src/pages/Customers.tsx` | Add state, fetch areas, update UI, update filtering | ~50 |
| `src/types/api.ts` | No changes needed (Area type already exists) | 0 |
| `src/services/ezyerpService.ts` | No changes needed (getAreas already exists) | 0 |

---

## ✅ Testing Checklist

- [ ] Areas load from API
- [ ] Area dropdown displays all areas
- [ ] "All Areas" option works
- [ ] Selecting area filters customers
- [ ] Search works with area filter
- [ ] Area filter works with search
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] No duplicate areas in dropdown
- [ ] Area names display correctly

---

## 🚀 Implementation Order

1. ✅ Add state for selectedArea
2. ✅ Fetch areas from API
3. ✅ Add area dropdown UI
4. ✅ Update filtering logic
5. ✅ Test functionality

---

## 💡 Additional Considerations

### Persistence
- **Current**: Filter resets on page navigation
- **Future**: Could use localStorage to persist selection

### Visual Indicator
- **Current**: Selected area shown in dropdown
- **Future**: Could add badge showing active filters

### Performance
- **Areas**: Fetched once on mount (small dataset)
- **Customers**: Filtered in memory (fast)
- **No pagination needed**: Filtering is instant

---

## 📞 Questions Answered

1. **API Response Structure**: `{ flag, msg, areas: [...] }`
2. **Persistence**: Not required (resets on navigation)
3. **Visual Indicator**: Shown in dropdown value

---

## 🎯 Success Criteria

✅ Users can select an area from dropdown
✅ Customers list filters by selected area
✅ Search and area filters work together
✅ "All Areas" option shows all customers
✅ No errors in console
✅ Smooth user experience

---

**Status**: 📋 PLAN READY FOR IMPLEMENTATION
**Last Updated**: 2025-10-23
**Estimated Time**: 30-45 minutes

