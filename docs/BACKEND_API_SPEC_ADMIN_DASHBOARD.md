# Backend API Specification: Admin Dashboard Stats

## Endpoint

```
GET /admin/dashboard/stats
```

## Authentication

**Required:** Yes  
**Header:** `Authorization: Bearer <admin_token>`

---

## Request

### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### Query Parameters
None

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000,
    "totalUsers": 450,
    "totalOrders": 320,
    "refundRate": 2.3,
    "revenueTrend": {
      "direction": "up",
      "value": "12%"
    },
    "usersTrend": {
      "direction": "up",
      "value": "5%"
    },
    "ordersTrend": {
      "direction": "up",
      "value": "8%"
    },
    "refundRateTrend": {
      "direction": "down",
      "value": "0.5%"
    },
    "revenueData": [
      { "date": "Jan", "revenue": 45000 },
      { "date": "Feb", "revenue": 52000 },
      { "date": "Mar", "revenue": 48000 },
      { "date": "Apr", "revenue": 61000 },
      { "date": "May", "revenue": 55000 },
      { "date": "Jun", "revenue": 67000 },
      { "date": "Jul", "revenue": 72000 },
      { "date": "Aug", "revenue": 68000 },
      { "date": "Sep", "revenue": 75000 },
      { "date": "Oct", "revenue": 80000 },
      { "date": "Nov", "revenue": 85000 },
      { "date": "Dec", "revenue": 90000 }
    ],
    "enrollmentsData": [
      { "course": "React 101", "enrollments": 120 },
      { "course": "Python Basics", "enrollments": 95 },
      { "course": "JavaScript Advanced", "enrollments": 80 },
      { "course": "Node.js Mastery", "enrollments": 65 },
      { "course": "Vue.js Fundamentals", "enrollments": 50 }
    ],
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
      }
    ]
  }
}
```

### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized. Admin access required."
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Failed to fetch dashboard statistics"
}
```

---

## Data Field Descriptions

### KPI Metrics

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `totalRevenue` | number | Total revenue from all completed orders | `125000` |
| `totalUsers` | number | Total number of active users/students | `450` |
| `totalOrders` | number | Total number of enrollments/orders | `320` |
| `refundRate` | number | Refund rate as a percentage (0-100) | `2.3` |

### Trend Data

Each trend object contains:
- `direction`: `"up"` or `"down"` - Direction of change
- `value`: `string` - Percentage change formatted as string (e.g., `"12%"`)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `revenueTrend` | object | Revenue trend vs previous period | `{ "direction": "up", "value": "12%" }` |
| `usersTrend` | object | Users trend vs previous period | `{ "direction": "up", "value": "5%" }` |
| `ordersTrend` | object | Orders trend vs previous period | `{ "direction": "up", "value": "8%" }` |
| `refundRateTrend` | object | Refund rate trend vs previous period | `{ "direction": "down", "value": "0.5%" }` |

### Revenue Chart Data

Array of revenue data points by time period.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `revenueData` | array | Array of revenue objects | See example above |
| `revenueData[].date` | string | Month abbreviation | `"Jan"`, `"Feb"`, `"Mar"` |
| `revenueData[].revenue` | number | Revenue amount for that period | `45000` |

**Recommended:** Provide last 12 months of data.

### Enrollments Chart Data

Array of enrollment data by course.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `enrollmentsData` | array | Array of enrollment objects | See example above |
| `enrollmentsData[].course` | string | Course name/title | `"React 101"` |
| `enrollmentsData[].enrollments` | number | Number of enrollments | `120` |

**Recommended:** Provide top 5-10 courses sorted by enrollment count.

### Recent Orders

