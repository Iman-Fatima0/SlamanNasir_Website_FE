# 🎯 Cursor Prompt: Build Next.js Frontend for Arabic Course Website

## Project Overview

Build a modern Next.js frontend application for an Arabic Course Website (Elcandi) with the following requirements:

### Core Requirements

1. **Home Page (`/`)**
   - Hero section with compelling Arabic course messaging
   - Courses section displaying featured courses (limit 6-8 courses)
   - Header with navigation (Home, Courses, About, Login/Signup)
   - Footer with links and information
   - "View More Products" button at the end that links to `/courses`

2. **Products/Courses Page (`/courses`)**
   - Display all courses in a responsive card grid layout
   - Each course card should show:
     - Course thumbnail/image
     - Course title
     - Instructor name
     - Price
     - Rating (if available)
     - Level (Beginner/Intermediate/Advanced)
     - Language
     - Brief description
   - Filter functionality (by level, language, search)
   - Pagination support
   - Clicking a card navigates to course details page

3. **Backend Integration**
   - Backend API is running on `http://localhost:3000/api`
   - All courses are managed through admin dashboard (separate system)
   - Frontend only displays courses (read-only for courses)
   - PostgreSQL database on backend

4. **Technology Stack**
   - Framework: Next.js 14+ (App Router)
   - TypeScript
   - Styling: Tailwind CSS (or your preferred CSS solution)
   - API Client: Axios or Fetch API
   - State Management: React Context or Zustand (optional)

---

## 📋 Implementation Checklist

### Phase 1: Project Setup

```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install dependencies
npm install axios
npm install @tanstack/react-query  # Optional: for data fetching
npm install react-icons  # For icons
```

**Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

### Phase 2: Project Structure

Create the following structure:
```
src/
├── app/
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Home page
│   ├── courses/
│   │   ├── page.tsx        # Courses listing page
│   │   └── [id]/
│   │       └── page.tsx    # Course details page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   └── CoursesSection.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   └── CourseFilters.tsx
│   └── common/
│       ├── Button.tsx
│       └── LoadingSpinner.tsx
├── services/
│   ├── api.ts              # API client configuration
│   └── courses.service.ts  # Course API calls
├── types/
│   └── course.types.ts     # TypeScript types for courses
└── utils/
    └── constants.ts        # API endpoints, routes
```

### Phase 3: API Service Layer

**File: `src/services/api.ts`**
- Create Axios instance with base URL from env
- Add request/response interceptors
- Handle errors globally

**File: `src/services/courses.service.ts`**
- `getAllCourses(params)` - GET /api/courses with pagination/filters
- `getCourseById(id)` - GET /api/courses/:id
- `getFeaturedCourses(limit)` - GET /api/courses?limit=6&isPublished=true

### Phase 4: TypeScript Types

