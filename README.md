# Elcandi Website

Arabic Course Website - Front-end Application

## 📁 Project Structure

```
Elcandi_Website/
├── src/                          # Source code
│   ├── components/               # React/Vue/Angular components
│   │   ├── common/              # Reusable UI components
│   │   ├── features/            # Feature-specific components
│   │   └── forms/               # Form components
│   ├── layouts/                 # Layout components
│   ├── pages/                   # Page components and routes
│   │   └── api/                 # API route handlers
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services and integrations
│   ├── store/                   # State management
│   ├── utils/                   # Utility functions
│   ├── types/                   # TypeScript type definitions
│   ├── constants/               # Application constants
│   ├── assets/                  # Static assets (source)
│   │   ├── images/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── videos/
│   └── styles/                  # Global styles and themes
│       ├── components/
│       ├── layouts/
│       ├── themes/
│       └── utilities/
├── public/                      # Public static files
│   ├── icons/
│   ├── images/
│   ├── fonts/
│   └── videos/
├── config/                      # Configuration files
├── scripts/                     # Build and deployment scripts
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                        # Documentation
├── .github/                     # GitHub configuration
│   └── workflows/               # GitHub Actions workflows
└── README.md                    # This file
```

## 🎯 Directory Descriptions

### `/src`
Main source code directory containing all application logic, components, and styles.

### `/src/components`
- **common/**: Shared, reusable UI components (Button, Input, Card, Modal, etc.)
- **features/**: Feature-specific components (CourseCard, LessonList, etc.)
- **forms/**: Form-related components (LoginForm, RegistrationForm, etc.)

### `/src/layouts`
Layout components that define page structure (MainLayout, AuthLayout, DashboardLayout, etc.)

### `/src/pages`
Page-level components and routes. The `api/` subdirectory contains API route handlers.

### `/src/hooks`
Custom React hooks (or composables/services for Vue/Angular) for reusable logic.

### `/src/services`
API services, external integrations, and data fetching logic.

### `/src/store`
State management (Redux, Zustand, Pinia, Vuex, NgRx, etc.).

### `/src/utils`
Utility functions, helpers, formatters, and validators.

### `/src/types`
TypeScript type definitions, interfaces, and type declarations.

### `/src/constants`
Application-wide constants (routes, API endpoints, messages, config values).

### `/src/assets`
Source assets that may be processed during build (images, fonts, icons, videos).

### `/src/styles`
Global styles, themes, CSS modules, styled-components, or SCSS files.

### `/public`
Static files served directly by the web server (favicon, robots.txt, etc.).

### `/config`
Build tool and application configuration files (webpack, vite, tailwind, eslint, etc.).

### `/scripts`
Build scripts, deployment scripts, and automation tools.

### `/tests`
Test files organized by test type (unit, integration, e2e).

### `/docs`
Project documentation, guides, and specifications.

### `/.github`
GitHub-specific configuration including workflows for CI/CD.

## 🚀 Getting Started

1. Install dependencies
2. Configure environment variables
3. Run development server
4. Build for production

## 📝 Best Practices

- Follow the established folder structure
- Keep components small and focused
- Use TypeScript for type safety
- Write tests for critical functionality
- Document complex logic
- Follow naming conventions (PascalCase for components, camelCase for utilities)

## 🔧 Technology Stack

[Add your technology stack here]
- Framework: [React/Vue/Angular/Next.js/etc.]
- State Management: [Redux/Zustand/Pinia/etc.]
- Styling: [CSS Modules/Tailwind CSS/styled-components/etc.]
- Testing: [Jest/Vitest/Cypress/etc.]
- Build Tool: [Vite/Webpack/Parcel/etc.]
