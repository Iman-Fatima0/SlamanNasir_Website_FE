# Admin Dashboard - Complete Backend Data Requirements

## Overview
This document lists ALL data displayed on the Admin Dashboard that should be fetched from the backend API endpoint `/admin/dashboard/stats`.

---

## API Endpoint

**Endpoint:** `GET /admin/dashboard/stats`  
**Method:** `GET`  
**Authentication:** Required (Admin token in Authorization header)  
**Response Format:** JSON

---

## Required Backend Response Structure

```json
{
  "success": true,
  "data": {
    // KPI Metrics
    "totalRevenue": 125000,
    "totalUsers": 450,
    "totalOrders": 320,
    "refundRate": 2.3,
    
    // Trend Data (percentage changes from previous period)
    "revenueTrend": {
      "direction": "up",  // "up" or "down"
      "value": "12%",     // Percentage change as string
      "previousPeriodValue": 111607.14
    },
    "usersTrend": {
      "direction": "up",
      "value": "5%",
      "previousPeriodValue": 428
    },
    "ordersTrend": {
      "direction": "up",
      "value": "8%",
      "previousPeriodValue": 296
    },
    "refundRateTrend": {
      "direction": "down",
      "value": "0.5%",
      "previousPeriodValue": 2.8
    },
    
    // Revenue Chart Data (Time Series)
    "revenueData": [
      {
        "date": "Jan",
        "revenue": 45000,
        "orders": 120
      },
      {
        "date": "Feb",
        "revenue": 52000,
        "orders": 145
      },
      {
        "date": "Mar",
        "revenue": 48000,
        "orders": 135
      },
      {
        "date": "Apr",
        "revenue": 61000,
        "orders": 170
      },
      {
        "date": "May",
        "revenue": 55000,
        "orders": 155
      },
      {
        "date": "Jun",
        "revenue": 67000,
        "orders": 185
      },
      {
        "date": "Jul",
        "revenue": 72000,
        "orders": 200
      },
      {
        "date": "Aug",
        "revenue": 68000,
        "orders": 190
      },
      {
        "date": "Sep",
        "revenue": 75000,
        "orders": 210
      },
      {
        "date": "Oct",
        "revenue": 80000,
        "orders": 225
      },
      {
        "date": "Nov",
        "revenue": 85000,
        "orders": 240
      },
      {
        "date": "Dec",
        "revenue": 90000,
        "orders": 250
      }
    ],
    
    // Enrollments Chart Data (by Course)
    "enrollmentsData": [
      {
        "course": "React 101",
        "enrollments": 120,
        "revenue": 12000
      },
      {
        "course": "Python Basics",
        "enrollments": 95,
        "revenue": 9500
      },
      {
        "course": "JavaScript Advanced",
        "enrollments": 80,
        "revenue": 8000
      },
      {
        "course": "Node.js Mastery",
        "enrollments": 65,
        "revenue": 6500
      },
      {
        "course": "Vue.js Fundamentals",
        "enrollments": 50,
        "revenue": 5000
      }
    ],
    
    // Recent Orders/Transactions
    "recentOrders": [
      {
        "id": 1001,
        "user": {
          "id": 201,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "product": {
          "id": 301,
          "title": "Arabic 101 - Beginner Course"
        },
        "course": {
          "id": 301,
          "title": "Arabic 101 - Beginner Course"
        },
        "status": "completed",
        "totalAmount": 99.99,
        "amount": 99.99,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "paymentMethod": "Stripe"
      },
      {
        "id": 1002,
        "user": {
          "id": 202,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@example.com"
        },
        "product": {
          "id": 302,
          "title": "Arabic 201 - Intermediate Course"
        },
        "course": {
          "id": 302,
          "title": "Arabic 201 - Intermediate Course"
        },
        "status": "pending",
        "totalAmount": 149.99,
        "amount": 149.99,
        "createdAt": "2024-01-14T14:20:00Z",
        "updatedAt": "2024-01-14T14:20:00Z",
        "paymentMethod": "PayPal"
      }
    ]
  }
}
```

---

## Data Breakdown by Dashboard Section

### 1. KPI Cards (Top Row - 4 Cards)

#### Card 1: Total Revenue
- **Display Value:** `stats.totalRevenue`
- **Type:** Number (currency amount)
- **Example:** `125000` → displayed as "$125,000.00"
- **Trend Indicator:** 
  - Direction: `stats.revenueTrend.direction` ("up" or "down")
  - Value: `stats.revenueTrend.value` (e.g., "12%")
- **Backend Field:** `data.totalRevenue`
- **Backend Trend Field:** `data.revenueTrend`

