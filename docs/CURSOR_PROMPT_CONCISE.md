# 🚀 Quick Cursor Prompt: Build Next.js Frontend

Build a Next.js 14+ frontend for an Arabic Course Website with:

## Requirements

1. **Home Page (`/`)**:
   - Hero section with compelling messaging and CTA button
   - Featured courses section (6-8 courses in cards)
   - Header with navigation (Home, Courses, About, Login/Signup)
   - Footer with links
   - "View More Products" button at bottom → links to `/courses`

2. **Courses Page (`/courses`)**:
   - Display ALL courses in responsive card grid
   - Each card shows: thumbnail, title, instructor, price, level, language, rating, description
   - Filters: search, level (Beginner/Intermediate/Advanced), language
   - Pagination
   - Click card → navigate to `/courses/[id]`

3. **Backend Integration**:
   - API Base: `http://localhost:3000/api`
   - Courses are managed via admin dashboard (read-only on frontend)
   - Use TypeScript, Tailwind CSS, Axios

## Key API Endpoints

- `GET /api/courses?limit=6&isPublished=true` - Featured courses (home)
- `GET /api/courses?page=1&limit=12&level=Beginner&language=Arabic` - All courses with filters
- `GET /api/courses/:id` - Course details

## Project Structure

```
src/app/
  ├── layout.tsx          # Root layout (Header + Footer)
  ├── page.tsx            # Home page
  └── courses/
      ├── page.tsx        # Courses listing
      └── [id]/page.tsx   # Course details

src/components/
  ├── layout/Header.tsx, Footer.tsx
  ├── home/HeroSection.tsx, CoursesSection.tsx
  ├── courses/CourseCard.tsx, CourseGrid.tsx, CourseFilters.tsx
  └── common/Button.tsx, LoadingSpinner.tsx

src/services/
  ├── api.ts              # Axios config
  └── courses.service.ts  # API calls

src/types/course.types.ts # TypeScript interfaces
```

## Design

- Modern, clean, professional
- Responsive (mobile-first)
- Color scheme: Deep blue/teal primary, gold accent
- Smooth animations, hover effects
- Arabic/RTL support if needed

## Implementation Steps

1. Setup Next.js with TypeScript + Tailwind
2. Create API service layer (Axios)
3. Define TypeScript types for Course
4. Build Header & Footer components
5. Build Home page (Hero + Featured Courses)
6. Build Courses page (Grid + Filters + Pagination)
7. Style with Tailwind CSS
8. Add loading/error states
9. Test API integration

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

Start with the home page, then courses page. Use Server Components for data fetching or React Query for client-side. Make it beautiful and responsive!

