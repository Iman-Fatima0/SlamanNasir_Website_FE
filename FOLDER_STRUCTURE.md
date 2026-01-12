# Folder Structure Documentation

## Complete Directory Tree

```
Elcandi_Website/
│
├── .github/                      # GitHub configuration
│   └── workflows/                # GitHub Actions workflows
│
├── .gitignore                    # Git ignore file
│
├── config/                       # Configuration files
│   └── README.md
│
├── docs/                         # Project documentation
│   └── README.md
│
├── public/                       # Public static files
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── videos/
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # Search engine directives
│   └── README.md
│
├── scripts/                      # Build and deployment scripts
│   └── README.md
│
├── src/                          # Source code
│   ├── assets/                   # Static assets (source)
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   ├── videos/
│   │   └── README.md
│   │
│   ├── components/               # React/Vue/Angular components
│   │   ├── common/               # Reusable UI components
│   │   ├── features/             # Feature-specific components
│   │   ├── forms/                # Form components
│   │   └── README.md
│   │
│   ├── constants/                # Application constants
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── README.md
│   │
│   ├── layouts/                  # Layout components
│   │   └── README.md
│   │
│   ├── pages/                    # Page components and routes
│   │   ├── api/                  # API route handlers
│   │   └── README.md
│   │
│   ├── services/                 # API services
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── store/                    # State management
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── styles/                   # Global styles and themes
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── themes/
│   │   ├── utilities/
│   │   ├── index.css
│   │   └── README.md
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── utils/                    # Utility functions
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── App.tsx                   # Main app component
│   ├── index.ts                  # Entry point (TypeScript)
│   ├── index.tsx                 # Entry point (JSX)
│   └── main.tsx                  # Alternative entry point
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   └── README.md
│
├── FOLDER_STRUCTURE.md           # This file
└── README.md                     # Main project README
```

## Quick Reference

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/` | All UI components organized by type |
| `src/pages/` | Page-level components and routes |
| `src/layouts/` | Layout wrapper components |
| `src/services/` | API calls and external integrations |
| `src/store/` | State management (Redux, Zustand, etc.) |
| `src/hooks/` | Custom React hooks / composables |
| `src/utils/` | Utility functions and helpers |
| `src/types/` | TypeScript type definitions |
| `src/constants/` | Application-wide constants |
| `src/styles/` | Global styles, themes, and CSS |
| `src/assets/` | Source assets (processed during build) |
| `public/` | Static files served directly |
| `config/` | Build and application configuration |
| `tests/` | All test files organized by type |
| `docs/` | Project documentation |
| `scripts/` | Build and deployment scripts |

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `CourseCard.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `formatDate.ts`, `useAuth.ts`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **Types**: camelCase with `.types.ts` suffix (e.g., `user.types.ts`)
- **Tests**: Same as source file with `.test.ts` or `.spec.ts` suffix

### Best Practices

1. **Component Organization**: Keep components small and focused. One component per file.
2. **Type Safety**: Use TypeScript for all new code. Define types in `/types`.
3. **Code Splitting**: Organize by feature when components become numerous.
4. **Constants**: Use constants folder for magic numbers and strings.
5. **Services**: Keep API logic separate from components.
6. **Styles**: Use CSS modules, styled-components, or Tailwind for component styles.
7. **Tests**: Mirror source structure in tests directory.
8. **Documentation**: Update README files as structure evolves.

