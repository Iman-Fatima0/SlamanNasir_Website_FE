# Admin Analytics - Backend Requirements

## 📊 Current Status

### ✅ **What's Currently Connected to Backend:**

1. **Revenue Analytics Tab:**
   - ❌ **NOT using backend data** - All revenue charts use mock/hardcoded data
   - Uses `AdminService.getDashboardStats()` but only for loading/error states
   - Charts show hardcoded revenue, orders, and trends

2. **Course Analytics Tab:**
   - ✅ **Partially connected** - Fetches courses list from backend
   - Uses `CoursesService.getAllCourses()` to get course data
   - ❌ **BUT** - Analytics metrics (enrollments, revenue, completion rates) are calculated/mocked on frontend
   - ❌ Enrollment trends are completely hardcoded

3. **Student Analytics Tab:**
   - ✅ **Partially connected** - Gets total users count from `AdminService.getDashboardStats()`
   - ❌ **BUT** - All other metrics (new students, active students, growth charts, engagement) are hardcoded

4. **Funnel Analytics Tab:**
   - ❌ **NOT using backend data** - All funnel data is hardcoded
   - Uses `AdminService.getDashboardStats()` but doesn't use the response
   - All conversion rates, funnel stages, and time-to-conversion data is mock

---

## 🔌 Required Backend Endpoints

### **1. Revenue Analytics Endpoint**

**Endpoint:** `GET /api/admin/analytics/revenue`

**Query Parameters:**
- `period` (string, optional): `'daily' | 'weekly' | 'monthly' | 'yearly'` (default: `'monthly'`)
- `startDate` (string, optional): ISO date string
- `endDate` (string, optional): ISO date string

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 798000.00,
      "totalOrders": 2225,
      "averageOrderValue": 358.65,
      "revenueGrowth": 12.5,  // percentage change from previous period
      "ordersGrowth": 8.3,
      "aovGrowth": 4.2
    },
    "timeSeries": [
      {
        "date": "2024-01",
        "revenue": 45000,
        "orders": 120
      },
      {
        "date": "2024-02",
        "revenue": 52000,
        "orders": 145
      }
      // ... more periods
    ]
  }
}
```

**What Frontend Needs:**
- Total revenue, orders, average order value
- Revenue growth percentages (vs previous period)
- Time series data for charts (revenue over time, revenue vs orders)

---

### **2. Course Analytics Endpoint**

**Endpoint:** `GET /api/admin/analytics/courses`

**Query Parameters:**
- `limit` (number, optional): Number of courses to return (default: 10)
- `sortBy` (string, optional): `'enrollments' | 'revenue' | 'completion'` (default: `'enrollments'`)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCourses": 25,
      "totalEnrollments": 3500,
      "averageCompletionRate": 72.5
    },
    "courses": [
      {
        "courseId": "uuid",
        "courseTitle": "Python Basics",
        "enrollments": 95,
        "revenue": 9500.00,
        "completionRate": 68.5,
        "averageRating": 4.5
      }
      // ... more courses
    ],
    "enrollmentTrend": [
      {
        "month": "2024-01",
        "enrollments": 150
      },
      {
        "month": "2024-02",
        "enrollments": 180
      }
      // ... more months
    ],
    "completionStatus": {
      "completed": 2500,
      "inProgress": 1000
    }
  }
}
```

**What Frontend Needs:**
- Total courses, enrollments, average completion rate
- Top courses by enrollments/revenue
- Course-level metrics (enrollments, revenue, completion rate)
- Enrollment trend over time
- Completion status breakdown

---

### **3. Student Analytics Endpoint**

**Endpoint:** `GET /api/admin/analytics/students`