#### Card 2: Active Students
- **Display Value:** `stats.totalUsers`
- **Type:** Number (count)
- **Example:** `450` → displayed as "450"
- **Trend Indicator:**
  - Direction: `stats.usersTrend.direction` ("up" or "down")
  - Value: `stats.usersTrend.value` (e.g., "5%")
- **Backend Field:** `data.totalUsers`
- **Backend Trend Field:** `data.usersTrend`

#### Card 3: Enrollments
- **Display Value:** `stats.totalOrders`
- **Type:** Number (count)
- **Example:** `320` → displayed as "320"
- **Trend Indicator:**
  - Direction: `stats.ordersTrend.direction` ("up" or "down")
  - Value: `stats.ordersTrend.value` (e.g., "8%")
- **Backend Field:** `data.totalOrders`
- **Backend Trend Field:** `data.ordersTrend`

#### Card 4: Refund Rate
- **Display Value:** `stats.refundRate`
- **Type:** Number (percentage)
- **Example:** `2.3` → displayed as "2.3%"
- **Trend Indicator:**
  - Direction: `stats.refundRateTrend.direction` ("up" or "down")
  - Value: `stats.refundRateTrend.value` (e.g., "0.5%")
- **Backend Field:** `data.refundRate`
- **Backend Trend Field:** `data.refundRateTrend`

---

### 2. Revenue Chart (Left Chart)

**Component:** `RevenueChart`  
**Data Source:** `stats.revenueData`

#### Required Data Structure:
```json
"revenueData": [
  {
    "date": "Jan",     // Month abbreviation (Jan, Feb, Mar, etc.)
    "revenue": 45000   // Revenue amount for this period
  },
  // ... more months
]
```

**Fields:**
- `date` (string): Month name/abbreviation
- `revenue` (number): Revenue amount for that period

**Display:**
- X-axis: `date` field
- Y-axis: `revenue` values
- Tooltip: Shows formatted currency (e.g., "$45,000")

**Backend Field:** `data.revenueData`

---

### 3. Enrollments Chart (Right Chart)

**Component:** `EnrollmentsChart`  
**Data Source:** `stats.enrollmentsData`

#### Required Data Structure:
```json
"enrollmentsData": [
  {
    "course": "React 101",     // Course title/name
    "enrollments": 120         // Number of enrollments
  },
  // ... more courses
]
```

**Fields:**
- `course` (string): Course name/title
- `enrollments` (number): Number of enrollments for this course

**Display:**
- Horizontal bar chart
- Y-axis: Course names
- X-axis: Enrollment numbers

**Backend Field:** `data.enrollmentsData`

---

### 4. Recent Transactions Table

**Data Source:** `stats.recentOrders`

#### Required Data Structure:
```json
"recentOrders": [
  {
    "id": 1001,                          // Order ID (required)
    "user": {
      "id": 201,                         // User ID (optional)
      "firstName": "John",               // User first name (optional)
      "lastName": "Doe",                 // User last name (optional)
      "email": "john@example.com"        // User email (required as fallback)
    },
    "product": {
      "id": 301,                         // Product/Course ID (optional)
      "title": "Arabic 101"              // Course title (optional, use course.title as fallback)
    },
    "course": {
      "id": 301,                         // Course ID (optional)
      "title": "Arabic 101"              // Course title (preferred over product.title)
    },
    "status": "completed",               // Order status: "completed", "pending", "cancelled", "refunded"
    "totalAmount": 99.99,                // Order total amount (preferred)
    "amount": 99.99,                     // Alternative amount field (fallback)
    "createdAt": "2024-01-15T10:30:00Z", // ISO date string (required)
    "updatedAt": "2024-01-15T10:30:00Z", // ISO date string (optional, used if different from createdAt)
    "paymentMethod": "Stripe"            // Payment method (optional, for display in slide-over)
  }
]
```

#### Table Columns Displayed:

1. **User Column:**
   - Display: Full name or email
   - Source: `order.user.firstName + order.user.lastName` OR `order.user.email`
   - Avatar: First letter of user name

2. **Course Column:**
   - Display: Course title
   - Source: `order.product.title` OR `order.course.title` OR "N/A"

3. **Amount Column:**
   - Display: Formatted currency
   - Source: `order.totalAmount` OR `order.amount`
   - Example: "$99.99"

4. **Status Column:**
   - Display: Status badge
   - Source: `order.status`
   - Values: "Completed", "Pending", "Cancelled", "Refunded"

5. **Time Column:**
   - Display: Formatted date/time
   - Source: `order.createdAt` OR `order.updatedAt`
   - Format: "Jan 15, 2024, 10:30 AM"

**Backend Field:** `data.recentOrders`

**Recommended:** Limit to last 10-20 recent orders, sorted by `createdAt` descending.

---