**File: `src/types/course.types.ts`**
```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  instructor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating?: number;
  totalStudents?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  success: boolean;
  data: {
    courses: Course[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

### Phase 5: Home Page Implementation

**File: `src/app/page.tsx`**
- Hero section with:
  - Large heading: "Learn Arabic with Expert Instructors"
  - Subheading/description
  - CTA button: "Browse Courses" → links to `/courses`
  - Background image or gradient
- Courses section:
  - Heading: "Featured Courses"
  - Fetch 6-8 featured courses using `getFeaturedCourses()`
  - Display in a horizontal scroll or 3-column grid
  - Each course shows as a card
- "View More Products" button at bottom → links to `/courses`

**File: `src/components/home/HeroSection.tsx`**
- Beautiful hero section with Arabic-themed design
- Responsive layout
- Call-to-action buttons

**File: `src/components/home/CoursesSection.tsx`**
- Display featured courses
- Reuse CourseCard component
- Show loading state while fetching

### Phase 6: Courses Page Implementation

**File: `src/app/courses/page.tsx`**
- Page title: "All Courses"
- CourseFilters component (search, level filter, language filter)
- CourseGrid component displaying all courses
- Pagination controls
- Loading and error states

**File: `src/components/courses/CourseCard.tsx`**
- Card design with:
  - Course image/thumbnail
  - Title
  - Instructor name
  - Price (formatted)
  - Level badge
  - Rating stars (if available)
  - Hover effects
  - Click to navigate to `/courses/[id]`

**File: `src/components/courses/CourseGrid.tsx`**
- Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Map through courses and render CourseCard for each

**File: `src/components/courses/CourseFilters.tsx`**
- Search input
- Level dropdown filter
- Language dropdown filter
- Clear filters button

### Phase 7: Layout Components

**File: `src/components/layout/Header.tsx`**
- Logo/Brand name
- Navigation links: Home, Courses, About
- Login/Signup buttons (right side)
- Mobile responsive hamburger menu
- Sticky header on scroll

**File: `src/app/layout.tsx`**
- Include Header and Footer
- Set up metadata
- Add font imports (if using custom fonts)

**File: `src/components/layout/Footer.tsx`**
- Company information
- Quick links
- Social media icons
- Copyright notice

### Phase 8: Styling & Design

- Use Tailwind CSS for styling
- Create a modern, clean design
- Arabic/RTL support (if needed)
- Responsive design (mobile-first)
- Smooth animations and transitions
- Color scheme: Professional and educational theme

### Phase 9: Error Handling & Loading States

- Loading spinners for async operations
- Error messages for failed API calls
- Empty states (no courses found)
- 404 page for invalid routes

---

## 🎨 Design Requirements

### Color Palette (Suggested)
- Primary: Deep blue or teal (#1e40af or #0d9488)
- Secondary: Gold/Amber (#f59e0b)
- Background: White/Light gray (#ffffff, #f9fafb)
- Text: Dark gray/Black (#1f2937, #111827)
- Accent: Green for success states

### Typography
- Headings: Bold, modern sans-serif (Inter, Poppins, or similar)
- Body: Readable sans-serif
- Arabic text: Use appropriate Arabic font if displaying Arabic content

### Components Style
- Cards: Rounded corners, subtle shadows, hover effects
- Buttons: Rounded, with hover states
- Inputs: Clean, modern design
- Consistent spacing and padding

---

## 🔌 API Integration Details

### Backend API Base URL
```
http://localhost:3000/api
```

### Key Endpoints to Use

1. **Get Featured Courses (Home Page)**
   ```
   GET /api/courses?limit=6&isPublished=true
   ```

2. **Get All Courses (Courses Page)**
   ```
   GET /api/courses?page=1&limit=12&level=Beginner&language=Arabic
   ```
   Query params:
   - `page`: Page number
   - `limit`: Items per page
   - `level`: Filter by level (Beginner/Intermediate/Advanced)
   - `language`: Filter by language
   - `search`: Search query
   - `isPublished`: Only published courses

3. **Get Course Details**
   ```
   GET /api/courses/:id
   ```

### API Response Format
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

## 📝 Implementation Notes

1. **Data Fetching**
   - Use Server Components in Next.js 14+ for initial data fetching
   - Or use React Query/TanStack Query for client-side fetching
   - Implement proper loading and error states

2. **Routing**
   - Use Next.js App Router
   - Home: `/`
   - Courses: `/courses`
   - Course Details: `/courses/[id]`

3. **State Management**
   - Use React Context for global state (auth, theme)
   - Use local state for component-specific data
   - Consider Zustand for complex state management

4. **Performance**
   - Implement image optimization (Next.js Image component)
   - Add lazy loading for course cards
   - Implement pagination to avoid loading all courses at once

5. **Accessibility**
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation support
   - Alt text for images

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## ✅ Acceptance Criteria

- [ ] Home page displays hero section with CTA
- [ ] Home page shows 6-8 featured courses in cards
- [ ] "View More Products" button links to `/courses`
- [ ] Courses page displays all courses in a responsive grid
- [ ] Course cards show all required information
- [ ] Filters work (level, language, search)
- [ ] Pagination works correctly
- [ ] Header and footer are present on all pages
- [ ] Design is modern, responsive, and professional
- [ ] API integration works with backend
- [ ] Loading and error states are handled
- [ ] Mobile responsive design
- [ ] TypeScript types are properly defined
- [ ] Code is clean and well-organized

---

## 🎯 Next Steps After Implementation

1. Add course details page (`/courses/[id]`)
2. Implement authentication (login/signup)
3. Add user dashboard
4. Implement search functionality
5. Add instructor profiles
6. Add course enrollment functionality
7. Add reviews and ratings display

---

## 📚 Additional Resources

- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- API Documentation: See `docs/` folder for backend API details

---

**Note**: This prompt assumes the backend is already running and accessible at `http://localhost:3000`. Make sure to update the API URLs in `.env.local` if your backend runs on a different port or domain.