**Query Parameters:**
- `period` (string, optional): `'daily' | 'weekly' | 'monthly' | 'yearly'` (default: `'monthly'`)
- `startDate` (string, optional): ISO date string
- `endDate` (string, optional): ISO date string

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalStudents": 2500,
      "newStudents": 250,
      "activeStudents": 900,
      "completionRate": 72.0,
      "newStudentsGrowth": 12.5,
      "activeStudentsGrowth": 8.3,
      "completionRateGrowth": 2.1
    },
    "growth": [
      {
        "date": "2024-01",
        "newStudents": 120,
        "activeStudents": 450
      },
      {
        "date": "2024-02",
        "newStudents": 145,
        "activeStudents": 520
      }
      // ... more periods
    ],
    "engagement": [
      {
        "category": "Highly Engaged",
        "students": 450,
        "percentage": 45
      },
      {
        "category": "Moderately Engaged",
        "students": 350,
        "percentage": 35
      },
      {
        "category": "Low Engagement",
        "students": 150,
        "percentage": 15
      },
      {
        "category": "Inactive",
        "students": 50,
        "percentage": 5
      }
    ],
    "activityByDay": [
      {
        "day": "Monday",
        "logins": 320,
        "completions": 180
      }
      // ... all 7 days
    ]
  }
}
```

**What Frontend Needs:**
- Total students, new students, active students
- Growth percentages vs previous period
- Student growth time series (new + active students over time)
- Engagement breakdown (highly/moderately/low engaged, inactive)
- Activity by day of week (logins, completions)

---

### **4. Funnel Analytics Endpoint**

**Endpoint:** `GET /api/admin/analytics/funnels`

**Query Parameters:**
- `startDate` (string, optional): ISO date string
- `endDate` (string, optional): ISO date string
- `category` (string, optional): Filter by course category

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "overallConversionRate": 6.0,
      "cartAbandonmentRate": 33.3,
      "averageTimeToPurchase": 3.2,  // in days
      "conversionRateGrowth": 0.5,
      "abandonmentRateChange": -2.1,
      "timeToPurchaseChange": -0.5
    },
    "funnel": [
      {
        "stage": "Visitors",
        "count": 10000,
        "percentage": 100
      },
      {
        "stage": "Sign Ups",
        "count": 2500,
        "percentage": 25
      },
      {
        "stage": "Course Views",
        "count": 1800,
        "percentage": 18
      },
      {
        "stage": "Add to Cart",
        "count": 1200,
        "percentage": 12
      },
      {
        "stage": "Checkout",
        "count": 800,
        "percentage": 8
      },
      {
        "stage": "Purchases",
        "count": 600,
        "percentage": 6
      }
    ],
    "conversionRates": [
      {
        "from": "Visitors → Sign Up",
        "rate": 25.0
      },
      {
        "from": "Sign Up → Course View",
        "rate": 72.0
      },
      {
        "from": "Course View → Cart",
        "rate": 66.7
      },
      {
        "from": "Cart → Checkout",
        "rate": 66.7
      },
      {
        "from": "Checkout → Purchase",
        "rate": 75.0
      }
    ],
    "funnelByCategory": [
      {
        "category": "Beginner",
        "visitors": 4000,
        "enrollments": 300,
        "conversion": 7.5
      },
      {
        "category": "Intermediate",
        "visitors": 3500,
        "enrollments": 200,
        "conversion": 5.7
      },
      {
        "category": "Advanced",
        "visitors": 2500,
        "enrollments": 100,
        "conversion": 4.0
      }
    ],
    "timeToConversion": [
      {
        "period": "0-1 days",
        "conversions": 200
      },
      {
        "period": "2-3 days",
        "conversions": 150
      },
      {
        "period": "4-7 days",
        "conversions": 100
      },
      {
        "period": "8-14 days",
        "conversions": 80
      },
      {
        "period": "15+ days",
        "conversions": 70
      }
    ]
  }
}
```

**What Frontend Needs:**
- Overall conversion rate, cart abandonment, average time to purchase
- Growth/change percentages vs previous period
- Full conversion funnel (visitors → sign ups → course views → cart → checkout → purchases)
- Conversion rates between each stage
- Funnel breakdown by course category
- Time to conversion distribution

---

## 📋 Summary

### **Currently Available Routes:**
- ✅ `GET /api/admin/dashboard/stats` - Basic dashboard stats (used but not fully utilized)
- ✅ `GET /api/courses` - Course list (used for course analytics, but analytics are calculated on frontend)

### **Missing Routes (Required):**
- ❌ `GET /api/admin/analytics/revenue` - Revenue analytics with time series
- ❌ `GET /api/admin/analytics/courses` - Course performance analytics
- ❌ `GET /api/admin/analytics/students` - Student growth and engagement analytics
- ❌ `GET /api/admin/analytics/funnels` - Conversion funnel analytics

---

## 🎯 Implementation Priority

1. **High Priority:**
   - Revenue Analytics endpoint (most visible metrics)
   - Course Analytics endpoint (uses existing course data)

2. **Medium Priority:**
   - Student Analytics endpoint (important for growth tracking)

3. **Lower Priority:**
   - Funnel Analytics endpoint (advanced metrics)

---

## 📝 Notes for Backend Team

1. **Time Period Handling:**
   - All endpoints should support `period` parameter: `'daily' | 'weekly' | 'monthly' | 'yearly'`
   - Or use `startDate` and `endDate` for custom ranges
   - Frontend will pass the selected period from dropdowns

2. **Growth Calculations:**
   - All growth percentages should compare current period to previous period
   - Example: If `period=monthly`, compare current month to previous month
   - Return both current values and growth percentages

3. **Data Aggregation:**
   - Revenue: Sum of all order totals
   - Orders: Count of all orders
   - Enrollments: Count of all course enrollments
   - Students: Count of users with role 'student'
   - Active Students: Students who logged in or completed a lesson in the period

4. **Authentication:**
   - All endpoints require admin authentication (Bearer token)
   - Verify user has `admin` role

5. **Error Handling:**
   - Return `{ success: false, message: "Error message" }` on errors
   - Return `{ success: true, data: {...} }` on success

---

## ✅ Once Backend Routes Are Ready

The frontend will:
1. Update `src/constants/api.js` to add new analytics endpoints
2. Update `src/services/admin.service.js` to add analytics methods
3. Update all analytics components to use real backend data instead of mock data
4. Remove all hardcoded/mock data generation
5. Handle loading and error states properly

---

**Last Updated:** 2024-01-XX
**Status:** Waiting for backend implementation

