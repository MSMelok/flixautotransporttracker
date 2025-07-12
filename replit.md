# Replit.md - Flix AT Tracker

## Overview

Flix AT Tracker is a professional auto transport order tracking system designed for managing transportation orders with real-time analytics, role-based access control, and comprehensive order management. The application is built as a full-stack web application with a React frontend and Express backend, using Firebase for authentication and data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom brand colors and design tokens
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: Drizzle ORM configured for PostgreSQL (though currently using in-memory storage)
- **Authentication**: Firebase Auth integration
- **Data Storage**: Firebase Firestore for orders collection

### Database Design
- **Current**: In-memory storage for development with user management
- **Planned**: PostgreSQL with Drizzle ORM for production
- **Firebase**: Firestore for orders with user-based access control

## Key Components

### Authentication & Authorization
- Firebase Authentication with email/password
- Role-based access control (admin@admin.com has full access)
- Protected routes with AuthGuard component
- User-specific data filtering

### Order Management
- CRUD operations for transportation orders
- Order status tracking (Posted, On Hold, In Progress, Dispatched, Completed, Canceled)
- Real-time updates via Firestore listeners
- Form validation with comprehensive field validation

### Dashboard & Analytics
- Real-time order statistics and metrics
- Date range filtering for analytics
- Target progress tracking
- Salary calculations based on broker fees
- Responsive card-based layout

### UI Components
- Complete shadcn/ui component library
- Custom branded components with blue/indigo color scheme
- Responsive design with mobile-first approach
- Professional SaaS dashboard aesthetics

## Data Flow

1. **Authentication**: Firebase Auth manages user sessions
2. **Data Fetching**: React Query handles server state with real-time Firestore listeners
3. **Order Management**: CRUD operations flow through Firebase Firestore
4. **Analytics**: Client-side calculations based on filtered order data
5. **UI Updates**: Real-time updates via Firestore subscriptions

## External Dependencies

### Core Dependencies
- **Firebase**: Authentication and Firestore database
- **React Query**: Server state management and caching
- **Radix UI**: Headless UI components
- **Tailwind CSS**: Utility-first styling
- **Drizzle ORM**: Database operations (configured for future PostgreSQL use)

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production

## Deployment Strategy

### Development Environment
- Vite dev server for frontend development
- Express server with hot reload via tsx
- Firebase emulators for local development (when needed)

### Production Build
- Vite builds optimized frontend bundle
- ESBuild bundles backend for Node.js deployment
- Static assets served from Express server
- Environment variables for Firebase configuration

### Database Migration Path
- Current: In-memory storage for development
- Future: PostgreSQL with Drizzle ORM
- Firestore continues for real-time order data
- Database migrations handled via Drizzle Kit

### Key Configuration Files
- `vite.config.ts`: Frontend build configuration
- `drizzle.config.ts`: Database schema and migrations
- `tsconfig.json`: TypeScript configuration for monorepo
- `tailwind.config.ts`: Design system and theming

The application follows modern full-stack development practices with a focus on developer experience, type safety, and professional UI/UX design patterns.