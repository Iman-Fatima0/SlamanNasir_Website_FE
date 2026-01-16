# Elcandi Website - Frontend

Arabic Course Website - React Frontend Application

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```env
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:3001
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components
│   ├── features/       # Feature-specific components
│   ├── forms/          # Form components
│   └── layout/         # Layout components (Header, Footer)
├── pages/              # Page components
├── services/           # API services
├── constants/          # Application constants
├── styles/             # Global styles
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── store/              # State management
└── App.jsx             # Main app component
```

## 🎨 Color Scheme

The application uses the following color palette:

- **Primary**: `#424C61` (Dark blue)
- **Secondary**: `#A38B5D` (Gold/Bronze)
- **Font Primary**: `#121212` (Near black)
- **Stroke**: `#F5F3ED` (Light cream)
- **Shadow**: `#E7E7E7` (Light gray)

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Icons** - Icon library

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Features

- ✅ Home page with hero section and featured courses
- ✅ Courses page with filters and pagination
- ✅ Responsive design (mobile-first)
- ✅ Modern UI with Tailwind CSS
- ✅ API integration with backend
- ✅ Loading and error states
- ✅ Search and filter functionality

## 📚 API Integration

The frontend connects to the backend API at the URL specified in `.env`.

Key endpoints:
- `GET /api/courses` - Get all courses
- `GET /api/courses?limit=6&isPublished=true` - Get featured courses
- `GET /api/courses/:id` - Get course details

## 🔧 Development

### Adding New Components

1. Create component in appropriate folder under `src/components/`
2. Export from component file
3. Import where needed

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/layout/Header.jsx`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🤝 Contributing

Follow the existing code structure and naming conventions.

## 📄 License

[Your License Here]