### 5. Order Detail Slide-Over (When Order is Clicked)

**Data Source:** Selected order from `stats.recentOrders`

**Displayed Fields:**
- Order ID: `order.id`
- User Name: `order.user.firstName + order.user.lastName`
- User Email: `order.user.email`
- Course Title: `order.product.title` OR `order.course.title`
- Amount: `order.totalAmount` OR `order.amount`
- Status: `order.status`
- Created Date: `order.createdAt`
- Updated Date: `order.updatedAt` (if different from createdAt)
- Payment Method: `order.paymentMethod` (optional)

---

## Quick Reference: All Backend Fields Needed

```typescript
interface DashboardStats {
  // KPI Values
  totalRevenue: number;        // Total revenue amount
  totalUsers: number;          // Total active users/students
  totalOrders: number;         // Total enrollments/orders
  refundRate: number;          // Refund rate percentage (e.g., 2.3)
  
  // Trend Indicators
  revenueTrend: {
    direction: "up" | "down";
    value: string;             // e.g., "12%"
  };
  usersTrend: {
    direction: "up" | "down";
    value: string;             // e.g., "5%"
  };
  ordersTrend: {
    direction: "up" | "down";
    value: string;             // e.g., "8%"
  };
  refundRateTrend: {
    direction: "up" | "down";
    value: string;             // e.g., "0.5%"
  };
  
  // Chart Data
  revenueData: Array<{
    date: string;              // e.g., "Jan", "Feb"
    revenue: number;           // Revenue amount
  }>;
  
  enrollmentsData: Array<{
    course: string;            // Course name
    enrollments: number;       // Enrollment count
  }>;
  
  // Recent Orders
  recentOrders: Array<{
    id: number;
    user: {
      id?: number;
      firstName?: string;
      lastName?: string;
      email: string;
    };
    product?: {
      id?: number;
      title?: string;
    };
    course?: {
      id?: number;
      title?: string;
    };
    status: "completed" | "pending" | "cancelled" | "refunded";
    totalAmount: number;
    amount?: number;           // Fallback
    createdAt: string;         // ISO date string
    updatedAt?: string;        // ISO date string
    paymentMethod?: string;
  }>;
}
```

---

## Implementation Notes for Backend Team

### 1. **Time Period for Trends:**
- Compare current period (e.g., last 30 days) vs previous period (e.g., previous 30 days)
- Calculate percentage change: `((current - previous) / previous) * 100`
- Format as string with "%" sign: `"12%"`

### 2. **Revenue Data:**
- Provide last 12 months of revenue data
- Group by month
- Format dates as month abbreviations: "Jan", "Feb", "Mar", etc.

### 3. **Enrollments Data:**
- Top 5-10 courses by enrollment count
- Include course title and enrollment count
- Sort by enrollment count descending

### 4. **Recent Orders:**
- Last 10-20 orders
- Include full user and course information
- Sort by `createdAt` descending (most recent first)

### 5. **Refund Rate:**
- Calculate as: `(totalRefunds / totalOrders) * 100`
- Round to 1 decimal place: `2.3`

### 6. **Error Handling:**
- If data is missing, return `null` or `0` (frontend handles gracefully)
- Always return `success: true` or `success: false` in response

---

## Example Complete Response

```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000,
    "totalUsers": 450,
    "totalOrders": 320,
    "refundRate": 2.3,
    "revenueTrend": { "direction": "up", "value": "12%" },
    "usersTrend": { "direction": "up", "value": "5%" },
    "ordersTrend": { "direction": "up", "value": "8%" },
    "refundRateTrend": { "direction": "down", "value": "0.5%" },
    "revenueData": [
      { "date": "Jan", "revenue": 45000 },
      { "date": "Feb", "revenue": 52000 },
      { "date": "Mar", "revenue": 48000 }
    ],
    "enrollmentsData": [
      { "course": "React 101", "enrollments": 120 },
      { "course": "Python Basics", "enrollments": 95 }
    ],
    "recentOrders": [
      {
        "id": 1001,
        "user": { "firstName": "John", "lastName": "Doe", "email": "john@example.com" },
        "course": { "title": "Arabic 101" },
        "status": "completed",
        "totalAmount": 99.99,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## Frontend Code Reference

**Service File:** `src/services/admin.service.js` (Line 12-20)  
**Page Component:** `src/pages/admin/AdminDashboardPage.jsx` (Line 39-76)  
**API Endpoint Constant:** `src/constants/api.js` (Line 30)

**Usage in Frontend:**
```javascript
const { data } = useQuery({
  queryKey: ['adminDashboardStats'],
  queryFn: () => AdminService.getDashboardStats(),
});

const stats = data || {};
// stats.totalRevenue, stats.totalUsers, etc.
```

