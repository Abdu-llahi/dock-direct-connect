# replit.md

## Overview

DockDirect is a logistics SaaS platform that connects warehouse shippers directly with truck drivers, eliminating traditional broker fees and delays. The platform provides role-based authentication for shippers, drivers, and administrators, featuring load posting, driver matching, real-time tracking, and comprehensive dashboard management. Built as a full-stack TypeScript application with React frontend and Express.js backend, the system supports direct freight transactions with built-in verification, document management, and payment processing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: React Context for authentication state, TanStack Query for server state management
- **Routing**: React Router v6 with role-based route protection and conditional navigation
- **Component Structure**: Modular design with dashboard components, homepage sections, and reusable UI components
- **Styling System**: Tailwind CSS with custom design tokens for brand colors (dock-blue, dock-orange) and responsive design

### Backend Architecture
- **Framework**: Express.js with TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Custom JWT-based authentication with bcryptjs for password hashing
- **API Design**: RESTful API structure with role-based access control
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development**: Hot module replacement via Vite integration for development workflow

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **ORM**: Drizzle with TypeScript schema definitions in shared directory
- **Schema Design**: User roles (shipper/driver/admin), user profiles for additional data, verification status tracking
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Connection**: Neon serverless driver for PostgreSQL connectivity

### Authentication and Authorization
- **Strategy**: Custom server-side authentication using JWT tokens
- **Password Security**: bcryptjs for secure password hashing with salt rounds
- **Role-Based Access**: Three distinct user roles with appropriate dashboard routing
- **Session Management**: localStorage for client-side token persistence
- **Route Protection**: React Router guards based on authentication status and user roles
- **Admin Access**: Secure admin panel with role verification requirements

### External Service Integrations
- **Database Hosting**: Neon Database for PostgreSQL hosting with serverless architecture
- **Development Platform**: Replit for development environment with auto-deployment
- **Email Services**: Prepared integration points for email confirmation and notifications
- **Payment Processing**: Architecture prepared for future Stripe or similar payment integration
- **File Storage**: Prepared structure for document and image upload capabilities

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database connectivity
- **drizzle-orm**: TypeScript ORM for database operations with full type safety
- **bcryptjs**: Password hashing library for secure authentication
- **express**: Node.js web framework for API server implementation

### Frontend Dependencies
- **@radix-ui/***: Complete suite of unstyled, accessible UI primitives
- **@tanstack/react-query**: Server state management with caching and synchronization
- **react-router-dom**: Client-side routing with role-based navigation
- **tailwindcss**: Utility-first CSS framework for responsive design
- **clsx & tailwind-merge**: Conditional CSS class utilities for dynamic styling

### Development Dependencies
- **vite**: Fast build tool with HMR for development workflow
- **tsx**: TypeScript execution for Node.js development server
- **@types/***: TypeScript definitions for enhanced development experience
- **drizzle-kit**: CLI tools for database schema management and migrations

### UI and Enhancement Libraries
- **sonner**: Toast notifications for user feedback
- **lucide-react**: Icon library for consistent iconography
- **recharts**: Chart library for analytics and data visualization
- **date-fns**: Date manipulation utilities for scheduling features