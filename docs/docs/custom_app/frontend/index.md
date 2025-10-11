# Frontend Architecture

## Overview

The frontend is built using React with TypeScript, featuring a modern component-based architecture with client-side routing and a comprehensive component library.

## Application Structure

### Main Application Entry Point

The application is structured around a single-page application (SPA) using React Router for navigation:

```typescript
// App.tsx - Main application component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/architecture" element={<ArchitectureOverview />} />
          <Route path="/application-tier" element={<ApplicationTier />} />
          <Route path="/frontend" element={<Frontend />} />
        </Routes>
      </Layout>
    </Router>
  )
}
```

### Routing Structure

The application defines four main routes:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home` | Main landing page |
| `/architecture` | `ArchitectureOverview` | System architecture documentation |
| `/application-tier` | `ApplicationTier` | Application tier documentation |
| `/frontend` | `Frontend` | Frontend component demonstrations |

## Component Architecture

### Layout System

The application uses a consistent layout wrapper (`Layout` component) that provides:
- Common navigation structure
- Consistent styling and spacing
- Responsive design foundation

### View Components

Views are organized as page-level components that handle:
- Route-specific content rendering
- Component composition and layout
- Integration with the component library

## Frontend Component Library

The frontend features a comprehensive component reference library accessible through the `/frontend` route. This serves as both documentation and interactive demonstration of available UI components.

### Reference Components

The component library includes:

#### Core UI Components
- **ButtonReference** - Button variations, states, and interactions
- **InputReference** - Form input patterns and validation
- **BadgeReference** - Status indicators and labels
- **CardReference** - Content container layouts

#### Interactive Components
- **DialogReference** - Modal and dialog patterns
- **DropdownReference** - Dropdown menu examples
- **TableReference** - Data display and table implementations
- **ToastReference** - Notification and toast patterns

#### System Components  
- **TechnologyStackReference** - Technology stack visualization

### Component Organization

```typescript
// Frontend.tsx - Component library showcase
export function Frontend() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Frontend Components</h1>
          <p className="text-lg text-muted-foreground">
            Interactive demonstrations of our frontend component library and user interface patterns.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Core components in grid */}
        </div>

        {/* Full-width components */}
        <div className="mt-6">
          <InputReference />
          <TechnologyStackReference />
        </div>
      </div>
    </div>
  )
}
```

## Design System

### Layout Patterns
- **Container-based layout** - Uses `container mx-auto` for consistent content width
- **Responsive grid system** - `md:grid-cols-2` provides mobile-first responsive design
- **Consistent spacing** - Uses Tailwind CSS spacing utilities (`px-4`, `py-8`, `gap-6`)

### Typography Hierarchy
- **Page titles** - `text-3xl font-bold`
- **Descriptions** - `text-lg text-muted-foreground`
- **Consistent margin/padding** - Standardized spacing patterns

### Component Architecture Principles
- **Modular design** - Each component is self-contained and reusable
- **Reference-driven** - Components serve as both functional elements and documentation
- **Interactive examples** - Live demonstrations of component behavior

## Technology Stack

The frontend leverages modern web technologies:

- **React** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript development
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Lucide React** - Icon system

## Development Patterns

### Component Structure
```typescript
// Standard component signature
export default function ComponentName({ props }) {
  // Component logic
  return (
    // JSX structure
  )
}
```

### Import Patterns
- **Path aliases** - Uses `@/` prefix for clean import paths
- **Grouped imports** - Related components imported together
- **Reference components** - Centralized component library imports

This architecture provides a scalable, maintainable frontend with clear separation of concerns, comprehensive component documentation, and consistent user experience patterns.