Array of recent order transactions.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `recentOrders` | array | Array of order objects | See example above |
| `recentOrders[].id` | number | Order ID | `1001` |
| `recentOrders[].user` | object | User information | See example above |
| `recentOrders[].user.id` | number | User ID (optional) | `201` |
| `recentOrders[].user.firstName` | string | User first name (optional) | `"John"` |
| `recentOrders[].user.lastName` | string | User last name (optional) | `"Doe"` |
| `recentOrders[].user.email` | string | User email (required) | `"john@example.com"` |
| `recentOrders[].product` | object | Product/course info (optional) | See example above |
| `recentOrders[].product.id` | number | Product ID (optional) | `301` |
| `recentOrders[].product.title` | string | Product title (optional) | `"Arabic 101"` |
| `recentOrders[].course` | object | Course info (preferred over product) | See example above |
| `recentOrders[].course.id` | number | Course ID (optional) | `301` |
| `recentOrders[].course.title` | string | Course title (preferred) | `"Arabic 101"` |
| `recentOrders[].status` | string | Order status | `"completed"`, `"pending"`, `"cancelled"`, `"refunded"` |
| `recentOrders[].totalAmount` | number | Order total amount (preferred) | `99.99` |
| `recentOrders[].amount` | number | Order amount (fallback) | `99.99` |
| `recentOrders[].createdAt` | string | ISO 8601 date string | `"2024-01-15T10:30:00Z"` |
| `recentOrders[].updatedAt` | string | ISO 8601 date string (optional) | `"2024-01-15T10:30:00Z"` |
| `recentOrders[].paymentMethod` | string | Payment method (optional) | `"Stripe"`, `"PayPal"` |

**Recommended:** Provide last 10-20 orders, sorted by `createdAt` descending (most recent first).

---

## Calculation Guidelines

### Total Revenue
Sum of `totalAmount` or `amount` from all orders with status `"completed"`.

### Total Users
Count of all active users (not deleted/soft-deleted).

### Total Orders
Count of all orders (any status).

### Refund Rate
Calculate as: `(total_refunds / total_orders) * 100`

Round to 1 decimal place: `2.3`

### Trend Calculations

Compare current period (e.g., last 30 days) vs previous period (e.g., previous 30 days).

**Formula:**
```javascript
percentageChange = ((current - previous) / previous) * 100
direction = current > previous ? "up" : "down"
value = `${Math.abs(percentageChange).toFixed(0)}%`
```

**Example:**
- Current revenue: $125,000
- Previous revenue: $111,607.14
- Change: ((125000 - 111607.14) / 111607.14) * 100 = 12%
- Result: `{ "direction": "up", "value": "12%" }`

### Revenue Data
Group orders by month, sum revenue for each month.

Provide last 12 months:
- Format dates as month abbreviations: "Jan", "Feb", "Mar", etc.
- Sum `totalAmount` for all completed orders in each month.

### Enrollments Data
Group enrollments by course, count enrollments per course.

Provide top 5-10 courses:
- Sort by enrollment count (descending)
- Include course title and enrollment count

---

## Notes

1. **Null/Undefined Handling:** If a field is missing, the frontend will display `0` or `"N/A"` as appropriate.

2. **Trend Direction:** Must be exactly `"up"` or `"down"` (lowercase).

3. **Trend Value:** Must be a string ending with `"%"` (e.g., `"12%"`, `"0.5%"`).

4. **Date Format:** Use ISO 8601 format (e.g., `"2024-01-15T10:30:00Z"`).

5. **Currency:** Amounts are in USD. Frontend will format with `$` symbol.

6. **Course Title:** Frontend prefers `course.title` over `product.title`. If neither exists, displays `"N/A"`.

7. **User Name:** Frontend displays `firstName + lastName` if available, otherwise falls back to `email`.

8. **Order Status:** Valid values: `"completed"`, `"pending"`, `"cancelled"`, `"refunded"`.

---

## Example cURL Request

```bash
curl -X GET "http://localhost:3000/api/admin/dashboard/stats" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

---

## Frontend Integration

**Service File:** `src/services/admin.service.js`  
**Page Component:** `src/pages/admin/AdminDashboardPage.jsx`  
**API Endpoint Constant:** `src/constants/api.js` (Line 30: `DASHBOARD_STATS: '/admin/dashboard/stats'`)

**Frontend Usage:**
```javascript
const { data } = useQuery({
  queryKey: ['adminDashboardStats'],
  queryFn: () => AdminService.getDashboardStats(),
});

const stats = data || {};
// Access: stats.totalRevenue, stats.totalUsers, etc.
```

